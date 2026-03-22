import React, { useState } from 'react';
import Section from '../components/UI/Section';
import Badge from '../components/UI/Badge';
import GlassCard from '../components/UI/GlassCard';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { PROGRAMS } from '../data';
import { supabase } from '../lib/supabase';

const BecomeCoachPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", spec: "", exp: "", price: "", location: "", bio: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    if (supabase) {
      const { error } = await supabase.from('trainer_applications').insert([form]);
      if (error) {
        alert("Failed to save application: " + error.message);
        setLoading(false);
        return;
      }
    } else {
      console.log("Simulating backend save since Supabase keys are missing:", form);
      // Simulate network delay
      await new Promise(r => setTimeout(r, 1000));
    }
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ paddingTop: 120, minHeight: "100vh", textAlign: "center" }}>
        <Section>
          <div className="scale-in" style={{ maxWidth: 500, margin: "0 auto" }}>
            <div style={{ fontSize: 72, marginBottom: 24 }}>🎉</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Application Submitted!</h1>
            <p style={{ fontSize: 17, color: "var(--text2)", lineHeight: 1.7 }}>
              Thank you for your interest in joining FindMyCoach. Our team will review your application and get back to you within 48 hours.
            </p>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 96, minHeight: "100vh" }}>
      <Section>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="fade-up" style={{ textAlign: "center", marginBottom: 48 }}>
            <Badge variant="gold">✦ Coach Application</Badge>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, marginTop: 16 }}>
              Grow Your Coaching Business
            </h1>
            <p style={{ fontSize: 17, color: "var(--text2)", marginTop: 12, lineHeight: 1.7 }}>
              Join our network of elite fitness professionals and connect with thousands of potential clients.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid-3" style={{ marginBottom: 48 }}>
            {[
              { icon: "👥", title: "5000+ Clients", desc: "Active users" },
              { icon: "💰", title: "Zero Commission", desc: "For first 3 months" },
              { icon: "📈", title: "Growth Tools", desc: "Analytics & insights" },
            ].map(b => (
              <GlassCard key={b.title} hover={false} style={{ padding: 20, textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{b.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>{b.desc}</div>
              </GlassCard>
            ))}
          </div>

          <GlassCard hover={false} style={{ padding: 36 }} className="fade-up section-padding">
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, marginBottom: 28 }}>Coach Application</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="grid-2">
                <Input label="Full Name *" placeholder="Your name" value={form.name} onChange={e => u("name", e.target.value)} />
                <Input label="Email *" type="email" placeholder="coach@email.com" value={form.email} onChange={e => u("email", e.target.value)} />
              </div>
              <div className="grid-2">
                <Input label="Phone *" placeholder="+971..." value={form.phone} onChange={e => u("phone", e.target.value)} />
                <Input label="Location" value={form.location} onChange={e => u("location", e.target.value)}
                  options={["Dubai Marina", "Downtown Dubai", "JBR", "JLT", "Business Bay", "DIFC", "Palm Jumeirah", "Online"]} />
              </div>
              <Input label="Specialization *" value={form.spec} onChange={e => u("spec", e.target.value)}
                options={PROGRAMS.map(p => p.title)} />
              <div className="grid-2">
                <Input label="Years of Experience" value={form.exp} onChange={e => u("exp", e.target.value)}
                  options={["1-2 years", "3-5 years", "5-8 years", "8-10 years", "10+ years"]} />
                <Input label="Price per Session (AED)" type="number" placeholder="e.g. 250" value={form.price} onChange={e => u("price", e.target.value)} />
              </div>
              <Input label="Bio / About You" textarea placeholder="Tell us about your experience, certifications, and coaching philosophy..." value={form.bio} onChange={e => u("bio", e.target.value)} />
            </div>
            <Button variant="gold" size="lg" full onClick={handleSubmit} style={{ marginTop: 28, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Submitting..." : "Submit Application →"}
            </Button>
          </GlassCard>
        </div>
      </Section>
    </div>
  );
};

export default BecomeCoachPage;
