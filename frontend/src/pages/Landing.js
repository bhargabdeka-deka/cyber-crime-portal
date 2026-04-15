import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../services/api";

const scamTypeIcon = {
  "UPI Fraud":"💳","Phishing":"🎣","Job Scam":"💼","Lottery Scam":"🎰",
  "Romance Scam":"💔","Investment Scam":"📈","Identity Theft":"🪪",
  "Account Hacking":"🔓","Cyber Harassment":"😡","Other":"⚠️"
};

const verdictConfig = {
  safe:      { color:"#10b981", bg:"rgba(16,185,129,0.12)",  border:"rgba(16,185,129,0.3)",  icon:"✅", label:"No Reports Found" },
  caution:   { color:"#f59e0b", bg:"rgba(245,158,11,0.12)",  border:"rgba(245,158,11,0.3)",  icon:"⚠️", label:"Reported Once" },
  warning:   { color:"#f59e0b", bg:"rgba(245,158,11,0.12)",  border:"rgba(245,158,11,0.3)",  icon:"🚨", label:"Suspicious" },
  dangerous: { color:"#ef4444", bg:"rgba(239,68,68,0.12)",   border:"rgba(239,68,68,0.3)",   icon:"🔴", label:"Highly Dangerous" },
};

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled]       = useState(false);
  const [query, setQuery]             = useState("");
  const [checking, setChecking]       = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [trending, setTrending]       = useState(null);
  const checkerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user  = JSON.parse(localStorage.getItem("user") || "null");
    if (token && user) navigate(user.role === "admin" ? "/dashboard" : "/user-dashboard");
  }, [navigate]);

  // Load trending scams from real DB
  useEffect(() => {
    API.get("/scam/trending").then(res => setTrending(res.data)).catch(() => {});
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
    <div style={{ fontFamily:"'Segoe UI', system-ui, sans-serif", background:"#0a0f1e", minHeight:"100vh", color:"white" }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.1) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.08) 0%, transparent 60%)", pointerEvents:"none", zIndex:0 }} />

      {/* ── NAVBAR ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"14px 0", transition:"all 0.3s", background: scrolled ? "rgba(10,15,30,0.95)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:22 }}>⚔️</span>
            <span style={{ fontSize:20, fontWeight:700, letterSpacing:"-0.5px" }}>CyberShield</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <button onClick={() => checkerRef.current?.scrollIntoView({ behavior:"smooth" })} style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", color:"#fca5a5", padding:"7px 14px", borderRadius:8, cursor:"pointer", fontSize:13 }}>🔍 Check Scam</button>
            <button onClick={() => navigate("/trending")} style={{ background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.25)", color:"#fcd34d", padding:"7px 14px", borderRadius:8, cursor:"pointer", fontSize:13 }}>🔥 Trending</button>
            <button onClick={() => navigate("/login")} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.15)", color:"white", padding:"7px 16px", borderRadius:8, cursor:"pointer", fontSize:13 }}>Login</button>
            <button onClick={() => navigate("/register")} style={{ background:"linear-gradient(135deg, #3b82f6, #8b5cf6)", border:"none", color:"white", padding:"7px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 }}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"130px 24px 80px", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ display:"inline-block", background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.3)", color:"#fca5a5", padding:"6px 16px", borderRadius:20, fontSize:13, marginBottom:20 }}>
            🛡️ India's Scam Detection & Reporting Platform
          </div>
          <h1 style={{ fontSize:"clamp(36px, 6vw, 64px)", fontWeight:800, lineHeight:1.1, margin:"0 0 18px", letterSpacing:"-1.5px" }}>
            Check Before You<br />
            <span style={{ background:"linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Trust Anyone.
            </span>
          </h1>
          <p style={{ color:"#94a3b8", fontSize:18, lineHeight:1.7, margin:"0 auto 40px", maxWidth:520 }}>
            Search any phone number, link, or UPI ID instantly. See if it's been reported as a scam by others.
          </p>

          {/* ── INLINE SCAM CHECKER ── */}
          <div ref={checkerRef} style={{ maxWidth:600, margin:"0 auto" }}>
            <form onSubmit={handleCheck}>
              <div style={{ display:"flex", gap:8, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:14, padding:8 }}>
                <input
                  type="text"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setCheckResult(null); }}
                  placeholder="Enter phone number, URL, or UPI ID..."
                  style={{ flex:1, background:"none", border:"none", color:"white", fontSize:15, padding:"10px 12px", outline:"none", fontFamily:"inherit" }}
                />
                <button type="submit" disabled={checking || !query.trim()}
                  style={{ background:"linear-gradient(135deg, #ef4444, #f59e0b)", border:"none", color:"white", padding:"12px 24px", borderRadius:10, cursor: !query.trim() ? "not-allowed" : "pointer", fontSize:14, fontWeight:700, opacity: !query.trim() ? 0.5 : 1, display:"flex", alignItems:"center", gap:8, whiteSpace:"nowrap" }}>
                  {checking
                    ? <span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }} />
                    : "🔍"} Check Now
                </button>
              </div>
            </form>

            {/* Quick examples */}
            <div style={{ display:"flex", gap:8, marginTop:10, justifyContent:"center", flexWrap:"wrap" }}>
              <span style={{ color:"#475569", fontSize:12 }}>Try:</span>
              {["9876543210","fake-jobs.com","lottery@scam.in"].map(ex => (
                <button key={ex} type="button" onClick={() => setQuery(ex)}
                  style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#64748b", padding:"3px 10px", borderRadius:20, cursor:"pointer", fontSize:12 }}>
                  {ex}
                </button>
              ))}
            </div>

            {/* ── RESULT ── */}
            {checkResult && vc && checkResult.verdict !== "error" && (
              <div style={{ marginTop:16, background: vc.bg, border:`1px solid ${vc.border}`, borderRadius:12, padding:"18px 20px", textAlign:"left" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ fontSize:28 }}>{vc.icon}</span>
                    <div>
                      <div style={{ color: vc.color, fontSize:18, fontWeight:800 }}>{vc.label}</div>
                      <div style={{ color:"#94a3b8", fontSize:13 }}>
                        {checkResult.reports > 0
                          ? `Reported ${checkResult.reports} time${checkResult.reports > 1 ? "s" : ""} · Avg Risk ${checkResult.avgRiskScore}`
                          : "No reports found in our database"}
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    {checkResult.category && (
                      <span style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", color:"#e2e8f0", padding:"3px 10px", borderRadius:20, fontSize:12 }}>
                        {scamTypeIcon[checkResult.category] || "⚠️"} {checkResult.category}
                      </span>
                    )}
                    {checkResult.riskLevel && checkResult.riskLevel !== "LOW" && (
                      <span style={{ background: vc.bg, color: vc.color, border:`1px solid ${vc.border}`, padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600 }}>
                        {checkResult.riskLevel}
                      </span>
                    )}
                  </div>
                </div>
                {checkResult.reports > 0 && (
                  <div style={{ marginTop:14, paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ color:"#64748b", fontSize:13 }}>Encountered this scam?</span>
                    <button onClick={() => navigate("/register")}
                      style={{ background:"linear-gradient(135deg, #3b82f6, #8b5cf6)", border:"none", color:"white", padding:"7px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 }}>
                      Report It →
                    </button>
                  </div>
                )}
              </div>
            )}
            {checkResult?.verdict === "error" && (
              <div style={{ marginTop:12, color:"#f87171", fontSize:13 }}>⚠️ Could not check. Please try again.</div>
            )}
          </div>

          {/* Secondary CTAs */}
          <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:32, flexWrap:"wrap" }}>
            <button onClick={() => navigate("/register")} style={{ background:"linear-gradient(135deg, #3b82f6, #8b5cf6)", border:"none", color:"white", padding:"13px 28px", borderRadius:10, cursor:"pointer", fontSize:15, fontWeight:600 }}>
              Report a Scam →
            </button>
            <button onClick={() => navigate("/trending")} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"white", padding:"13px 28px", borderRadius:10, cursor:"pointer", fontSize:15 }}>
              🔥 View Trending Scams
            </button>
          </div>
        </div>
      </section>

      {/* ── TRENDING SCAMS (LIVE FROM DB) ── */}
      <section style={{ background:"rgba(255,255,255,0.02)", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"60px 24px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)", color:"#fca5a5", padding:"4px 12px", borderRadius:20, fontSize:12, marginBottom:8 }}>
                🔴 Live
              </div>
              <h2 style={{ color:"white", fontSize:22, fontWeight:700, margin:0 }}>Trending Scams Right Now</h2>
            </div>
            <button onClick={() => navigate("/trending")} style={{ background:"none", border:"1px solid rgba(255,255,255,0.1)", color:"#94a3b8", padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13 }}>
              View All →
            </button>
          </div>

          {!trending ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:12 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"16px", height:80, animation:"pulse 1.5s ease-in-out infinite" }} />
              ))}
            </div>
          ) : trending.topCategories?.length === 0 && trending.topTargets?.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 0" }}>
              <p style={{ color:"#475569", fontSize:14 }}>No scam reports yet. Be the first to report one.</p>
              <button onClick={() => navigate("/register")} style={{ marginTop:12, background:"linear-gradient(135deg, #3b82f6, #8b5cf6)", border:"none", color:"white", padding:"10px 20px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 }}>Report a Scam</button>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              {/* Top categories */}
              <div>
                <h3 style={{ color:"#64748b", fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 14px" }}>Top Scam Types</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {(trending.topCategories || []).slice(0,5).map((cat, i) => {
                    const max = trending.topCategories[0]?.count || 1;
                    const pct = Math.round((cat.count / max) * 100);
                    return (
                      <div key={cat.category} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"12px 14px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                          <span style={{ color:"white", fontSize:13 }}>{scamTypeIcon[cat.category] || "⚠️"} {cat.category}</span>
                          <span style={{ color:"#ef4444", fontSize:13, fontWeight:700 }}>{cat.count} reports</span>
                        </div>
                        <div style={{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:2 }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg, #ef4444, #f59e0b)", borderRadius:2 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Most reported targets */}
              <div>
                <h3 style={{ color:"#64748b", fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 14px" }}>Most Reported Numbers / Links</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(trending.topTargets || []).slice(0,5).map((t, i) => (
                    <div key={t.value} onClick={() => { setQuery(t.value); checkerRef.current?.scrollIntoView({ behavior:"smooth" }); }}
                      style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", transition:"border-color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ background:"rgba(239,68,68,0.15)", color:"#f87171", width:22, height:22, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0 }}>{i+1}</span>
                        <div>
                          <div style={{ color:"white", fontSize:13, fontWeight:600, fontFamily:"monospace" }}>{t.value}</div>
                          <div style={{ color:"#64748b", fontSize:11 }}>{scamTypeIcon[t.category] || "⚠️"} {t.category}</div>
                        </div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ color:"#ef4444", fontSize:13, fontWeight:800 }}>{t.reports}×</div>
                        <div style={{ color:"#475569", fontSize:11 }}>{t.riskLevel}</div>
                      </div>
                    </div>
                  ))}
                  {(!trending.topTargets || trending.topTargets.length === 0) && (
                    <div style={{ color:"#475569", fontSize:13, padding:"20px 0", textAlign:"center" }}>No targets reported yet.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ maxWidth:1200, margin:"0 auto", padding:"80px 24px", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ display:"inline-block", background:"rgba(59,130,246,0.12)", border:"1px solid rgba(59,130,246,0.25)", color:"#93c5fd", padding:"5px 14px", borderRadius:20, fontSize:12, marginBottom:14 }}>How It Works</div>
          <h2 style={{ fontSize:"clamp(24px, 4vw, 36px)", fontWeight:700, margin:0, letterSpacing:"-0.5px" }}>Simple. Fast. Effective.</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:20 }}>
          {[
            { step:"01", icon:"🔍", title:"Check First",      desc:"Enter any phone number, URL, or UPI ID to instantly see if it's been reported." },
            { step:"02", icon:"📝", title:"Report a Scam",    desc:"File a detailed complaint with evidence. Our AI classifies and scores it instantly." },
            { step:"03", icon:"🧠", title:"AI Analysis",      desc:"Every report updates our intelligence database and helps others stay safe." },
            { step:"04", icon:"🛡️", title:"Community Stays Safe", desc:"The more people report, the smarter our detection becomes for everyone." },
          ].map(item => (
            <div key={item.step} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"24px 20px", textAlign:"center" }}>
              <div style={{ fontSize:32, marginBottom:12 }}>{item.icon}</div>
              <div style={{ fontSize:11, color:"#475569", fontWeight:700, marginBottom:8, letterSpacing:"0.05em" }}>STEP {item.step}</div>
              <h3 style={{ fontSize:16, fontWeight:600, margin:"0 0 10px", color:"white" }}>{item.title}</h3>
              <p style={{ color:"#64748b", fontSize:13, lineHeight:1.6, margin:0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ background:"rgba(255,255,255,0.02)", borderTop:"1px solid rgba(255,255,255,0.06)", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"80px 24px" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ display:"inline-block", background:"rgba(139,92,246,0.12)", border:"1px solid rgba(139,92,246,0.25)", color:"#c4b5fd", padding:"5px 14px", borderRadius:20, fontSize:12, marginBottom:14 }}>Features</div>
            <h2 style={{ fontSize:"clamp(24px, 4vw, 36px)", fontWeight:700, margin:0, letterSpacing:"-0.5px" }}>Everything you need to stay safe online</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
            {[
              { icon:"🔍", title:"Instant Scam Check",      desc:"Search any phone, URL, or UPI ID and get an instant verdict from our database." },
              { icon:"🧠", title:"AI Risk Classification",  desc:"Every report is auto-classified by crime type, risk score, and priority." },
              { icon:"📊", title:"Live Intelligence Feed",  desc:"See trending scams and most-reported targets updated in real time." },
              { icon:"📁", title:"Evidence Upload",         desc:"Attach screenshots or documents as proof when filing a complaint." },
              { icon:"🔒", title:"Secure & Private",        desc:"Your identity is protected. Reports are stored securely on encrypted servers." },
              { icon:"📧", title:"Critical Alerts",         desc:"High-risk cases trigger immediate alerts to our response team." },
            ].map(f => (
              <div key={f.title} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"22px 20px" }}>
                <div style={{ fontSize:28, marginBottom:12 }}>{f.icon}</div>
                <h3 style={{ fontSize:15, fontWeight:600, margin:"0 0 8px", color:"white" }}>{f.title}</h3>
                <p style={{ color:"#64748b", fontSize:13, lineHeight:1.6, margin:0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position:"relative", zIndex:1, padding:"80px 24px", textAlign:"center" }}>
        <div style={{ maxWidth:560, margin:"0 auto" }}>
          <h2 style={{ fontSize:"clamp(24px, 4vw, 38px)", fontWeight:700, margin:"0 0 14px", letterSpacing:"-0.5px" }}>
            Spotted a scam? Report it now.
          </h2>
          <p style={{ color:"#94a3b8", fontSize:15, margin:"0 0 32px" }}>
            Every report you file helps protect someone else from being scammed.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => navigate("/register")} style={{ background:"linear-gradient(135deg, #3b82f6, #8b5cf6)", border:"none", color:"white", padding:"13px 28px", borderRadius:10, cursor:"pointer", fontSize:15, fontWeight:600, boxShadow:"0 0 24px rgba(59,130,246,0.35)" }}>
              Create Free Account →
            </button>
            <button onClick={() => navigate("/check-scam")} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", color:"white", padding:"13px 28px", borderRadius:10, cursor:"pointer", fontSize:15 }}>
              Check a Number First
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"28px 24px", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:18 }}>⚔️</span>
            <span style={{ fontSize:16, fontWeight:700, color:"#94a3b8" }}>CyberShield</span>
          </div>
          <div style={{ display:"flex", gap:16 }}>
            <button onClick={() => navigate("/check-scam")} style={{ background:"none", border:"none", color:"#475569", fontSize:13, cursor:"pointer" }}>Scam Checker</button>
            <button onClick={() => navigate("/trending")} style={{ background:"none", border:"none", color:"#475569", fontSize:13, cursor:"pointer" }}>Trending</button>
            <button onClick={() => navigate("/login")} style={{ background:"none", border:"none", color:"#475569", fontSize:13, cursor:"pointer" }}>Login</button>
          </div>
          <p style={{ color:"#374151", fontSize:12, margin:0 }}>© 2026 CyberShield</p>
        </div>
      </footer>
    </div>
  );
}
