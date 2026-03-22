import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import Joi from 'joi';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import DodoPayments from 'dodopayments';

// 1. API Keys loaded from .env.local (NOT in code)
dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

// For validation we don't strictly need Supabase initialized here unless we insert locally, 
// since we pass metadata through Stripe checkout and have the client insert it.
// But we've prepared it if needed.
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

// ── Dodo Payments ─────────────────────────────────────────────────────────────
const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: process.env.DODO_ENV === 'live' ? 'live_mode' : 'test_mode',
});

const DODO_PRODUCTS = {
  starter: process.env.DODO_STARTER_PRODUCT_ID,
  growth:  process.env.DODO_GROWTH_PRODUCT_ID,
  pro:     process.env.DODO_PRO_PRODUCT_ID,
};

const dodoSubscriptionSchema = Joi.object({
  plan:       Joi.string().valid('starter', 'growth', 'pro').required(),
  user_email: Joi.string().email().required(),
  user_name:  Joi.string().required(),
  user_id:    Joi.string().required(),
});

app.post('/api/dodo-subscription', async (req, res) => {
  try {
    const { error, value } = dodoSubscriptionSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { plan, user_email, user_name, user_id } = value;
    const productId = DODO_PRODUCTS[plan];

    if (!productId) {
      return res.status(400).json({ error: `Product ID for "${plan}" plan not configured. Add DODO_${plan.toUpperCase()}_PRODUCT_ID to .env.local` });
    }

    const session = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: { email: user_email, name: user_name },
      billing_address: { country: 'AE' },
      return_url: `http://localhost:5173/?subscription_success=true&plan=${plan}&user_id=${user_id}`,
    });

    res.json({ url: session.checkout_url });
  } catch (err) {
    console.error('Dodo Payments error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to create checkout session.' });
  }
});

// 2. Rate Limiting on public endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: { error: 'Too many booking requests from this IP, please try again later.' }
});

app.use('/api/', limiter);

// 3. Server-side validation schemas

// Trainer subscription plan prices (AED, in fils = smallest unit)
const SUBSCRIPTION_PRICES = { starter: 9900, growth: 19900, pro: 29900 };
const SUBSCRIPTION_NAMES = {
  starter: 'FindMyCoach Starter — 99 AED/month',
  growth:  'FindMyCoach Growth — 199 AED/month',
  pro:     'FindMyCoach Pro — 299 AED/month',
};

const subscriptionSchema = Joi.object({
  plan:       Joi.string().valid('starter', 'growth', 'pro').required(),
  user_email: Joi.string().email().required(),
  user_id:    Joi.string().required(),
});

// Trainer Subscription Checkout
app.post('/api/create-subscription-session', async (req, res) => {
  try {
    const { error, value } = subscriptionSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { plan, user_email, user_id } = value;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user_email,
      line_items: [{
        price_data: {
          currency: 'aed',
          product_data: {
            name: SUBSCRIPTION_NAMES[plan],
            description: `Monthly subscription — FindMyCoach ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan`,
          },
          unit_amount: SUBSCRIPTION_PRICES[plan],
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `http://localhost:5173/?subscription_success=true&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `http://localhost:5173/?page=trainer-pricing`,
      metadata: { user_id, plan },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe Subscription Exception:', err.message);
    res.status(500).json({ error: err.message || 'Failed to create subscription checkout session.' });
  }
});

const bookingSchema = Joi.object({
  user_name: Joi.string().min(2).max(100).required(),
  user_email: Joi.string().email().required(),
  user_phone: Joi.string().required(),
  notes: Joi.string().allow('', null),
  goal: Joi.string().required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
  trainer: Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    price: Joi.number().required(),
    img: Joi.string().allow('', null),
    spec: Joi.string().allow('', null),
    package_name: Joi.string().allow('', null),
    sessions: Joi.number().allow(null),
  }).unknown(true).required()  // allow extra trainer fields (exp, rating, etc.)
});

// Secure Checkout Endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    // A. User input validated strictly server-side
    const { error, value } = bookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { trainer, ...bookingData } = value;

    // B. Build Secure Stripe Checkout Session
    // We multiply AED price by 100 to get the smallest currency unit (fils).
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: trainer.package_name
                ? `${trainer.package_name} with ${trainer.name}`
                : `Training Session with ${trainer.name}`,
              description: [
                trainer.sessions > 1 ? `${trainer.sessions} sessions` : '1 session',
                `Goal: ${bookingData.goal}`,
                `Date: ${bookingData.date} @ ${bookingData.time}`,
              ].filter(Boolean).join(' | '),
            },
            unit_amount: trainer.price * 100, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // We pass the stringified JSON payload through Stripe's success URL so the frontend 
      // can finalize the database insert without losing State.
      success_url: `http://localhost:5173/?session_id={CHECKOUT_SESSION_ID}&booking_success=true&booking_payload=${encodeURIComponent(JSON.stringify(value))}`,
      cancel_url: `http://localhost:5173/`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe Exception:', err.message);
    res.status(500).json({ error: 'Failed to create secure checkout session.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Secure Backend running on port ${PORT}`));
