import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState("");
  const [showPass, setShowPass]   = useState(false);
  const navigate = useNavigate();

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColor = ["","#ef4444","#f59e0b","#10b981"][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match"); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try {
      await API.post(`/users/reset-password/${token}`, { password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Link may have expired.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0a0f1e", fontFamily:"'Segoe UI',system-ui,sans-serif", padding:16 }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 70% 50%,rgba(139,92,246,0.1) 0%,transparent 60%)", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:420, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"36px 28px", position:"relative", zIndex:1 }}>
        {done ? (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
            <h2 style={{ color:"white", fontSize:20, fontWeight:700, margin:"0 0 8px" }}>Password Reset!</h2>
            <p style={{ color:"#94a3b8", fontSize:14, margin:"0 0 20px" }}>Your password has been updated. You can now log in.</p>
            <button onClick={() => navigate("/login")} style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"11px 24px", borderRadius:8, cursor:"pointer", fontSize:14, fontWeight:600 }}>Go to Login</button>
          </div>
        ) : (
          <>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <span style={{ fontSize:32 }}>🔒</span>
              <h2 style={{ color:"white", fontSize:22, fontWeight:700, margin:"10px 0 6px" }}>Set New Password</h2>
              <p style={{ color:"#64748b", fontSize:14, margin:0 }}>Choose a strong password for your account.</p>
            </div>

            {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#fca5a5", padding:"11px 14px", borderRadius:10, fontSize:14, marginBottom:16 }}>⚠️ {error}</div>}

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label style={{ color:"#94a3b8", fontSize:13, display:"block", marginBottom:6 }}>New Password</label>
                <div style={{ position:"relative" }}>
                  <input type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 6 characters" required
                    style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 44px 12px 14px", color:"white", fontSize:14, outline:"none", boxSizing:"border-box" }}
                    onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                  <button type="button" onClick={()=>setShowPass(!showPass)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16 }}>{showPass?"🙈":"👁️"}</button>
                </div>
                {password.length > 0 && (
                  <div style={{ marginTop:6 }}>
                    <div style={{ display:"flex", gap:4 }}>
                      {[1,2,3].map(i => <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i<=strength ? strengthColor : "rgba(255,255,255,0.1)" }} />)}
                    </div>
                    <span style={{ fontSize:11, color:strengthColor, marginTop:3, display:"block" }}>{["","Weak","Good","Strong"][strength]}</span>
                  </div>
                )}
              </div>
              <div>
                <label style={{ color:"#94a3b8", fontSize:13, display:"block", marginBottom:6 }}>Confirm Password</label>
                <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repeat your password" required
                  style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:`1px solid ${confirm && confirm!==password ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius:10, padding:"12px 14px", color:"white", fontSize:14, outline:"none", boxSizing:"border-box" }} />
                {confirm && confirm !== password && <span style={{ color:"#f87171", fontSize:12, marginTop:4, display:"block" }}>Passwords don't match</span>}
              </div>
              <button type="submit" disabled={loading || (confirm && confirm !== password)}
                style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"13px", borderRadius:10, cursor:"pointer", fontSize:15, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity: loading ? 0.7 : 1 }}>
                {loading ? <span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }} /> : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
