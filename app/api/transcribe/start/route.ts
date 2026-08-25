import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-service";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  // Verify user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { callId } = await req.json();
  if (!callId) return NextResponse.json({ error: "callId required" }, { status: 400 });

  // Use service role to read platform_config and call record
  const service = createServiceClient();

  const [{ data: call }, { data: config }] = await Promise.all([
    service.from("calls").select("id, audio_url, company_id").eq("id", callId).single(),
    service.from("platform_config").select("assemblyai_api_key").limit(1).single(),
  ]);

  if (!call) return NextResponse.json({ error: "Call not found" }, { status: 404 });
  if (!call.audio_url) return NextResponse.json({ error: "No audio URL on this call" }, { status: 400 });
  if (!config?.assemblyai_api_key) {
    return NextResponse.json({ error: "AssemblyAI key not configured — go to Settings" }, { status: 400 });
  }

  // Mark as transcribing
  await service.from("calls").update({ status: "transcribing" }).eq("id", callId);

  // Submit to AssemblyAI
  const res = await fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    headers: {
      authorization: config.assemblyai_api_key,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      audio_url: call.audio_url,
      speaker_labels: true,
      auto_chapters: false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    await service.from("calls").update({ status: "error" }).eq("id", callId);
    return NextResponse.json({ error: `AssemblyAI error: ${err}` }, { status: 502 });
  }

  const { id: transcriptId } = await res.json();
  return NextResponse.json({ transcriptId });
}
