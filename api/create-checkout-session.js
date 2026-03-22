import Stripe from 'stripe';
import Joi from 'joi';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const bookingSchema = Joi.object({
  user_name:  Joi.string().min(2).max(100).required(),
  user_email: Joi.string().email().required(),
  user_phone: Joi.string().required(),
  notes:      Joi.string().allow('', null),
  goal:       Joi.string().required(),
  date:       Joi.string().required(),
  time:       Joi.string().required(),
  trainer: Joi.object({
    id:           Joi.number().required(),
    name:         Joi.string().required(),
    price:        Joi.number().required(),
    img:          Joi.string().allow('', null),
    spec:         Joi.string().allow('', null),
    package_name: Joi.string().allow('', null),
    sessions:     Joi.number().allow(null),
  }).unknown(true).required(),
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { error, value } = bookingSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { trainer, ...bookingData } = value;
    const appUrl = process.env.APP_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
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
            ].join(' | '),
          },
          unit_amount: trainer.price * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${appUrl}/?session_id={CHECKOUT_SESSION_ID}&booking_success=true&booking_payload=${encodeURIComponent(JSON.stringify(value))}`,
      cancel_url: `${appUrl}/`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: 'Failed to create checkout session.' });
  }
}
