import React, { useState } from 'react';
import Section from '../components/UI/Section';
import SectionTitle from '../components/UI/SectionTitle';
import GlassCard from '../components/UI/GlassCard';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import { PROGRAMS, TRAINERS } from '../data';

const TrainersPage = ({ setPage, setSelectedTrainer, goalFilter, setGoalFilter }) => {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [locFilter, setLocFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);

  const filtered = TRAINERS.filter(t => {
    if (goalFilter && !t.programs.includes(goalFilter) && !t.spec.toLowerCase().includes(goalFilter.toLowerCase())) return false;
    if (t.price < priceRange[0] || t.price > priceRange[1]) return false;
    if (locFilter && t.location !== locFilter) return false;
    if (ratingFilter && t.rating < ratingFilter) return false;
    return true;
  });

  return (
    <div style={{ paddingTop: 96, minHeight: "100vh" }}>
      <Section>
        <SectionTitle sub="Browse" title="Find Your Perfect Coach" />
        <div className="sidebar-layout" style={{ gap: 30 }}>
          {/* Sidebar */}
          <div>
            <GlassCard hover={false} style={{ padding: 24, position: "sticky", top: 96 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 24 }}>Filters</h3>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600, marginBottom: 8, display: "block" }}>Goal</label>
                <select value={goalFilter} onChange={e => setGoalFilter(e.target.value)} style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, background: "var(--bg3)",
                  border: "1px solid var(--border)", color: "var(--text)", fontSize: 13, fontFamily: "var(--font-body)", outline: "none",
                }}>
                  <option value="">All Programs</option>
                  {PROGRAMS.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600, marginBottom: 8, display: "block" }}>
                  Max Price: <span style={{ color: "var(--accent)" }}>{priceRange[1]} AED</span>
                </label>
                <input type="range" min="100" max="500" value={priceRange[1]} onChange={e => setPriceRange([0, +e.target.value])} style={{ width: "100%", accentColor: "var(--accent)" }} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600, marginBottom: 8, display: "block" }}>Location</label>
                <select value={locFilter} onChange={e => setLocFilter(e.target.value)} style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, background: "var(--bg3)",
                  border: "1px solid var(--border)", color: "var(--text)", fontSize: 13, fontFamily: "var(--font-body)", outline: "none",
                }}>
                  <option value="">All Locations</option>
                  {[...new Set(TRAINERS.map(t => t.location))].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600, marginBottom: 8, display: "block" }}>Min Rating</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[0, 4.5, 4.7, 4.9].map(r => (
                    <button key={r} onClick={() => setRatingFilter(r)} style={{
                      padding: "6px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                      border: ratingFilter === r ? "1px solid var(--accent)" : "1px solid var(--border)",
                      background: ratingFilter === r ? "var(--accent-glow)" : "var(--bg3)",
                      color: ratingFilter === r ? "var(--accent)" : "var(--text3)",
                      cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.2s",
                    }}>
                      {r === 0 ? "All" : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="ghost" size="sm" full onClick={() => { setGoalFilter(""); setLocFilter(""); setRatingFilter(0); setPriceRange([0,500]); }}>
                Clear All Filters
              </Button>
            </GlassCard>
          </div>

          {/* Grid */}
          <div>
            <div style={{ fontSize: 14, color: "var(--text3)", marginBottom: 20 }}>{filtered.length} coaches found</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {filtered.map((t, i) => (
                <GlassCard key={t.id} style={{ overflow: "hidden", animationDelay: `${i * 0.05}s` }} className="fade-up">
                  <div style={{ position: "relative" }}>
                    <img src={t.img} alt={t.name} style={{ width: "100%", height: 200, objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
                    <div style={{ position: "absolute", top: 12, right: 12 }}><Badge variant="accent">★ {t.rating}</Badge></div>
                    <div style={{ position: "absolute", bottom: 12, left: 16 }}>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>{t.location}</div>
                    </div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{t.name}</h3>
                    <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 4 }}>{t.spec}</p>
                    <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16 }}>{t.exp} experience</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div>
                        <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--accent)" }}>{t.price}</span>
                        <span style={{ fontSize: 12, color: "var(--text3)" }}> AED</span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text3)" }}>{t.reviews} reviews</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button variant="secondary" size="sm" style={{ flex: 1 }} onClick={() => { setSelectedTrainer(t); setPage("trainer-profile"); }}>
                        View Profile
                      </Button>
                      <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => { setSelectedTrainer(t); setPage("trainer-profile"); }}>
                        Book Now
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "var(--text3)" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>No coaches found</div>
                <div style={{ fontSize: 14, marginTop: 8 }}>Try adjusting your filters</div>
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default TrainersPage;
