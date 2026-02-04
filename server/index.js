import "dotenv/config";
import crypto from "crypto";
import express from "express";
import Razorpay from "razorpay";

const app = express();
const port = process.env.PORT || 5174;
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  console.warn(
    "Missing Razorpay keys. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
  );
}

const razorpay = new Razorpay({
  key_id: keyId || "",
  key_secret: keySecret || "",
});

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/razorpay/order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, notes } = req.body || {};
    const amountValue = Number(amount);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      res.status(400).json({ error: "Amount must be a positive number." });
      return;
    }
    if (!keyId || !keySecret) {
      res.status(500).json({ error: "Razorpay keys are not configured." });
      return;
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amountValue),
      currency,
      receipt: receipt || `tfhd_${Date.now()}`,
      notes,
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ error: "Failed to create Razorpay order." });
  }
});

app.post("/api/razorpay/verify", (req, res) => {
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

  res.json({ valid: true });
});

app.listen(port, () => {
  console.log(`Razorpay server listening on http://localhost:${port}`);
});
