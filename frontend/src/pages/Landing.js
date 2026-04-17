import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import useWindowWidth from "../hooks/useWindowWidth";

const scamTypeIcon = {
  "UPI Fraud":"💳","Phishing":"🎣","Job Scam":"💼","Lottery Scam":"🎰",
  "Romance Scam":"💔","Investment Scam":"📈","Identity Theft":"🪪",
  "Account Hacking":"🔓","Cyber Harassment":"😡","Other":"⚠️"
};

const verdictConfig = {
  safe:      { color:"#10b981",bg:"rgba(16,185,129,0.12)",border:"rgba(16,185,129,0.3)",icon:"✅",label:"No Reports Found" },
  caution:   { color:"#f59e0b",bg:"rgba(245,158,11,0.12)",border:"rgba(245,158,11,0.3)",icon:"⚠️",label:"Reported Once" },
  warning:   { color:"#f59e0b",bg:"rgba(245,158,11,0.12)",border:"rgba(245,158,11,0.3)",icon:"🚨",label:"Suspicious" },
  dangerous: { color:"#ef4444",bg:"rgba(239,68,68,0.12)",border:"rgba(239,68,68,0.3)",icon:"🔴",label:"Highly Dangerous" },
};

export default function Landing() {
  const navigate = useNavigate();
  const w = useWindowWidth();
  const isMobile = w < 640;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [trending, setTrending] = useState(null);
  const [ticker, setTicker] = useState([]);
  const checkerRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (token && user) navigate(user.role === "admin" ? "/dashboard" : "/user-dashboard");
  }, [navigate]);

  useEffect(() => {
    API.get("/scam/trending").then(r => setTrending(r.data)).catch(() => {});
    API.get("/scam/activity").then(r => setTicker(r.data || [])).catch(() => {});
  }, []);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setChecking(true); setCheckResult(null);
    try {
      const res = await API.get("/scam/check", { params: { query: query.trim() } });
      setCheckResult(res.data);
    } catch { setCheckResult({ verdict: "error" }); }
    finally { setChecking(false); }
  };

  const vc = checkResult ? (verdictConfig[checkResult.verdict] || verdictConfig.safe) : null;

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:"#0a0f1e", minHeight:"100vh", color:"white" }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 20% 50%,rgba(59,130,246,0.1) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(139,92,246,0.08) 0%,transparent 60%)", pointerEvents:"none", zIndex:0 }} />

      {/* NAV */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"12px 0", background: scrolled||menuOpen ? "rgba(10,15,30,0.97)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none", transition:"all 0.3s" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <img src="/logo1.jpeg" alt="CyberShield" style={{ width:28, height:28, borderRadius:6, objectFit:"cover" }} />
            <span style={{ fontSize:18, fontWeight:700 }}>CyberShield</span>
          </div>

          {/* Desktop nav */}
          {!isMobile && (
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <button onClick={() => checkerRef.current?.scrollIntoView({behavior:"smooth"})} style={navBtn("#ef4444")}>🔍 Check Scam</button>
              <button onClick={() => navigate("/trending")} style={navBtn("#f59e0b")}>🔥 Trending</button>
              <button onClick={() => navigate("/login")} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.15)", color:"white", padding:"7px 16px", borderRadius:8, cursor:"pointer", fontSize:13 }}>Login</button>
              <button onClick={() => navigate("/register")} style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"7px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 }}>Get Started</button>
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background:"rgba(255,255,255,0.06)", border:"none", color:"white", width:36, height:36, borderRadius:8, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>

        {/* Mobile dropdown */}
        {isMobile && menuOpen && (
          <div style={{ padding:"12px 16px", display:"flex", flexDirection:"column", gap:8, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
            <button onClick={() => { checkerRef.current?.scrollIntoView({behavior:"smooth"}); setMenuOpen(false); }} style={mobileNavBtn}>🔍 Check Scam</button>
            <button onClick={() => { navigate("/trending"); setMenuOpen(false); }} style={mobileNavBtn}>🔥 Trending Scams</button>
            <button onClick={() => { navigate("/report"); setMenuOpen(false); }} style={mobileNavBtn}>🚨 Report Anonymously</button>
            <button onClick={() => { navigate("/login"); setMenuOpen(false); }} style={mobileNavBtn}>Login</button>
            <button onClick={() => { navigate("/register"); setMenuOpen(false); }} style={{ ...mobileNavBtn, background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", fontWeight:600 }}>Get Started Free</button>
          </div>
        )}
      </nav>

      {/* LIVE TICKER */}
      {ticker.length > 0 && (
        <div style={{ background:"rgba(239,68,68,0.08)", borderBottom:"1px solid rgba(239,68,68,0.15)", padding:"8px 0", overflow:"hidden", position:"relative", zIndex:99, marginTop:48 }}>
          <div style={{ display:"flex", alignItems:"center", gap:0, whiteSpace:"nowrap" }}>
            <div style={{ background:"rgba(239,68,68,0.2)", color:"#fca5a5", padding:"2px 12px", fontSize:11, fontWeight:700, flexShrink:0, marginRight:16 }}>🔴 LIVE</div>
            <div style={{ display:"flex", gap:32, animation:"ticker 30s linear infinite", willChange:"transform" }}>
              {[...ticker, ...ticker].map((a, i) => (
                <span key={i} style={{ color:"#94a3b8", fontSize:12 }}>
                  <span style={{ color: a.riskLevel==="CRITICAL"?"#ef4444":a.riskLevel==="HIGH"?"#f59e0b":"#94a3b8", fontWeight:600 }}>{a.riskLevel}</span>
                  {" · "}
                  <span style={{ color:"white", fontFamily:"monospace" }}>{a.value}</span>
                  {" · "}
                  <span>{a.category}</span>
                  <span style={{ color:"#475569", marginLeft:8 }}>just reported</span>
                  <span style={{ color:"#374151", margin:"0 16px" }}>|</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding: isMobile ? "100px 16px 60px" : "130px 24px 80px", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom: isMobile ? 32 : 48 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", color:"#fca5a5", padding:"4px 12px", borderRadius:6, fontSize:12, marginBottom:20, fontFamily:"monospace" }}>
            ⚠️ Cyber scams are rising in India — stay protected
          </div>
          <h1 style={{ fontSize: isMobile ? "clamp(26px,7vw,38px)" : "clamp(32px,5vw,56px)", fontWeight:800, lineHeight:1.15, margin:"0 0 18px", letterSpacing:"-0.5px" }}>
            Got a suspicious call or link?<br />
            <span style={{ color:"#60a5fa" }}>Check it here first.</span>
          </h1>
          <p style={{ color:"#94a3b8", fontSize: isMobile ? 14 : 16, lineHeight:1.8, margin:"0 auto 32px", maxWidth:480, padding: isMobile ? "0 4px" : 0 }}>
            CyberShield lets you look up any phone number, website, or UPI ID to see if others have reported it as a scam. Built to help people in India stay safe online.
          </p>          {/* SCAM CHECKER */}
          <div ref={checkerRef} style={{ maxWidth:600, margin:"0 auto" }}>
            <form onSubmit={handleCheck}>
              <div style={{ display:"flex", flexDirection: isMobile ? "column" : "row", gap:8, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:14, padding:8 }}>
                <input type="text" value={query} onChange={e => { setQuery(e.target.value); setCheckResult(null); }}
                  placeholder="Phone number, URL, or UPI ID..."
                  style={{ flex:1, background:"none", border:"none", color:"white", fontSize:15, padding:"10px 12px", outline:"none", fontFamily:"inherit", width:"100%" }} />
                <button type="submit" disabled={checking || !query.trim()}
                  style={{ background:"linear-gradient(135deg,#ef4444,#f59e0b)", border:"none", color:"white", padding:"12px 20px", borderRadius:10, cursor: !query.trim() ? "not-allowed" : "pointer", fontSize:14, fontWeight:700, opacity: !query.trim() ? 0.5 : 1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, whiteSpace:"nowrap" }}>
                  {checking ? <span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }} /> : "🔍"} Check Now
                </button>
              </div>
            </form>

            <div style={{ display:"flex", gap:6, marginTop:10, justifyContent:"center", flexWrap:"wrap" }}>
              <span style={{ color:"#475569", fontSize:12 }}>Try:</span>
              {["9876543210","fake-jobs.com","lottery@scam.in"].map(ex => (
                <button key={ex} onClick={() => setQuery(ex)} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#64748b", padding:"3px 10px", borderRadius:20, cursor:"pointer", fontSize:12 }}>{ex}</button>
              ))}
            </div>

            {/* RESULT */}
            {checkResult && vc && checkResult.verdict !== "error" && (
              <div style={{ marginTop:16, background:vc.bg, border:`1px solid ${vc.border}`, borderRadius:12, padding:"16px", textAlign:"left" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom: checkResult.reports > 0 ? 12 : 0 }}>
                  <span style={{ fontSize:28, flexShrink:0 }}>{vc.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ color:vc.color, fontSize:17, fontWeight:800 }}>{vc.label}</div>
                    <div style={{ color:"#94a3b8", fontSize:13, marginTop:2 }}>
                      {checkResult.reports > 0 ? `Reported ${checkResult.reports} time${checkResult.reports>1?"s":""} · Avg Risk ${checkResult.avgRiskScore}` : "No reports found in our database"}
                    </div>
                    {checkResult.category && <span style={{ display:"inline-block", marginTop:6, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", color:"#e2e8f0", padding:"2px 10px", borderRadius:20, fontSize:12 }}>{scamTypeIcon[checkResult.category]||"⚠️"} {checkResult.category}</span>}
                  </div>
                </div>
                {checkResult.reports > 0 && (
                  <div style={{ paddingTop:10, borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                    <span style={{ color:"#64748b", fontSize:13 }}>Encountered this scam?</span>
                    <button onClick={() => navigate("/register")} style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"7px 14px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 }}>Report It →</button>
                  </div>
                )}
              </div>
            )}
            {checkResult?.verdict === "error" && <div style={{ marginTop:10, color:"#f87171", fontSize:13 }}>⚠️ Could not check. Please try again.</div>}
          </div>

          <div style={{ display:"flex", gap:10, justifyContent:"center", marginTop:28, flexWrap:"wrap", padding: isMobile ? "0 16px" : 0 }}>
            <button onClick={() => navigate("/report")} style={{ background:"linear-gradient(135deg,#ef4444,#f59e0b)", border:"none", color:"white", padding:"12px 24px", borderRadius:10, cursor:"pointer", fontSize:15, fontWeight:600, flex: isMobile ? 1 : "none" }}>🚨 Report Anonymously</button>
            <button onClick={() => navigate("/register")} style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"12px 24px", borderRadius:10, cursor:"pointer", fontSize:15, fontWeight:600, flex: isMobile ? 1 : "none" }}>Create Account →</button>
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section style={{ background:"rgba(255,255,255,0.02)", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding: isMobile ? "40px 16px" : "60px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:10 }}>
            <div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)", color:"#fca5a5", padding:"3px 10px", borderRadius:20, fontSize:11, marginBottom:6 }}>🔴 Live</div>
              <h2 style={{ color:"white", fontSize: isMobile ? 18 : 22, fontWeight:700, margin:0 }}>Trending Scams Right Now</h2>
            </div>
            <button onClick={() => navigate("/trending")} style={{ background:"none", border:"1px solid rgba(255,255,255,0.1)", color:"#94a3b8", padding:"7px 14px", borderRadius:8, cursor:"pointer", fontSize:13 }}>View All →</button>
          </div>

          {!trending ? (
            <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap:10 }}>
              {[1,2,3,4].map(i => <div key={i} style={{ background:"rgba(255,255,255,0.03)", borderRadius:10, height:70, animation:"pulse 1.5s ease-in-out infinite" }} />)}
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:20 }}>
              {/* Categories */}
              <div>
                <h3 style={{ color:"#64748b", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 12px" }}>Top Scam Types</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(trending.topCategories||[]).slice(0,5).map((cat,i) => {
                    const max = trending.topCategories[0]?.count||1;
                    const pct = Math.round((cat.count/max)*100);
                    return (
                      <div key={cat.category} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 12px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                          <span style={{ color:"white", fontSize:13 }}>{scamTypeIcon[cat.category]||"⚠️"} {cat.category}</span>
                          <span style={{ color:"#ef4444", fontSize:13, fontWeight:700 }}>{cat.count}</span>
                        </div>
                        <div style={{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:2 }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#ef4444,#f59e0b)", borderRadius:2 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top targets */}
              <div>
                <h3 style={{ color:"#64748b", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 12px" }}>Most Reported</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(trending.topTargets||[]).slice(0,5).map((t,i) => (
                    <div key={t.value} onClick={() => { setQuery(t.value); checkerRef.current?.scrollIntoView({behavior:"smooth"}); }}
                      style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor="rgba(239,68,68,0.3)"}
                      onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
                        <span style={{ background:"rgba(239,68,68,0.15)", color:"#f87171", width:20, height:20, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0 }}>{i+1}</span>
                        <div style={{ minWidth:0 }}>
                          <div style={{ color:"white", fontSize:13, fontWeight:600, fontFamily:"monospace", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.value}</div>
                          <div style={{ color:"#64748b", fontSize:11 }}>{scamTypeIcon[t.category]||"⚠️"} {t.category}</div>
                        </div>
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0, marginLeft:8 }}>
                        <div style={{ color:"#ef4444", fontSize:13, fontWeight:800 }}>{t.reports}×</div>
                        <div style={{ color:"#475569", fontSize:11 }}>{t.riskLevel}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding: isMobile ? "50px 16px" : "80px 24px", position:"relative", zIndex:1 }}>
        <div style={{ marginBottom:36 }}>
          <h2 style={{ fontSize: isMobile ? 20 : 28, fontWeight:700, margin:"0 0 6px" }}>How does it work?</h2>
          <p style={{ color:"#64748b", fontSize:14, margin:0 }}>Pretty straightforward, honestly.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 12 : 16 }}>
          {[
            { num:"1", icon:"🔍", title:"Search anything", desc:"Type a phone number, website link, or UPI ID you're unsure about." },
            { num:"2", icon:"📝", title:"File a report", desc:"If you got scammed, report it. Takes about 2 minutes." },
            { num:"3", icon:"⚡", title:"AI checks it", desc:"Our system scores the complaint and flags the scam target." },
            { num:"4", icon:"🛡️", title:"Others stay safe", desc:"Next person who searches that number sees your report." },
          ].map(item => (
            <div key={item.num} style={{ padding: isMobile ? "14px 10px" : "20px 16px", borderLeft: "2px solid rgba(59,130,246,0.3)" }}>
              <div style={{ fontSize: isMobile ? 22 : 26, marginBottom:10 }}>{item.icon}</div>
              <div style={{ color:"#3b82f6", fontSize:11, fontWeight:700, marginBottom:4 }}>0{item.num}</div>
              <h3 style={{ fontSize: isMobile ? 13 : 15, fontWeight:600, margin:"0 0 6px", color:"white" }}>{item.title}</h3>
              <p style={{ color:"#64748b", fontSize: isMobile ? 11 : 13, lineHeight:1.6, margin:0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background:"rgba(255,255,255,0.02)", borderTop:"1px solid rgba(255,255,255,0.06)", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding: isMobile ? "50px 16px" : "80px 24px" }}>
          <div style={{ marginBottom:36 }}>
            <h2 style={{ fontSize: isMobile ? 20 : 28, fontWeight:700, margin:"0 0 6px" }}>What CyberShield does</h2>
            <p style={{ color:"#64748b", fontSize:14, margin:0 }}>Built this to solve a real problem — too many people getting scammed with no way to check.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: isMobile ? 10 : 16 }}>
            {[
              { icon:"🔍", title:"Instant Scam Check", desc:"Search any phone, URL, or UPI ID for instant verdict." },
              { icon:"🧠", title:"AI Risk Analysis", desc:"Auto-classified by crime type, risk score, and priority." },
              { icon:"📊", title:"Live Intelligence", desc:"Trending scams updated in real time from reports." },
              { icon:"📁", title:"Evidence Upload", desc:"Attach screenshots or documents as proof." },
              { icon:"🔒", title:"Secure & Private", desc:"Your identity is protected. Reports stored securely." },
              { icon:"📧", title:"Critical Alerts", desc:"High-risk cases trigger immediate team alerts." },
            ].map(f => (
              <div key={f.title} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding: isMobile ? "14px 12px" : "20px 18px" }}>
                <div style={{ fontSize: isMobile ? 22 : 26, marginBottom:8 }}>{f.icon}</div>
                <h3 style={{ fontSize: isMobile ? 13 : 15, fontWeight:600, margin:"0 0 6px", color:"white" }}>{f.title}</h3>
                <p style={{ color:"#64748b", fontSize: isMobile ? 11 : 13, lineHeight:1.5, margin:0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position:"relative", zIndex:1, padding: isMobile ? "50px 16px" : "80px 24px", textAlign:"center" }}>
        <div style={{ maxWidth:520, margin:"0 auto" }}>
          <h2 style={{ fontSize: isMobile ? 22 : 34, fontWeight:700, margin:"0 0 12px", letterSpacing:"-0.5px" }}>Spotted a scam? Report it now.</h2>
          <p style={{ color:"#94a3b8", fontSize: isMobile ? 14 : 15, margin:"0 0 28px" }}>Every report helps protect someone else from being scammed.</p>          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => navigate("/register")} style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"12px 24px", borderRadius:10, cursor:"pointer", fontSize:15, fontWeight:600, flex: isMobile ? 1 : "none" }}>Create Free Account →</button>
            <button onClick={() => navigate("/check-scam")} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"white", padding:"12px 24px", borderRadius:10, cursor:"pointer", fontSize:15, flex: isMobile ? 1 : "none" }}>Check a Number</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"24px 16px", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <img src="/logo1.jpeg" alt="CyberShield" style={{ width:16, height:16, borderRadius:4, objectFit:"cover" }} />
            <span style={{ fontSize:15, fontWeight:700, color:"#94a3b8" }}>CyberShield</span>
          </div>
          {!isMobile && (
            <div style={{ display:"flex", gap:16 }}>
              <button onClick={() => navigate("/check-scam")} style={{ background:"none", border:"none", color:"#475569", fontSize:13, cursor:"pointer" }}>Scam Checker</button>
              <button onClick={() => navigate("/trending")} style={{ background:"none", border:"none", color:"#475569", fontSize:13, cursor:"pointer" }}>Trending</button>
              <button onClick={() => navigate("/report")} style={{ background:"none", border:"none", color:"#475569", fontSize:13, cursor:"pointer" }}>Report Anonymously</button>
              <button onClick={() => navigate("/api-docs")} style={{ background:"none", border:"none", color:"#475569", fontSize:13, cursor:"pointer" }}>API Docs</button>
              <button onClick={() => navigate("/login")} style={{ background:"none", border:"none", color:"#475569", fontSize:13, cursor:"pointer" }}>Login</button>
            </div>
          )}
          <p style={{ color:"#374151", fontSize:12, margin:0 }}>© 2026 CyberShield</p>
        </div>
      </footer>
    </div>
  );
}

const navBtn = (c) => ({ background:`${c}18`, border:`1px solid ${c}40`, color: c==="ef4444" ? "#fca5a5" : "#fcd34d", padding:"7px 12px", borderRadius:8, cursor:"pointer", fontSize:13 });
const mobileNavBtn = { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"white", padding:"11px 14px", borderRadius:8, cursor:"pointer", fontSize:14, textAlign:"left", width:"100%" };
