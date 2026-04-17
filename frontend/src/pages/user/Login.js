import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import useWindowWidth from "../../hooks/useWindowWidth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const w = useWindowWidth();
  const isMobile = w < 640;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await API.post("/users/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate(user.role === "admin" ? "/dashboard" : "/user-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0a0f1e", fontFamily:"'Segoe UI',system-ui,sans-serif", padding:16, position:"relative" }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 20% 50%,rgba(59,130,246,0.12) 0%,transparent 60%)", pointerEvents:"none" }} />
      <button onClick={() => navigate("/")} style={{ position:"fixed", top:16, left:16, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#94a3b8", padding:"7px 14px", borderRadius:8, cursor:"pointer", fontSize:13, zIndex:10 }}>← Home</button>

      <div style={{ display:"flex", width:"100%", maxWidth: isMobile ? 400 : 860, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, overflow:"hidden", position:"relative", zIndex:1, flexDirection: isMobile ? "column" : "row" }}>

        {/* Left panel — hidden on mobile */}
        {!isMobile && (
          <div style={{ flex:1, background:"linear-gradient(135deg,rgba(59,130,246,0.2),rgba(139,92,246,0.2))", padding:"48px 36px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
              <span style={{ fontSize:26 }}>⚔️</span>
              <span style={{ color:"white", fontWeight:700, fontSize:20 }}>CyberShield</span>
            </div>
            <h2 style={{ fontSize:24, fontWeight:700, color:"white", margin:"0 0 12px", lineHeight:1.3 }}>Fight cyber crime with confidence.</h2>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:14, lineHeight:1.6, margin:"0 0 28px" }}>A platform to report and track cyber crime complaints — built for Indian citizens.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {["AI Risk Analysis","Evidence Upload","Real-Time Tracking","Instant Alerts"].map(f => (
                <div key={f} style={{ color:"rgba(255,255,255,0.8)", fontSize:14, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ background:"rgba(16,185,129,0.2)", color:"#10b981", width:22, height:22, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0 }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right panel */}
        <div style={{ flex:1, padding: isMobile ? "32px 20px" : "48px 36px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
          {isMobile && (
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24 }}>
              <span style={{ fontSize:22 }}>⚔️</span>
              <span style={{ color:"white", fontWeight:700, fontSize:18 }}>CyberShield</span>
            </div>
          )}
          <h2 style={{ fontSize:24, fontWeight:700, color:"white", margin:"0 0 6px" }}>Welcome back</h2>
          <p style={{ color:"#94a3b8", fontSize:14, margin:"0 0 24px" }}>Sign in to your account</p>

          {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#fca5a5", padding:"11px 14px", borderRadius:10, fontSize:14, marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>⚠️ {error}</div>}

          <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label style={lbl}>Email address</label>
              <div style={{ position:"relative" }}>
                <span style={icoStyle}>✉️</span>
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={inp} onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
              </div>
            </div>
            <div>
              <label style={lbl}>Password</label>
              <div style={{ position:"relative" }}>
                <span style={icoStyle}>🔒</span>
                <input type={showPass?"text":"password"} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required style={{ ...inp, paddingRight:44 }} onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16 }}>{showPass?"🙈":"👁️"}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"13px", borderRadius:10, cursor:"pointer", fontSize:15, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", minHeight:48, opacity: loading ? 0.7 : 1 }}>
              {loading ? <span style={{ width:18, height:18, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }} /> : "Sign In →"}
            </button>
          </form>
          <p style={{ color:"#94a3b8", fontSize:14, textAlign:"center", marginTop:20 }}>
            Don't have an account? <span onClick={() => navigate("/register")} style={{ color:"#60a5fa", cursor:"pointer", fontWeight:500 }}>Create one free</span>
          </p>
          <p style={{ color:"#64748b", fontSize:13, textAlign:"center", marginTop:8 }}>
            <span onClick={() => navigate("/forgot-password")} style={{ color:"#94a3b8", cursor:"pointer" }}>Forgot password?</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const lbl = { color:"#94a3b8", fontSize:13, fontWeight:500, display:"block", marginBottom:6 };
const icoStyle = { position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:15, pointerEvents:"none" };
const inp = { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 14px 12px 42px", color:"white", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color 0.2s" };
