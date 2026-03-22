import React from 'react';

const Input = ({ label, type = "text", placeholder, value, onChange, textarea, options, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500 }}>{label}</label>}
    {options ? (
      <select value={value} onChange={onChange} style={{
        padding: "12px 16px", borderRadius: "var(--radius-xs)", background: "var(--bg3)",
        border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)",
        outline: "none", transition: "border 0.3s", appearance: "none",
        ...style,
      }}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : textarea ? (
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} style={{
        padding: "12px 16px", borderRadius: "var(--radius-xs)", background: "var(--bg3)",
        border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)",
        outline: "none", resize: "vertical", transition: "border 0.3s",
        ...style,
      }} onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
    ) : (
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{
        padding: "12px 16px", borderRadius: "var(--radius-xs)", background: "var(--bg3)",
        border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)",
        outline: "none", transition: "border 0.3s",
        colorScheme: "dark",
        WebkitColorScheme: "dark",
        ...style,
      }} onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
    )}
  </div>
);

export default Input;
