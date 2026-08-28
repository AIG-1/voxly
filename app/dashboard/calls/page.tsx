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

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--ink)" }}>Team</h1>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
            {members?.length ?? 0} member{members?.length !== 1 ? "s" : ""} · manage your sales team
          </p>
        </div>
        {isAdmin && <InviteTeamButton companyId={companyId} invitedBy={user!.id} />}
      </div>

      {/* Rep performance table */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", overflow: "hidden", marginBottom: "24px",
      }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontWeight: 600, color: "var(--ink)", fontSize: "14px" }}>Members</h2>
          <span style={{
            fontSize: "11px", padding: "2px 8px", borderRadius: "99px",
            background: "var(--adim)", color: "var(--accent)", border: "1px solid var(--border)", fontWeight: 600,
          }}>
            {members?.length ?? 0}
          </span>
        </div>

        {!members || members.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ fontSize: "32px" }}>👤</p>
            <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "8px" }}>No members yet</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-alt)" }}>
                  {["Member", "Role", "Calls", "Avg Score", "Win Rate", "Joined"].map((h) => (
                    <th key={h} style={{
                      padding: "10px 16px", textAlign: "left", fontSize: "11px",
                      textTransform: "uppercase", letterSpacing: "0.06em",
                      color: "var(--muted)", fontWeight: 600,
                    }}>
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
                    <tr key={m.id} style={{ borderBottom: i < members.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "32px", height: "32px", borderRadius: "50%",
                            background: "var(--accent)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "13px", fontWeight: 600, color: "#fff", flexShrink: 0,
                          }}>
                            {(m.full_name || m.email || "?")[0].toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--ink)" }}>{m.full_name || "—"}</p>
                            <p style={{ fontSize: "11px", color: "var(--muted)" }}>{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <RoleBadge role={m.role} />
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--ink)", fontWeight: 600 }}>
                        {s.total}
                        {s.completed < s.total && s.total > 0 && (
                          <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 400, marginLeft: "4px" }}>
                            ({s.completed} done)
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 700, color: s.avgScore !== null ? "var(--accent)" : "var(--muted)" }}>
                        {s.avgScore !== null ? `${s.avgScore}/100` : "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {winRate !== null ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "60px", height: "5px", background: "var(--bg-alt)", borderRadius: "99px", overflow: "hidden", border: "1px solid var(--border)" }}>
                              <div style={{
                                width: `${winRate}%`, height: "100%",
                                background: winRate >= 50 ? "#22c55e" : "#ef4444",
                                borderRadius: "99px",
                              }} />
                            </div>
                            <span style={{ fontSize: "12px", color: winRate >= 50 ? "#16a34a" : "#DC2626", fontWeight: 500 }}>
                              {winRate}%
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: "var(--muted)", fontSize: "13px" }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: "var(--muted)" }}>
                        {new Date(m.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pending invites */}
      {invites && invites.length > 0 && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontWeight: 600, color: "var(--ink)", fontSize: "14px" }}>Pending Invites</h2>
            <span style={{
              fontSize: "11px", padding: "2px 8px", borderRadius: "99px",
              background: "#FEF9C3", color: "#92400E", border: "1px solid #FDE68A", fontWeight: 600,
            }}>
              {invites.length} pending
            </span>
          </div>
          {invites.map((inv, i) => (
            <div key={inv.id} style={{
              padding: "14px 20px",
              borderBottom: i < invites.length - 1 ? "1px solid var(--border)" : "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <p style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 500 }}>{inv.email}</p>
                <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
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
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    super_admin: { bg: "rgba(79,70,229,.12)",  color: "#4338CA", border: "rgba(79,70,229,.25)" },
    admin:       { bg: "rgba(6,182,212,.10)",  color: "#0E7490", border: "rgba(6,182,212,.25)" },
    member:      { bg: "rgba(117,112,160,.10)", color: "#7570A0", border: "rgba(117,112,160,.25)" },
  };
  const s = styles[role] ?? styles.member;
  return (
    <span style={{
      fontSize: "11px", padding: "2px 9px", borderRadius: "99px",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontWeight: 600, textTransform: "capitalize",
    }}>
      {role.replace("_", " ")}
    </span>
  );
}
