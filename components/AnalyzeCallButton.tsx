"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

interface AnalyzeCallButtonProps {
  callId: string;
  audioUrl: string | null;
  variant?: "default" | "large";
}

// Lightweight AssemblyAI client running browser-side
// API key stored in platform_config table (Option D — MVP)
async function transcribeWithAssemblyAI(audioUrl: string, apiKey: string) {
  // 1. Submit transcript job
  const submitRes = await fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    headers: { authorization: apiKey, "content-type": "application/json" },
    body: JSON.stringify({
      audio_url: audioUrl,
      speaker_labels: true,
      auto_chapters: false,
    }),
  });
  const { id } = await submitRes.json();

  // 2. Poll until complete (max 3 minutes)
  for (let i = 0; i < 36; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const pollRes = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
      headers: { authorization: apiKey },
    });
    const data = await pollRes.json();
    if (data.status === "completed") return data;
    if (data.status === "error") throw new Error(data.error);
  }
  throw new Error("Transcription timed out");
}

function calcTalkRatios(utterances: Array<{ speaker: string; text: string }>) {
  const words: Record<string, number> = {};
  for (const u of utterances) {
    words[u.speaker] = (words[u.speaker] ?? 0) + u.text.split(" ").length;
  }
  const speakers = Object.keys(words);
  if (speakers.length < 2) return { rep: 50, customer: 50 };
  // Assume first speaker is rep
  const total = Object.values(words).reduce((a, b) => a + b, 0);
  const repWords = words[speakers[0]];
  return {
    rep: Math.round((repWords / total) * 100),
    customer: Math.round(((total - repWords) / total) * 100),
  };
}

async function analyzeWithClaude(transcript: string): Promise<{
  coaching_score: number;
  coaching_feedback: string;
  topics: string[];
  objections: string[];
  buying_signals: string[];
  next_steps: string[];
  outcome: string;
}> {
  // Call our own API route that uses Claude
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ transcript }),
  });
  if (!res.ok) throw new Error("Analysis failed");
  return res.json();
}

export default function AnalyzeCallButton({
  callId,
  audioUrl,
  variant = "default",
}: AnalyzeCallButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleAnalyze = async () => {
    if (!audioUrl) {
      alert("No audio URL found for this call.");
      return;
    }

    setLoading(true);
    setStatus("Fetching API key…");

    const supabase = createClient();

    // Fetch AssemblyAI key from platform_config
    const { data: config } = await supabase
      .from("platform_config")
      .select("assemblyai_api_key")
      .limit(1)
      .single();

    if (!config?.assemblyai_api_key) {
      alert("AssemblyAI API key not configured. Go to Settings → Platform Config.");
      setLoading(false);
      return;
    }

    // Update status to transcribing
    await supabase
      .from("calls")
      .update({ status: "transcribing" })
      .eq("id", callId);

    setStatus("Transcribing audio (1–2 min)…");

    try {
      const transcriptData = await transcribeWithAssemblyAI(audioUrl, config.assemblyai_api_key);

      const utterances = transcriptData.utterances ?? [];
      const transcript = transcriptData.text ?? "";
      const duration = transcriptData.audio_duration ?? null;
      const { rep, customer } = calcTalkRatios(utterances);

      // Update with transcription, move to analyzing
      await supabase.from("calls").update({
        transcript,
        utterances,
        duration_seconds: duration,
        talk_ratio_rep: rep,
        talk_ratio_customer: customer,
        status: "analyzing",
      }).eq("id", callId);

      setStatus("Running AI analysis…");

      // AI analysis
      const analysis = await analyzeWithClaude(transcript);

      await supabase.from("calls").update({
        ...analysis,
        status: "completed",
      }).eq("id", callId);

      setStatus("Done!");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      await supabase.from("calls").update({ status: "error" }).eq("id", callId);
      alert("Analysis failed: " + msg);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleAnalyze}
      disabled={loading}
      className={`bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-medium rounded-lg transition-colors ${
        variant === "large" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm"
      }`}
    >
      {loading ? status || "Analyzing…" : "⚡ Analyze call"}
    </button>
  );
}
