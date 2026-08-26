import { createClient } from "@/lib/supabase-server";
import UploadCallButton from "@/components/UploadCallButton";
import DeleteCallButton from "@/components/DeleteCallButton";

export default async function CallsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id, role")
    .eq("user_id", user!.id)
    .single();

  const { data: calls } = await supabase
    .from("calls")
    .select("*")
    .eq("company_id", profile?.company_id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--ink)" }}>Calls</h1>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>Upload and analyze your sales recordings</p>
        </div>
        <UploadCallButton companyId={profile?.company_id} userId={user!.id} />
      </div>

      {!calls || calls.length === 0 ? (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "64px", textAlign: "center",
        }}>
          <p style={{ fontSize: "48px", marginBottom: "16px" }}>🎙</p>
          <h2 style={{ fontSize: "17px", fontWeight: 600, color: "var(--ink)", marginBottom: "8px" }}>No calls uploaded yet</h2>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "24px", maxWidth: "360px", margin: "0 auto 24px" }}>
            Upload an MP3 or MP4 recording of a sales call. Voxly will transcribe it and deliver
            AI coaching feedback in about 60–90 seconds.
          </p>
          <UploadCallButton companyId={profile?.company_id} userId={user!.id} variant="large" />
        </div>
      ) : (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", overflow: "hidden",
        }}>
          <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "720px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-alt)" }}>
                {["Title", "Date", "Duration", "Status", "Score", "Outcome", "Talk %", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left", fontSize: "11px", color: "var(--muted)",
                      textTransform: "uppercase", letterSpacing: "0.06em",
                      padding: "10px 16px", fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calls.map((call, i) => (
                <tr
                  key={call.id}
                  className="vx-tr-hover"
                  style={{ borderBottom: i < calls.length - 1 ? "1px solid var(--border)" : "none" }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <a
                      href={`/dashboard/calls/${call.id}`}
                      style={{ fontWeight: 500, color: "var(--ink)", textDecoration: "none" }}
                    >
                      {call.title || `Call ${call.id.slice(-6)}`}
                    </a>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--muted)" }}>
                    {new Date(call.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--muted)" }}>
                    {call.duration_seconds
                      ? `${Math.floor(call.duration_seconds / 60)}m ${call.duration_seconds % 60}s`
                      : "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <StatusBadge status={call.status} />
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--accent)", fontWeight: 700 }}>
                    {call.coaching_score ? `${call.coaching_score}/100` : "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {call.outcome ? <OutcomeBadge outcome={call.outcome} /> : <span style={{ color: "var(--muted)" }}>—</span>}
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--muted)" }}>
                    {call.talk_ratio_rep ? `${Math.round(call.talk_ratio_rep)}%` : "—"}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <DeleteCallButton callId={call.id} variant="icon" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
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
