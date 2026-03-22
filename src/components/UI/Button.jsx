import React from 'react';

const Button = ({ children, variant = "primary", size = "md", onClick, style = {}, full }) => {
  const base = {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    borderRadius: 14,
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "none",
    letterSpacing: 0.3,
    width: full ? "100%" : "auto",
  };
  const sizes = {
    sm: { padding: "8px 18px", fontSize: 13 },
    md: { padding: "12px 28px", fontSize: 14 },
    lg: { padding: "16px 36px", fontSize: 16 },
  };
  const variants = {
    primary: {
      background: "var(--accent)",
      color: "#000",
      boxShadow: "0 0 30px rgba(200,255,0,0.2)",
    },
    secondary: {
      background: "var(--card)",
      color: "var(--text)",
      border: "1px solid var(--border)",
      backdropFilter: "blur(10px)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text2)",
      border: "1px solid var(--border)",
    },
    gold: {
      background: "linear-gradient(135deg, var(--gold), var(--gold2))",
      color: "#000",
      boxShadow: "0 0 30px rgba(240,194,127,0.2)",
    },
  };
  return (
    <button
      onClick={onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={e => {
        e.target.style.transform = "translateY(-2px)";
        if (variant === "primary") e.target.style.boxShadow = "0 0 50px rgba(200,255,0,0.35)";
      }}
      onMouseLeave={e => {
        e.target.style.transform = "translateY(0)";
        if (variant === "primary") e.target.style.boxShadow = "0 0 30px rgba(200,255,0,0.2)";
      }}
    >
      {children}
    </button>
  );
};

export default Button;
