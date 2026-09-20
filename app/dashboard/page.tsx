import { createClient } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, companies(*)")
    .eq("user_id", user!.id)
    .single();

  const companyId = profile?.company_id;

  const { data: calls } = await supabase
    .from("calls")
    .select("id, status, outcome, coaching_score, talk_ratio_rep, created_at")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  const totalCalls     = calls?.length ?? 0;
  const completedCalls = calls?.filter((c) => c.status === "completed") ?? [];
  const avgScore       = completedCalls.length > 0
    ? Math.round(completedCalls.reduce((s, c) => s + (c.coaching_score ?? 0), 0) / completedCalls.length)
    : null;
  const wonCalls       = completedCalls.filter((c) => c.outcome === "won").length;
  const avgTalkRatio   = completedCalls.length > 0
    ? Math.round(completedCalls.reduce((s, c) => s + (c.talk_ratio_rep ?? 0), 0) / completedCalls.length)
    : null;

  const companyName = (profile?.companies as { name?: string } | null)?.name ?? "Your Workspace";

  return (
    <div>
            <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--ink)" }}>
          {companyName} Overview
        </h1>
        <p style={{ fontSize: "13px", marginTop: "4px", color: "var(--muted)" }}>
          Your AI call intelligence dashboard
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Calls",        value: totalCalls.toString(),                             sub: "uploaded" },
          { label: "Avg Coaching Score", value: avgScore !== null ? `${avgScore}/100` : "—",       sub: completedCalls.length > 0 ? `from ${completedCalls.length} analyzed` : "No calls yet" },
          { label: "Deals Won",          value: wonCalls.toString(),                               sub: completedCalls.length > 0 ? `${Math.round((wonCalls / completedCalls.length) * 100)}% win rate` : "—" },
          { label: "Avg Rep Talk %",     value: avgTalkRatio !== null ? `${avgTalkRatio}%` : "—", sub: "target: 43%" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "20px",
            }}
          >
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "6px" }}>
              {stat.label}
            </p>
            <p style={{ fontSize: "28px", fontWeight: 700, color: "var(--ink)", lineHeight: 1, marginBottom: "4px" }}>
              {stat.value}
            </p>
            <p style={{ fontSize: "12px", color: "var(--muted)" }}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Recent calls */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontWeight: 600, color: "var(--ink)", fontSize: "14px" }}>Recent Calls</h2>
          <a href="/dashboard/calls" style={{ fontSize: "13px", color: "var(--accent-2)", opacity: 0.9 }}>
            View all →
          </a>
        </div>

        {!calls || calls.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ fontSize: "40px", marginBottom: "12px" }}>🎙</p>
            <p style={{ fontWeight: 600, marginBottom: "4px", color: "var(--ink)" }}>No calls yet</p>
            <p style={{ fontSize: "13px", marginBottom: "16px", color: "var(--muted)" }}>
              Upload your first sales call recording to get started.
            </p>
            
              href="/dashboard/calls"
              style={{
                display: "inline-block", background: "var(--accent)", color: "#fff",
                fontSize: "13px", fontWeight: 600, padding: "8px 20px",
                borderRadius: "8px", textDecoration: "none",
              }}
            >
              Upload a call
            </a>
          </div>
        ) : (
          <div>
            {calls.slice(0, 5).map((call, i) => (
              
                key={call.id}
                href={`/dashboard/calls/${call.id}`}
                className="call-row"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 20px",
                  borderBottom: i < Math.min(calls.length, 5) - 1 ? "1px solid var(--border)" : "none",
                  textDecoration: "none",
                  background: "transparent",
                }}
              >
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--ink)" }}>
                    Call #{call.id.slice(-6)}
                  </p>
                  <p style={{ fontSize: "11px", marginTop: "2px", color: "var(--muted)" }}>
                    {new Date(call.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <StatusBadge status={call.status} />
                  {call.coaching_score && (
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)" }}>
                      {call.coaching_score}/100
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
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
