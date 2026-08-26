import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import AnalyzeCallButton from "@/components/AnalyzeCallButton";
import CollapsibleSection from "@/components/CollapsibleSection";
import DeleteCallButton from "@/components/DeleteCallButton";
import type { Call } from "@/lib/supabase";

export default async function CallDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: call, error } = await supabase
    .from("calls")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !call) notFound();

  const c = call as Call;

  return (
    <div>
      {/* Back link */}
      <div style={{ marginBottom: "20px" }}>
        <a href="/dashboard/calls" style={{ fontSize: "13px", color: "var(--muted)", textDecoration: "none" }}>
          ← Back to Calls
        </a>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--ink)" }}>
            {c.title || `Call ${c.id.slice(-6)}`}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
            {new Date(c.created_at).toLocaleString()}
            {c.duration_seconds ? ` · ${Math.floor(c.duration_seconds / 60)}m ${c.duration_seconds % 60}s` : ""}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <StatusBadge status={c.status} />
          {(c.status === "pending" || c.status === "error") && (
            <AnalyzeCallButton callId={c.id} audioUrl={c.audio_url} />
          )}
          <DeleteCallButton callId={c.id} variant="full" />
        </div>
      </div>

      {/* Score cards */}
      {c.status === "completed" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          <StatCard label="Coaching Score" value={c.coaching_score ? `${c.coaching_score}/100` : "—"} highlight />
          <StatCard label="Rep Talk %" value={c.talk_ratio_rep ? `${Math.round(c.talk_ratio_rep)}%` : "—"} />
          <StatCard label="Customer Talk %" value={c.talk_ratio_customer ? `${Math.round(c.talk_ratio_customer)}%` : "—"} />
          <StatCard label="Outcome" value={c.outcome ? c.outcome.replace("_", " ") : "—"} capitalize />
        </div>
      )}

      {/* Coaching feedback */}
      {c.coaching_feedback && (
        <Section title="🎯 Coaching Feedback">
          <p style={{ fontSize: "13px", color: "var(--ink-2)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{c.coaching_feedback}</p>
        </Section>
      )}

      {/* Call Summary + Topics */}
      {((c.topics && Array.isArray(c.topics) && c.topics.length > 0) || (c as any).call_summary) ? (
        <CollapsibleSection
          title="💬 Call Summary"
          preview={(c.topics as string[] | null)?.[0] ?? "click to expand"}
        >
          {(c as any).call_summary && (
            <p style={{ fontSize: "13px", color: "var(--ink-2)", lineHeight: 1.7, marginBottom: "14px" }}>
              {(c as any).call_summary}
            </p>
          )}
          {c.topics && Array.isArray(c.topics) && c.topics.length > 0 && (
            <>
              <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "8px", fontWeight: 500 }}>
                Topics covered
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(c.topics as string[]).map((topic: string, i: number) => (
                  <span
                    key={i}
                    style={{
                      background: "var(--adim)",
                      color: "var(--accent)",
                      fontSize: "12px",
                      padding: "3px 10px",
                      borderRadius: "99px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </>
          )}
        </CollapsibleSection>
      ) : null}

      {/* Objections */}
      {c.objections && Array.isArray(c.objections) && c.objections.length > 0 && (
        <Section title="🛡 Objections">
          <ul style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none" }}>
            {c.objections.map((obj: string, i: number) => (
              <li key={i} style={{ fontSize: "13px", color: "var(--ink-2)", display: "flex", gap: "8px" }}>
                <span style={{ color: "#ef4444", marginTop: "2px", flexShrink: 0 }}>•</span> {obj}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Buying signals */}
      {c.buying_signals && Array.isArray(c.buying_signals) && c.buying_signals.length > 0 && (
        <Section title="📈 Buying Signals">
          <ul style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none" }}>
            {c.buying_signals.map((sig: string, i: number) => (
              <li key={i} style={{ fontSize: "13px", color: "var(--ink-2)", display: "flex", gap: "8px" }}>
                <span style={{ color: "#22c55e", marginTop: "2px", flexShrink: 0 }}>•</span> {sig}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Next steps */}
      {c.next_steps && Array.isArray(c.next_steps) && c.next_steps.length > 0 && (
        <Section title="✅ Next Steps">
          <ul style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none" }}>
            {c.next_steps.map((step: string, i: number) => (
              <li key={i} style={{ fontSize: "13px", color: "var(--ink-2)", display: "flex", gap: "8px" }}>
                <span style={{ color: "var(--accent)", marginTop: "2px", flexShrink: 0, fontWeight: 700 }}>{i + 1}.</span> {step}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Transcript */}
      {c.transcript && (
        <Section title="📝 Transcript">
          <div style={{ maxHeight: "384px", overflowY: "auto" }}>
            <p style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
              {c.transcript}
            </p>
          </div>
        </Section>
      )}

      {/* Pending state */}
      {c.status === "pending" && !c.transcript && (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "48px", textAlign: "center",
        }}>
          <p style={{ color: "var(--muted)", marginBottom: "16px" }}>This call hasn&apos;t been analyzed yet.</p>
          <AnalyzeCallButton callId={c.id} audioUrl={c.audio_url} variant="large" />
        </div>
      )}

      {(c.status === "transcribing" || c.status === "analyzing") && (
        <div style={{
          background: "var(--adim)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "48px", textAlign: "center",
        }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚡</div>
          <p style={{ color: "var(--accent)", fontWeight: 600 }}>Processing your call…</p>
          <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "4px" }}>Refresh in 60–90 seconds for results.</p>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", padding: "20px", marginBottom: "16px",
    }}>
      <h2 style={{ fontWeight: 600, color: "var(--ink)", marginBottom: "12px", fontSize: "13px" }}>{title}</h2>
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
  capitalize = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", padding: "18px",
    }}>
      <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "6px" }}>
        {label}
      </p>
      <p style={{
        fontSize: "24px", fontWeight: 700, lineHeight: 1,
        color: highlight ? "var(--accent)" : "var(--ink)",
        textTransform: capitalize ? "capitalize" : "none",
      }}>
        {value}
      </p>
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
      fontSize: "11px", padding: "3px 10px", borderRadius: "99px",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontWeight: 600,
    }}>
      {status}
    </span>
  );
}
