import React, { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { downloadReceipt } from '../../lib/pdfGenerator';

// ─── Session Packages ────────────────────────────────────────────────────────
const getPackages = (basePrice) => [
  {
    id: 'single',
    label: 'Single Session',
    sessions: 1,
    price: basePrice,
    original: null,
    discount: null,
    tag: null,
  },
  {
    id: 'starter',
    label: 'Starter Pack',
    sessions: 5,
    price: Math.round(basePrice * 5 * 0.9),
    original: basePrice * 5,
    discount: '-10%',
    tag: 'Save 10%',
  },
  {
    id: 'pro',
    label: 'Pro Pack',
    sessions: 10,
    price: Math.round(basePrice * 10 * 0.85),
    original: basePrice * 10,
    discount: '-15%',
    tag: 'Most Popular',
  },
  {
    id: 'elite',
    label: 'Elite Pack',
    sessions: 20,
    price: Math.round(basePrice * 20 * 0.8),
    original: basePrice * 20,
    discount: '-20%',
    tag: 'Best Value',
  },
];

// ─── Time slots ───────────────────────────────────────────────────────────────
const TIME_SLOTS = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM',
];

// ─── Package Card ─────────────────────────────────────────────────────────────
const PackageCard = ({ pkg, selected, onSelect }) => (
  <div
    onClick={() => onSelect(pkg)}
    style={{
      padding: '16px 18px',
      borderRadius: 16,
      border: selected ? '2px solid var(--accent)' : '1px solid var(--border)',
      background: selected ? 'rgba(200,255,0,0.06)' : 'var(--bg3)',
      cursor: 'pointer',
      transition: 'all 0.25s',
      position: 'relative',
      userSelect: 'none',
    }}
  >
    {pkg.tag && (
      <div style={{
        position: 'absolute', top: -10, right: 12,
        background: selected ? 'var(--accent)' : 'var(--card)',
        border: selected ? 'none' : '1px solid var(--border)',
        color: selected ? '#000' : 'var(--text2)',
        fontSize: 10, fontWeight: 800, letterSpacing: 0.8,
        padding: '3px 10px', borderRadius: 100,
      }}>
        {pkg.tag}
      </div>
    )}

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
          color: selected ? 'var(--accent)' : 'var(--text)',
        }}>
          {pkg.label}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>
          {pkg.sessions} session{pkg.sessions > 1 ? 's' : ''}
          {pkg.discount && (
            <span style={{ marginLeft: 8, color: '#22c55e', fontWeight: 700 }}>{pkg.discount}</span>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18,
          color: selected ? 'var(--accent)' : 'var(--text)',
        }}>
          {pkg.price.toLocaleString()} AED
        </div>
        {pkg.original && (
          <div style={{ fontSize: 11, color: 'var(--text3)', textDecoration: 'line-through', marginTop: 1 }}>
            {pkg.original.toLocaleString()} AED
          </div>
        )}
      </div>
    </div>

    {/* Selected indicator */}
    <div style={{
      position: 'absolute', top: 12, left: 14,
      width: 16, height: 16, borderRadius: '50%',
      border: selected ? '2px solid var(--accent)' : '2px solid var(--border)',
      background: selected ? 'var(--accent)' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.2s',
    }}>
      {selected && <span style={{ fontSize: 8, color: '#000', fontWeight: 900 }}>✓</span>}
    </div>
    <div style={{ paddingLeft: 28 }} /> {/* offset for radio */}
  </div>
);

// ─── Field wrapper — shows error message below input ─────────────────────────
const errorBorder = { border: '1px solid rgba(239,68,68,0.7)' };
const Field = ({ error, children }) => (
  <div>
    {children}
    {error && (
      <div style={{ fontSize: 12, color: '#ef4444', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>⚠</span> {error}
      </div>
    )}
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
const BookingModal = ({ trainer, onClose, onSubmit }) => {
  const packages = getPackages(trainer.price);
  const [step, setStep] = useState(1); // 1: Package, 2: Details, 3: Confirm
  const [selectedPkg, setSelectedPkg] = useState(packages[0]);
  const [form, setForm] = useState({ name: '', phone: '', email: '', goal: '', date: '', time: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const u = (k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: '' }));
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.goal)         e.goal  = 'Please select a training goal';
    if (!form.date)         e.date  = 'Please choose a preferred date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePaymentSubmit = async () => {
    setLoading(true);
    try {
      const bookingData = {
        id: Date.now(),
        user_name: form.name,
        user_email: form.email,
        user_phone: form.phone,
        notes: form.notes,
        goal: form.goal || 'General Fitness',
        date: form.date,
        time: form.time,
        status: 'Confirmed',
        trainer: {
          ...trainer,
          price: selectedPkg.price,
          package_name: selectedPkg.label,
          sessions: selectedPkg.sessions,
        },
      };

      await onSubmit(bookingData);
    } catch (err) {
      alert('Failed to confirm booking. Please try again.');
      setLoading(false);
    }
  };

  // Step labels for progress bar
  const steps = ['Package', 'Details', 'Payment'];

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(12px)', padding: 20 }}
      onClick={onClose}
    >
      <div
        className="scale-in"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 24,
          padding: 36, maxWidth: 540, width: '100%', maxHeight: '92vh', overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800 }}>
            {step === 1 ? 'Choose Package' : step === 2 ? 'Booking Details' : 'Confirm & Pay'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'var(--card)', border: '1px solid var(--border)', width: 36, height: 36, borderRadius: 12, color: 'var(--text)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >✕</button>
        </div>

        {/* Progress steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: step > i + 1 ? 'var(--accent)' : step === i + 1 ? 'var(--accent)' : 'var(--card)',
                  border: step <= i + 1 ? '1px solid var(--border)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800,
                  color: step >= i + 1 ? '#000' : 'var(--text3)',
                  transition: 'all 0.3s',
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: step === i + 1 ? 'var(--text)' : 'var(--text3)' }}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 1, background: step > i + 1 ? 'var(--accent)' : 'var(--border)', margin: '0 8px', transition: 'background 0.3s' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Trainer pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg3)', borderRadius: 14, marginBottom: 24, border: '1px solid var(--border)' }}>
          <img src={trainer.img} alt="" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{trainer.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>{trainer.spec} · {trainer.price} AED/session</div>
          </div>
        </div>

        {/* ── STEP 1: Package Selection ── */}
        {step === 1 && (
          <div className="fade-in">
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>
              Choose a session package. Bulk packages come with a discount.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {packages.map(pkg => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  selected={selectedPkg.id === pkg.id}
                  onSelect={setSelectedPkg}
                />
              ))}
            </div>

            {/* Selected summary */}
            <div style={{
              padding: '14px 18px', borderRadius: 14,
              background: 'rgba(200,255,0,0.06)', border: '1px solid rgba(200,255,0,0.2)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 24,
            }}>
              <span style={{ fontSize: 14, color: 'var(--text2)' }}>
                {selectedPkg.label} · {selectedPkg.sessions} session{selectedPkg.sessions > 1 ? 's' : ''}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--accent)' }}>
                {selectedPkg.price.toLocaleString()} AED
              </span>
            </div>

            <Button variant="primary" size="lg" full onClick={() => setStep(2)}>
              Continue with {selectedPkg.label} →
            </Button>
          </div>
        )}

        {/* ── STEP 2: Booking Details ── */}
        {step === 2 && (
          <div className="fade-in">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              <div className="grid-2" style={{ gap: 16 }}>
                <Field error={errors.name}>
                  <Input label="Full Name *" placeholder="Your name" value={form.name} onChange={e => u('name', e.target.value)} style={errors.name ? errorBorder : {}} />
                </Field>
                <Field error={errors.phone}>
                  <Input label="Phone *" placeholder="+971..." value={form.phone} onChange={e => u('phone', e.target.value)} style={errors.phone ? errorBorder : {}} />
                </Field>
              </div>
              <Field error={errors.email}>
                <Input label="Email *" type="email" placeholder="you@email.com" value={form.email} onChange={e => u('email', e.target.value)} style={errors.email ? errorBorder : {}} />
              </Field>
              <Field error={errors.goal}>
                <Input label="Training Goal *" placeholder="Select goal" value={form.goal} onChange={e => u('goal', e.target.value)} options={trainer.programs} style={errors.goal ? errorBorder : {}} />
              </Field>

              {/* Date & Time row */}
              <div className="grid-2" style={{ gap: 16 }}>
                <Field error={errors.date}>
                  <Input label="Preferred Date *" type="date" value={form.date} onChange={e => u('date', e.target.value)} style={errors.date ? errorBorder : {}} />
                </Field>

                {/* Custom time select */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Preferred Time</label>
                  <select
                    value={form.time}
                    onChange={e => u('time', e.target.value)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'var(--bg3)',
                      border: form.time ? '1px solid var(--accent)' : '1px solid var(--border)',
                      color: form.time ? 'var(--text)' : 'var(--text3)',
                      fontSize: 14,
                      fontFamily: 'var(--font-body)',
                      outline: 'none',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      paddingRight: 36,
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">Select time</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <Input label="Additional Notes" textarea placeholder="Any specific requirements..." value={form.notes} onChange={e => u('notes', e.target.value)} />

            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Button variant="primary" size="lg" full onClick={() => { if (validateStep2()) setStep(3); }}>
                Review & Pay →
              </Button>
              <Button variant="ghost" full onClick={() => setStep(1)}>← Back to Packages</Button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Confirm & Pay ── */}
        {step === 3 && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Order summary */}
            <div style={{ padding: 18, background: 'var(--bg3)', borderRadius: 16, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>ORDER SUMMARY</div>
              {[
                { label: 'Package', value: selectedPkg.label },
                { label: 'Sessions', value: `${selectedPkg.sessions} session${selectedPkg.sessions > 1 ? 's' : ''}` },
                { label: 'Trainer', value: trainer.name },
                { label: 'Date', value: form.date || 'TBD' },
                { label: 'Time', value: form.time || 'TBD' },
                ...(selectedPkg.original ? [{ label: 'Original price', value: `${selectedPkg.original.toLocaleString()} AED` }] : []),
                ...(selectedPkg.discount ? [{ label: 'Discount', value: selectedPkg.discount, accent: '#22c55e' }] : []),
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--text3)' }}>{row.label}</span>
                  <span style={{ fontWeight: 600, color: row.accent || 'var(--text)' }}>{row.value}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', marginTop: 6, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Total Due</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--accent)' }}>
                  {selectedPkg.price.toLocaleString()} AED
                </span>
              </div>
            </div>

            <div style={{
              padding: '12px 16px', borderRadius: 12,
              background: 'rgba(200,255,0,0.06)', border: '1px solid rgba(200,255,0,0.15)',
              fontSize: 13, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>🔒</span>
              <span>You'll be redirected to Stripe's secure checkout to complete payment.</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              full
              onClick={handlePaymentSubmit}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Redirecting to Stripe...' : `Pay ${selectedPkg.price.toLocaleString()} AED Securely →`}
            </Button>
            <Button variant="ghost" full onClick={() => setStep(2)}>← Back to Details</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
