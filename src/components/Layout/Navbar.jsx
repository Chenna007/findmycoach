import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';
import { supabase } from '../../lib/supabase';

const Navbar = ({ page, setPage, setShowAuth, hasBookings, user, isTrainer }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleNav = (p) => {
    setPage(p);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 24px", height: 72,
        background: scrolled ? "rgba(10,10,10,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all 0.4s ease",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ maxWidth: 1280, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => handleNav("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#000", fontFamily: "var(--font-display)" }}>F</div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>FindMyCoach</span>
          </div>
          
          {/* Desktop Links */}
          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {[
              { label: "Home", key: "home" },
              { label: "Trainers", key: "trainers" },
              isTrainer
                ? { label: "Trainer Portal", key: "trainer-dashboard" }
                : { label: "Become a Coach", key: "trainer-pricing" },
              ...(hasBookings ? [{ label: "My Bookings", key: "dashboard" }] : []),
            ].map(n => (
              <button key={n.key} onClick={() => handleNav(n.key)} style={{
                background: page === n.key ? "var(--card)" : "transparent",
                border: page === n.key ? "1px solid var(--border)" : "1px solid transparent",
                color: page === n.key ? "var(--text)" : "var(--text2)",
                padding: "8px 18px", borderRadius: 12, fontSize: 14, fontWeight: 500,
                cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.3s",
              }}>{n.label}</button>
            ))}
            {user ? (
              <Button variant="ghost" size="sm" onClick={async () => await supabase.auth.signOut()}>
                Logout ({user.user_metadata?.full_name?.split(' ')[0] || "User"})
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={() => { setShowAuth(true); setMobileMenuOpen(false); }}>Sign In</Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-only"
            style={{ display: "none", background: "transparent", border: "none", color: "var(--text)", fontSize: 24, cursor: "pointer" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
          <style>{`
            @media (max-width: 768px) {
              .mobile-only { display: block !important; }
            }
          `}</style>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: "fixed", top: 72, left: 0, right: 0, bottom: 0, zIndex: 999,
          background: "var(--bg)", display: "flex", flexDirection: "column", padding: 24, gap: 16
        }}>
          {[
            { label: "Home", key: "home" },
            { label: "Trainers", key: "trainers" },
            isTrainer
              ? { label: "Trainer Portal", key: "trainer-dashboard" }
              : { label: "Become a Coach", key: "trainer-pricing" },
            ...(hasBookings ? [{ label: "My Bookings", key: "dashboard" }] : []),
          ].map(n => (
            <button key={n.key} onClick={() => handleNav(n.key)} style={{
              background: page === n.key ? "var(--card)" : "transparent",
              border: page === n.key ? "1px solid var(--border)" : "1px solid transparent",
              color: page === n.key ? "var(--text)" : "var(--text2)",
              padding: "16px 24px", borderRadius: 12, fontSize: 18, fontWeight: 600,
              cursor: "pointer", fontFamily: "var(--font-body)", textAlign: "left"
            }}>{n.label}</button>
          ))}
          {user ? (
            <Button variant="outline" size="lg" full onClick={async () => { await supabase.auth.signOut(); setMobileMenuOpen(false); }} style={{ marginTop: 24, borderColor: "var(--border)", color: "var(--text)" }}>
              Logout ({user.user_metadata?.full_name?.split(' ')[0] || "User"})
            </Button>
          ) : (
            <Button variant="primary" size="lg" full onClick={() => { setShowAuth(true); setMobileMenuOpen(false); }} style={{ marginTop: 24 }}>Sign In</Button>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
