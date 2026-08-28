"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BillingActionsProps {
  status: string;
  hasCustomer: boolean;
}

export default function BillingActions({ status, hasCustomer }: BillingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        setError(json.error ?? "Could not start checkout");
        setLoading(false);
      }
    } catch {
      setError("Network error — try again");
      setLoading(false);
    }
  };

  const handlePortal = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        setError(json.error ?? "Could not open billing portal");
        setLoading(false);
      }
    } catch {
      setError("Network error — try again");
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "12px", color: "#DC2626" }}>{error}</span>
        <button
          onClick={() => setError(null)}
          style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "6px",
            background: "var(--bg-alt)", border: "1px solid var(--border)", cursor: "pointer", color: "var(--muted)" }}
        >
          Dismiss
        </button>
      </div>
    );
  }

  if (status === "active") {
    return (
      <button
        onClick={handlePortal}
        disabled={loading}
        style={{
          padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
          background: "var(--bg-alt)", color: "var(--ink)",
          border: "1px solid var(--border)", cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1, transition: "all .15s",
        }}
      >
        {loading ? "Opening portal…" : "Manage subscription →"}
      </button>
    );
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      style={{
        padding: "11px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: 700,
        background: "var(--accent)", color: "#fff",
        border: "none", cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1, transition: "opacity .15s",
      }}
    >
      {loading ? "Redirecting to checkout…" : "Subscribe — $49/mo →"}
    </button>
  );
}
