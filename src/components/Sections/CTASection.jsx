import React from 'react';
import Section from '../UI/Section';
import GlassCard from '../UI/GlassCard';
import Badge from '../UI/Badge';
import Button from '../UI/Button';

const CTASection = ({ setPage }) => (
  <Section className="section-padding">
    <GlassCard hover={false} className="section-padding" style={{
      padding: "72px 48px", textAlign: "center", position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg, rgba(200,255,0,0.06) 0%, rgba(240,194,127,0.04) 100%)",
      border: "1px solid rgba(200,255,0,0.12)",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "radial-gradient(var(--accent) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }} />
      <div style={{ position: "relative" }}>
        <Badge variant="gold">✦ Join Our Network</Badge>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, marginTop: 20, lineHeight: 1.1 }}>
          Are you a fitness coach?
        </h2>
        <p style={{ fontSize: 17, color: "var(--text2)", marginTop: 16, maxWidth: 520, margin: "16px auto 0" }}>
          Join hundreds of coaches growing their business on FindMyCoach. Get discovered by thousands of clients.
        </p>
        <div style={{ marginTop: 32 }}>
          <Button variant="gold" size="lg" onClick={() => setPage("trainer-pricing")}>
            Join as a Coach →
          </Button>
        </div>
      </div>
    </GlassCard>
  </Section>
);

export default CTASection;
