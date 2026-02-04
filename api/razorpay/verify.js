import crypto from "crypto";

const keySecret = process.env.RAZORPAY_KEY_SECRET;

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({ valid: false, error: "Missing payment details." });
    return;
  }
  if (!keySecret) {
    res.status(500).json({ valid: false, error: "Missing Razorpay secret." });
    return;
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  if (expected !== razorpay_signature) {
    res.status(400).json({ valid: false, error: "Invalid signature." });
    return;
  }

  res.status(200).json({ valid: true });
}
