import { createClient } from "@/lib/supabase-server";
import InviteTeamButton from "@/components/InviteTeamButton";

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id, role")
    .eq("user_id", user!.id)
    .single();

  const companyId = profile?.company_id;

  const { data: members } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .eq("company_id", companyId)
    .order("created_at");

  const { data: invites } = await supabase
    .from("team_invites")
    .select("id, email, role, status, created_at")
    .eq("company_id", companyId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your sales team</p>
        </div>
        {isAdmin && <InviteTeamButton companyId={companyId} invitedBy={user!.id} />}
      </div>

      {/* Members */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl mb-6">
        <div className="p-5 border-b border-gray-800">
          <h2 className="font-semibold text-white">Members ({members?.length ?? 0})</h2>
        </div>
        <div className="divide-y divide-gray-800">
          {members?.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                  {(m.full_name || m.email || "?")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{m.full_name || "—"}</p>
                  <p className="text-xs text-gray-500">{m.email}</p>
                </div>
              </div>
              <RoleBadge role={m.role} />
            </div>
          ))}
        </div>
      </div>

      {/* Pending invites */}
      {invites && invites.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="p-5 border-b border-gray-800">
            <h2 className="font-semibold text-white">Pending Invites ({invites.length})</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {invites.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm text-white">{inv.email}</p>
                  <p className="text-xs text-gray-500">Invited {new Date(inv.created_at).toLocaleDateString()}</p>
                </div>
                <RoleBadge role={inv.role} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    admin: "bg-indigo-900 text-indigo-300",
    super_admin: "bg-purple-900 text-purple-300",
    member: "bg-gray-700 text-gray-300",
  };
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${map[role] ?? map.member}`}>
      {role.replace("_", " ")}
    </span>
  );
}
