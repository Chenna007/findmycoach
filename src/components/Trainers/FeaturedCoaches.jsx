import React, { useRef } from 'react';
import Section from '../UI/Section';
import SectionTitle from '../UI/SectionTitle';
import GlassCard from '../UI/GlassCard';
import Badge from '../UI/Badge';
import Button from '../UI/Button';
import { TRAINERS } from '../../data';

const FeaturedCoaches = ({ setPage, setSelectedTrainer }) => {
  const scrollRef = useRef(null);
  return (
    <Section>
      <SectionTitle sub="Top Rated" title="Featured Coaches" />
      <div ref={scrollRef} style={{
        display: "flex", gap: 20, overflowX: "auto", paddingBottom: 20,
        scrollSnapType: "x mandatory", scrollbarWidth: "none",
      }}>
        {TRAINERS.slice(0, 6).map((t, i) => (
          <GlassCard key={t.id} style={{
            minWidth: 280, scrollSnapAlign: "start",
            animationDelay: `${i * 0.1}s`, padding: 0, overflow: "hidden",
          }} className="fade-up">
            <div style={{ position: "relative" }}>
              <img src={t.img} alt={t.name} style={{ width: "100%", height: 220, objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", top: 12, right: 12 }}>
                <Badge variant="accent">★ {t.rating}</Badge>
              </div>
            </div>
            <div style={{ padding: 20 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{t.name}</h3>
              <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 12 }}>{t.spec}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--accent)" }}>{t.price}</span>
                  <span style={{ fontSize: 12, color: "var(--text3)" }}> AED/session</span>
                </div>
                <Button size="sm" variant="primary" onClick={() => { setSelectedTrainer(t); setPage("trainer-profile"); }}>
                  Book Now
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
};

export default FeaturedCoaches;
