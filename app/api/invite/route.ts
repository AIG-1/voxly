import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createServiceClient } from "@/lib/supabase-service";

export async function POST(req: Request) {
  // Verify caller is authenticated and is admin/super_admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id, role")
    .eq("user_id", user.id)
    .single();

  if (!profile?.company_id) return NextResponse.json({ error: "No company" }, { status: 400 });
  if (profile.role !== "admin" && profile.role !== "super_admin") {
    return NextResponse.json({ error: "Only admins can invite members" }, { status: 403 });
  }

  const { email, role } = await req.json();
  if (!email || !role) return NextResponse.json({ error: "email and role required" }, { status: 400 });

  const service = createServiceClient();

  // Record invite in DB
  const { data: invite, error: inviteError } = await service
    .from("team_invites")
    .insert({
      company_id: profile.company_id,
      invited_by: user.id,
      email,
      role,
      status: "pending",
    })
    .select()
    .single();

  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 500 });
  }

  // Send invite email via Supabase Auth (sends magic link automatically)
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://voxly.applied-intelholdings.net"}/auth/callback?next=/dashboard`;

  const { error: authError } = await service.auth.admin.inviteUserByEmail(email, {
    redirectTo,
    data: {
      company_id: profile.company_id,
      role,
      invite_id: invite.id,
    },
  });

  if (authError) {
    // Clean up the invite record if email fails
    await service.from("team_invites").delete().eq("id", invite.id);
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
