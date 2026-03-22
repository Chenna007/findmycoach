import React from 'react';
import Section from '../components/UI/Section';
import GlassCard from '../components/UI/GlassCard';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import Star from '../components/UI/Star';
import { PROGRAMS, PACKAGES } from '../data';

const TrainerProfile = ({ trainer, setShowBooking }) => {
  if (!trainer) return null;
  const reviewData = [
    { name: "Sarah K.", text: "Absolutely incredible trainer. Transformed my fitness in 3 months!", rating: 5 },
    { name: "Mike D.", text: "Very professional and knowledgeable. Highly recommend!", rating: 5 },
    { name: "Amira R.", text: "Best investment in my health. Results speak for themselves.", rating: 5 },
  ];
  return (
    <div style={{ paddingTop: 72, minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{
        position: "relative", height: 400, overflow: "hidden",
        background: `linear-gradient(to bottom, transparent, var(--bg))`,
      }}>
        <img src={trainer.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3, filter: "blur(30px) saturate(1.5)", transform: "scale(1.2)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, var(--bg) 100%)" }} />
      </div>

      <Section style={{ marginTop: -200, position: "relative" }}>
        <div className="profile-grid" style={{ gap: 40, alignItems: "start" }}>
          {/* Left column */}
          <div className="fade-up">
            <GlassCard hover={false} style={{ padding: 28, textAlign: "center" }}>
              <img src={trainer.img} alt={trainer.name} style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", border: "4px solid var(--accent)", margin: "0 auto 20px" }} />
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800 }}>{trainer.name}</h1>
              <p style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600, marginTop: 6 }}>{trainer.spec}</p>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 12 }}>
                <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(i => <Star key={i} filled={i <= trainer.rating} />)}</div>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{trainer.rating}</span>
                <span style={{ fontSize: 12, color: "var(--text3)" }}>({trainer.reviews})</span>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "center", flexWrap: "wrap" }}>
                <Badge variant="accent">📍 {trainer.location}</Badge>
                <Badge>🎯 {trainer.exp}</Badge>
              </div>
              <div style={{ marginTop: 20, padding: "16px 0", borderTop: "1px solid var(--border)" }}>
                <div style={{ fontSize: 14, color: "var(--text3)" }}>Starting from</div>
                <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                  {trainer.price} <span style={{ fontSize: 16, color: "var(--text3)", fontWeight: 400 }}>AED/session</span>
                </div>
              </div>
              <Button variant="primary" size="lg" full onClick={() => setShowBooking(true)} style={{ marginTop: 8 }}>
                Request Booking
              </Button>
            </GlassCard>
          </div>

          {/* Right column */}
          <div className="fade-up" style={{ animationDelay: "0.15s" }}>
            {/* About */}
            <GlassCard hover={false} style={{ padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, marginBottom: 16 }}>About</h2>
              <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.8 }}>{trainer.bio}</p>
            </GlassCard>

            {/* Programs */}
            <GlassCard hover={false} style={{ padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, marginBottom: 16 }}>Programs Offered</h2>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {trainer.programs.map(p => {
                  const prog = PROGRAMS.find(pr => pr.title === p);
                  return (
                    <div key={p} style={{
                      padding: "10px 18px", borderRadius: 14,
                      background: "var(--bg3)", border: "1px solid var(--border)",
                      fontSize: 14, fontWeight: 500,
                    }}>
                      {prog?.icon} {p}
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Packages */}
            <GlassCard hover={false} style={{ padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, marginBottom: 16 }}>Pricing Packages</h2>
              <div className="grid-2" style={{ gap: 12 }}>
                {PACKAGES.map(pk => (
                  <div key={pk.name} style={{
                    padding: 20, borderRadius: "var(--radius-sm)",
                    background: "var(--bg3)", border: "1px solid var(--border)",
                    position: "relative", overflow: "hidden",
                  }}>
                    {pk.discount > 0 && (
                      <div style={{
                        position: "absolute", top: 8, right: 8,
                        background: "var(--accent)", color: "#000", fontSize: 11,
                        fontWeight: 700, padding: "2px 8px", borderRadius: 8,
                      }}>-{pk.discount}%</div>
                    )}
                    <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 6 }}>{pk.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text3)" }}>{pk.sessions} session{pk.sessions > 1 ? "s" : ""}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--accent)", marginTop: 8 }}>
                      {Math.round(trainer.price * pk.sessions * (1 - pk.discount / 100))}
                      <span style={{ fontSize: 13, color: "var(--text3)", fontWeight: 400 }}> AED</span>
                    </div>
                    {pk.discount > 0 && (
                      <div style={{ fontSize: 12, color: "var(--text3)", textDecoration: "line-through" }}>
                        {trainer.price * pk.sessions} AED
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Availability */}
            <GlassCard hover={false} style={{ padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, marginBottom: 16 }}>Availability</h2>
              <div className="week-grid" style={{ gap: 8 }}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                  <div key={d} style={{
                    textAlign: "center", padding: "12px 8px", borderRadius: 12,
                    background: i < 5 ? "var(--accent-glow)" : "var(--bg3)",
                    border: `1px solid ${i < 5 ? "rgba(200,255,0,0.15)" : "var(--border)"}`,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: i < 5 ? "var(--accent)" : "var(--text3)" }}>{d}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4 }}>{i < 5 ? "6am–9pm" : i === 5 ? "8am–2pm" : "Off"}</div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Reviews */}
            <GlassCard hover={false} style={{ padding: 28 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, marginBottom: 16 }}>Reviews</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {reviewData.map((r, i) => (
                  <div key={i} style={{ padding: 20, background: "var(--bg3)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                      <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(j => <Star key={j} filled={j <= r.rating} />)}</div>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>{r.text}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default TrainerProfile;
