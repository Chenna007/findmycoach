-- ============================================================
-- FindMyCoach — Trainer Subscription Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── 1. Trainer Profiles ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS trainer_profiles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  spec       TEXT,
  exp        TEXT,
  location   TEXT,
  bio        TEXT,
  price      INTEGER DEFAULT 200,   -- session price in AED
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE trainer_profiles ENABLE ROW LEVEL SECURITY;

-- Trainer can manage their own profile
CREATE POLICY "trainer_profiles_self_select" ON trainer_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "trainer_profiles_self_insert" ON trainer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "trainer_profiles_self_update" ON trainer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Public can view active trainer profiles (for listing page)
CREATE POLICY "trainer_profiles_public_read" ON trainer_profiles
  FOR SELECT USING (is_active = true);


-- ── 2. Trainer Subscriptions ─────────────────────────────────
-- plan: 'free' | 'starter' | 'growth' | 'pro'
-- status: 'active' | 'cancelled' | 'expired'

CREATE TABLE IF NOT EXISTS trainer_subscriptions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  plan                  TEXT NOT NULL DEFAULT 'free'
                          CHECK (plan IN ('free', 'starter', 'growth', 'pro')),
  status                TEXT NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'cancelled', 'expired')),
  stripe_session_id     TEXT,              -- Stripe checkout session ID
  stripe_subscription_id TEXT,            -- Stripe subscription ID (from webhooks)
  current_period_end    TIMESTAMPTZ,       -- When the current billing period ends
  bookings_this_month   INTEGER DEFAULT 0, -- Resets monthly; enforces booking limits
  booking_reset_date    DATE DEFAULT CURRENT_DATE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE trainer_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trainer_subscriptions_self_select" ON trainer_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "trainer_subscriptions_self_insert" ON trainer_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "trainer_subscriptions_self_update" ON trainer_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);


-- ── 3. Auto-update updated_at on trainer_subscriptions ───────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trainer_subscriptions_updated_at
  BEFORE UPDATE ON trainer_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ── 4. Monthly booking counter reset (run via pg_cron or Edge Function) ──
-- Example cron job to reset bookings_this_month on the 1st of each month:
--
--   SELECT cron.schedule(
--     'reset-monthly-bookings',
--     '0 0 1 * *',
--     $$
--       UPDATE trainer_subscriptions
--       SET bookings_this_month = 0,
--           booking_reset_date  = CURRENT_DATE
--       WHERE booking_reset_date < date_trunc('month', CURRENT_DATE);
--     $$
--   );
--
-- Alternatively, reset in your backend when checking booking limits.


-- ── 5. Existing tables (already in your project) ─────────────
-- bookings table (already exists — no changes needed)
-- trainer_applications table (already exists — no changes needed)

-- ── Done! ────────────────────────────────────────────────────
-- After running this, go to Supabase → Authentication → Policies
-- and confirm the policies above appear correctly.
