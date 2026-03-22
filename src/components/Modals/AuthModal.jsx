import React, { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { supabase } from '../../lib/supabase';

const AuthModal = ({ onClose }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async () => {
    if (!supabase) return alert("Backend is missing database keys.");
    setLoading(true);
    setErrorMsg("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: { data: { full_name: name } }
        });
        if (error) throw error;
        alert("Success! Your account was securely created.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: pass
        });
        if (error) throw error;
        onClose(); // App.jsx will catch onAuthStateChange globally
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }} onClick={onClose}>
      <div className="scale-in" onClick={e => e.stopPropagation()} style={{
        background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 24,
        padding: 36, maxWidth: 420, width: "90%",
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: "var(--accent)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: "#000", fontFamily: "var(--font-display)", marginBottom: 16 }}>F</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800 }}>{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
          <p style={{ fontSize: 14, color: "var(--text3)", marginTop: 6 }}>
            {mode === "login" ? "Sign in to your FindMyCoach account" : "Join the FindMyCoach community"}
          </p>
        </div>

        {/* Google button */}
        <button 
          onClick={async () => {
            if (!supabase) return alert("Backend is missing database keys.");
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: window.location.origin }
            });
            if (error) setErrorMsg(error.message);
            setLoading(false);
          }}
          style={{
          width: "100%", padding: "12px 20px", borderRadius: 14,
          background: "var(--bg3)", border: "1px solid var(--border)",
          color: "var(--text)", fontSize: 14, fontWeight: 600,
          cursor: "pointer", fontFamily: "var(--font-body)", marginBottom: 20,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          transition: "all 0.3s",
        }} onMouseEnter={e => e.target.style.borderColor = "var(--accent)"} onMouseLeave={e => e.target.style.borderColor = "var(--border)"}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        {errorMsg && (
          <div style={{ padding: 12, background: "rgba(255, 60, 60, 0.1)", color: "#ff5050", borderRadius: 8, fontSize: 13, marginBottom: 16, border: "1px solid rgba(255, 60, 60, 0.2)" }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--text3)" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <Input label="Full Name" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          )}
          <Input label="Email" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="Password" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
        </div>

        <Button variant="primary" size="lg" full onClick={handleAuth} disabled={loading} style={{ marginTop: 20, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Authenticating..." : mode === "login" ? "Sign In" : "Create Account"}
        </Button>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text3)" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}>
            {mode === "login" ? "Sign Up" : "Sign In"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
