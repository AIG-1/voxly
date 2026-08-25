import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user!.id)
    .single();

  if (profile?.role !== "super_admin") redirect("/dashboard");

  const [
    { data: companies },
    { data: allProfiles },
    { data: allCalls },
  ] = await Promise.all([
    supabase.from("companies").select("id, name, industry, team_size, created_at").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, email, role, company_id, created_at").order("created_at", { ascending: false }),
    supabase.from("calls").select("id, title, status, coaching_score, outcome, company_id, created_at").order("created_at", { ascending: false }),
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

  const companyMap: Record<string, string> = {};
  companies?.forEach((c) => { companyMap[c.id] = c.name; });

  const card = {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "12px",
    padding: "20px",
  } as const;

  const muted = "#a78bfa";
  const subtle = "#7c85f5";
  const cyan = "#22d3ee";
  const white = "#f9fafb";

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <span style={{ fontSize: "28px" }}>🛡</span>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: white }}>Super Admin</h1>
        </div>
        <p style={{ fontSize: "14px", color: muted, marginLeft: "40px" }}>
          Platform-wide view — {totalCompanies} {totalCompanies === 1 ? "company" : "companies"}, {totalUsers} {totalUsers === 1 ? "user" : "users"}, {totalCalls} {totalCalls === 1 ? "call" : "calls"}
        </p>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { icon: "🏢", label: "Companies",      value: totalCompanies.toString(),                    sub: "tenants on platform" },
          { icon: "👤", label: "Total Users",     value: totalUsers.toString(),                       sub: "across all companies" },
          { icon: "🎙", label: "Total Calls",     value: totalCalls.toString(),                       sub: `${completedCalls.length} analyzed` },
          { icon: "📊", label: "Avg Coach Score", value: avgScore !== null ? `${avgScore}/100` : "—", sub: winRate !== null ? `${winRate}% win rate` : "no data yet" },
        ].map((s) => (
          <div key={s.label} style={{ ...card }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <span style={{ fontSize: "18px" }}>{s.icon}</span>
              <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: muted, fontWeight: 500 }}>{s.label}</p>
            </div>
            <p style={{ fontSize: "32px", fontWeight: 700, color: white, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: "12px", color: subtle, marginTop: "6px" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Two-column: companies + users */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

        {/* Companies */}
        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontWeight: 600, color: white, fontSize: "14px" }}>Companies</h2>
            <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "#312e81", color: "#a5b4fc" }}>{totalCompanies}</span>
          </div>
          {!companies || companies.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ fontSize: "32px" }}>🏢</p>
              <p style={{ color: muted, fontSize: "13px", marginTop: "8px" }}>No companies yet</p>
            </div>
          ) : (
            companies.map((c, i) => {
              const memberCount = allProfiles?.filter((p) => p.company_id === c.id).length ?? 0;
              const callCount   = allCalls?.filter((call) => call.company_id === c.id).length ?? 0;
              return (
                <div key={c.id} style={{ padding: "14px 20px", borderBottom: i < companies.length - 1 ? "1px solid #1f2937" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: white }}>{c.name}</p>
                    <p style={{ fontSize: "11px", color: subtle, marginTop: "2px" }}>
                      {c.industry ?? "No industry"} · {memberCount} member{memberCount !== 1 ? "s" : ""} · since {new Date(c.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "18px", fontWeight: 700, color: cyan }}>{callCount}</p>
                    <p style={{ fontSize: "11px", color: subtle }}>calls</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Users */}
        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontWeight: 600, color: white, fontSize: "14px" }}>All Users</h2>
            <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "#312e81", color: "#a5b4fc" }}>{totalUsers}</span>
          </div>
          {!allProfiles || allProfiles.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ fontSize: "32px" }}>👤</p>
              <p style={{ color: muted, fontSize: "13px", marginTop: "8px" }}>No users yet</p>
            </div>
          ) : (
            allProfiles.slice(0, 8).map((p, i) => (
              <div key={p.id} style={{ padding: "12px 20px", borderBottom: i < Math.min(allProfiles.length, 8) - 1 ? "1px solid #1f2937" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#4338ca", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, color: "#fff", flexShrink: 0 }}>
                    {(p.full_name || p.email || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: white }}>{p.full_name || "—"}</p>
                    <p style={{ fontSize: "11px", color: subtle }}>{p.email} · {companyMap[p.company_id] ?? "Unknown"}</p>
                  </div>
                </div>
                <RoleBadge role={p.role} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* All Calls */}
      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontWeight: 600, color: white, fontSize: "14px" }}>All Calls — Platform-wide</h2>
          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "#312e81", color: "#a5b4fc" }}>{totalCalls} total</span>
        </div>
        {!allCalls || allCalls.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ fontSize: "40px" }}>🎙</p>
            <p style={{ color: muted, fontSize: "14px", marginTop: "12px" }}>No calls uploaded on the platform yet</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1f2937" }}>
                {["Call", "Company", "Date", "Status", "Score", "Outcome"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: muted, fontWeight: 500 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allCalls.slice(0, 20).map((call, i) => (
                <tr key={call.id} style={{ borderBottom: i < Math.min(allCalls.length, 20) - 1 ? "1px solid #1f2937" : "none" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <a href={`/dashboard/calls/${call.id}`} style={{ fontSize: "13px", fontWeight: 500, color: white, textDecoration: "none" }}>
                      {call.title || `Call #${call.id.slice(-6)}`}
                    </a>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", color: muted }}>{companyMap[call.company_id] ?? "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", color: subtle }}>{new Date(call.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 16px" }}><StatusBadge status={call.status} /></td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: cyan }}>{call.coaching_score ? `${call.coaching_score}/100` : "—"}</td>
                  <td style={{ padding: "12px 16px" }}>{call.outcome ? <OutcomeBadge outcome={call.outcome} /> : <span style={{ color: subtle }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    pending:      { bg: "#1f2937", color: "#9ca3af" },
    transcribing: { bg: "#422006", color: "#fcd34d" },
    analyzing:    { bg: "#1e3a5f", color: "#93c5fd" },
    completed:    { bg: "#052e16", color: "#86efac" },
    error:        { bg: "#450a0a", color: "#fca5a5" },
  };
  const s = styles[status] ?? styles.pending;
  return (
    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: s.bg, color: s.color, fontWeight: 500 }}>
      {status}
    </span>
  );
}

function OutcomeBadge({ outcome }: { outcome: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    won:       { bg: "#052e16", color: "#86efac" },
    lost:      { bg: "#450a0a", color: "#fca5a5" },
    follow_up: { bg: "#422006", color: "#fcd34d" },
    unknown:   { bg: "#1f2937", color: "#9ca3af" },
  };
  const s = styles[outcome] ?? styles.unknown;
  return (
    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: s.bg, color: s.color, fontWeight: 500, textTransform: "capitalize" }}>
      {outcome.replace("_", " ")}
    </span>
  );
}
