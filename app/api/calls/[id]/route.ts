import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase-service";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code);

    // If this was an invite flow, wire up the new user to the right company + role
    if (session?.user) {
      const authUser = session.user;
      const meta = authUser.user_metadata as {
        company_id?: string;
        role?: string;
        invite_id?: string;
      };

      if (meta?.company_id && meta?.role) {
        const service = createServiceClient();

        // Upsert profile — creates it if missing (invited users have no profile yet),
        // or updates it if it already exists from a prior partial flow.
        await service
          .from("profiles")
          .upsert(
            {
              user_id: authUser.id,
              email: authUser.email ?? "",
              full_name: (authUser.user_metadata?.full_name as string) ?? "",
              company_id: meta.company_id,
              role: meta.role,
            },
            { onConflict: "user_id" }
          );

        // Mark invite accepted
        if (meta.invite_id) {
          await service
            .from("team_invites")
            .update({ status: "accepted" })
            .eq("id", meta.invite_id);
        }
      }
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
