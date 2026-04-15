import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function UserRegister() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (formData.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await API.post("/users/register", formData);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = formData.password.length === 0 ? 0 : formData.password.length < 6 ? 1 : formData.password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#10b981"];

  return (
    <div style={s.root}>
      <div style={s.bg} />
      <div style={s.bgGlow1} />
      <div style={s.bgGlow2} />

      <button onClick={() => navigate("/")} style={s.backBtn}>← Back to Home</button>

      <div style={s.card}>
        {/* LEFT */}
        <div style={s.leftPanel}>
          <div style={s.brandRow}>
            <span style={{ fontSize: 28 }}>⚔️</span>
            <span style={s.brandName}>CyberShield</span>
          </div>
          <h2 style={s.leftTitle}>Your safety is our mission.</h2>
          <p style={s.leftSub}>Create a free account and start reporting cyber crimes with AI-powered analysis.</p>
          <div style={s.leftSteps}>
            {[
              { num: "1", text: "Create your free account" },
              { num: "2", text: "Submit your complaint" },
              { num: "3", text: "AI analyzes and prioritizes" },
              { num: "4", text: "Track until resolved" },
            ].map(item => (
              <div key={item.num} style={s.stepRow}>
                <div style={s.stepNum}>{item.num}</div>
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={s.rightPanel}>
          <h2 style={s.formTitle}>Create account</h2>
          <p style={s.formSub}>Free forever. No credit card required.</p>

          {error && (
            <div style={s.errorBox}><span>⚠️</span> {error}</div>
          )}
          {success && (
            <div style={s.successBox}><span>✅</span> {success}</div>
          )}

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Full Name</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>👤</span>
                <input name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} required style={s.input} />
              </div>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Email address</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>✉️</span>
                <input name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required style={s.input} />
              </div>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Password</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>🔒</span>
                <input name="password" type={showPass ? "text" : "password"} placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required style={{ ...s.input, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={s.eyeBtn}>{showPass ? "🙈" : "👁️"}</button>
              </div>
              {formData.password.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1,2,3].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColor[strength] : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: strengthColor[strength], marginTop: 4, display: "block" }}>{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}>
              {loading ? <span style={s.spinner} /> : "Create Account →"}
            </button>
          </form>

          <p style={s.switchText}>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} style={s.switchLink}>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0f1e", fontFamily: "'Segoe UI', system-ui, sans-serif", padding: 16, position: "relative" },
  bg: { position: "fixed", inset: 0, background: "radial-gradient(ellipse at 80% 50%, rgba(59,130,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 20%, rgba(139,92,246,0.1) 0%, transparent 60%)", pointerEvents: "none" },
  bgGlow1: { position: "fixed", top: "20%", right: "10%", width: 400, height: 400, background: "rgba(59,130,246,0.06)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" },
  bgGlow2: { position: "fixed", bottom: "20%", left: "10%", width: 300, height: 300, background: "rgba(139,92,246,0.08)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" },
  backBtn: { position: "fixed", top: 20, left: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, zIndex: 10 },
  card: { display: "flex", width: "100%", maxWidth: 900, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden", backdropFilter: "blur(20px)", position: "relative", zIndex: 1, flexWrap: "wrap" },
  leftPanel: { flex: 1, minWidth: 260, background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2))", padding: "48px 36px", display: "flex", flexDirection: "column", justifyContent: "center" },
  brandRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 32 },
  brandName: { fontSize: 22, fontWeight: 700, color: "white" },
  leftTitle: { fontSize: 26, fontWeight: 700, color: "white", margin: "0 0 12px", lineHeight: 1.3 },
  leftSub: { color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6, margin: "0 0 32px" },
  leftSteps: { display: "flex", flexDirection: "column", gap: 14 },
  stepRow: { display: "flex", alignItems: "center", gap: 12 },
  stepNum: { width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  rightPanel: { flex: 1, minWidth: 280, padding: "48px 36px", display: "flex", flexDirection: "column", justifyContent: "center" },
  formTitle: { fontSize: 26, fontWeight: 700, color: "white", margin: "0 0 6px" },
  formSub: { color: "#94a3b8", fontSize: 14, margin: "0 0 28px" },
  errorBox: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", padding: "12px 16px", borderRadius: 10, fontSize: 14, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 },
  successBox: { background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#6ee7b7", padding: "12px 16px", borderRadius: 10, fontSize: 14, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { color: "#94a3b8", fontSize: 13, fontWeight: 500 },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: 14, fontSize: 15, pointerEvents: "none" },
  input: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px 12px 42px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" },
  eyeBtn: { position: "absolute", right: 12, background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 4 },
  submitBtn: { background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "white", padding: "14px", borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 48 },
  spinner: { width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" },
  switchText: { color: "#94a3b8", fontSize: 14, textAlign: "center", marginTop: 24 },
  switchLink: { color: "#60a5fa", cursor: "pointer", fontWeight: 500 },
};
