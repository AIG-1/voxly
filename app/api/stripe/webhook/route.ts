import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase-service";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const service = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const companyId = session.metadata?.company_id;
      if (!companyId) break;

      await service
        .from("companies")
        .update({
          subscription_status: "active",
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        })
        .eq("id", companyId);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await service
        .from("companies")
        .update({ subscription_status: "canceled" })
        .eq("stripe_subscription_id", sub.id);
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      // If reactivated after cancel
      if (sub.status === "active") {
        await service
          .from("companies")
          .update({ subscription_status: "active" })
          .eq("stripe_subscription_id", sub.id);
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        await service
          .from("companies")
          .update({ subscription_status: "past_due" })
          .eq("stripe_subscription_id", invoice.subscription as string);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
