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
    <div style={{ display: "flex", minHeight: "100vh", background: "#030712" }}>
      {/* Sidebar */}
      <aside style={{
        width: "224px",
        minWidth: "224px",
        background: "#111827",
        borderRight: "1px solid #1f2937",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        flexShrink: 0,
      }}>
        {/* Logo + company */}
        <div style={{ padding: "20px", borderBottom: "1px solid #1f2937" }}>
          <VoxlyLogo size={28} />
          <p style={{ fontSize: "11px", color: "#a78bfa", marginTop: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {companyName}
          </p>
          {profile.role === "super_admin" && (
            <span style={{ display: "inline-block", marginTop: "6px", fontSize: "10px", padding: "2px 8px", borderRadius: "99px", background: "#581c87", color: "#d8b4fe", fontWeight: 600 }}>
              Super Admin
            </span>
          )}
        </div>

        {/* Nav */}
        <DashboardNav role={profile.role} />

        {/* Avatar */}
        <div style={{ padding: "16px", borderTop: "1px solid #1f2937" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, color: "#fff", flexShrink: 0 }}>
              {(profile.full_name || user.email || "?")[0].toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "12px", fontWeight: 500, color: "#f9fafb", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {profile.full_name || "User"}
              </p>
              <p style={{ fontSize: "11px", color: "#7c85f5", textTransform: "capitalize" }}>
                {profile.role.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
