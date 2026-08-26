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
          // On detail page — navigate back to list
          router.push("/dashboard/calls");
        } else {
          // On list page — refresh data in place
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
        <span style={{ fontSize: "12px", color: "#f87171" }}>{error}</span>
        <button
          onClick={() => setError(null)}
          style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "6px", background: "#1f2937", color: "#9ca3af", border: "none", cursor: "pointer" }}
        >
          OK
        </button>
      </span>
    );
  }

  if (confirming) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "12px", color: "#DC2626" }}>Delete?</span>
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
            background: "var(--vx-surface2, #EDEAFF)", color: "var(--vx-muted, #7570A0)",
            border: "1px solid var(--vx-border, rgba(79,70,229,.12))", cursor: "pointer",
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
          border: "1px solid rgba(220,38,38,.3)", cursor: "pointer",
          transition: "all .15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#FEE2E2"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
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
        color: "var(--vx-muted, #7570A0)",
        cursor: "pointer", fontSize: "16px", padding: "2px 6px",
        lineHeight: 1, borderRadius: "4px", transition: "color .15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--vx-muted, #7570A0)")}
    >
      ×
    </button>
  );
}
