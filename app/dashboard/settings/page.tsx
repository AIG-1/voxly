import { createClient } from "@/lib/supabase-server";
import PlatformConfigForm from "@/components/PlatformConfigForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id, role, full_name, email")
    .eq("user_id", user!.id)
    .single();

  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";

  // Fetch current AssemblyAI key status
  const { data: config } = await supabase
    .from("platform_config")
    .select("id, assemblyai_api_key")
    .limit(1)
    .single();

  const hasKey = !!config?.assemblyai_api_key;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account and workspace</p>
      </div>

      {/* Profile */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-white mb-4">Profile</h2>
        <div className="space-y-3 text-sm">
          <div className="flex gap-4">
            <span className="text-gray-500 w-24">Name</span>
            <span className="text-white">{profile?.full_name || "—"}</span>
          </div>
          <div className="flex gap-4">
            <span className="text-gray-500 w-24">Email</span>
            <span className="text-white">{profile?.email || user?.email}</span>
          </div>
          <div className="flex gap-4">
            <span className="text-gray-500 w-24">Role</span>
            <span className="text-white capitalize">{profile?.role?.replace("_", " ")}</span>
          </div>
        </div>
      </div>

      {/* AssemblyAI config — admin only */}
      {isAdmin && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-white mb-1">AssemblyAI API Key</h2>
          <p className="text-gray-500 text-xs mb-4">
            Required for call transcription. Get a free key at{" "}
            <a href="https://www.assemblyai.com" target="_blank" rel="noreferrer" className="text-indigo-400">
              assemblyai.com
            </a>{" "}
            (5hrs/month free).
          </p>

          {hasKey && (
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-green-400 text-sm">API key configured</span>
            </div>
          )}

          <PlatformConfigForm hasKey={hasKey} configId={config?.id} />
        </div>
      )}

      {/* Danger zone */}
      <div className="bg-gray-900 border border-red-900/40 rounded-xl p-6">
        <h2 className="font-semibold text-white mb-1">Account</h2>
        <p className="text-gray-500 text-sm mb-4">
          To delete your account or workspace, contact support@voxly.ai
        </p>
      </div>
    </div>
  );
}
