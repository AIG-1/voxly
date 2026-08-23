import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import AnalyzeCallButton from "@/components/AnalyzeCallButton";
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
      <div className="mb-6">
        <a href="/dashboard/calls" className="text-gray-500 hover:text-gray-300 text-sm">
          ← Back to Calls
        </a>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{c.title || `Call ${c.id.slice(-6)}`}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {new Date(c.created_at).toLocaleString()}
            {c.duration_seconds ? ` · ${Math.floor(c.duration_seconds / 60)}m ${c.duration_seconds % 60}s` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={c.status} />
          {(c.status === "pending" || c.status === "error") && (
            <AnalyzeCallButton callId={c.id} audioUrl={c.audio_url} />
          )}
        </div>
      </div>

      {/* Scores row */}
      {c.status === "completed" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Coaching Score" value={c.coaching_score ? `${c.coaching_score}/100` : "—"} highlight />
          <StatCard label="Rep Talk %" value={c.talk_ratio_rep ? `${Math.round(c.talk_ratio_rep)}%` : "—"} />
          <StatCard label="Customer Talk %" value={c.talk_ratio_customer ? `${Math.round(c.talk_ratio_customer)}%` : "—"} />
          <StatCard
            label="Outcome"
            value={c.outcome ? c.outcome.replace("_", " ") : "—"}
            capitalize
          />
        </div>
      )}

      {/* Coaching feedback */}
      {c.coaching_feedback && (
        <Section title="🎯 Coaching Feedback">
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{c.coaching_feedback}</p>
        </Section>
      )}

      {/* Topics */}
      {c.topics && Array.isArray(c.topics) && c.topics.length > 0 && (
        <Section title="💬 Topics Discussed">
          <div className="flex flex-wrap gap-2">
            {c.topics.map((topic: string, i: number) => (
              <span key={i} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">
                {topic}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Objections */}
      {c.objections && Array.isArray(c.objections) && c.objections.length > 0 && (
        <Section title="🛡 Objections">
          <ul className="space-y-2">
            {c.objections.map((obj: string, i: number) => (
              <li key={i} className="text-sm text-gray-300 flex gap-2">
                <span className="text-red-400 mt-0.5">•</span> {obj}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Buying signals */}
      {c.buying_signals && Array.isArray(c.buying_signals) && c.buying_signals.length > 0 && (
        <Section title="📈 Buying Signals">
          <ul className="space-y-2">
            {c.buying_signals.map((sig: string, i: number) => (
              <li key={i} className="text-sm text-gray-300 flex gap-2">
                <span className="text-green-400 mt-0.5">•</span> {sig}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Next steps */}
      {c.next_steps && Array.isArray(c.next_steps) && c.next_steps.length > 0 && (
        <Section title="✅ Next Steps">
          <ul className="space-y-2">
            {c.next_steps.map((step: string, i: number) => (
              <li key={i} className="text-sm text-gray-300 flex gap-2">
                <span className="text-blue-400 mt-0.5">{i + 1}.</span> {step}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Transcript */}
      {c.transcript && (
        <Section title="📝 Transcript">
          <div className="max-h-96 overflow-y-auto">
            <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-wrap font-mono">
              {c.transcript}
            </p>
          </div>
        </Section>
      )}

      {/* Pending state */}
      {c.status === "pending" && !c.transcript && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
          <p className="text-gray-400 mb-4">This call hasn&apos;t been analyzed yet.</p>
          <AnalyzeCallButton callId={c.id} audioUrl={c.audio_url} variant="large" />
        </div>
      )}

      {(c.status === "transcribing" || c.status === "analyzing") && (
        <div className="bg-gray-900 border border-indigo-800 rounded-xl p-10 text-center">
          <div className="animate-pulse text-4xl mb-3">⚡</div>
          <p className="text-indigo-300 font-medium">Processing your call…</p>
          <p className="text-gray-500 text-sm mt-1">Refresh in 60–90 seconds for results.</p>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
      <h2 className="font-semibold text-white mb-3 text-sm">{title}</h2>
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
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? "text-indigo-400" : "text-white"} ${capitalize ? "capitalize" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-gray-700 text-gray-300",
    transcribing: "bg-yellow-900 text-yellow-300",
    analyzing: "bg-blue-900 text-blue-300",
    completed: "bg-green-900 text-green-300",
    error: "bg-red-900 text-red-300",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${map[status] ?? map.pending}`}>
      {status}
    </span>
  );
}
