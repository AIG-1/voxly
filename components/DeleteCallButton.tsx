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

  const handleDelete = async () => {
    setLoading(true);
    const res = await fetch(`/api/calls/${callId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard/calls");
      router.refresh();
    } else {
      const json = await res.json();
      alert(json.error ?? "Delete failed");
      setLoading(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "12px", color: "#f87171" }}>Delete?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            fontSize: "11px", padding: "3px 10px", borderRadius: "6px",
            background: "#991b1b", color: "#fecaca", border: "none", cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "…" : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          style={{
            fontSize: "11px", padding: "3px 10px", borderRadius: "6px",
            background: "#1f2937", color: "#9ca3af", border: "none", cursor: "pointer",
          }}
        >
          No
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
          background: "none", color: "#f87171", border: "1px solid #7f1d1d",
          cursor: "pointer",
        }}
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
        background: "none", border: "none", color: "#4b5563",
        cursor: "pointer", fontSize: "15px", padding: "2px 6px",
        lineHeight: 1, borderRadius: "4px",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#4b5563")}
    >
      ×
    </button>
  );
}
