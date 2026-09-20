import Stripe from "stripe";

let _instance: Stripe | null = null;

function getInstance(): Stripe {
  if (!_instance) {
    const key = process.env.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;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _instance = new Stripe(key, { apiVersion: "2025-02-24.acacia" });
  }
  return _instance;
}

const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const instance = getInstance();
    const value = (instance as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export default stripe;
