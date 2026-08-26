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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Calls</h1>
          <p className="text-gray-400 text-sm mt-1">Upload and analyze your sales recordings</p>
        </div>
        <UploadCallButton companyId={profile?.company_id} userId={user!.id} />
      </div>

      {!calls || calls.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center">
          <p className="text-5xl mb-4">🎙</p>
          <h2 className="text-lg font-semibold text-white mb-2">No calls uploaded yet</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            Upload an MP3 or MP4 recording of a sales call. Voxly will transcribe it and deliver
            AI coaching feedback in about 60–90 seconds.
          </p>
          <UploadCallButton companyId={profile?.company_id} userId={user!.id} variant="large" />
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800">
              <tr>
                {["Title", "Date", "Duration", "Status", "Score", "Outcome", "Talk %", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs text-gray-500 uppercase tracking-wide px-4 py-3 font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {calls.map((call) => (
                <tr key={call.id} className="hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <a href={`/dashboard/calls/${call.id}`} className="font-medium text-white hover:text-indigo-400">
                      {call.title || `Call ${call.id.slice(-6)}`}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(call.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {call.duration_seconds
                      ? `${Math.floor(call.duration_seconds / 60)}m ${call.duration_seconds % 60}s`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={call.status} />
                  </td>
                  <td className="px-4 py-3 text-indigo-400 font-semibold">
                    {call.coaching_score ? `${call.coaching_score}/100` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {call.outcome ? <OutcomeBadge outcome={call.outcome} /> : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {call.talk_ratio_rep ? `${Math.round(call.talk_ratio_rep)}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteCallButton callId={call.id} variant="icon" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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

function OutcomeBadge({ outcome }: { outcome: string }) {
  const map: Record<string, string> = {
    won: "bg-green-900 text-green-300",
    lost: "bg-red-900 text-red-300",
    follow_up: "bg-yellow-900 text-yellow-300",
    unknown: "bg-gray-700 text-gray-300",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${map[outcome] ?? map.unknown}`}>
      {outcome.replace("_", " ")}
    </span>
  );
}
