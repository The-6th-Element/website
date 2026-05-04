// api/payment.js — Vercel Serverless Function
// Handles Stripe payments for reservation deposits and direct ordering.
//
// Required environment variables:
//   STRIPE_SECRET_KEY     — from https://dashboard.stripe.com/apikeys
//   STRIPE_WEBHOOK_SECRET — from Stripe webhook endpoint config
//   SITE_URL              — e.g. https://thesixthelement.co.uk
//   OWNER_EMAIL           — for payment notifications
//   RESEND_API_KEY        — for email notifications (reuse from booking)
//
// Install: npm install stripe

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, stripe-signature");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
  const SITE_URL = process.env.SITE_URL || "https://thesixthelement.co.uk";

  if (!STRIPE_KEY) {
    return res.status(500).json({ error: "Stripe not configured" });
  }

  // Dynamic import for Stripe
  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(STRIPE_KEY);

  const { action } = req.query;

  // ── Create Checkout Session for Reservation Deposit ──
  if (action === "reservation-deposit") {
    try {
      const { bookingRef, name, email, date, time, guests, seating, depositAmount } = req.body;

      const seatingLabel = seating === "brunch" ? "Brunch" : "Evening";
      const amount = depositAmount || (seating === "brunch" ? 500 : 1000); // £5 or £10 in pence

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "apple_pay", "google_pay"],
        mode: "payment",
        customer_email: email,
        line_items: [{
          price_data: {
            currency: "gbp",
            product_data: {
              name: `Table Deposit — ${seatingLabel}`,
              description: `${seatingLabel} for ${guests} on ${date} at ${time}. Ref: ${bookingRef}`,
              images: [], // Add restaurant image URL here
            },
            unit_amount: amount,
          },
          quantity: 1,
        }],
        metadata: {
          type: "reservation_deposit",
          bookingRef,
          name,
          date,
          time,
          guests,
          seating,
        },
        success_url: `${SITE_URL}?booking=confirmed&ref=${bookingRef}`,
        cancel_url: `${SITE_URL}?booking=cancelled&ref=${bookingRef}`,
        expires_after: 1800, // 30 minutes
      });

      return res.json({ sessionId: session.id, url: session.url });
    } catch (err) {
      console.error("Stripe session error:", err);
      return res.status(500).json({ error: "Failed to create payment session" });
    }
  }

  // ── Create Checkout Session for Direct Order (Collection) ──
  if (action === "direct-order") {
    try {
      const { items, customerName, customerEmail, customerPhone, collectionTime } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ error: "No items in order" });
      }

      const lineItems = items.map(item => ({
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.name,
            description: item.description || undefined,
          },
          unit_amount: Math.round(parseFloat(item.price) * 100), // Convert £ to pence
        },
        quantity: item.quantity || 1,
      }));

      const orderRef = `TSE-ORD-${Date.now().toString(36).toUpperCase()}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "apple_pay", "google_pay"],
        mode: "payment",
        customer_email: customerEmail,
        line_items: lineItems,
        metadata: {
          type: "direct_order",
          orderRef,
          customerName,
          customerPhone: customerPhone || "",
          collectionTime: collectionTime || "",
        },
        success_url: `${SITE_URL}?order=confirmed&ref=${orderRef}`,
        cancel_url: `${SITE_URL}?order=cancelled`,
      });

      return res.json({ sessionId: session.id, url: session.url, orderRef });
    } catch (err) {
      console.error("Stripe order error:", err);
      return res.status(500).json({ error: "Failed to create order session" });
    }
  }

  // ── Stripe Webhook Handler ──
  if (action === "webhook") {
    const sig = req.headers["stripe-signature"];
    const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      return res.status(500).json({ error: "Webhook secret not configured" });
    }

    let event;
    try {
      // For Vercel, we need the raw body
      const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      event = stripe.webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Handle completed payments
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const meta = session.metadata;

      if (meta.type === "reservation_deposit") {
        await notifyOwner({
          subject: `💳 Deposit Paid — ${meta.name} (${meta.bookingRef})`,
          body: `
            <h2>Reservation Deposit Received</h2>
            <p><strong>Ref:</strong> ${meta.bookingRef}</p>
            <p><strong>Guest:</strong> ${meta.name}</p>
            <p><strong>Date:</strong> ${meta.date} at ${meta.time}</p>
            <p><strong>Covers:</strong> ${meta.guests}</p>
            <p><strong>Seating:</strong> ${meta.seating}</p>
            <p><strong>Amount:</strong> £${(session.amount_total / 100).toFixed(2)}</p>
            <p><strong>Payment:</strong> ✅ Confirmed via Stripe</p>
          `,
        });
      }

      if (meta.type === "direct_order") {
        await notifyOwner({
          subject: `🛒 New Order Paid — ${meta.orderRef}`,
          body: `
            <h2>Collection Order Received</h2>
            <p><strong>Ref:</strong> ${meta.orderRef}</p>
            <p><strong>Customer:</strong> ${meta.customerName}</p>
            <p><strong>Phone:</strong> ${meta.customerPhone || "—"}</p>
            <p><strong>Collection:</strong> ${meta.collectionTime || "ASAP"}</p>
            <p><strong>Total:</strong> £${(session.amount_total / 100).toFixed(2)}</p>
            <p><strong>Payment:</strong> ✅ Confirmed via Stripe</p>
            <p>Check Stripe dashboard for full line items.</p>
          `,
        });
      }
    }

    // Handle failed payments
    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const meta = session.metadata;
      console.log(`Payment expired: ${meta.type} — ${meta.bookingRef || meta.orderRef}`);
    }

    return res.json({ received: true });
  }

  return res.status(400).json({ error: "Invalid action" });
}

// ── Email notification helper ───────────────────────────────────────
async function notifyOwner({ subject, body }) {
  const RESEND_KEY = process.env.RESEND_API_KEY;
  const OWNER_EMAIL = process.env.OWNER_EMAIL;
  if (!RESEND_KEY || !OWNER_EMAIL) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "The Sixth Element <bookings@thesixthelement.co.uk>",
      to: OWNER_EMAIL,
      subject,
      html: `<div style="font-family: sans-serif; max-width: 500px; padding: 20px;">${body}</div>`,
    }),
  });
}
