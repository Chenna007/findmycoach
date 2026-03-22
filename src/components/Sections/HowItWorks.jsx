import React from 'react';
import Section from '../UI/Section';
import SectionTitle from '../UI/SectionTitle';
import GlassCard from '../UI/GlassCard';

const HowItWorks = () => {
  const steps = [
    { num: "01", icon: "🔍", title: "Search", desc: "Browse coaches by specialty, location, or budget." },
    { num: "02", icon: "⚖️", title: "Compare", desc: "View profiles, read reviews, and compare pricing." },
    { num: "03", icon: "📅", title: "Book", desc: "Request a session and start training." },
  ];
  return (
    <Section className="section-padding" style={{ background: "var(--bg2)", maxWidth: "100%", borderRadius: 0, padding: "100px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionTitle sub="How It Works" title="Start training in 3 simple steps" align="center" />
        <div className="grid-3">
          {steps.map((s, i) => (
            <GlassCard key={i} style={{ padding: 40, textAlign: "center", position: "relative", overflow: "hidden" }} className="fade-up">
              <div style={{
                position: "absolute", top: -10, right: 10, fontSize: 100, fontWeight: 900,
                fontFamily: "var(--font-display)", color: "rgba(200,255,0,0.04)", lineHeight: 1,
              }}>{s.num}</div>
              <div style={{ fontSize: 48, marginBottom: 20 }}>{s.icon}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7 }}>{s.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default HowItWorks;
