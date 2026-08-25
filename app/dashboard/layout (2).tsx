import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import VoxlyLogo from "@/components/VoxlyLogo";
import DashboardNav from "@/components/DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, companies(*)")
    .eq("user_id", user.id)
    .single();

  if (!profile?.company_id) redirect("/onboarding");

  const companyName = (profile.companies as { name?: string } | null)?.name ?? "My Workspace";

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar — fixed, always visible */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full z-10">
        <div className="p-5 border-b border-gray-800">
          <VoxlyLogo size={28} />
          <p className="text-xs mt-2 truncate font-medium" style={{ color: "var(--vx-muted, #a78bfa)" }}>
            {companyName}
          </p>
          {profile.role === "super_admin" && (
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-purple-900 text-purple-300 font-medium">
              Super Admin
            </span>
          )}
        </div>

        <DashboardNav role={profile.role} />

        {/* Avatar */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
              {(profile.full_name || user.email || "?")[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{profile.full_name || "User"}</p>
              <p className="text-xs truncate" style={{ color: "var(--vx-subtle, #7c85f5)" }}>
                {profile.role.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content — offset by sidebar width */}
      <main className="ml-56 flex-1 p-8 min-h-screen bg-gray-950">
        {children}
      </main>
    </div>
  );
}
