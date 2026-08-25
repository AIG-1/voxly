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

  // Fetch all data across every company
  const [
    { data: companies },
    { data: allProfiles },
    { data: allCalls },
  ] = await Promise.all([
    supabase.from("companies").select("id, name, industry, team_size, created_at").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, email, role, company_id, created_at").order("created_at", { ascending: false }),
    supabase.from("calls").select("id, title, status, coaching_score, outcome, company_id, created_at").order("created_at", { ascending: false }),
  ]);

  const totalCompanies = companies?.length ?? 0;
  const totalUsers = allProfiles?.length ?? 0;
  const totalCalls = allCalls?.length ?? 0;
  const completedCalls = allCalls?.filter((c) => c.status === "completed") ?? [];
  const avgScore = completedCalls.length > 0
    ? Math.round(completedCalls.reduce((s, c) => s + (c.coaching_score ?? 0), 0) / completedCalls.length)
    : null;

  // Map company id → name for lookups
  const companyMap: Record<string, string> = {};
  companies?.forEach((c) => { companyMap[c.id] = c.name; });

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <span className="text-2xl">🛡</span>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--vx-text)" }}>
            Super Admin
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--vx-muted)" }}>
            Platform-wide view — all companies, users, and calls
          </p>
        </div>
      </div>

      {/* Platform stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Companies",       value: totalCompanies.toString(),                               icon: "🏢" },
          { label: "Total Users",     value: totalUsers.toString(),                                   icon: "👤" },
          { label: "Total Calls",     value: totalCalls.toString(),                                   icon: "🎙" },
          { label: "Avg Coach Score", value: avgScore !== null ? `${avgScore}/100` : "—",             icon: "📊" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-5 border"
            style={{ background: "var(--vx-surface)", borderColor: "var(--vx-border)" }}
          >
            <p className="text-xs uppercase tracking-wide mb-1 flex items-center gap-1.5" style={{ color: "var(--vx-muted)" }}>
              <span>{s.icon}</span> {s.label}
            </p>
            <p className="text-3xl font-bold" style={{ color: "var(--vx-text)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* All Companies */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: "var(--vx-surface)", borderColor: "var(--vx-border)" }}
        >
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "var(--vx-border)" }}>
            <h2 className="font-semibold" style={{ color: "var(--vx-text)" }}>All Companies</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-900 text-indigo-300">{totalCompanies}</span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--vx-border)" }}>
            {!companies || companies.length === 0 ? (
              <p className="p-6 text-sm text-center" style={{ color: "var(--vx-muted)" }}>No companies yet</p>
            ) : (
              companies.map((c) => {
                const memberCount = allProfiles?.filter((p) => p.company_id === c.id).length ?? 0;
                const callCount   = allCalls?.filter((call) => call.company_id === c.id).length ?? 0;
                return (
                  <div key={c.id} className="px-5 py-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--vx-text)" }}>{c.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--vx-subtle)" }}>
                        {c.industry ?? "—"} · {memberCount} member{memberCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold" style={{ color: "var(--vx-cyan)" }}>{callCount}</p>
                      <p className="text-xs" style={{ color: "var(--vx-subtle)" }}>calls</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* All Users */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: "var(--vx-surface)", borderColor: "var(--vx-border)" }}
        >
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "var(--vx-border)" }}>
            <h2 className="font-semibold" style={{ color: "var(--vx-text)" }}>All Users</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-900 text-indigo-300">{totalUsers}</span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--vx-border)" }}>
            {!allProfiles || allProfiles.length === 0 ? (
              <p className="p-6 text-sm text-center" style={{ color: "var(--vx-muted)" }}>No users yet</p>
            ) : (
              allProfiles.slice(0, 10).map((p) => (
                <div key={p.id} className="px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                      {(p.full_name || p.email || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--vx-text)" }}>{p.full_name || "—"}</p>
                      <p className="text-xs" style={{ color: "var(--vx-subtle)" }}>
                        {p.email} · {companyMap[p.company_id] ?? "Unknown"}
                      </p>
                    </div>
                  </div>
                  <RoleBadge role={p.role} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* All Recent Calls */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "var(--vx-surface)", borderColor: "var(--vx-border)" }}
      >
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "var(--vx-border)" }}>
          <h2 className="font-semibold" style={{ color: "var(--vx-text)" }}>All Calls — Platform-wide</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-900 text-indigo-300">{totalCalls} total</span>
        </div>
        {!allCalls || allCalls.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">🎙</p>
            <p className="text-sm" style={{ color: "var(--vx-muted)" }}>No calls uploaded across any company yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b" style={{ borderColor: "var(--vx-border)" }}>
                <tr>
                  {["Call", "Company", "Date", "Status", "Score", "Outcome"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs uppercase tracking-wide px-4 py-3 font-medium"
                      style={{ color: "var(--vx-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allCalls.slice(0, 20).map((call) => (
                  <tr
                    key={call.id}
                    className="border-b transition-colors"
                    style={{ borderColor: "var(--vx-border)" }}
                  >
                    <td className="px-4 py-3">
                      <a
                        href={`/dashboard/calls/${call.id}`}
                        className="font-medium hover:underline"
                        style={{ color: "var(--vx-text)" }}
                      >
                        {call.title || `Call #${call.id.slice(-6)}`}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--vx-muted)" }}>
                      {companyMap[call.company_id] ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--vx-subtle)" }}>
                      {new Date(call.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={call.status} />
                    </td>
                    <td className="px-4 py-3 font-semibold text-xs" style={{ color: "var(--vx-cyan)" }}>
                      {call.coaching_score ? `${call.coaching_score}/100` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {call.outcome ? <OutcomeBadge outcome={call.outcome} /> : <span style={{ color: "var(--vx-subtle)" }}>—</span>}
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

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    super_admin: "bg-purple-900 text-purple-300",
    admin:       "bg-indigo-900 text-indigo-300",
    member:      "bg-gray-700 text-gray-300",
  };
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${map[role] ?? map.member}`}>
      {role.replace("_", " ")}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:      "bg-gray-700 text-gray-300",
    transcribing: "bg-yellow-900 text-yellow-300",
    analyzing:    "bg-blue-900 text-blue-300",
    completed:    "bg-green-900 text-green-300",
    error:        "bg-red-900 text-red-300",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? map.pending}`}>
      {status}
    </span>
  );
}

function OutcomeBadge({ outcome }: { outcome: string }) {
  const map: Record<string, string> = {
    won:       "bg-green-900 text-green-300",
    lost:      "bg-red-900 text-red-300",
    follow_up: "bg-yellow-900 text-yellow-300",
    unknown:   "bg-gray-700 text-gray-300",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${map[outcome] ?? map.unknown}`}>
      {outcome.replace("_", " ")}
    </span>
  );
}
