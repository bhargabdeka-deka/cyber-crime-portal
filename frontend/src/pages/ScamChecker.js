import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import useWindowWidth from "../hooks/useWindowWidth";

const verdictConfig = {
  safe:      { color:"#10b981", bg:"rgba(16,185,129,0.1)",  border:"rgba(16,185,129,0.3)",  icon:"✅", title:"No Reports Found",  sub:"This hasn't been reported in our database. Looks safe." },
  caution:   { color:"#f59e0b", bg:"rgba(245,158,11,0.1)",  border:"rgba(245,158,11,0.3)",  icon:"⚠️", title:"Reported Once",      sub:"Someone reported this once. Be careful." },
  warning:   { color:"#f59e0b", bg:"rgba(245,158,11,0.1)",  border:"rgba(245,158,11,0.3)",  icon:"🚨", title:"Suspicious",         sub:"Multiple people reported this. Avoid engaging." },
  dangerous: { color:"#ef4444", bg:"rgba(239,68,68,0.1)",   border:"rgba(239,68,68,0.3)",   icon:"🔴", title:"Highly Dangerous",   sub:"Confirmed scam. Do NOT engage. Report to authorities." },
};

export default function ScamChecker() {
  const { value: paramValue } = useParams(); // for /check/:value public URL
  const [query, setQuery]     = useState(paramValue || "");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [copied, setCopied]   = useState(false);
  const [activity, setActivity] = useState([]);
  const navigate = useNavigate();
  const w = useWindowWidth();
  const isMobile = w < 640;
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!localStorage.getItem("token") && !!user;
  const initials = user?.name ? user.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) : "";

  // Auto-check if URL has a value param
  useEffect(() => {
    if (paramValue) doCheck(paramValue);
    // Load live activity
    API.get("/scam/activity").then(r => setActivity(r.data)).catch(() => {});
  }, [paramValue]); // eslint-disable-line

  const doCheck = async (val) => {
    if (!val?.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await API.get("/scam/check", { params: { query: val.trim() } });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Check failed. Try again.");
    } finally { setLoading(false); }
  };

  const handleCheck = (e) => { e.preventDefault(); doCheck(query); };

  const handleShare = () => {
    if (!result) return;
    const url = `${window.location.origin}/check/${encodeURIComponent(result.value || query)}`;
    const text = result.reports > 0
      ? `⚠️ SCAM ALERT: "${result.value}" has been reported ${result.reports} times as ${result.category}.\nRisk Level: ${result.riskLevel}\nCheck it: ${url}`
      : `✅ "${result.value}" has no scam reports on CyberShield.\nVerify any number/link: ${url}`;

    if (navigator.share) {
      navigator.share({ title: "CyberShield Scam Check", text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }
  };

  const vc = result ? (verdictConfig[result.verdict] || verdictConfig.safe) : null;
  const timeAgo = (date) => {
    const mins = Math.floor((Date.now() - new Date(date)) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0a0f1e", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"white" }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 30% 40%,rgba(59,130,246,0.1) 0%,transparent 60%)", pointerEvents:"none" }} />

      {/* NAV */}
      <nav style={{ position:"sticky", top:0, zIndex:50, background:"rgba(10,15,30,0.92)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={() => navigate("/")}>
          <span style={{ fontSize:18 }}>⚔️</span>
          <span style={{ fontWeight:700, fontSize:15 }}>CyberShield</span>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={() => navigate("/trending")} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#94a3b8", padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:13 }}>🔥 Trending</button>
          {isLoggedIn ? (
            <>
              <button onClick={() => navigate(user.role === "admin" ? "/dashboard" : "/user-dashboard")}
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#94a3b8", padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:13 }}>
                Dashboard
              </button>
              <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", padding:"4px 12px 4px 6px", borderRadius:8 }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:11, fontWeight:700 }}>{initials}</div>
                <span style={{ color:"white", fontSize:13, fontWeight:500 }}>{user.name?.split(" ")[0]}</span>
              </div>
            </>
          ) : (
            <button onClick={() => navigate("/login")} style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 }}>Login</button>
          )}
        </div>
      </nav>

      <div style={{ maxWidth:680, margin:"0 auto", padding: isMobile ? "24px 16px 60px" : "48px 24px", position:"relative", zIndex:1 }}>

        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize: isMobile ? 24 : 32, fontWeight:800, margin:"0 0 8px", letterSpacing:"-0.5px" }}>
            Is this number safe?
          </h1>
          <p style={{ color:"#64748b", fontSize:14, margin:0 }}>Search any phone, URL, UPI ID, or email to see if it's been reported.</p>
        </div>

        {/* Search */}
        <form onSubmit={handleCheck} style={{ marginBottom:24 }}>
          <div style={{ display:"flex", flexDirection: isMobile ? "column" : "row", gap:8, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:8 }}>
            <input type="text" value={query} onChange={e => { setQuery(e.target.value); setResult(null); }}
              placeholder="9876543210 or fake-jobs.com or cashback@ybl..."
              style={{ flex:1, background:"none", border:"none", color:"white", fontSize:15, padding:"10px 12px", outline:"none", fontFamily:"inherit", width:"100%" }} />
            <button type="submit" disabled={loading || !query.trim()}
              style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"11px 20px", borderRadius:8, cursor: !query.trim() ? "not-allowed" : "pointer", fontSize:14, fontWeight:600, opacity: !query.trim() ? 0.5 : 1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, whiteSpace:"nowrap" }}>
              {loading ? <span style={{ width:15, height:15, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }} /> : "🔍"} Check
            </button>
          </div>
          <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
            <span style={{ color:"#475569", fontSize:12 }}>Try:</span>
            {["9876543210","sbi-kyc-update.com","lottery@scam.in"].map(ex => (
              <button key={ex} type="button" onClick={() => { setQuery(ex); doCheck(ex); }}
                style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#64748b", padding:"3px 10px", borderRadius:20, cursor:"pointer", fontSize:12 }}>{ex}</button>
            ))}
          </div>
        </form>

        {error && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#fca5a5", padding:"11px 14px", borderRadius:10, fontSize:14, marginBottom:16 }}>⚠️ {error}</div>}

        {/* RESULT */}
        {result && vc && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {/* Main verdict */}
            <div style={{ background:vc.bg, border:`1px solid ${vc.border}`, borderRadius:14, padding:"20px" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:36 }}>{vc.icon}</span>
                  <div>
                    <div style={{ color:vc.color, fontSize:20, fontWeight:800 }}>{vc.title}</div>
                    <div style={{ color:"#94a3b8", fontSize:13, marginTop:2 }}>{vc.sub}</div>
                  </div>
                </div>
                {/* Share button */}
                <button onClick={handleShare}
                  style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", color:"white", padding:"7px 12px", borderRadius:8, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                  {copied ? "✅ Copied!" : "📤 Share"}
                </button>
              </div>

              {/* Stats row */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom: result.reports > 0 ? 14 : 0 }}>
                {[
                  { label:"Reports", value: result.reports },
                  { label:"Avg Risk", value: result.avgRiskScore || "—" },
                  { label:"Level", value: result.riskLevel || "—" },
                ].map(s => (
                  <div key={s.label} style={{ background:"rgba(0,0,0,0.2)", borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
                    <div style={{ color:vc.color, fontSize:20, fontWeight:800 }}>{s.value}</div>
                    <div style={{ color:"#64748b", fontSize:11, marginTop:3 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {result.reports > 0 && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                  {result.category && <span style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)", color:"#e2e8f0", padding:"3px 10px", borderRadius:20, fontSize:12 }}>🎯 {result.category}</span>}
                  {result.type && <span style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", color:"#94a3b8", padding:"3px 10px", borderRadius:20, fontSize:12 }}>{result.type}</span>}
                  {result.locations?.slice(0,3).map(loc => <span key={loc} style={{ background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", color:"#93c5fd", padding:"3px 10px", borderRadius:20, fontSize:12 }}>📍 {loc}</span>)}
                </div>
              )}

              {result.description && result.status !== "SAFE" && (
                <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:8, padding:"10px 12px", marginBottom:12 }}>
                  <div style={{ color:"#64748b", fontSize:11, marginBottom:4 }}>What people reported</div>
                  <div style={{ color:"#e2e8f0", fontSize:13, lineHeight:1.6 }}>{result.description}</div>
                </div>
              )}

              {result.lastReportedAt && result.status !== "SAFE" && (
                <div style={{ color:"#475569", fontSize:12 }}>Last reported: {new Date(result.lastReportedAt).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}</div>
              )}
            </div>

            {/* ACTION ADVICE — the key upgrade */}
            {result.actionAdvice && (
              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:12 }}>
                <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:12, padding:"16px" }}>
                  <div style={{ color:"#f87171", fontSize:13, fontWeight:700, marginBottom:10 }}>❌ Do NOT</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                    {result.actionAdvice.avoid.map((a, i) => (
                      <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                        <span style={{ color:"#ef4444", fontSize:12, flexShrink:0, marginTop:1 }}>✕</span>
                        <span style={{ color:"#fca5a5", fontSize:13, lineHeight:1.4 }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:12, padding:"16px" }}>
                  <div style={{ color:"#6ee7b7", fontSize:13, fontWeight:700, marginBottom:10 }}>✅ Do This Instead</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                    {result.actionAdvice.doThis.map((a, i) => (
                      <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                        <span style={{ color:"#10b981", fontSize:12, flexShrink:0, marginTop:1 }}>✓</span>
                        <span style={{ color:"#6ee7b7", fontSize:13, lineHeight:1.4 }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Report CTA */}
            <div style={{ background:"rgba(59,130,246,0.07)", border:"1px solid rgba(59,130,246,0.18)", borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
              <div>
                <div style={{ color:"white", fontSize:14, fontWeight:600 }}>Encountered this scam?</div>
                <div style={{ color:"#64748b", fontSize:13 }}>File a report — it helps others avoid it.</div>
              </div>
              <button onClick={() => navigate("/register")} style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"9px 18px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 }}>
                Report It →
              </button>
            </div>
          </div>
        )}

        {/* Live activity feed — shown when no result */}
        {!result && !loading && activity.length > 0 && (
          <div style={{ marginTop:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:"#ef4444", display:"inline-block", animation:"pulse 1.5s ease-in-out infinite" }} />
              <span style={{ color:"#64748b", fontSize:13 }}>Recent reports</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {activity.slice(0,6).map((a, i) => (
                <div key={i} onClick={() => { setQuery(a.value); doCheck(a.value); }}
                  style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 14px", cursor:"pointer" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor="rgba(59,130,246,0.3)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
                  <div>
                    <span style={{ color:"white", fontSize:13, fontFamily:"monospace" }}>{a.value}</span>
                    <span style={{ color:"#64748b", fontSize:12, marginLeft:8 }}>{a.category}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ color: a.riskLevel==="CRITICAL"?"#ef4444":a.riskLevel==="HIGH"?"#f59e0b":"#94a3b8", fontSize:11, fontWeight:600 }}>{a.riskLevel}</span>
                    <span style={{ color:"#475569", fontSize:11 }}>{timeAgo(a.lastReportedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && activity.length === 0 && (
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap:12, marginTop:8 }}>
            {[
              { icon:"📱", title:"Phone numbers", desc:"Someone called asking for OTP? Check if others reported the same number." },
              { icon:"🔗", title:"Websites & links", desc:"Got a suspicious link on WhatsApp? Paste it here before clicking." },
              { icon:"💳", title:"UPI & email IDs", desc:"Verify a UPI ID before sending money to someone you don't know." },
            ].map(c => (
              <div key={c.title} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"16px" }}>
                <div style={{ fontSize:26, marginBottom:8 }}>{c.icon}</div>
                <div style={{ color:"white", fontSize:14, fontWeight:600, marginBottom:5 }}>{c.title}</div>
                <div style={{ color:"#64748b", fontSize:13, lineHeight:1.5 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
