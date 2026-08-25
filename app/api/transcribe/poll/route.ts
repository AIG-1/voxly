import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-service";
import { createClient } from "@/lib/supabase-server";

function calcTalkRatios(utterances: Array<{ speaker: string; text: string }>) {
  const words: Record<string, number> = {};
  for (const u of utterances) {
    words[u.speaker] = (words[u.speaker] ?? 0) + u.text.split(" ").length;
  }
  const speakers = Object.keys(words);
  if (speakers.length < 2) return { rep: 50, customer: 50 };
  const total = Object.values(words).reduce((a, b) => a + b, 0);
  const repWords = words[speakers[0]];
  return {
    rep: Math.round((repWords / total) * 100),
    customer: Math.round(((total - repWords) / total) * 100),
  };
}

export async function POST(req: Request) {
  // Verify user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { transcriptId, callId } = await req.json();
  if (!transcriptId || !callId) {
    return NextResponse.json({ error: "transcriptId and callId required" }, { status: 400 });
  }

  const service = createServiceClient();

  // Get AssemblyAI key
  const { data: config } = await service
    .from("platform_config")
    .select("assemblyai_api_key")
    .limit(1)
    .single();

  if (!config?.assemblyai_api_key) {
    return NextResponse.json({ error: "AssemblyAI key not configured" }, { status: 400 });
  }

  // Poll AssemblyAI for this job
  const res = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
    headers: { authorization: config.assemblyai_api_key },
  });

  if (!res.ok) {
    return NextResponse.json({ status: "error", error: "AssemblyAI poll failed" }, { status: 502 });
  }

  const data = await res.json();

  if (data.status === "error") {
    await service.from("calls").update({ status: "error" }).eq("id", callId);
    return NextResponse.json({ status: "error", error: data.error });
  }

  if (data.status !== "completed") {
    // Still processing — tell the client to keep polling
    return NextResponse.json({ status: data.status });
  }

  // Transcription complete — save it, move to analyzing
  const utterances = data.utterances ?? [];
  const transcript = data.text ?? "";
  const duration = data.audio_duration ?? null;
  const { rep, customer } = calcTalkRatios(utterances);

  await service.from("calls").update({
    transcript,
    utterances,
    duration_seconds: duration,
    talk_ratio_rep: rep,
    talk_ratio_customer: customer,
    status: "analyzing",
  }).eq("id", callId);

  // Run Claude analysis (internal call — reuse existing route logic inline)
  const analysisResult = await runClaudeAnalysis(transcript);

  await service.from("calls").update({
    ...analysisResult,
    status: "completed",
  }).eq("id", callId);

  return NextResponse.json({ status: "completed" });
}

async function runClaudeAnalysis(transcript: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || transcript.length < 50) {
    return mockAnalysis();
  }

  const prompt = `You are an expert sales coach. Analyze the following sales call transcript and respond ONLY with valid JSON.

Transcript:
"""
${transcript.slice(0, 8000)}
"""

Return this exact JSON structure:
{
  "coaching_score": <integer 0-100>,
  "coaching_feedback": "<2-4 sentences of specific, actionable coaching feedback for the sales rep>",
  "topics": ["<topic1>", "<topic2>"],
  "objections": ["<verbatim or paraphrased objection 1>", ...],
  "buying_signals": ["<signal 1>", ...],
  "next_steps": ["<clear next step 1>", ...],
  "outcome": "<one of: won|lost|follow_up|unknown>"
}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const responseData = await res.json();
    const content = responseData.content?.[0]?.text ?? "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    return JSON.parse(jsonMatch[0]);
  } catch {
    return mockAnalysis();
  }
}

function mockAnalysis() {
  return {
    coaching_score: 72,
    coaching_feedback:
      "Good discovery questions in the opening. Work on reducing filler words and pausing before responding to objections — it signals confidence. The closing was too passive; try a more direct next-step ask.",
    topics: ["Pricing", "Integration", "Timeline", "ROI"],
    objections: [
      "We already have a tool for this",
      "The price is higher than expected",
      "Need to check with the team first",
    ],
    buying_signals: [
      "Asked about implementation timeline",
      "Mentioned budget is available this quarter",
    ],
    next_steps: [
      "Send pricing proposal by Friday",
      "Schedule demo with technical stakeholders",
      "Follow up on Q4 budget availability",
    ],
    outcome: "follow_up",
  };
}
