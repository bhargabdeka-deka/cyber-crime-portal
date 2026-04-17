import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import useWindowWidth from "../../hooks/useWindowWidth";

export default function UserRegister() {
  const [formData, setFormData] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const w = useWindowWidth();
  const isMobile = w < 640;

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

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
    } finally { setLoading(false); }
  };

  const strength = formData.password.length === 0 ? 0 : formData.password.length < 6 ? 1 : formData.password.length < 10 ? 2 : 3;
  const strengthColor = ["","#ef4444","#f59e0b","#10b981"][strength];

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0a0f1e", fontFamily:"'Segoe UI',system-ui,sans-serif", padding:16, position:"relative" }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 80% 50%,rgba(59,130,246,0.12) 0%,transparent 60%)", pointerEvents:"none" }} />
      <button onClick={() => navigate("/")} style={{ position:"fixed", top:16, left:16, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#94a3b8", padding:"7px 14px", borderRadius:8, cursor:"pointer", fontSize:13, zIndex:10 }}>← Home</button>

      <div style={{ display:"flex", width:"100%", maxWidth: isMobile ? 400 : 860, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, overflow:"hidden", position:"relative", zIndex:1, flexDirection: isMobile ? "column" : "row" }}>

        {/* Left panel */}
        {!isMobile && (
          <div style={{ flex:1, background:"linear-gradient(135deg,rgba(139,92,246,0.2),rgba(59,130,246,0.2))", padding:"48px 36px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
              <img src="/logo1.jpeg" alt="CyberShield" style={{ width:32, height:32, borderRadius:8, objectFit:"cover" }} />
              <span style={{ color:"white", fontWeight:700, fontSize:20 }}>CyberShield</span>
            </div>
            <h2 style={{ fontSize:24, fontWeight:700, color:"white", margin:"0 0 12px", lineHeight:1.3 }}>Your safety is our mission.</h2>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:14, lineHeight:1.6, margin:"0 0 28px" }}>Create a free account and start reporting cyber crimes with AI-powered analysis.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[["1","Create your free account"],["2","Submit your complaint"],["3","AI analyzes and prioritizes"],["4","Track until resolved"]].map(([n,t]) => (
                <div key={n} style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{n}</div>
                  <span style={{ color:"rgba(255,255,255,0.75)", fontSize:14 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right panel */}
        <div style={{ flex:1, padding: isMobile ? "32px 20px" : "48px 36px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
          {isMobile && (
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24 }}>
              <img src="/logo1.jpeg" alt="CyberShield" style={{ width:26, height:26, borderRadius:6, objectFit:"cover" }} />
              <span style={{ color:"white", fontWeight:700, fontSize:18 }}>CyberShield</span>
            </div>
          )}
          <h2 style={{ fontSize:24, fontWeight:700, color:"white", margin:"0 0 6px" }}>Create account</h2>
          <p style={{ color:"#94a3b8", fontSize:14, margin:"0 0 24px" }}>Free forever. No credit card required.</p>

          {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#fca5a5", padding:"11px 14px", borderRadius:10, fontSize:14, marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>⚠️ {error}</div>}
          {success && <div style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)", color:"#6ee7b7", padding:"11px 14px", borderRadius:10, fontSize:14, marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>✅ {success}</div>}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label style={lbl}>Full Name</label>
              <div style={{ position:"relative" }}>
                <span style={icoStyle}>👤</span>
                <input name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} required style={inp} onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
              </div>
            </div>
            <div>
              <label style={lbl}>Email address</label>
              <div style={{ position:"relative" }}>
                <span style={icoStyle}>✉️</span>
                <input name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required style={inp} onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
              </div>
            </div>
            <div>
              <label style={lbl}>Password</label>
              <div style={{ position:"relative" }}>
                <span style={icoStyle}>🔒</span>
                <input name="password" type={showPass?"text":"password"} placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required style={{ ...inp, paddingRight:44 }} onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16 }}>{showPass?"🙈":"👁️"}</button>
              </div>
              {formData.password.length > 0 && (
                <div style={{ marginTop:6 }}>
                  <div style={{ display:"flex", gap:4 }}>
                    {[1,2,3].map(i => <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i<=strength ? strengthColor : "rgba(255,255,255,0.1)", transition:"background 0.3s" }} />)}
                  </div>
                  <span style={{ fontSize:11, color:strengthColor, marginTop:3, display:"block" }}>{["","Weak","Good","Strong"][strength]}</span>
                </div>
              )}
            </div>
            <button type="submit" disabled={loading} style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"13px", borderRadius:10, cursor:"pointer", fontSize:15, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", minHeight:48, opacity: loading ? 0.7 : 1 }}>
              {loading ? <span style={{ width:18, height:18, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }} /> : "Create Account →"}
            </button>
          </form>
          <p style={{ color:"#94a3b8", fontSize:14, textAlign:"center", marginTop:20 }}>
            Already have an account? <span onClick={() => navigate("/login")} style={{ color:"#60a5fa", cursor:"pointer", fontWeight:500 }}>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const lbl = { color:"#94a3b8", fontSize:13, fontWeight:500, display:"block", marginBottom:6 };
const icoStyle = { position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:15, pointerEvents:"none" };
const inp = { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 14px 12px 42px", color:"white", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color 0.2s" };
