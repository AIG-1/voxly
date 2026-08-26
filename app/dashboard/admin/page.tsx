import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { createServiceClient } from "@/lib/supabase-service";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user!.id)
    .single();

  if (profile?.role !== "super_admin") redirect("/dashboard");

  const service = createServiceClient();

  const [
    { data: companies },
    { data: allProfiles },
    { data: allCalls },
    { data: allInvites },
  ] = await Promise.all([
    service.from("companies").select("id, name, industry, team_size, created_at").order("created_at", { ascending: false }),
    service.from("profiles").select("id, full_name, email, role, company_id, created_at").order("created_at", { ascending: false }),
    service.from("calls").select("id, title, status, coaching_score, outcome, company_id, user_id, created_at").order("created_at", { ascending: false }),
    service.from("team_invites").select("id, email, role, company_id, status, created_at").order("created_at", { ascending: false }),
  ]);

  const totalCompanies  = companies?.length ?? 0;
  const totalUsers      = allProfiles?.length ?? 0;
  const totalCalls      = allCalls?.length ?? 0;
  const completedCalls  = allCalls?.filter((c) => c.status === "completed") ?? [];
  const avgScore        = completedCalls.length > 0
    ? Math.round(completedCalls.reduce((s, c) => s + (c.coaching_score ?? 0), 0) / completedCalls.length)
    : null;
  const wonCalls        = completedCalls.filter((c) => c.outcome === "won").length;
  const winRate         = completedCalls.length > 0 ? Math.round((wonCalls / completedCalls.length) * 100) : null;
  const pendingInvites  = allInvites?.filter((i) => i.status === "pending").length ?? 0;

  const companyMap: Record<string, string> = {};
  companies?.forEach((c) => { companyMap[c.id] = c.name; });

  const surface: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
  };

  const sectionHeader: React.CSSProperties = {
    padding: "16px 20px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const th: React.CSSProperties = {
    padding: "10px 16px",
    textAlign: "left",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "var(--muted)",
    fontWeight: 600,
    borderBottom: "1px solid var(--border)",
    background: "var(--bg-alt)",
  };

  const td: React.CSSProperties = {
    padding: "12px 16px",
    borderBottom: "1px solid var(--border)",
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <span style={{ fontSize: "28px" }}>🛡</span>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--ink)" }}>Super Admin</h1>
        </div>
        <p style={{ fontSize: "14px", color: "var(--muted)", marginLeft: "40px" }}>
          Platform-wide view — {totalCompanies} {totalCompanies === 1 ? "company" : "companies"}, {totalUsers} {totalUsers === 1 ? "user" : "users"}, {totalCalls} {totalCalls === 1 ? "call" : "calls"}
        </p>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px", marginBottom: "28px" }}>
        {[
          { icon: "🏢", label: "Companies",      value: totalCompanies.toString(),                    sub: "tenants on platform" },
          { icon: "👤", label: "Users",           value: totalUsers.toString(),                        sub: "across all companies" },
          { icon: "🎙", label: "Calls",           value: totalCalls.toString(),                        sub: `${completedCalls.length} analyzed` },
          { icon: "📊", label: "Avg Score",       value: avgScore !== null ? `${avgScore}/100` : "—", sub: winRate !== null ? `${winRate}% win rate` : "—" },
          { icon: "✉️", label: "Pending Invites", value: pendingInvites.toString(),                    sub: "awaiting acceptance" },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
              <span style={{ fontSize: "16px" }}>{s.icon}</span>
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", fontWeight: 600 }}>{s.label}</p>
            </div>
            <p style={{ fontSize: "28px", fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "5px" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Companies + Users */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

        {/* Companies */}
        <div style={surface}>
          <div style={sectionHeader}>
            <h2 style={{ fontWeight: 600, color: "var(--ink)", fontSize: "14px" }}>Companies</h2>
            <CountPill count={totalCompanies} />
          </div>
          {!companies || companies.length === 0 ? (
            <EmptyState icon="🏢" text="No companies yet" />
          ) : (
            companies.map((c, i) => {
              const memberCount = allProfiles?.filter((p) => p.company_id === c.id).length ?? 0;
              const callCount   = allCalls?.filter((call) => call.company_id === c.id).length ?? 0;
              return (
                <div key={c.id} style={{
                  padding: "14px 20px",
                  borderBottom: i < companies.length - 1 ? "1px solid var(--border)" : "none",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>{c.name}</p>
                    <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
                      {c.industry ?? "No industry"} · {memberCount} member{memberCount !== 1 ? "s" : ""} · since {new Date(c.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "20px", fontWeight: 700, color: "var(--accent)" }}>{callCount}</p>
                    <p style={{ fontSize: "11px", color: "var(--muted)" }}>calls</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Users */}
        <div style={surface}>
          <div style={sectionHeader}>
            <h2 style={{ fontWeight: 600, color: "var(--ink)", fontSize: "14px" }}>All Users</h2>
            <CountPill count={totalUsers} />
          </div>
          {!allProfiles || allProfiles.length === 0 ? (
            <EmptyState icon="👤" text="No users yet" />
          ) : (
            allProfiles.slice(0, 10).map((p, i) => (
              <div key={p.id} style={{
                padding: "12px 20px",
                borderBottom: i < Math.min(allProfiles.length, 10) - 1 ? "1px solid var(--border)" : "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "30px", height: "30px", borderRadius: "50%",
                    background: "var(--adim)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: 700, color: "var(--accent)", flexShrink: 0,
                  }}>
                    {(p.full_name || p.email || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--ink)" }}>{p.full_name || "—"}</p>
                    <p style={{ fontSize: "11px", color: "var(--muted)" }}>
                      {p.email} · {companyMap[p.company_id] ?? "Unknown co."}
                    </p>
                  </div>
                </div>
                <RoleBadge role={p.role} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pending Invites */}
      {allInvites && allInvites.filter(i => i.status === "pending").length > 0 && (
        <div style={{ ...surface, marginBottom: "20px" }}>
          <div style={sectionHeader}>
            <h2 style={{ fontWeight: 600, color: "var(--ink)", fontSize: "14px" }}>Pending Invites</h2>
            <CountPill count={pendingInvites} />
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Email", "Company", "Role", "Sent"].map((h) => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allInvites.filter(i => i.status === "pending").map((inv) => (
                <tr key={inv.id}>
                  <td style={{ ...td, fontSize: "13px", color: "var(--ink)", fontWeight: 500 }}>{inv.email}</td>
                  <td style={{ ...td, fontSize: "12px", color: "var(--muted)" }}>{companyMap[inv.company_id] ?? "—"}</td>
                  <td style={td}><RoleBadge role={inv.role} /></td>
                  <td style={{ ...td, fontSize: "12px", color: "var(--muted)" }}>{new Date(inv.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* All Calls */}
      <div style={surface}>
        <div style={sectionHeader}>
          <h2 style={{ fontWeight: 600, color: "var(--ink)", fontSize: "14px" }}>All Calls — Platform-wide</h2>
          <CountPill count={totalCalls} label="total" />
        </div>
        {!allCalls || allCalls.length === 0 ? (
          <EmptyState icon="🎙" text="No calls uploaded yet" />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Call", "Company", "Date", "Status", "Score", "Outcome"].map((h) => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allCalls.slice(0, 25).map((call, i) => (
                  <tr key={call.id} style={{ background: i % 2 === 0 ? "transparent" : "var(--bg-alt)" }}>
                    <td style={{ ...td, borderBottom: i < Math.min(allCalls.length, 25) - 1 ? "1px solid var(--border)" : "none" }}>
                      <a href={`/dashboard/calls/${call.id}`} style={{ fontSize: "13px", fontWeight: 500, color: "var(--accent)" }}>
                        {call.title || `Call #${call.id.slice(-6)}`}
                      </a>
                    </td>
                    <td style={{ ...td, fontSize: "12px", color: "var(--muted)", borderBottom: i < Math.min(allCalls.length, 25) - 1 ? "1px solid var(--border)" : "none" }}>
                      {companyMap[call.company_id] ?? "—"}
                    </td>
                    <td style={{ ...td, fontSize: "12px", color: "var(--muted)", borderBottom: i < Math.min(allCalls.length, 25) - 1 ? "1px solid var(--border)" : "none" }}>
                      {new Date(call.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ ...td, borderBottom: i < Math.min(allCalls.length, 25) - 1 ? "1px solid var(--border)" : "none" }}>
                      <StatusBadge status={call.status} />
                    </td>
                    <td style={{ ...td, fontSize: "13px", fontWeight: 700, color: "var(--accent)", borderBottom: i < Math.min(allCalls.length, 25) - 1 ? "1px solid var(--border)" : "none" }}>
                      {call.coaching_score ? `${call.coaching_score}/100` : "—"}
                    </td>
                    <td style={{ ...td, borderBottom: i < Math.min(allCalls.length, 25) - 1 ? "1px solid var(--border)" : "none" }}>
                      {call.outcome ? <OutcomeBadge outcome={call.outcome} /> : <span style={{ color: "var(--muted)" }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function CountPill({ count, label = "" }: { count: number; label?: string }) {
  return (
    <span style={{
      fontSize: "11px", padding: "2px 10px", borderRadius: "99px",
      background: "var(--adim)", color: "var(--accent)",
      border: "1px solid var(--border)", fontWeight: 600,
    }}>
      {count}{label ? ` ${label}` : ""}
    </span>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <p style={{ fontSize: "32px" }}>{icon}</p>
      <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "8px" }}>{text}</p>
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    pending:      { bg: "#F3F4F6", color: "#6B7280", border: "#D1D5DB" },
    transcribing: { bg: "#FEF9C3", color: "#92400E", border: "#FDE68A" },
    analyzing:    { bg: "#DBEAFE", color: "#1E40AF", border: "#BFDBFE" },
    completed:    { bg: "#DCFCE7", color: "#166534", border: "#BBF7D0" },
    error:        { bg: "#FEE2E2", color: "#991B1B", border: "#FECACA" },
  };
  const s = styles[status] ?? styles.pending;
  return (
    <span style={{
      fontSize: "11px", padding: "2px 9px", borderRadius: "99px",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontWeight: 600,
    }}>
      {status}
    </span>
  );
}

function OutcomeBadge({ outcome }: { outcome: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    won:       { bg: "#DCFCE7", color: "#166534", border: "#BBF7D0" },
    lost:      { bg: "#FEE2E2", color: "#991B1B", border: "#FECACA" },
    follow_up: { bg: "#FEF9C3", color: "#92400E", border: "#FDE68A" },
    unknown:   { bg: "#F3F4F6", color: "#6B7280", border: "#D1D5DB" },
  };
  const s = styles[outcome] ?? styles.unknown;
  return (
    <span style={{
      fontSize: "11px", padding: "2px 9px", borderRadius: "99px",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontWeight: 600, textTransform: "capitalize",
    }}>
      {outcome.replace("_", " ")}
    </span>
  );
}
