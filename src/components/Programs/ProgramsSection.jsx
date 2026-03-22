import React from 'react';
import Section from '../UI/Section';
import SectionTitle from '../UI/SectionTitle';
import GlassCard from '../UI/GlassCard';
import { PROGRAMS } from '../../data';

const ProgramsSection = ({ setPage, setGoalFilter }) => (
  <Section style={{ background: "var(--bg2)", borderRadius: 0, maxWidth: "100%", padding: "100px 24px" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <SectionTitle sub="Training Programs" title="What are you training for?" align="center" />
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 16,
      }}>
        {PROGRAMS.map((p, i) => (
          <GlassCard key={p.id} onClick={() => { setGoalFilter(p.title); setPage("trainers"); }}
            style={{ padding: 24, cursor: "pointer", animationDelay: `${i * 0.05}s` }} className="fade-up"
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{p.title}</div>
            <div style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.5 }}>{p.desc}</div>
            <div style={{ marginTop: 14, fontSize: 12, color: "var(--accent)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              Explore Coaches <span style={{ fontSize: 14 }}>→</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  </Section>
);

export default ProgramsSection;
