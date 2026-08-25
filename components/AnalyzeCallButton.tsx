"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AnalyzeCallButtonProps {
  callId: string;
  audioUrl: string | null;
  variant?: "default" | "large";
}

export default function AnalyzeCallButton({
  callId,
  audioUrl,
  variant = "default",
}: AnalyzeCallButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleAnalyze = async () => {
    if (!audioUrl) {
      alert("No audio URL found for this call.");
      return;
    }

    setLoading(true);
    setStatusMsg("Starting transcription…");

    try {
      // 1. Submit job server-side (key never touches browser)
      const startRes = await fetch("/api/transcribe/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ callId }),
      });

      if (!startRes.ok) {
        const { error } = await startRes.json();
        throw new Error(error ?? "Failed to start transcription");
      }

      const { transcriptId } = await startRes.json();
      setStatusMsg("Transcribing audio (1–2 min)…");

      // 2. Poll every 5 seconds — server does the AssemblyAI call
      for (let i = 0; i < 36; i++) {
        await new Promise((r) => setTimeout(r, 5000));

        const pollRes = await fetch("/api/transcribe/poll", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ transcriptId, callId }),
        });

        if (!pollRes.ok) {
          const { error } = await pollRes.json().catch(() => ({}));
          throw new Error(error ?? "Poll request failed");
        }

        const { status, error } = await pollRes.json();

        if (status === "error") throw new Error(error ?? "Transcription failed");
        if (status === "analyzing") setStatusMsg("Running AI analysis…");
        if (status === "completed") {
          setStatusMsg("Done!");
          router.refresh();
          setLoading(false);
          return;
        }
      }

      throw new Error("Transcription timed out — try again");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert("Analysis failed: " + msg);
      router.refresh(); // refresh so status badge updates if DB was already changed
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleAnalyze}
      disabled={loading}
      style={{
        background: loading ? "#4338ca" : "#4f46e5",
        color: "#fff",
        fontWeight: 500,
        borderRadius: "8px",
        border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        transition: "background 0.15s",
        padding: variant === "large" ? "12px 24px" : "8px 16px",
        fontSize: variant === "large" ? "15px" : "13px",
      }}
    >
      {loading ? statusMsg || "Analyzing…" : "⚡ Analyze call"}
    </button>
  );
}
