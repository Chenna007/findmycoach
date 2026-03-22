import React from 'react';

const SectionTitle = ({ sub, title, align = "left" }) => (
  <div style={{ marginBottom: 48, textAlign: align }}>
    <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "var(--font-display)" }}>{sub}</p>
    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, lineHeight: 1.15, color: "var(--text)" }}>{title}</h2>
  </div>
);

export default SectionTitle;
