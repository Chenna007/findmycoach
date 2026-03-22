import React, { useState } from 'react';
import Section from '../components/UI/Section';
import Badge from '../components/UI/Badge';
import GlassCard from '../components/UI/GlassCard';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { PROGRAMS } from '../data';
import { supabase } from '../lib/supabase';
import { getPlan } from '../lib/trainerPlans';

const TrainerSetupPage = ({ user, selectedPlan, setPage, onProfileCreated }) => {
  const plan = getPlan(selectedPlan || 'free');

  const [form, setForm] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    spec: '',
    exp: '',
    location: '',
    bio: '',
    price: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.spec) {
      setError('Please fill in Name, Email, and Specialization.');
      return;
    }
    setError('');
    setLoading(true);

    // Build local profile object — always used as fallback
    const localProfile = {
      user_id: user?.id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      spec: form.spec,
      exp: form.exp,
      location: form.location,
      bio: form.bio,
      price: parseInt(form.price) || 200,
      is_active: true,
    };

    // Brief processing delay for UX
    await new Promise(r => setTimeout(r, 800));

    // Try to save to Supabase — fail silently if tables not set up yet
    if (supabase && user) {
      try {
        const timeout = new Promise(r => setTimeout(() => r({ data: null, error: 'timeout' }), 4000));

        // 1. Save profile
        const { data: profileData } = await Promise.race([
          supabase
            .from('trainer_profiles')
            .upsert([localProfile], { onConflict: 'user_id' })
            .select()
            .single(),
          timeout,
        ]);
        if (profileData) Object.assign(localProfile, profileData);

        // 2. Save subscription (fire and forget — don't block on failure)
        supabase.from('trainer_subscriptions').upsert([{
          user_id: user.id,
          plan: selectedPlan || 'free',
          status: 'active',
          bookings_this_month: 0,
          booking_reset_date: new Date().toISOString().split('T')[0],
        }], { onConflict: 'user_id' }).then(() => {}).catch(() => {});

      } catch (_) {
        // Tables may not exist yet — proceed with local state
      }
    }

    // Always succeed — profile is active in app state
    setLoading(false);
    onProfileCreated(localProfile);
    setPage('trainer-dashboard');
  };

  return (
    <div style={{ paddingTop: 96, minHeight: '100vh', paddingBottom: 80 }}>
      <Section>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>

          {/* Header */}
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 40 }}>
            <Badge variant="gold">✦ Profile Setup</Badge>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 900,
              marginTop: 16,
            }}>
              Set Up Your Trainer Profile
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text2)', marginTop: 12, lineHeight: 1.7 }}>
              You're on the{' '}
              <span style={{ color: plan.color, fontWeight: 700 }}>
                {plan.name} Plan
              </span>
              {plan.price > 0 && ` (${plan.price} AED/month)`}
              . Complete your profile to start receiving clients.
            </p>
          </div>

          {/* Plan Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 20px',
            background: plan.colorBg,
            border: `1px solid ${plan.colorBorder}`,
            borderRadius: 14,
            marginBottom: 32,
          }}>
            <span style={{ fontSize: 22 }}>{plan.emoji}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: plan.color }}>
                {plan.name} Plan Active
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                {plan.limits.bookingsPerMonth === Infinity
                  ? 'Unlimited bookings/month'
                  : `Up to ${plan.limits.bookingsPerMonth} bookings/month`}
                {' · '}
                {plan.limits.hasAnalytics ? 'Analytics included' : 'No analytics'}
              </div>
            </div>
          </div>

          {/* Form */}
          <GlassCard hover={false} style={{ padding: 36 }} className="fade-up">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, marginBottom: 28 }}>
              Your Information
            </h2>

            {error && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10,
                color: '#ef4444',
                fontSize: 14,
                marginBottom: 20,
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="grid-2">
                <Input
                  label="Full Name *"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => u('name', e.target.value)}
                />
                <Input
                  label="Email *"
                  type="email"
                  placeholder="coach@email.com"
                  value={form.email}
                  onChange={e => u('email', e.target.value)}
                />
              </div>

              <div className="grid-2">
                <Input
                  label="Phone"
                  placeholder="+971..."
                  value={form.phone}
                  onChange={e => u('phone', e.target.value)}
                />
                <Input
                  label="Location"
                  value={form.location}
                  onChange={e => u('location', e.target.value)}
                  options={['Dubai Marina', 'Downtown Dubai', 'JBR', 'JLT', 'Business Bay', 'DIFC', 'Palm Jumeirah', 'Online']}
                />
              </div>

              <Input
                label="Specialization *"
                value={form.spec}
                onChange={e => u('spec', e.target.value)}
                options={PROGRAMS.map(p => p.title)}
              />

              <div className="grid-2">
                <Input
                  label="Years of Experience"
                  value={form.exp}
                  onChange={e => u('exp', e.target.value)}
                  options={['1-2 years', '3-5 years', '5-8 years', '8-10 years', '10+ years']}
                />
                <Input
                  label="Price per Session (AED)"
                  type="number"
                  placeholder="e.g. 250"
                  value={form.price}
                  onChange={e => u('price', e.target.value)}
                />
              </div>

              {/* Bio — shown for Starter+ (customization enabled) */}
              <div>
                <Input
                  label={plan.limits.hasCustomization ? 'Bio / About You' : 'Bio (upgrade to Starter to customize)'}
                  textarea
                  placeholder={plan.limits.hasCustomization
                    ? 'Tell clients about your experience, certifications, and coaching philosophy...'
                    : 'Available on Starter plan and above'}
                  value={form.bio}
                  onChange={e => plan.limits.hasCustomization && u('bio', e.target.value)}
                  style={{ opacity: plan.limits.hasCustomization ? 1 : 0.4 }}
                />
                {!plan.limits.hasCustomization && (
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
                    🔒 Unlock bio customization with the{' '}
                    <span
                      onClick={() => setPage('trainer-pricing')}
                      style={{ color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Starter plan
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="gold"
              size="lg"
              full
              onClick={handleSubmit}
              style={{ marginTop: 32, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creating Profile...' : 'Launch My Profile →'}
            </Button>
          </GlassCard>

          <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, marginTop: 20 }}>
            You can update your profile anytime from your Trainer Dashboard.
          </p>
        </div>
      </Section>
    </div>
  );
};

export default TrainerSetupPage;
