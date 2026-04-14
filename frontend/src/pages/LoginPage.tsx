import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FloatingParticles } from "../components/aceternity/floating-particles";
import { SpotlightBackground } from "../components/aceternity/spotlight";
import { TypewriterText } from "../components/aceternity/typewriter";
import { GlowButton } from "../components/aceternity/glow-button";
import { GridBackground } from "../components/aceternity/grid-background";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { cn } from "../libs/utils";

/* ─────────────────────────────────────────────
   Micro-components
───────────────────────────────────────────── */

const FeatureChip = ({
  icon,
  label,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  delay: string;
}) => (
  <div
    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/60 text-xs font-medium"
    style={{ animation: `fadeUp 0.6s ease ${delay} both` }}
  >
    <span className="text-indigo-400">{icon}</span>
    {label}
  </div>
);

const StatCard = ({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: string;
}) => (
  <div
    className="flex flex-col gap-0.5"
    style={{ animation: `fadeUp 0.6s ease ${delay} both` }}
  >
    <span
      className="text-3xl font-light text-white"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      {value}
    </span>
    <span className="text-xs text-white/40 tracking-wide">{label}</span>
  </div>
);

/* ─────────────────────────────────────────────
   Floating label input
───────────────────────────────────────────── */

const FloatingInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  rightElement,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
  autoComplete?: string;
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const isActive = focused || hasValue;

  return (
    <div className="relative group">
      {/* Background glow on focus */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none",
          focused && "opacity-100"
        )}
        style={{
          background:
            "radial-gradient(ellipse at 50% 120%, rgba(99,102,241,0.15), transparent 70%)",
        }}
      />

      {/* Icon */}
      <div
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors duration-200",
          isActive ? "text-indigo-400" : "text-white/25"
        )}
      >
        {icon}
      </div>

      {/* Floating label */}
      <label
        htmlFor={id}
        className={cn(
          "absolute left-11 transition-all duration-200 pointer-events-none z-10 select-none",
          isActive
            ? "top-2.5 text-[10px] text-indigo-400 font-medium tracking-widest uppercase"
            : "top-1/2 -translate-y-1/2 text-sm text-white/30"
        )}
      >
        {label}
      </label>

      {/* Input */}
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ""}
        className={cn(
          "w-full h-14 pl-11 pr-11 pt-5 pb-1 rounded-xl text-sm text-white",
          "bg-white/5 border transition-all duration-200 outline-none",
          "placeholder:text-white/20",
          focused
            ? "border-indigo-500/70 bg-white/8 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
            : "border-white/10 hover:border-white/20"
        )}
      />

      {/* Right element */}
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
          {rightElement}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Login Page
───────────────────────────────────────────── */

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [checkAnim, setCheckAnim] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      setCheckAnim(true);
      setTimeout(() => navigate("/"), 600);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
      setLoading(false);
    }
  };

  const EyeIcon = () => (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="p-1.5 rounded-lg text-white/30 hover:text-white/70 transition-colors"
    >
      {showPassword ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );

  return (
    <>
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300&family=Outfit:wght@300;400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes shimmer-spin {
          from { transform: rotate(0deg) scale(1.5); }
          to { transform: rotate(360deg) scale(1.5); }
        }
        @keyframes shine-sweep {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes ripple-expand {
          to { transform: scale(25); opacity: 0; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes success-pop {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes orb-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.97); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#06050f",
          display: "flex",
          fontFamily: "'Outfit', system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Background layers ── */}
        <FloatingParticles count={50} color="99,102,241" />

        {/* Ambient orbs */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div style={{
            position: "absolute", top: "10%", left: "8%", width: 500, height: 500,
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
            borderRadius: "50%", animation: "orb-drift 12s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", bottom: "5%", right: "5%", width: 400, height: 400,
            background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
            borderRadius: "50%", animation: "orb-drift 16s ease-in-out infinite reverse",
          }} />
          <div style={{
            position: "absolute", top: "50%", left: "40%", width: 300, height: 300,
            background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
            borderRadius: "50%", animation: "orb-drift 20s ease-in-out infinite 5s",
          }} />
        </div>

        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)`,
          backgroundSize: "52px 52px",
          maskImage: "radial-gradient(ellipse 100% 100% at 50% 50%, black 20%, transparent 100%)",
          pointerEvents: "none",
        }} />

        {/* ══════════════════════════════════════
            LEFT PANEL — Brand
        ══════════════════════════════════════ */}
        <div style={{
          flex: "0 0 46%", display: "flex", alignItems: "center",
          justifyContent: "center", padding: "60px 52px", position: "relative", zIndex: 1,
        }}>
          <div style={{
            maxWidth: 380, width: "100%",
            opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(24px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}>

            {/* Logo + wordmark */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48, animation: "fadeUp 0.7s ease 0.1s both" }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: "linear-gradient(135deg, rgba(99,102,241,0.9) 0%, rgba(139,92,246,0.8) 100%)",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 20px rgba(99,102,241,0.4), 0 4px 24px rgba(0,0,0,0.5)",
              }}>
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <rect x="2" y="2" width="11" height="11" rx="3" fill="white" fillOpacity="0.95" />
                  <rect x="15" y="2" width="11" height="11" rx="3" fill="white" fillOpacity="0.55" />
                  <rect x="2" y="15" width="11" height="11" rx="3" fill="white" fillOpacity="0.55" />
                  <rect x="15" y="15" width="11" height="11" rx="3" fill="white" fillOpacity="0.25" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.95)", letterSpacing: "-0.2px" }}>
                  RentManager
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Property Platform
                </div>
              </div>
            </div>

            {/* Headline with typewriter */}
            <div style={{ marginBottom: 32, animation: "fadeUp 0.7s ease 0.2s both" }}>
              <h1 style={{
                fontSize: 46, fontWeight: 300, lineHeight: 1.1, margin: "0 0 16px",
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "rgba(255,255,255,0.93)",
                letterSpacing: "-1px",
              }}>
                Your properties,
                <br />
                <em style={{ color: "rgba(139,120,255,0.95)" }}>
                  <TypewriterText
                    words={["fully tracked.", "always on time.", "zero stress.", "smartly managed."]}
                  />
                </em>
              </h1>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, margin: 0, maxWidth: 320 }}>
                From rent collection to overdue alerts — one dashboard for everything a property owner needs.
              </p>
            </div>

            {/* Feature chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 44 }}>
              {[
                { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, label: "Auto rent cycles", delay: "0.35s" },
                { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>, label: "SMS reminders", delay: "0.45s" },
                { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, label: "Live dashboard", delay: "0.55s" },
                { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>, label: "Receipt uploads", delay: "0.65s" },
              ].map((f) => (
                <FeatureChip key={f.label} {...f} />
              ))}
            </div>

            {/* Stats */}
            <div style={{
              display: "flex", gap: 36,
              paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)",
              animation: "fadeUp 0.7s ease 0.5s both",
            }}>
              <StatCard value="∞" label="Properties" delay="0.6s" />
              <StatCard value="0" label="Missed alerts" delay="0.7s" />
              <StatCard value="24/7" label="Automation" delay="0.8s" />
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════
            RIGHT PANEL — Form
        ══════════════════════════════════════ */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "48px 40px", position: "relative", zIndex: 1,
        }}>

          {/* Vertical separator */}
          <div style={{
            position: "absolute", left: 0, top: "10%", bottom: "10%", width: 1,
            background: "linear-gradient(180deg, transparent, rgba(99,102,241,0.25) 40%, rgba(99,102,241,0.25) 60%, transparent)",
          }} />

          {/* Form card */}
          <div style={{
            width: "100%", maxWidth: 420,
            opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(28px)",
            transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s",
          }}>

            {/* Card with shimmer border */}
            <div style={{
              position: "relative", padding: 1, borderRadius: 20,
              background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(99,102,241,0.05) 50%, rgba(99,102,241,0.3))",
            }}>
              {/* Shimmer ring */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 20, overflow: "hidden",
                pointerEvents: "none",
              }}>
                <div style={{
                  position: "absolute", inset: "-100%",
                  background: "conic-gradient(from 0deg, transparent 0deg, rgba(99,102,241,0.5) 60deg, transparent 120deg)",
                  animation: "shimmer-spin 4s linear infinite",
                }} />
              </div>

              {/* Card inner */}
              <div style={{
                background: "rgba(8,7,20,0.92)", borderRadius: 19, padding: "40px 36px",
                backdropFilter: "blur(24px)",
                position: "relative", zIndex: 1,
              }}>

                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px",
                    background: "rgba(99,102,241,0.15)", borderRadius: 100,
                    border: "1px solid rgba(99,102,241,0.3)", marginBottom: 16,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8", animation: "blink 2s step-end infinite" }} />
                    <span style={{ fontSize: 11, color: "#a5b4fc", letterSpacing: "0.08em", fontWeight: 500 }}>
                      SECURE LOGIN
                    </span>
                  </div>

                  <h2 style={{
                    fontSize: 28, fontWeight: 300, margin: "0 0 8px",
                    color: "rgba(255,255,255,0.92)",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    letterSpacing: "-0.5px",
                  }}>
                    Welcome back
                  </h2>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", margin: 0 }}>
                    Sign in to your property dashboard
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  <FloatingInput
                    id="email"
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    autoComplete="email"
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    }
                  />

                  <FloatingInput
                    id="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                    }
                    rightElement={<EyeIcon />}
                  />

                  {/* Remember + Forgot */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <div style={{ position: "relative", width: 16, height: 16 }}>
                        <input type="checkbox" style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer" }} />
                        <div style={{
                          width: 16, height: 16, borderRadius: 4, border: "1px solid rgba(255,255,255,0.15)",
                          background: "rgba(255,255,255,0.05)",
                        }} />
                      </div>
                      <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)" }}>Remember me</span>
                    </label>
                    <button type="button" style={{
                      background: "none", border: "none", padding: 0, cursor: "pointer",
                      fontSize: 12.5, color: "#818cf8", fontFamily: "'Outfit', sans-serif",
                      fontWeight: 500,
                    }}>
                      Forgot password?
                    </button>
                  </div>

                  {/* Error */}
                  {error && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                      background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                      borderRadius: 12, fontSize: 13.5, color: "#fca5a5",
                      animation: "fadeIn 0.3s ease",
                    }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <GlowButton
                    type="submit"
                    disabled={loading || checkAnim}
                    style={{
                      width: "100%", height: 52, borderRadius: 14, marginTop: 4,
                      background: checkAnim
                        ? "linear-gradient(135deg, #10b981, #059669)"
                        : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      color: "#fff", border: "none", fontSize: 15, fontWeight: 500,
                      fontFamily: "'Outfit', sans-serif", letterSpacing: "0.01em",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "background 0.4s ease",
                    }}
                  >
                    {checkAnim ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 8, animation: "success-pop 0.4s ease" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Signed in!
                      </span>
                    ) : loading ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{
                          width: 16, height: 16, border: "2px solid rgba(255,255,255,0.25)",
                          borderTopColor: "#fff", borderRadius: "50%",
                          display: "inline-block", animation: "shimmer-spin 0.7s linear infinite",
                        }} />
                        Signing in...
                      </span>
                    ) : (
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        Sign in
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </span>
                    )}
                  </GlowButton>

                </form>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0 20px" }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                  <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>
                    NO ACCOUNT YET?
                  </span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                </div>

                {/* Register hint */}
                <div style={{
                  padding: "14px 16px", background: "rgba(99,102,241,0.06)",
                  borderRadius: 12, border: "1px solid rgba(99,102,241,0.15)",
                }}>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0, lineHeight: 1.6, textAlign: "center" }}>
                    Register via{" "}
                    <code style={{
                      background: "rgba(99,102,241,0.2)", borderRadius: 5, padding: "1px 7px",
                      fontSize: 11, color: "#a5b4fc", fontFamily: "'Courier New', monospace",
                    }}>
                      POST /api/auth/register
                    </code>
                    {" "}or ask your admin
                  </p>
                </div>

              </div>
            </div>

            {/* Below card — trust badges */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 20, marginTop: 24,
              animation: "fadeUp 0.7s ease 0.7s both",
            }}>
              {[
                { icon: "🔒", label: "JWT Secured" },
                { icon: "⚡", label: "Fast Auth" },
                { icon: "🛡️", label: "Bcrypt Hashed" },
              ].map((b) => (
                <div key={b.label} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: 11, color: "rgba(255,255,255,0.22)",
                }}>
                  <span style={{ fontSize: 12 }}>{b.icon}</span>
                  {b.label}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
