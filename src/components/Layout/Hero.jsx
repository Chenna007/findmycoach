import React, { useState } from 'react';
import Badge from '../UI/Badge';
import Star from '../UI/Star';
import { PROGRAMS, TRAINERS } from '../../data';

const Hero = ({ setPage, setGoalFilter }) => {
  const [goal, setGoal] = useState("");
  const [loc, setLoc] = useState("");
  
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 24px 60px",
      background: `radial-gradient(ellipse at 20% 50%, rgba(200,255,0,0.06) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 20%, rgba(240,194,127,0.04) 0%, transparent 50%),
                    var(--bg)`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="hero-grid" style={{ maxWidth: 1280, margin: "0 auto", width: "100%", gap: 60, alignItems: "center", position: "relative", paddingTop: 40 }}>
        <div className="fade-up">
          <Badge variant="accent">✦ #1 Fitness Marketplace in the UAE</Badge>
          <h1 className="hero-title" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 900, lineHeight: 1.05, marginTop: 24, letterSpacing: -2 }}>
            Find.<br />Book.<br />
            <span style={{ color: "var(--accent)", textShadow: "0 0 60px rgba(200,255,0,0.3)" }}>Train.</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--text2)", marginTop: 20, lineHeight: 1.7, maxWidth: 480 }}>
            Find the right fitness coach near you or online. Personalized training, real results.
          </p>

          <div className="flex-col-mobile" style={{ marginTop: 36, display: "flex", gap: 0, background: "var(--bg3)", borderRadius: 18, border: "1px solid var(--border)", overflow: "hidden", maxWidth: 560 }}>
            <select value={goal} onChange={e => setGoal(e.target.value)} style={{ flex: 1, padding: "16px 20px", background: "transparent", border: "none", color: goal ? "var(--text)" : "var(--text3)", fontSize: 14, fontFamily: "var(--font-body)", outline: "none", borderRight: "1px solid var(--border)", appearance: "none" }}>
              <option value="">Goal</option>
              {PROGRAMS.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
            </select>
            <select value={loc} onChange={e => setLoc(e.target.value)} style={{ flex: 1, padding: "16px 20px", background: "transparent", border: "none", color: loc ? "var(--text)" : "var(--text3)", fontSize: 14, fontFamily: "var(--font-body)", outline: "none", borderRight: "1px solid var(--border)", appearance: "none" }}>
              <option value="">Location</option>
              {["Dubai Marina", "Downtown Dubai", "JBR", "Online", "JLT", "Business Bay", "DIFC", "Palm Jumeirah"].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <button onClick={() => { setGoalFilter(goal); setPage("trainers"); }} style={{ padding: "16px 28px", background: "var(--accent)", border: "none", color: "#000", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "var(--font-display)", transition: "all 0.3s", letterSpacing: 0.3 }}>
              Find a Coach →
            </button>
          </div>

          <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex" }}>
              {TRAINERS.slice(0, 4).map((t, i) => (
                <img key={t.id} src={t.img} alt="" style={{ width: 38, height: 38, borderRadius: "50%", border: "3px solid var(--bg)", marginLeft: i ? -12 : 0, objectFit: "cover" }} />
              ))}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>500+ Active Coaches</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>Across the UAE & Online</div>
            </div>
          </div>
        </div>

        <div className="fade-in" style={{ position: "relative", animationDelay: "0.3s" }}>
          <div style={{ borderRadius: 32, overflow: "hidden", aspectRatio: "4/5", position: "relative", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}>
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=750&fit=crop" alt="Fitness" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
          </div>

          <div className="hide-mobile" style={{ position: "absolute", top: 30, left: -40, background: "rgba(20,20,20,0.85)", backdropFilter: "blur(20px)", borderRadius: 18, padding: "16px 22px", border: "1px solid var(--glass-border)", animation: "float 4s ease-in-out infinite" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--accent)" }}>4.9</span>
              <div>
                <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(i => <Star key={i} filled />)}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>1,200+ Reviews</div>
              </div>
            </div>
          </div>

          <div className="hide-mobile" style={{ position: "absolute", bottom: 80, right: -30, background: "rgba(20,20,20,0.85)", backdropFilter: "blur(20px)", borderRadius: 18, padding: "16px 20px", border: "1px solid var(--glass-border)", animation: "float 5s ease-in-out infinite", animationDelay: "1s" }}>
            <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Popular Now</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>🥊 Boxing & Kickboxing</div>
            <div style={{ fontSize: 12, color: "var(--accent)", marginTop: 4 }}>32 coaches available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
