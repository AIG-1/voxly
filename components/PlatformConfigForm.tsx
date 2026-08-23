"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function PlatformConfigForm({ hasKey, configId }: { hasKey: boolean; configId?: string }) {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setLoading(true);
    const supabase = createClient();

    let error;
    if (configId) {
      // Update existing row
      ({ error } = await supabase
        .from("platform_config")
        .update({ assemblyai_api_key: apiKey.trim(), updated_at: new Date().toISOString() })
        .eq("id", configId));
    } else {
      // Insert new row
      ({ error } = await supabase
        .from("platform_config")
        .insert({ assemblyai_api_key: apiKey.trim() }));
    }

    if (error) {
      alert("Failed to save: " + error.message);
    } else {
      setSaved(true);
      setApiKey("");
      setTimeout(() => setSaved(false), 3000);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSave} className="flex gap-3">
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder={hasKey ? "Enter new key to update" : "Paste your AssemblyAI API key"}
        className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
      />
      <button
        type="submit"
        disabled={loading || !apiKey.trim()}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        {saved ? "✓ Saved" : loading ? "Saving…" : hasKey ? "Update" : "Save"}
      </button>
    </form>
  );
}
