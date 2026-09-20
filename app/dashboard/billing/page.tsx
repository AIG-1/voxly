import { createClient } from "@/lib/supabase-server";
import BillingActions from "@/components/BillingActions";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id, role")
    .eq("user_id", user!.id)
    .single();

  const { data: company } = await supabase
    .from("companies")
    .select("name, subscription_status, stripe_customer_id, stripe_subscription_id")
    .eq("id", profile!.company_id)
    .single();

  const status = company?.subscription_status ?? "free";
  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--ink)" }}>
          Billing
        </h1>
        <p style={{ fontSize: "13px", marginTop: "4px", color: "var(--muted)" }}>
          Manage your subscription
        </p>
      </div>

      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "28px",
        maxWidth: "560px",
      }}>
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "6px" }}>
            Current Plan
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <p style={{ fontSize: "20px", fontWeight: 700, color: "var(--ink)" }}>
              {status === "active" ? "Pro" : "Free Trial"}
            </p>
            <span style={{
              fontSize: "11px",
              padding: "2px 10px",
              borderRadius: "99px",
              fontWeight: 600,
              background: status === "active" ? "rgba(52,211,153,.15)" : "var(--adim)",
              color: status === "active" ? "#34d399" : "var(--accent)",
              border: `1px solid ${status === "active" ? "rgba(52,211,153,.3)" : "var(--border)"}`,
            }}>
              {status === "active" ? "Active" : status === "past_due" ? "Past due" : status === "canceled" ? "Canceled" : "Free"}
            </span>
          </div>
          {status === "active" && (
            <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "6px" }}>
              $49/user/month · renews monthly
            </p>
          )}
          {status !== "active" && (
            <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "6px" }}>
              3 free call analyses included. Upgrade to get unlimited.
            </p>
          )}
        </div>

        {isAdmin ? (
          <BillingActions status={status} />
        ) : (
          <p style={{ fontSize: "13px", color: "var(--muted)" }}>
            Contact your workspace admin to manage billing.
          </p>
        )}
      </div>
    </div>
  );
}
