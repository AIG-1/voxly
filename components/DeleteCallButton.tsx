"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteCallButtonProps {
  callId: string;
  variant?: "icon" | "full";
}

export default function DeleteCallButton({ callId, variant = "icon" }: DeleteCallButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/calls/${callId}`, { method: "DELETE" });

      if (res.ok) {
        if (variant === "full") {
          router.push("/dashboard/calls");
        } else {
          router.refresh();
        }
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Delete failed");
        setLoading(false);
        setConfirming(false);
      }
    } catch {
      setError("Network error — try again");
      setLoading(false);
      setConfirming(false);
    }
  };

  if (error) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "12px", color: "#DC2626" }}>{error}</span>
        <button
          onClick={() => setError(null)}
          style={{
            fontSize: "11px", padding: "2px 8px", borderRadius: "6px",
            background: "var(--bg-alt)", color: "var(--muted)",
            border: "1px solid var(--border)", cursor: "pointer",
          }}
        >
          OK
        </button>
      </span>
    );
  }

  if (confirming) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "12px", color: "#DC2626", fontWeight: 500 }}>Delete?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            fontSize: "11px", padding: "3px 10px", borderRadius: "6px",
            background: "#DC2626", color: "#fff", border: "none",
            cursor: loading ? "not-allowed" : "pointer", fontWeight: 600,
          }}
        >
          {loading ? "…" : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          style={{
            fontSize: "11px", padding: "3px 10px", borderRadius: "6px",
            background: "var(--bg-alt)", color: "var(--muted)",
            border: "1px solid var(--border)", cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </span>
    );
  }

  if (variant === "full") {
    return (
      <button
        onClick={() => setConfirming(true)}
        style={{
          fontSize: "13px", padding: "8px 16px", borderRadius: "8px",
          background: "none", color: "#DC2626",
          border: "1px solid rgba(220,38,38,.25)", cursor: "pointer",
          transition: "all .15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "rgba(220,38,38,.5)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "rgba(220,38,38,.25)"; }}
      >
        Delete call
      </button>
    );
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirming(true); }}
      title="Delete call"
      style={{
        background: "none", border: "none",
        color: "var(--muted)",
        cursor: "pointer", fontSize: "18px", padding: "2px 6px",
        lineHeight: 1, borderRadius: "4px", transition: "color .15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
    >
      ×
    </button>
  );
}
