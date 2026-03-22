import React from 'react';

const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: { background: "var(--card)", color: "var(--text2)", border: "1px solid var(--border)" },
    accent: { background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid rgba(200,255,0,0.2)" },
    gold: { background: "rgba(240,194,127,0.1)", color: "var(--gold)", border: "1px solid rgba(240,194,127,0.2)" },
  };
  return (
    <span style={{ ...styles[variant], padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, letterSpacing: 0.5, display: "inline-flex", alignItems: "center", gap: 4 }}>
      {children}
    </span>
  );
};

export default Badge;
