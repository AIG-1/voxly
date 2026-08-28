import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createServiceClient } from "@/lib/supabase-service";
import stripe from "@/lib/stripe";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("user_id", user.id)
    .single();

  if (!profile?.company_id) {
    return NextResponse.json({ error: "No company" }, { status: 400 });
  }

  const service = createServiceClient();
  const { data: company } = await service
    .from("companies")
    .select("id, name, stripe_customer_id, subscription_status")
    .eq("id", profile.company_id)
    .single();

  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  // Already active — send to portal instead
  if (company.subscription_status === "active") {
    return NextResponse.json({ error: "Already subscribed" }, { status: 400 });
  }

  const priceId = process.env.STRIPE_PRICE_ID_MONTHLY;
  if (!priceId) return NextResponse.json({ error: "Price not configured" }, { status: 500 });

  const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://voxly.app";

  // Create or reuse Stripe customer
  let customerId = company.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: company.name,
      metadata: { company_id: company.id },
    });
    customerId = customer.id;

    await service
      .from("companies")
      .update({ stripe_customer_id: customerId })
      .eq("id", company.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard/billing?success=1`,
    cancel_url: `${origin}/dashboard/billing?canceled=1`,
    metadata: { company_id: company.id },
  });

  return NextResponse.json({ url: session.url });
}
