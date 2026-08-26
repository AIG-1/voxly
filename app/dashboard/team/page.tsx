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
  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";

  const [{ data: members }, { data: calls }, { data: invites }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, user_id, full_name, email, role, created_at")
      .eq("company_id", companyId)
      .order("created_at"),
    supabase
      .from("calls")
      .select("user_id, status, coaching_score, outcome")
      .eq("company_id", companyId),
    supabase
      .from("team_invites")
      .select("id, email, role, status, created_at")
      .eq("company_id", companyId)
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
  ]);

  // Build per-member stats from calls
  type MemberStats = { total: number; completed: number; avgScore: number | null; wins: number };
  const statsMap: Record<string, MemberStats> = {};

  for (const call of calls ?? []) {
    if (!call.user_id) continue;
    if (!statsMap[call.user_id]) statsMap[call.user_id] = { total: 0, completed: 0, avgScore: null, wins: 0 };
    const s = statsMap[call.user_id];
    s.total++;
    if (call.status === "completed") {
      s.completed++;
      if (call.coaching_score) {
        s.avgScore = s.avgScore === null
          ? call.coaching_score
          : Math.round((s.avgScore + call.coaching_score) / 2);
      }
      if (call.outcome === "won") s.wins++;
    }
  }

  const white = "#f9fafb";
  const muted = "#a78bfa";
  const subtle = "#7c85f5";
  const cyan = "#22d3ee";
  const surface = "#111827";
  const border = "1px solid #1f2937";

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: white }}>Team</h1>
          <p style={{ fontSize: "13px", color: muted, marginTop: "4px" }}>
            {members?.length ?? 0} member{members?.length !== 1 ? "s" : ""} · manage your sales team
          </p>
        </div>
        {isAdmin && <InviteTeamButton companyId={companyId} invitedBy={user!.id} />}
      </div>

      {/* Rep performance table */}
      <div style={{ background: surface, border, borderRadius: "12px", overflow: "hidden", marginBottom: "24px" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontWeight: 600, color: white, fontSize: "14px" }}>Members</h2>
          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "#312e81", color: "#a5b4fc" }}>
            {members?.length ?? 0}
          </span>
        </div>

        {!members || members.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ fontSize: "32px" }}>👤</p>
            <p style={{ color: muted, fontSize: "13px", marginTop: "8px" }}>No members yet</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1f2937" }}>
                {["Member", "Role", "Calls", "Avg Score", "Win Rate", "Joined"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: muted, fontWeight: 500 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => {
                const s = statsMap[m.user_id] ?? { total: 0, completed: 0, avgScore: null, wins: 0 };
                const winRate = s.completed > 0 ? Math.round((s.wins / s.completed) * 100) : null;
                return (
                  <tr key={m.id} style={{ borderBottom: i < members.length - 1 ? "1px solid #1f2937" : "none" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "32px", height: "32px", borderRadius: "50%", background: "#4338ca",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "13px", fontWeight: 600, color: "#fff", flexShrink: 0,
                        }}>
                          {(m.full_name || m.email || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: 500, color: white }}>{m.full_name || "—"}</p>
                          <p style={{ fontSize: "11px", color: subtle }}>{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <RoleBadge role={m.role} />
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: white, fontWeight: 600 }}>
                      {s.total}
                      {s.completed < s.total && s.total > 0 && (
                        <span style={{ fontSize: "11px", color: subtle, fontWeight: 400, marginLeft: "4px" }}>
                          ({s.completed} done)
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 700, color: s.avgScore !== null ? cyan : subtle }}>
                      {s.avgScore !== null ? `${s.avgScore}/100` : "—"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {winRate !== null ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "60px", height: "5px", background: "#1f2937", borderRadius: "99px", overflow: "hidden" }}>
                            <div style={{ width: `${winRate}%`, height: "100%", background: winRate >= 50 ? "#4ade80" : "#f87171", borderRadius: "99px" }} />
                          </div>
                          <span style={{ fontSize: "12px", color: winRate >= 50 ? "#4ade80" : "#f87171", fontWeight: 500 }}>
                            {winRate}%
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: subtle, fontSize: "13px" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "12px", color: subtle }}>
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pending invites */}
      {invites && invites.length > 0 && (
        <div style={{ background: surface, border, borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontWeight: 600, color: white, fontSize: "14px" }}>Pending Invites</h2>
            <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "#422006", color: "#fcd34d" }}>
              {invites.length} pending
            </span>
          </div>
          {invites.map((inv, i) => (
            <div key={inv.id} style={{ padding: "14px 20px", borderBottom: i < invites.length - 1 ? "1px solid #1f2937" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "13px", color: white }}>{inv.email}</p>
                <p style={{ fontSize: "11px", color: subtle, marginTop: "2px" }}>
                  Invited {new Date(inv.created_at).toLocaleDateString()} · awaiting sign-up
                </p>
              </div>
              <RoleBadge role={inv.role} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    super_admin: { bg: "#581c87", color: "#d8b4fe" },
    admin:       { bg: "#312e81", color: "#a5b4fc" },
    member:      { bg: "#1f2937", color: "#9ca3af" },
  };
  const s = styles[role] ?? styles.member;
  return (
    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: s.bg, color: s.color, fontWeight: 500, textTransform: "capitalize" }}>
      {role.replace("_", " ")}
    </span>
  );
}
