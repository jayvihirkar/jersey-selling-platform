import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: keyId || "",
  key_secret: keySecret || "",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

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

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amountValue),
      currency,
      receipt: receipt || `tfhd_${Date.now()}`,
      notes,
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ error: "Failed to create Razorpay order." });
  }
}
