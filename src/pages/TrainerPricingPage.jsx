import React, { useState } from 'react';
import Section from '../components/UI/Section';
import Badge from '../components/UI/Badge';
import GlassCard from '../components/UI/GlassCard';
import Button from '../components/UI/Button';
import { PLANS, PLAN_ORDER } from '../lib/trainerPlans';

const TrainerPricingPage = ({ user, setShowAuth, setPage, setSelectedPlan, trainerSubscription }) => {
  const [loading, setLoading] = useState(null);

  const currentPlan = trainerSubscription?.plan || null;

  const handleSelectPlan = (planId) => {
    // Must be logged in
    if (!user) {
      setShowAuth(true);
      return;
    }

    setLoading(planId);
    setSelectedPlan(planId);

    if (planId === 'free') {
      setPage('trainer-setup');
    } else {
      // Paid plans → in-app payment checkout
      setPage('payment-checkout');
    }

    setLoading(null);
  };

  return (
    <div style={{ paddingTop: 96, minHeight: '100vh', paddingBottom: 80 }}>
      <Section>
        {/* Header */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: 64 }}>
          <Badge variant="accent">✦ Trainer Plans</Badge>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 900,
            marginTop: 16,
            lineHeight: 1.1,
          }}>
            Choose Your Plan,<br />
            <span style={{ color: 'var(--accent)' }}>Grow Your Business</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text2)', marginTop: 16, maxWidth: 560, margin: '16px auto 0' }}>
            Join thousands of fitness professionals on FindMyCoach. Start free, upgrade when you're ready to scale.
          </p>
        </div>

        {/* Plan Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {PLAN_ORDER.map((planId, idx) => {
            const plan = PLANS[planId];
            const isPopular = plan.badge === 'MOST POPULAR';
            const isCurrent = currentPlan === planId;
            const isLoading = loading === planId;

            return (
              <div
                key={planId}
                className="fade-up"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <GlassCard
                  hover={false}
                  style={{
                    padding: 32,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    border: isPopular
                      ? `2px solid ${plan.color}`
                      : isCurrent
                      ? '2px solid var(--accent)'
                      : '1px solid var(--border)',
                    boxShadow: isPopular ? `0 0 40px ${plan.colorBg}` : 'none',
                  }}
                >
                  {/* Popular / Current Badge */}
                  {(plan.badge || isCurrent) && (
                    <div style={{
                      position: 'absolute',
                      top: -14,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: isCurrent ? 'var(--accent)' : plan.color,
                      color: '#000',
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 1.5,
                      padding: '4px 16px',
                      borderRadius: 100,
                      whiteSpace: 'nowrap',
                    }}>
                      {isCurrent ? 'YOUR CURRENT PLAN' : plan.badge}
                    </div>
                  )}

                  {/* Plan Name & Price */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 22 }}>{plan.emoji}</span>
                      <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 22,
                        fontWeight: 800,
                        color: plan.color,
                      }}>
                        {plan.name}
                      </h2>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>
                      {plan.tagline}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: plan.price === 0 ? 40 : 48,
                        fontWeight: 900,
                        color: 'var(--text)',
                      }}>
                        {plan.price === 0 ? 'Free' : plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span style={{ fontSize: 14, color: 'var(--text3)', fontWeight: 500 }}>
                          AED / month
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid var(--border)', marginBottom: 24 }} />

                  {/* Features */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                    {plan.features.map((f, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        opacity: f.included ? 1 : 0.35,
                      }}>
                        <span style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          flexShrink: 0,
                          background: f.included ? plan.colorBg : 'var(--card)',
                          border: `1px solid ${f.included ? plan.colorBorder : 'var(--border)'}`,
                          color: f.included ? plan.color : 'var(--text3)',
                          fontWeight: 800,
                        }}>
                          {f.included ? '✓' : '×'}
                        </span>
                        <span style={{ fontSize: 14, color: f.included ? 'var(--text)' : 'var(--text3)', lineHeight: 1.4 }}>
                          {f.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  {isCurrent ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '14px',
                      borderRadius: 14,
                      border: '1px solid var(--accent)',
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: 14,
                    }}>
                      ✓ Active Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSelectPlan(planId)}
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: 14,
                        border: `2px solid ${plan.color}`,
                        background: isPopular ? plan.color : 'transparent',
                        color: isPopular ? '#000' : plan.color,
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: 15,
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.7 : 1,
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={e => {
                        if (!isLoading) {
                          e.target.style.background = plan.color;
                          e.target.style.color = '#000';
                          e.target.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={e => {
                        e.target.style.background = isPopular ? plan.color : 'transparent';
                        e.target.style.color = isPopular ? '#000' : plan.color;
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      {isLoading
                        ? 'Redirecting to checkout...'
                        : planId === 'free'
                        ? 'Get Started Free →'
                        : `Get ${plan.name} — ${plan.price} AED/mo →`}
                    </button>
                  )}
                </GlassCard>
              </div>
            );
          })}
        </div>

        {/* Guarantee Strip */}
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 32,
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '20px 40px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          }}>
            {[
              { icon: '🔒', text: 'Secure Stripe payments' },
              { icon: '🔄', text: 'Cancel anytime' },
              { icon: '📞', text: 'Dedicated support' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ note */}
        <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, marginTop: 32 }}>
          Not sure which plan? Start with <strong style={{ color: 'var(--text2)' }}>Free</strong> and upgrade anytime from your Trainer Dashboard.
        </p>
      </Section>
    </div>
  );
};

export default TrainerPricingPage;
