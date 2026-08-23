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

  // Fetch call stats
  const { data: calls } = await supabase
    .from("calls")
    .select("id, status, outcome, coaching_score, talk_ratio_rep, created_at")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  const totalCalls = calls?.length ?? 0;
  const completedCalls = calls?.filter((c) => c.status === "completed") ?? [];
  const avgScore =
    completedCalls.length > 0
      ? Math.round(
          completedCalls.reduce((s, c) => s + (c.coaching_score ?? 0), 0) /
            completedCalls.length
        )
      : null;
  const wonCalls = completedCalls.filter((c) => c.outcome === "won").length;
  const avgTalkRatio =
    completedCalls.length > 0
      ? Math.round(
          completedCalls.reduce((s, c) => s + (c.talk_ratio_rep ?? 0), 0) /
            completedCalls.length
        )
      : null;

  const companyName = (profile?.companies as { name?: string } | null)?.name ?? "Your Workspace";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          {companyName} Overview
        </h1>
        <p className="text-gray-400 text-sm mt-1">Your AI call intelligence dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Calls", value: totalCalls.toString(), sub: "uploaded" },
          {
            label: "Avg Coaching Score",
            value: avgScore !== null ? `${avgScore}/100` : "—",
            sub: completedCalls.length > 0 ? `from ${completedCalls.length} analyzed` : "No calls analyzed yet",
          },
          {
            label: "Deals Won",
            value: wonCalls.toString(),
            sub: completedCalls.length > 0 ? `${Math.round((wonCalls / completedCalls.length) * 100)}% win rate` : "—",
          },
          {
            label: "Avg Rep Talk %",
            value: avgTalkRatio !== null ? `${avgTalkRatio}%` : "—",
            sub: "target: 43%",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
          >
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{stat.label}</p>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent calls */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="font-semibold text-white">Recent Calls</h2>
          <a href="/dashboard/calls" className="text-indigo-400 text-sm hover:text-indigo-300">
            View all →
          </a>
        </div>

        {!calls || calls.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">🎙</p>
            <p className="text-gray-400 font-medium mb-1">No calls yet</p>
            <p className="text-gray-600 text-sm mb-4">
              Upload your first sales call recording to get started.
            </p>
            <a
              href="/dashboard/calls"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              Upload a call
            </a>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {calls.slice(0, 5).map((call) => (
              <a
                key={call.id}
                href={`/dashboard/calls/${call.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-white">Call #{call.id.slice(-6)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(call.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={call.status} />
                  {call.coaching_score && (
                    <span className="text-xs font-semibold text-indigo-400">
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
  const map: Record<string, string> = {
    pending: "bg-gray-700 text-gray-300",
    transcribing: "bg-yellow-900 text-yellow-300",
    analyzing: "bg-blue-900 text-blue-300",
    completed: "bg-green-900 text-green-300",
    error: "bg-red-900 text-red-300",
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? map.pending}`}>
      {status}
    </span>
  );
}
