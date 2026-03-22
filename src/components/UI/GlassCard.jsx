import React from 'react';

const GlassCard = ({ children, style = {}, hover = true, onClick, className = "" }) => (
  <div
    className={className}
    onClick={onClick}
    style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      backdropFilter: "blur(20px)",
      transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}
    onMouseEnter={e => {
      if (hover) {
        e.currentTarget.style.background = "var(--card-hover)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.3)";
      }
    }}
    onMouseLeave={e => {
      if (hover) {
        e.currentTarget.style.background = "var(--card)";
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }
    }}
  >
    {children}
  </div>
);

export default GlassCard;
