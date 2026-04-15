import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/users/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate(user.role === "admin" ? "/dashboard" : "/user-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.root}>
      {/* BG */}
      <div style={s.bg} />
      <div style={s.bgGlow1} />
      <div style={s.bgGlow2} />

      {/* BACK TO HOME */}
      <button onClick={() => navigate("/")} style={s.backBtn}>← Back to Home</button>

      <div style={s.card}>
        {/* LEFT PANEL */}
        <div style={s.leftPanel}>
          <div style={s.brandRow}>
            <span style={{ fontSize: 28 }}>⚔️</span>
            <span style={s.brandName}>CyberShield</span>
          </div>
          <h2 style={s.leftTitle}>Fight cyber crime with confidence.</h2>
          <p style={s.leftSub}>Secure, AI-powered complaint management trusted by thousands.</p>
          <div style={s.leftFeatures}>
            {["AI Risk Analysis", "Evidence Upload", "Real-Time Tracking", "Instant Alerts"].map(f => (
              <div key={f} style={s.leftFeatureItem}>
                <span style={s.checkIcon}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={s.rightPanel}>
          <h2 style={s.formTitle}>Welcome back</h2>
          <p style={s.formSub}>Sign in to your account</p>

          {error && (
            <div style={s.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={s.form}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Email address</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>✉️</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={s.input}
                />
              </div>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Password</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ ...s.input, paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={s.eyeBtn}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <span style={s.spinner} />
              ) : "Sign In →"}
            </button>
          </form>

          <p style={s.switchText}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")} style={s.switchLink}>Create one free</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0f1e", fontFamily: "'Segoe UI', system-ui, sans-serif", padding: 16, position: "relative" },
  bg: { position: "fixed", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.1) 0%, transparent 60%)", pointerEvents: "none" },
  bgGlow1: { position: "fixed", top: "20%", left: "10%", width: 400, height: 400, background: "rgba(59,130,246,0.06)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" },
  bgGlow2: { position: "fixed", bottom: "20%", right: "10%", width: 300, height: 300, background: "rgba(139,92,246,0.08)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" },
  backBtn: { position: "fixed", top: 20, left: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, zIndex: 10 },
  card: { display: "flex", width: "100%", maxWidth: 900, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden", backdropFilter: "blur(20px)", position: "relative", zIndex: 1, flexWrap: "wrap" },
  leftPanel: { flex: 1, minWidth: 260, background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))", padding: "48px 36px", display: "flex", flexDirection: "column", justifyContent: "center" },
  brandRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 32 },
  brandName: { fontSize: 22, fontWeight: 700, color: "white" },
  leftTitle: { fontSize: 26, fontWeight: 700, color: "white", margin: "0 0 12px", lineHeight: 1.3 },
  leftSub: { color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6, margin: "0 0 32px" },
  leftFeatures: { display: "flex", flexDirection: "column", gap: 12 },
  leftFeatureItem: { color: "rgba(255,255,255,0.8)", fontSize: 14, display: "flex", alignItems: "center", gap: 10 },
  checkIcon: { background: "rgba(16,185,129,0.2)", color: "#10b981", width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 },
  rightPanel: { flex: 1, minWidth: 280, padding: "48px 36px", display: "flex", flexDirection: "column", justifyContent: "center" },
  formTitle: { fontSize: 26, fontWeight: 700, color: "white", margin: "0 0 6px" },
  formSub: { color: "#94a3b8", fontSize: 14, margin: "0 0 28px" },
  errorBox: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", padding: "12px 16px", borderRadius: 10, fontSize: 14, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { color: "#94a3b8", fontSize: 13, fontWeight: 500 },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: 14, fontSize: 15, pointerEvents: "none" },
  input: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px 12px 42px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  eyeBtn: { position: "absolute", right: 12, background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 4 },
  submitBtn: { background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "white", padding: "14px", borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 48 },
  spinner: { width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" },
  switchText: { color: "#94a3b8", fontSize: 14, textAlign: "center", marginTop: 24 },
  switchLink: { color: "#60a5fa", cursor: "pointer", fontWeight: 500 },
};
