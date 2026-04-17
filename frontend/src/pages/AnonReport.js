import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import analyzeComplaint from "../utils/riskAnalyzer";
import useWindowWidth from "../hooks/useWindowWidth";

const SCAM_TYPES = ["UPI Fraud","Phishing","Job Scam","Lottery Scam","Romance Scam","Investment Scam","Identity Theft","Account Hacking","Cyber Harassment","Other"];

export default function AnonReport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const w = useWindowWidth();
  const isMobile = w < 640;

  const [form, setForm] = useState({
    title: "", description: "",
    scamType: "", scamTarget: searchParams.get("target") || "",
    location: "", evidence: null
  });
  const [analysis, setAnalysis] = useState(null);
  const [status, setStatus]     = useState({ type:"", msg:"" });
  const [loading, setLoading]   = useState(false);
  const [fileName, setFileName] = useState("");
  const [done, setDone]         = useState(null);

  useEffect(() => {
    if (form.title || form.description) setAnalysis(analyzeComplaint(form.title, form.description));
    else setAnalysis(null);
  }, [form.title, form.description]);

  const handleChange = (e) => {
    if (e.target.name === "evidence") {
      setForm({...form, evidence: e.target.files[0]});
      setFileName(e.target.files[0]?.name || "");
    } else setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setStatus({type:"",msg:""});
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k,v]) => { if (v && k !== "evidence") data.append(k, v); });
      if (form.evidence) data.append("evidence", form.evidence);
      const res = await API.post("/complaints/anonymous", data, { headers:{"Content-Type":"multipart/form-data"} });
      setDone(res.data.caseId);
    } catch (err) {
      setStatus({type:"error", msg: err.response?.data?.message || "Submission failed. Try again."});
    } finally { setLoading(false); }
  };

  const meta = analysis ? ({
    Critical:{color:"#ef4444",bg:"rgba(239,68,68,0.12)",border:"rgba(239,68,68,0.3)",icon:"🚨"},
    High:{color:"#f59e0b",bg:"rgba(245,158,11,0.12)",border:"rgba(245,158,11,0.3)",icon:"⚠️"},
    Medium:{color:"#3b82f6",bg:"rgba(59,130,246,0.12)",border:"rgba(59,130,246,0.3)",icon:"📋"},
    Low:{color:"#10b981",bg:"rgba(16,185,129,0.12)",border:"rgba(16,185,129,0.3)",icon:"✅"},
  }[analysis.priority] || {color:"#10b981",bg:"rgba(16,185,129,0.12)",border:"rgba(16,185,129,0.3)",icon:"✅"}) : null;

  return (
    <div style={{ minHeight:"100vh", background:"#0a0f1e", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"white" }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 30% 40%,rgba(239,68,68,0.08) 0%,transparent 60%)", pointerEvents:"none" }} />
      <nav style={{ position:"sticky", top:0, zIndex:50, background:"rgba(10,15,30,0.92)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={() => navigate("/")}>
          <img src="/logo1.jpeg" alt="CyberShield" style={{ width:26, height:26, borderRadius:6, objectFit:"cover" }} />
          <span style={{ fontWeight:700, fontSize:15 }}>CyberShield</span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => navigate("/login")} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#94a3b8", padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:13 }}>Login for full access</button>
        </div>
      </nav>

      <div style={{ maxWidth:660, margin:"0 auto", padding: isMobile ? "24px 16px 60px" : "48px 24px", position:"relative", zIndex:1 }}>

        {done ? (
          <div style={{ textAlign:"center", padding:"60px 24px" }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🛡️</div>
            <h2 style={{ color:"white", fontSize:24, fontWeight:800, margin:"0 0 10px" }}>Report Submitted!</h2>
            <p style={{ color:"#94a3b8", fontSize:15, margin:"0 0 8px" }}>Thank you for helping protect others.</p>
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 16px", display:"inline-block", marginBottom:24 }}>
              <span style={{ color:"#64748b", fontSize:12 }}>Case ID: </span>
              <span style={{ color:"white", fontSize:13, fontFamily:"monospace", fontWeight:600 }}>{done}</span>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
              <button onClick={() => navigate("/check-scam")} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"white", padding:"10px 20px", borderRadius:8, cursor:"pointer", fontSize:14 }}>Check Another Number</button>
              <button onClick={() => navigate("/register")} style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"10px 20px", borderRadius:8, cursor:"pointer", fontSize:14, fontWeight:600 }}>Create Account to Track</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom:24 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", color:"#6ee7b7", padding:"4px 12px", borderRadius:20, fontSize:12, marginBottom:12 }}>
                🔓 No account required
              </div>
              <h1 style={{ color:"white", fontSize: isMobile ? 22 : 28, fontWeight:800, margin:"0 0 6px" }}>Report a Scam Anonymously</h1>
              <p style={{ color:"#64748b", fontSize:14, margin:0 }}>Your report helps others avoid the same scam. No login needed.</p>
            </div>

            {status.msg && (
              <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#fca5a5", padding:"11px 14px", borderRadius:10, fontSize:14, marginBottom:16 }}>⚠️ {status.msg}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding: isMobile ? "16px" : "24px", display:"flex", flexDirection:"column", gap:18 }}>

                <div>
                  <label style={lbl}>What happened? <span style={{color:"#ef4444"}}>*</span></label>
                  <input name="title" type="text" placeholder="e.g. Fake job offer, UPI fraud call..." value={form.title} onChange={handleChange} required style={inp}
                    onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                </div>

                <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:16 }}>
                  <div>
                    <label style={lbl}>Scam Type</label>
                    <select name="scamType" value={form.scamType} onChange={handleChange} style={{ ...inp, cursor:"pointer" }}>
                      <option value="" style={{background:"#1e293b"}}>Auto-detect</option>
                      {SCAM_TYPES.map(t => <option key={t} value={t} style={{background:"#1e293b"}}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Phone / URL / UPI ID</label>
                    <input name="scamTarget" type="text" placeholder="The scam number or link" value={form.scamTarget} onChange={handleChange} style={inp}
                      onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                  </div>
                </div>

                <div>
                  <label style={lbl}>Location <span style={{color:"#64748b",fontWeight:400}}>(optional)</span></label>
                  <input name="location" type="text" placeholder="e.g. Guwahati, Assam" value={form.location} onChange={handleChange} style={inp}
                    onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                </div>

                <div>
                  <label style={lbl}>Describe what happened <span style={{color:"#ef4444"}}>*</span></label>
                  <textarea name="description" placeholder="Tell us exactly what happened..." value={form.description} onChange={handleChange} required rows={4}
                    style={{...inp, resize:"vertical", minHeight:100}}
                    onFocus={e=>e.target.style.borderColor="rgba(59,130,246,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
                </div>

                {analysis && meta && (
                  <div style={{ background:meta.bg, border:`1px solid ${meta.border}`, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ color:meta.color, fontWeight:600, fontSize:13, marginBottom:8 }}>⚡ AI Preview</div>
                    <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                      <div><div style={{color:"#64748b",fontSize:11}}>Type</div><div style={{color:"white",fontSize:13,fontWeight:600}}>{analysis.crimeType}</div></div>
                      <div><div style={{color:"#64748b",fontSize:11}}>Priority</div><div style={{color:meta.color,fontSize:13,fontWeight:600}}>{meta.icon} {analysis.priority}</div></div>
                      <div><div style={{color:"#64748b",fontSize:11}}>Risk Score</div><div style={{color:meta.color,fontSize:16,fontWeight:800}}>{analysis.riskScore}</div></div>
                    </div>
                  </div>
                )}

                <div>
                  <label style={lbl}>Evidence <span style={{color:"#64748b",fontWeight:400}}>(optional)</span></label>
                  <label style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(255,255,255,0.03)", border:"1px dashed rgba(255,255,255,0.15)", borderRadius:10, padding:"12px 14px", cursor:"pointer" }}>
                    <span style={{fontSize:20}}>📎</span>
                    <div>
                      <div style={{color: fileName ? "white" : "#64748b", fontSize:13}}>{fileName || "Attach screenshot or document"}</div>
                      <div style={{color:"#475569",fontSize:11,marginTop:2}}>PNG, JPG, PDF up to 10MB</div>
                    </div>
                    <input type="file" name="evidence" onChange={handleChange} style={{display:"none"}} accept="image/*,.pdf,.doc,.docx" />
                  </label>
                </div>

                <button type="submit" disabled={loading}
                  style={{ background: loading ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"13px", borderRadius:10, cursor: loading ? "not-allowed" : "pointer", fontSize:15, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  {loading ? <><span style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid white",borderRadius:"50%",animation:"spin 0.8s linear infinite",display:"inline-block"}} /> Submitting...</> : "Submit Report →"}
                </button>

                <p style={{ color:"#475569", fontSize:12, textAlign:"center", margin:0 }}>
                  Want to track your complaint status?{" "}
                  <span onClick={() => navigate("/register")} style={{color:"#60a5fa",cursor:"pointer"}}>Create a free account</span>
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const lbl = { color:"#94a3b8", fontSize:13, fontWeight:500, display:"block", marginBottom:6 };
const inp = { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"11px 14px", color:"white", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color 0.2s" };
