import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const features = [
  { icon: "🛡️", title: "AI-Powered Risk Analysis", desc: "Every complaint is instantly scored using our AI engine to detect crime type and severity." },
  { icon: "📁", title: "Evidence Upload", desc: "Securely attach screenshots, documents, or files as evidence with your complaint." },
  { icon: "📊", title: "Real-Time Dashboard", desc: "Track your complaint status live. Admins get full analytics with charts and priority alerts." },
  { icon: "🔔", title: "Instant Alerts", desc: "Critical cases trigger immediate email alerts to our cyber crime response team." },
  { icon: "🔒", title: "Secure & Private", desc: "Your data is encrypted and protected. Only authorized personnel can access case details." },
  { icon: "⚡", title: "Fast Resolution", desc: "Priority-based case management ensures high-risk complaints are handled first." },
];

const stats = [
  { value: "10K+", label: "Complaints Resolved" },
  { value: "98%", label: "Detection Accuracy" },
  { value: "24/7", label: "System Uptime" },
  { value: "500+", label: "Cases This Month" },
];

const mockCases = [
  { id: "CASE-001", type: "Financial Fraud", risk: 92, priority: "Critical", color: "#ef4444" },
  { id: "CASE-002", type: "Account Hacking", risk: 74, priority: "High", color: "#f59e0b" },
  { id: "CASE-003", type: "Identity Theft", risk: 61, priority: "Medium", color: "#3b82f6" },
  { id: "CASE-004", type: "Cyber Harassment", risk: 45, priority: "Low", color: "#10b981" },
];

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (token && user) {
      navigate(user.role === "admin" ? "/dashboard" : "/user-dashboard");
    }
  }, [navigate]);

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#0a0f1e", minHeight: "100vh", color: "white" }}>

      {/* BG GLOW */}
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.1) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 }} />

      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 0", transition: "all 0.3s", background: scrolled ? "rgba(10,15,30,0.95)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22 }}>⚔️</span>
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px" }}>CyberShield</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="#features" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14, padding: "8px 12px" }}>Features</a>
            <a href="#how" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14, padding: "8px 12px" }}>How It Works</a>
            <button onClick={() => navigate("/check-scam")} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>🔍 Scam Checker</button>
            <button onClick={() => navigate("/trending")} style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#fcd34d", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>🔥 Trending</button>
            <button onClick={() => navigate("/login")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "white", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14, marginLeft: 4 }}>Login</button>
            <button onClick={() => navigate("/register")} style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "white", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", gap: 48, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: "inline-block", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd", padding: "6px 14px", borderRadius: 20, fontSize: 13, marginBottom: 24 }}>
            🔐 Trusted Cyber Crime Reporting Platform
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px", letterSpacing: "-1px" }}>
            Report Cyber Crime.<br />
            <span style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Get Justice Faster.
            </span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 18, lineHeight: 1.7, margin: "0 0 36px", maxWidth: 480 }}>
            AI-powered complaint management that detects, classifies, and prioritizes cyber crimes in real time. Secure. Fast. Reliable.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => navigate("/register")} style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "white", padding: "14px 28px", borderRadius: 10, cursor: "pointer", fontSize: 16, fontWeight: 600, boxShadow: "0 0 30px rgba(59,130,246,0.4)" }}>
              File a Complaint →
            </button>
            <button onClick={() => navigate("/login")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "white", padding: "14px 28px", borderRadius: 10, cursor: "pointer", fontSize: 16 }}>
              Track My Case
            </button>
          </div>
        </div>

        {/* MOCK CARD */}
        <div style={{ flex: 1, minWidth: 280, maxWidth: 400 }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 20, backdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
              {["#ef4444","#f59e0b","#10b981"].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />)}
              <span style={{ color: "#9ca3af", fontSize: 12, marginLeft: 6 }}>Live Case Feed</span>
            </div>
            {mockCases.map((c) => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <div style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 600 }}>{c.id}</div>
                  <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>{c.type}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ background: c.color + "22", color: c.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{c.priority}</div>
                  <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>Risk: {c.risk}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32, textAlign: "center" }}>
          {stats.map((st) => (
            <div key={st.label}>
              <div style={{ fontSize: 40, fontWeight: 800, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{st.value}</div>
              <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 6 }}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "inline-block", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#c4b5fd", padding: "5px 14px", borderRadius: 20, fontSize: 12, marginBottom: 16 }}>Features</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.5px" }}>Everything you need to fight cyber crime</h2>
          <p style={{ color: "#94a3b8", fontSize: 16 }}>Built for citizens and law enforcement alike.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {features.map((f) => (
            <div key={f.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 28, transition: "border-color 0.2s" }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 10px" }}>{f.title}</h3>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ display: "inline-block", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd", padding: "5px 14px", borderRadius: 20, fontSize: 12, marginBottom: 16 }}>Process</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>How It Works</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {[
              { step: "01", title: "Create Account", desc: "Register in seconds with your email." },
              { step: "02", title: "File Complaint", desc: "Describe the incident and attach evidence." },
              { step: "03", title: "AI Analysis", desc: "Our engine scores and classifies your case instantly." },
              { step: "04", title: "Track & Resolve", desc: "Monitor status updates until your case is closed." },
            ].map((item) => (
              <div key={item.step} style={{ textAlign: "center", padding: 28 }}>
                <div style={{ fontSize: 40, fontWeight: 800, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 16 }}>{item.step}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 10px" }}>{item.title}</h3>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, margin: "0 0 16px", letterSpacing: "-0.5px" }}>Ready to report a cyber crime?</h2>
          <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 36 }}>Join thousands of citizens who trust CyberShield for fast, secure reporting.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/register")} style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "white", padding: "14px 32px", borderRadius: 10, cursor: "pointer", fontSize: 16, fontWeight: 600, boxShadow: "0 0 30px rgba(59,130,246,0.4)" }}>
              Get Started Free →
            </button>
            <button onClick={() => navigate("/login")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "white", padding: "14px 32px", borderRadius: 10, cursor: "pointer", fontSize: 16 }}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>⚔️</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#94a3b8" }}>CyberShield</span>
          </div>
          <p style={{ color: "#4b5563", fontSize: 13, margin: 0 }}>© 2026 CyberShield. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
