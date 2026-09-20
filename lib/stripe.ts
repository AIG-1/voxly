import Stripe from "stripe";

const stripe = new Stripe(process.env.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!, {
  apiVersion: "2025-02-24.acacia",
});

export default stripe;
