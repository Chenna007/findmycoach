import React from 'react';

const Footer = () => (
  <footer style={{
    padding: "60px 24px 30px", borderTop: "1px solid var(--border)",
    background: "var(--bg)",
  }}>
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div className="footer-grid" style={{ marginBottom: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#000", fontFamily: "var(--font-display)" }}>F</div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800 }}>FindMyCoach</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--text3)", lineHeight: 1.7, maxWidth: 300 }}>
            The premier marketplace connecting fitness enthusiasts with world-class coaches.
          </p>
        </div>
        {[
          { title: "Platform", links: ["Find Coaches", "Programs", "Pricing", "Reviews"] },
          { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
          { title: "Support", links: ["Help Center", "Contact", "Privacy", "Terms"] },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 16, color: "var(--text)" }}>{col.title}</h4>
            {col.links.map(l => (
              <div key={l} style={{ fontSize: 13, color: "var(--text3)", marginBottom: 10, cursor: "pointer", transition: "color 0.3s" }}
                onMouseEnter={e => e.target.style.color = "var(--text)"} onMouseLeave={e => e.target.style.color = "var(--text3)"}>
                {l}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex-col-mobile" style={{ borderTop: "1px solid var(--border)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 12, color: "var(--text3)" }}>© 2026 FindMyCoach. All rights reserved.</div>
        <div style={{ fontSize: 12, color: "var(--text3)" }}>Made with 💚 in Dubai</div>
      </div>
    </div>
  </footer>
);

export default Footer;
