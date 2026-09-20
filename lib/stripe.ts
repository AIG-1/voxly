import Stripe from "stripe";

const stripe = new Stripe(process.env.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!, {
  apiVersion: "2025-02-24.acacia",
});

export default stripe;
