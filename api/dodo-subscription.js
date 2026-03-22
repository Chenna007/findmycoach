import DodoPayments from 'dodopayments';
import Joi from 'joi';

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: process.env.DODO_ENV === 'live' ? 'live_mode' : 'test_mode',
});

const DODO_PRODUCTS = {
  starter: process.env.DODO_STARTER_PRODUCT_ID,
  growth:  process.env.DODO_GROWTH_PRODUCT_ID,
  pro:     process.env.DODO_PRO_PRODUCT_ID,
};

const schema = Joi.object({
  plan:       Joi.string().valid('starter', 'growth', 'pro').required(),
  user_email: Joi.string().email().required(),
  user_name:  Joi.string().required(),
  user_id:    Joi.string().required(),
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { plan, user_email, user_name, user_id } = value;
    const productId = DODO_PRODUCTS[plan];

    if (!productId) {
      return res.status(400).json({
        error: `DODO_${plan.toUpperCase()}_PRODUCT_ID not configured in environment variables.`,
      });
    }

    // Use APP_URL env var — set in Vercel dashboard for production
    const appUrl = process.env.APP_URL || 'http://localhost:5173';

    const session = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: { email: user_email, name: user_name },
      billing_address: { country: 'AE' },
      return_url: `${appUrl}/?subscription_success=true&plan=${plan}&user_id=${user_id}`,
    });

    res.json({ url: session.checkout_url });
  } catch (err) {
    console.error('Dodo error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to create checkout session.' });
  }
}
