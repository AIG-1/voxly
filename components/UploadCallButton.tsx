"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

interface UploadCallButtonProps {
  companyId: string;
  userId: string;
  variant?: "default" | "large";
}

export default function UploadCallButton({
  companyId,
  userId,
  variant = "default",
}: UploadCallButtonProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");

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

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="audio/*,video/*,.mp3,.mp4,.m4a,.wav,.ogg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className={`bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors ${
          variant === "large"
            ? "px-6 py-3 text-base"
            : "px-4 py-2 text-sm"
        }`}
      >
        {uploading ? progress : "↑ Upload call"}
      </button>
    </>
  );
}
