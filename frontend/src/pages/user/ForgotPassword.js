import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function ForgotPassword() {
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await API.post("/users/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0a0f1e", fontFamily:"'Segoe UI',system-ui,sans-serif", padding:16 }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 30% 50%,rgba(59,130,246,0.1) 0%,transparent 60%)", pointerEvents:"none" }} />
      <button onClick={() => navigate("/login")} style={{ position:"fixed", top:16, left:16, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#94a3b8", padding:"7px 14px", borderRadius:8, cursor:"pointer", fontSize:13, zIndex:10 }}>← Back to Login</button>

      <div style={{ width:"100%", maxWidth:420, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"36px 28px", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <span style={{ fontSize:36 }}>🔑</span>
          <h2 style={{ color:"white", fontSize:22, fontWeight:700, margin:"12px 0 6px" }}>Forgot Password?</h2>
          <p style={{ color:"#64748b", fontSize:14, margin:0 }}>Enter your email and we'll send you a reset link.</p>
        </div>

        {sent ? (
          <div style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:10, padding:"16px", textAlign:"center" }}>
            <div style={{ fontSize:28, marginBottom:8 }}>📧</div>
            <div style={{ color:"#6ee7b7", fontSize:15, fontWeight:600, marginBottom:6 }}>Check your inbox</div>
            <div style={{ color:"#94a3b8", fontSize:13 }}>If that email exists in our system, a reset link has been sent. Check your spam folder too.</div>
            <button onClick={() => navigate("/login")} style={{ marginTop:16, background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"10px 20px", borderRadius:8, cursor:"pointer", fontSize:14, fontWeight:600 }}>Back to Login</button>
          </div>
        ) : (
          <>
            {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#fca5a5", padding:"11px 14px", borderRadius:10, fontSize:14, marginBottom:16 }}>⚠️ {error}</div>}
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label style={{ color:"#94a3b8", fontSize:13, display:"block", marginBottom:6 }}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                  style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 14px", color:"white", fontSize:14, outline:"none", boxSizing:"border-box" }}
                  onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
              </div>
              <button type="submit" disabled={loading}
                style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"13px", borderRadius:10, cursor:"pointer", fontSize:15, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity: loading ? 0.7 : 1 }}>
                {loading ? <span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }} /> : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
