"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

interface UploadCallButtonProps {
  companyId: string;
  userId: string;
  variant?: "default" | "large";
  callCount?: number;
  subscribed?: boolean;
}

export default function UploadCallButton({
  companyId,
  userId,
  variant = "default",
  callCount = 0,
  subscribed = false,
}: UploadCallButtonProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");

  const atLimit = callCount >= 3 && !subscribed;

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setProgress("Uploading…");

    const supabase = createClient();

    // 1. Upload audio to Supabase Storage
    const filePath = `${companyId}/${Date.now()}-${file.name}`;
    const { error: storageError } = await supabase.storage
      .from("call-recordings")
      .upload(filePath, file, { contentType: file.type });

    if (storageError) {
      alert("Upload failed: " + storageError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("call-recordings")
      .getPublicUrl(filePath);

    setProgress("Creating call record…");

    // 2. Insert call record
    const { data: call, error: callError } = await supabase
      .from("calls")
      .insert({
        company_id: companyId,
        user_id: userId,
        title: file.name.replace(/\.[^/.]+$/, ""),
        audio_url: urlData.publicUrl,
        status: "pending",
      })
      .select()
      .single();

    if (callError) {
      alert("Failed to create call: " + callError.message);
      setUploading(false);
      return;
    }

    setProgress("Done! Redirecting…");
    router.push(`/dashboard/calls/${call.id}`);
    router.refresh();
  };

  // Paywall state — show upgrade prompt instead of upload
  if (atLimit) {
    if (variant === "large") {
      return (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>
            You&apos;ve used all 3 free calls.
          </p>
          <a
            href="/dashboard/billing"
            style={{
              display: "inline-block", padding: "12px 28px",
              background: "var(--accent)", color: "#fff",
              borderRadius: "10px", fontSize: "14px", fontWeight: 700,
              textDecoration: "none", transition: "opacity .15s",
            }}
          >
            Upgrade to upload more →
          </a>
        </div>
      );
    }
    return (
      <a
        href="/dashboard/billing"
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "8px 16px", borderRadius: "8px",
          background: "var(--accent)", color: "#fff",
          fontSize: "13px", fontWeight: 600, textDecoration: "none",
        }}
      >
        💳 Upgrade to upload
      </a>
    );
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="audio/*,video/*,.mp3,.mp4,.m4a,.wav,.ogg"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: variant === "large" ? "12px 28px" : "8px 16px",
          fontSize: variant === "large" ? "15px" : "13px",
          fontWeight: 600, borderRadius: variant === "large" ? "10px" : "8px",
          background: "var(--accent)", color: "#fff",
          border: "none", cursor: uploading ? "not-allowed" : "pointer",
          opacity: uploading ? 0.7 : 1, transition: "opacity .15s",
        }}
      >
        {uploading ? progress : "↑ Upload call"}
      </button>
    </>
  );
}
