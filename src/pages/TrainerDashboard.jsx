import React, { useState } from 'react';
import Section from '../components/UI/Section';
import GlassCard from '../components/UI/GlassCard';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import { getPlan, PLAN_ORDER, PLANS } from '../lib/trainerPlans';

// ─── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, locked, onUpgrade }) => (
  <GlassCard hover={false} style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
    {locked && (
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(10,10,10,0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius)', gap: 8,
        zIndex: 2,
      }}>
        <span style={{ fontSize: 24 }}>🔒</span>
        <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>Upgrade to unlock</span>
        {onUpgrade && (
          <button onClick={onUpgrade} style={{
            marginTop: 4, fontSize: 12, fontWeight: 700,
            background: 'var(--accent)', color: '#000',
            border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
          }}>
            Upgrade Plan
          </button>
        )}
      </div>
    )}
    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900 }}>{value}</div>
    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{sub}</div>}
  </GlassCard>
);

// ─── Plan Badge ──────────────────────────────────────────────────────────────
const PlanBadge = ({ planId }) => {
  const plan = getPlan(planId);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 14px', borderRadius: 100,
      background: plan.colorBg, border: `1px solid ${plan.colorBorder}`,
      color: plan.color, fontSize: 13, fontWeight: 700,
    }}>
      {plan.emoji} {plan.name}
    </span>
  );
};

// ─── Feature Row ─────────────────────────────────────────────────────────────
const FeatureRow = ({ label, included, planColor, planColorBg, planColorBorder }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <span style={{
      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 800,
      background: included ? planColorBg : 'var(--card)',
      border: `1px solid ${included ? planColorBorder : 'var(--border)'}`,
      color: included ? planColor : 'var(--text3)',
    }}>
      {included ? '✓' : '×'}
    </span>
    <span style={{ fontSize: 14, color: included ? 'var(--text)' : 'var(--text3)', opacity: included ? 1 : 0.4 }}>
      {label}
    </span>
  </div>
);

// ─── Main Dashboard ──────────────────────────────────────────────────────────
const TrainerDashboard = ({ trainerProfile, trainerSubscription, setPage }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const plan = getPlan(trainerSubscription?.plan || 'free');
  const limits = plan.limits;
  const bookingsUsed = trainerSubscription?.bookings_this_month || 0;
  const bookingLimit = limits.bookingsPerMonth;
  const bookingLimitDisplay = bookingLimit === Infinity ? '∞' : bookingLimit;
  const bookingPct = bookingLimit === Infinity ? 20 : Math.min(100, (bookingsUsed / bookingLimit) * 100);

  // Mock analytics (real integration requires analytics events tracking)
  const mockAnalytics = {
    profileViews: 142,
    clickThroughRate: '8.4%',
    contactRequests: 17,
    conversionRate: '11.9%',
    avgRating: 4.8,
    totalReviews: 9,
  };

  if (!trainerProfile) {
    return (
      <div style={{ paddingTop: 96, minHeight: '100vh' }}>
        <Section>
          <GlassCard style={{ padding: 60, textAlign: 'center', maxWidth: 500, margin: '0 auto' }} hover={false}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏋️</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
              No Profile Yet
            </h2>
            <p style={{ color: 'var(--text2)', marginBottom: 24 }}>
              Choose a plan and set up your trainer profile to start getting clients.
            </p>
            <Button variant="primary" size="lg" onClick={() => setPage('trainer-pricing')}>
              Get Started →
            </Button>
          </GlassCard>
        </Section>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'analytics', label: '📈 Analytics' },
    { id: 'plan', label: '💳 My Plan' },
  ];

  return (
    <div style={{ paddingTop: 96, minHeight: '100vh', paddingBottom: 80 }}>
      <Section>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900 }}>
                Trainer Portal
              </h1>
              <PlanBadge planId={trainerSubscription?.plan || 'free'} />
              {limits.hasVerifiedBadge && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 100,
                  background: 'rgba(200,255,0,0.1)', border: '1px solid rgba(200,255,0,0.3)',
                  color: 'var(--accent)', fontSize: 12, fontWeight: 700,
                }}>
                  ✓ Verified Trainer
                </span>
              )}
              {limits.hasCustomization && !limits.hasVerifiedBadge && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 100,
                  background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                  color: '#3b82f6', fontSize: 12, fontWeight: 700,
                }}>
                  ⚡ Active Trainer
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text2)', marginTop: 6, fontSize: 15 }}>
              Welcome back, <strong style={{ color: 'var(--text)' }}>{trainerProfile.name}</strong>
            </p>
          </div>
          {plan.id !== 'pro' && (
            <Button variant="ghost" size="sm" onClick={() => setPage('trainer-pricing')}>
              Upgrade Plan ↑
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                border: activeTab === tab.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: activeTab === tab.id ? 'rgba(200,255,0,0.08)' : 'var(--card)',
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text2)',
                fontFamily: 'var(--font-body)',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              {/* Bookings this month */}
              <GlassCard hover={false} style={{ padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📅</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900 }}>
                  {bookingsUsed}
                  <span style={{ fontSize: 16, color: 'var(--text3)', fontWeight: 400 }}>/{bookingLimitDisplay}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>Bookings This Month</div>
                {/* Progress bar */}
                <div style={{ marginTop: 10, height: 4, background: 'var(--border)', borderRadius: 2 }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    width: `${bookingPct}%`,
                    background: bookingPct > 80 ? '#ef4444' : plan.color,
                    transition: 'width 0.5s',
                  }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
                  {bookingLimit === Infinity ? 'Unlimited' : `${bookingLimit - bookingsUsed} remaining`}
                </div>
              </GlassCard>

              {/* Profile views */}
              <StatCard
                icon="👁️"
                label="Profile Views"
                value={limits.hasAnalytics ? mockAnalytics.profileViews : '—'}
                sub="This month"
                locked={!limits.hasAnalytics}
                onUpgrade={() => setPage('trainer-pricing')}
              />

              {/* Contact Requests */}
              <StatCard
                icon="📩"
                label="Contact Requests"
                value={limits.hasAnalytics ? mockAnalytics.contactRequests : '—'}
                sub="This month"
                locked={!limits.hasAnalytics}
                onUpgrade={() => setPage('trainer-pricing')}
              />

              {/* Rating */}
              <StatCard
                icon="⭐"
                label="Avg Rating"
                value={limits.hasReviews ? mockAnalytics.avgRating : '—'}
                sub={limits.hasReviews ? `${mockAnalytics.totalReviews} reviews` : 'Reviews disabled'}
                locked={!limits.hasReviews}
                onUpgrade={() => setPage('trainer-pricing')}
              />
            </div>

            {/* Profile Card */}
            <GlassCard hover={false} style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 }}>Your Profile</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {[
                  { label: 'Name', value: trainerProfile.name },
                  { label: 'Email', value: trainerProfile.email },
                  { label: 'Phone', value: trainerProfile.phone || '—' },
                  { label: 'Specialization', value: trainerProfile.spec },
                  { label: 'Experience', value: trainerProfile.exp || '—' },
                  { label: 'Location', value: trainerProfile.location || '—' },
                  { label: 'Session Price', value: trainerProfile.price ? `${trainerProfile.price} AED` : '—' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, letterSpacing: 0.8, marginBottom: 4 }}>
                      {item.label.toUpperCase()}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{item.value}</div>
                  </div>
                ))}
              </div>
              {trainerProfile.bio && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, letterSpacing: 0.8, marginBottom: 8 }}>BIO</div>
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>{trainerProfile.bio}</p>
                </div>
              )}
            </GlassCard>

            {/* WhatsApp Alerts Banner (Growth+) */}
            {!limits.hasWhatsApp && (
              <GlassCard hover={false} style={{
                padding: 20,
                background: 'rgba(168,85,247,0.05)',
                border: '1px solid rgba(168,85,247,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 28 }}>📱</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
                      WhatsApp Lead Alerts
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>
                      Get instant WhatsApp notifications for new leads. Available on Growth & Pro.
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setPage('trainer-pricing')} style={{ borderColor: '#a855f7', color: '#a855f7' }}>
                  Upgrade to Growth →
                </Button>
              </GlassCard>
            )}

            {/* Homepage Spotlight Banner (Pro only) */}
            {!limits.hasHomepageSpotlight && (
              <GlassCard hover={false} style={{
                padding: 20,
                background: 'rgba(239,68,68,0.05)',
                border: '1px solid rgba(239,68,68,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 28 }}>🔥</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
                      Homepage Spotlight — Limited Slots
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>
                      Be featured on the homepage and get priority leads. Pro plan only.
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setPage('trainer-pricing')} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                  Go Pro →
                </Button>
              </GlassCard>
            )}
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {!limits.hasAnalytics ? (
              <GlassCard hover={false} style={{ padding: 60, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📈</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
                  Analytics Locked
                </h2>
                <p style={{ color: 'var(--text2)', maxWidth: 400, margin: '0 auto 28px' }}>
                  Upgrade to the <strong>Starter plan (99 AED/mo)</strong> to unlock profile views, click-through rates, and contact request tracking.
                </p>
                <Button variant="primary" size="lg" onClick={() => setPage('trainer-pricing')}>
                  Upgrade to Starter →
                </Button>
              </GlassCard>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                  <GlassCard hover={false} style={{ padding: 24 }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>👁️</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900 }}>{mockAnalytics.profileViews}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>Profile Views</div>
                    <div style={{ fontSize: 11, color: '#22c55e', marginTop: 4 }}>↑ 12% vs last month</div>
                  </GlassCard>

                  <GlassCard hover={false} style={{ padding: 24 }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🖱️</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900 }}>{mockAnalytics.clickThroughRate}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>Click-Through Rate</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>vs 6.1% platform avg</div>
                  </GlassCard>

                  <GlassCard hover={false} style={{ padding: 24 }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📩</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900 }}>{mockAnalytics.contactRequests}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>Contact Requests</div>
                    <div style={{ fontSize: 11, color: '#22c55e', marginTop: 4 }}>↑ 3 vs last month</div>
                  </GlassCard>

                  <StatCard
                    icon="🎯"
                    label="Conversion Rate"
                    value={limits.hasAdvancedAnalytics ? mockAnalytics.conversionRate : '—'}
                    sub="Contacts → bookings"
                    locked={!limits.hasAdvancedAnalytics}
                    onUpgrade={() => setPage('trainer-pricing')}
                  />
                </div>

                {!limits.hasAdvancedAnalytics && (
                  <GlassCard hover={false} style={{
                    padding: 24,
                    background: 'rgba(168,85,247,0.05)',
                    border: '1px solid rgba(168,85,247,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
                        Unlock Advanced Analytics
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>
                        Conversion rate, revenue tracking, review sentiment analysis — Growth plan & above.
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setPage('trainer-pricing')} style={{ borderColor: '#a855f7', color: '#a855f7' }}>
                      Upgrade to Growth →
                    </Button>
                  </GlassCard>
                )}
              </>
            )}
          </div>
        )}

        {/* ── PLAN TAB ── */}
        {activeTab === 'plan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Current Plan Summary */}
            <GlassCard hover={false} style={{
              padding: 28,
              border: `2px solid ${plan.colorBorder}`,
              background: plan.colorBg,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>CURRENT PLAN</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 32 }}>{plan.emoji}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, color: plan.color }}>
                        {plan.name}
                      </div>
                      <div style={{ fontSize: 14, color: 'var(--text2)', marginTop: 2 }}>{plan.tagline}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 16, fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 900 }}>
                    {plan.price === 0 ? 'Free' : `${plan.price} AED`}
                    {plan.price > 0 && <span style={{ fontSize: 14, color: 'var(--text3)', fontWeight: 400 }}>/month</span>}
                  </div>
                </div>
                {trainerSubscription?.current_period_end && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, letterSpacing: 1 }}>RENEWS ON</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>
                      {new Date(trainerSubscription.current_period_end).toLocaleDateString('en-AE', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Feature Access Grid */}
            <GlassCard hover={false} style={{ padding: 28 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, marginBottom: 20 }}>
                Your Plan Features
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                {[
                  { label: `Up to ${limits.bookingsPerMonth === Infinity ? 'unlimited' : limits.bookingsPerMonth} bookings/month`, included: true },
                  { label: 'Profile customization', included: limits.hasCustomization },
                  { label: 'Basic analytics', included: limits.hasAnalytics },
                  { label: 'Advanced analytics', included: limits.hasAdvancedAnalytics },
                  { label: 'Featured in category pages', included: limits.hasFeatured },
                  { label: 'WhatsApp lead alerts', included: limits.hasWhatsApp },
                  { label: 'Reviews & ratings', included: limits.hasReviews },
                  { label: '"Verified Trainer" badge', included: limits.hasVerifiedBadge },
                  { label: 'Priority listing (shown first)', included: limits.hasPriorityListing },
                  { label: 'Homepage spotlight', included: limits.hasHomepageSpotlight },
                  { label: 'Sell monthly packages', included: limits.hasSellPackages },
                ].map((f, i) => (
                  <FeatureRow
                    key={i}
                    label={f.label}
                    included={f.included}
                    planColor={plan.color}
                    planColorBg={plan.colorBg}
                    planColorBorder={plan.colorBorder}
                  />
                ))}
              </div>
            </GlassCard>

            {/* Upgrade Options */}
            {plan.id !== 'pro' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, marginBottom: 16 }}>
                  Available Upgrades
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  {PLAN_ORDER.filter(id => {
                    const idx1 = PLAN_ORDER.indexOf(plan.id);
                    const idx2 = PLAN_ORDER.indexOf(id);
                    return idx2 > idx1;
                  }).map(upgradePlanId => {
                    const up = PLANS[upgradePlanId];
                    return (
                      <GlassCard
                        key={upgradePlanId}
                        hover={true}
                        onClick={() => setPage('trainer-pricing')}
                        style={{
                          padding: 20,
                          border: `1px solid ${up.colorBorder}`,
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: 20, marginBottom: 4 }}>{up.emoji}</div>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: up.color }}>{up.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{up.tagline}</div>
                          </div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: up.color }}>
                            {up.price}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text3)' }}> AED/mo</span>
                          </div>
                        </div>
                        <div style={{
                          marginTop: 14,
                          fontSize: 13,
                          color: up.color,
                          fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                          Upgrade Now →
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </div>
            )}

            {plan.id === 'pro' && (
              <GlassCard hover={false} style={{
                padding: 28, textAlign: 'center',
                background: 'rgba(239,68,68,0.05)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800 }}>
                  You're on the highest plan!
                </div>
                <div style={{ color: 'var(--text2)', marginTop: 8, fontSize: 14 }}>
                  You have full access to all FindMyCoach features. Thank you for being a Pro member.
                </div>
              </GlassCard>
            )}
          </div>
        )}

      </Section>
    </div>
  );
};

export default TrainerDashboard;
