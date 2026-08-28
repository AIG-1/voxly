"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

interface DashboardNavProps {
  role: string;
}

export default function DashboardNav({ role }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isSuperAdmin = role === "super_admin";

  const navItems = [
    { href: "/dashboard",           label: "Overview", icon: "◈" },
    { href: "/dashboard/calls",     label: "Calls",    icon: "🎙" },
    { href: "/dashboard/team",      label: "Team",     icon: "👥" },
    { href: "/dashboard/billing",   label: "Billing",  icon: "💳" },
    { href: "/dashboard/settings",  label: "Settings", icon: "⚙" },
    ...(isSuperAdmin
      ? [{ href: "/dashboard/admin", label: "Admin", icon: "🛡" }]
      : []),
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "13.5px",
                fontWeight: isActive ? 600 : 400,
                textDecoration: "none",
                transition: "background .15s, color .15s",
                background: isActive ? "var(--adim)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--muted)",
                border: isActive ? "1px solid var(--border)" : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--bg-alt)";
                  e.currentTarget.style.color = "var(--ink)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--muted)";
                }
              }}
            >
              <span style={{ fontSize: "15px" }}>{item.icon}</span>
              {item.label}
              {item.href === "/dashboard/admin" && (
                <span style={{
                  marginLeft: "auto", fontSize: "10px", padding: "2px 6px",
                  borderRadius: "99px", background: "var(--adim)",
                  color: "var(--accent)", fontWeight: 600,
                  border: "1px solid var(--border)",
                }}>
                  SA
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Sign out */}
      <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
        <button
          onClick={handleSignOut}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "8px 12px", borderRadius: "8px",
            fontSize: "13.5px", color: "var(--muted)",
            background: "none", border: "none", cursor: "pointer",
            width: "100%", textAlign: "left", transition: "background .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-alt)";
            e.currentTarget.style.color = "var(--ink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "var(--muted)";
          }}
        >
          <span>→</span> Sign out
        </button>
      </div>
    </nav>
  );
}
