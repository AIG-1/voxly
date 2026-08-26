import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createServiceClient } from "@/lib/supabase-service";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id, role")
    .eq("user_id", user.id)
    .single();

  if (!profile?.company_id) {
    return NextResponse.json({ error: "No company" }, { status: 400 });
  }

  // Fetch the call to verify ownership and get the audio URL for storage cleanup
  const { data: call } = await supabase
    .from("calls")
    .select("id, company_id, audio_url, user_id")
    .eq("id", id)
    .single();

  if (!call) {
    return NextResponse.json({ error: "Call not found" }, { status: 404 });
  }

  // Only allow: the call's owner, or an admin/super_admin in the same company
  const isOwner = call.user_id === user.id;
  const isAdmin = profile.role === "admin" || profile.role === "super_admin";
  const sameCompany = call.company_id === profile.company_id;

  if (!sameCompany || (!isOwner && !isAdmin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const service = createServiceClient();

  // Delete audio from storage if present
  if (call.audio_url) {
    try {
      const url = new URL(call.audio_url);
      // Extract storage path: everything after /object/public/call-recordings/
      const marker = "/object/public/call-recordings/";
      const idx = url.pathname.indexOf(marker);
      if (idx !== -1) {
        const storagePath = decodeURIComponent(url.pathname.slice(idx + marker.length));
        await service.storage.from("call-recordings").remove([storagePath]);
      }
    } catch {
      // Non-fatal — proceed with DB delete even if storage cleanup fails
    }
  }

  // Delete the call record
  const { error } = await service.from("calls").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
