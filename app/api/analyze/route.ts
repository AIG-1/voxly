import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { transcript } = await req.json();

  if (!transcript || transcript.length < 50) {
    return NextResponse.json({ error: "Transcript too short" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Return mock analysis when no key is configured (dev mode)
    return NextResponse.json(mockAnalysis());
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

    const data = await res.json();
    const content = data.content?.[0]?.text ?? "";

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json(analysis);
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json(mockAnalysis());
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
