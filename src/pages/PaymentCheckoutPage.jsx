import React, { useState } from 'react';
import Section from '../components/UI/Section';
import GlassCard from '../components/UI/GlassCard';
import Button from '../components/UI/Button';
import { supabase } from '../lib/supabase';
import { getPlan } from '../lib/trainerPlans';

const PaymentCheckoutPage = ({ user, selectedPlan, trainerProfile, setPage, onSubscriptionComplete }) => {
  const plan = getPlan(selectedPlan || 'starter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useFallback, setUseFallback] = useState(false);

  // ── Dodo Payments checkout ─────────────────────────────────────────────────
  const handleDodoPay = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dodo-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          user_email: user.email,
          user_name: user.user_metadata?.full_name || user.email,
          user_id: user.id,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Could not start checkout.');
        setLoading(false);
      }
    } catch (e) {
      setError('Backend server offline. Run: npm run dev');
      setLoading(false);
    }
  };

  // ── Simulated fallback (dev mode when Dodo not configured) ────────────────
  const handleSimulatedPay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    const subData = { plan: selectedPlan, status: 'active', current_period_end: periodEnd.toISOString(), bookings_this_month: 0 };

    if (supabase && user) {
      try {
        await Promise.race([
          supabase.from('trainer_subscriptions').upsert([{
            user_id: user.id, ...subData,
            booking_reset_date: new Date().toISOString().split('T')[0],
          }], { onConflict: 'user_id' }),
          new Promise(r => setTimeout(r, 4000)),
        ]);
      } catch (_) {}
    }

    setLoading(false);
    onSubscriptionComplete(subData);
    setPage(trainerProfile ? 'trainer-dashboard' : 'trainer-setup');
  };

  return (
    <div style={{ paddingTop: 96, minHeight: '100vh', paddingBottom: 80 }}>
      <Section>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 32, alignItems: 'start',
        }}>

          {/* ── Left: Plan Summary ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, color: '#000', fontSize: 18 }}>F</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 }}>FindMyCoach</span>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 1, marginBottom: 8 }}>SUBSCRIBING TO</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 28 }}>{plan.emoji}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: plan.color }}>{plan.name} Plan</div>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{plan.tagline}</div>
              </div>
            </div>

            {/* Price box */}
            <GlassCard hover={false} style={{ padding: 20, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                <span style={{ color: 'var(--text2)' }}>{plan.name} plan × 1 month</span>
                <span style={{ fontWeight: 600 }}>{plan.price} AED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Total today</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: 'var(--accent)' }}>
                  {plan.price} AED
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8 }}>
                Billed monthly. Cancel anytime.
              </div>
            </GlassCard>

            {/* Included features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {plan.features.filter(f => f.included).map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text2)' }}>
                  <span style={{ color: plan.color, fontWeight: 800, fontSize: 11 }}>✓</span>
                  {f.text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Payment ── */}
          <GlassCard hover={false} style={{ padding: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
              Complete Payment
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 28 }}>
              You'll be redirected to Dodo Payments' secure checkout page.
            </p>

            {error && (
              <div style={{
                padding: '12px 16px', borderRadius: 10, marginBottom: 20,
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444', fontSize: 13,
              }}>
                ⚠ {error}
                {error.includes('not configured') && (
                  <div style={{ marginTop: 8 }}>
                    <button
                      onClick={() => { setError(''); setUseFallback(true); }}
                      style={{ fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Use simulated payment instead (dev mode)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Dodo Payments summary */}
            {!useFallback && (
              <div style={{
                padding: '16px 20px', borderRadius: 14,
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                marginBottom: 24,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'linear-gradient(135deg, #ff6b00, #ff9500)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, color: '#fff', fontSize: 16,
                  }}>D</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Dodo Payments</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>Secure hosted checkout</div>
                  </div>
                </div>
                {[
                  '🔒 256-bit SSL encryption',
                  '💳 Cards, Apple Pay, Google Pay',
                  '🌍 Supports AED & global currencies',
                  '🔄 Instant subscription activation',
                ].map(item => (
                  <div key={item} style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>{item}</div>
                ))}
              </div>
            )}

            {/* Pay button */}
            {!useFallback ? (
              <button
                onClick={handleDodoPay}
                disabled={loading}
                style={{
                  width: '100%', padding: '16px',
                  borderRadius: 14, border: 'none',
                  background: loading ? 'var(--card)' : 'linear-gradient(135deg, #ff6b00, #ff9500)',
                  color: '#fff', fontFamily: 'var(--font-display)',
                  fontWeight: 800, fontSize: 16,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1, transition: 'all 0.3s',
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Redirecting to Dodo Payments...
                  </span>
                ) : `Pay ${plan.price} AED via Dodo Payments →`}
              </button>
            ) : (
              <button
                onClick={handleSimulatedPay}
                disabled={loading}
                style={{
                  width: '100%', padding: '16px',
                  borderRadius: 14, border: 'none',
                  background: loading ? 'var(--card)' : 'var(--accent)',
                  color: '#000', fontFamily: 'var(--font-display)',
                  fontWeight: 800, fontSize: 16,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1, transition: 'all 0.3s',
                }}
              >
                {loading ? 'Activating Plan...' : `Simulate Payment — ${plan.price} AED (Dev Mode)`}
              </button>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
              {['🔒 Secure', '🔄 Cancel anytime', '📞 Support'].map(t => (
                <span key={t} style={{ fontSize: 12, color: 'var(--text3)' }}>{t}</span>
              ))}
            </div>

            <button
              onClick={() => setPage('trainer-pricing')}
              style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', color: 'var(--text3)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
            >
              ← Back to plans
            </button>
          </GlassCard>
        </div>
      </Section>
    </div>
  );
};

export default PaymentCheckoutPage;
