"use client";

import { useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  preview?: string; // short text shown when collapsed
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({
  title,
  preview,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1f2937",
        borderRadius: "12px",
        marginBottom: "16px",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#f9fafb", flexShrink: 0 }}>
            {title}
          </span>
          {!open && preview && (
            <span
              style={{
                fontSize: "12px",
                color: "#6b7280",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              — {preview}
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: "12px",
            color: "#6b7280",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            display: "inline-block",
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div style={{ padding: "0 20px 16px 20px", borderTop: "1px solid #1f2937" }}>
          <div style={{ paddingTop: "14px" }}>{children}</div>
        </div>
      )}
    </div>
  );
}
