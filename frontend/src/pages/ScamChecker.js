import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import useWindowWidth from "../hooks/useWindowWidth";

const verdictConfig = {
  safe:      { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)",  icon: "✅", title: "No Reports Found",   sub: "This number/link has not been reported in our database." },
  caution:   { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  icon: "⚠️", title: "Reported Once",       sub: "Exercise caution. This has been reported once." },
  warning:   { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  icon: "🚨", title: "Suspicious",          sub: "Multiple reports found. Avoid engaging with this." },
  dangerous: { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)",   icon: "🔴", title: "Highly Dangerous",    sub: "Confirmed scam. Do NOT engage. Report to authorities." },
};

export default function ScamChecker() {
  const [query, setQuery]     = useState("");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const navigate = useNavigate();
  const w = useWindowWidth();
  const isMobile = w < 640;

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await API.get("/scam/check", { params: { query: query.trim() } });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Check failed. Try again.");
    } finally { setLoading(false); }
  };

  const vc = result ? (verdictConfig[result.verdict] || verdictConfig.safe) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "white" }}>
      {/* BG */}
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 30% 40%, rgba(59,130,246,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(139,92,246,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,15,30,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => navigate("/")}>
          <span style={{ fontSize: 20 }}>⚔️</span>
          <span style={{ fontWeight: 700, fontSize: 16 }}>CyberShield</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => navigate("/trending")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>Trending Scams</button>
          <button onClick={() => navigate("/login")} style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "white", padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Login</button>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: isMobile ? "80px 16px 40px" : "60px 24px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd", padding: "5px 14px", borderRadius: 20, fontSize: 12, marginBottom: 16 }}>🔍 Scam Intelligence Database</div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
            Check Before You <span style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Trust</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 16, margin: 0 }}>Search any phone number, URL, UPI ID, or email to check if it's been reported as a scam.</p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleCheck} style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 8 }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter phone number, URL, UPI ID, or email..."
              style={{ flex: 1, background: "none", border: "none", color: "white", fontSize: 15, padding: "10px 12px", outline: "none", fontFamily: "inherit" }}
            />
            <button type="submit" disabled={loading || !query.trim()}
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "white", padding: "12px 24px", borderRadius: 10, cursor: loading || !query.trim() ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 600, opacity: !query.trim() ? 0.5 : 1, display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
              {loading ? <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> : "🔍"} Check Now
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {["9876543210", "fake-jobs.com", "lottery@scam.in"].map(ex => (
              <button key={ex} type="button" onClick={() => setQuery(ex)}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b", padding: "4px 12px", borderRadius: 20, cursor: "pointer", fontSize: 12 }}>
                {ex}
              </button>
            ))}
          </div>
        </form>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", padding: "12px 16px", borderRadius: 10, fontSize: 14, marginBottom: 20 }}>⚠️ {error}</div>
        )}

        {/* Result */}
        {result && vc && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Verdict Card */}
            <div style={{ background: vc.bg, border: `1px solid ${vc.border}`, borderRadius: 14, padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <span style={{ fontSize: 40 }}>{vc.icon}</span>
                <div>
                  <div style={{ color: vc.color, fontSize: 22, fontWeight: 800 }}>{vc.title}</div>
                  <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 2 }}>{vc.sub}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
                {[
                  { label: "Reports Found",  value: result.reports },
                  { label: "Avg Risk Score", value: result.avgRiskScore || result.avgRisk || "—" },
                  { label: "Risk Level",     value: result.riskLevel || "—" },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                    <div style={{ color: vc.color, fontSize: 24, fontWeight: 800 }}>{s.value}</div>
                    <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Category + Locations */}
              <div style={{ marginTop: 14, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {result.category && (
                  <span style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#e2e8f0", padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>
                    🎯 {result.category}
                  </span>
                )}
                {result.type && (
                  <span style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>
                    {result.type}
                  </span>
                )}
                {result.locations?.map(loc => (
                  <span key={loc} style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#93c5fd", padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>
                    📍 {loc}
                  </span>
                ))}
              </div>

              {result.description && result.status !== "SAFE" && (
                <div style={{ marginTop: 14, background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>LATEST REPORT DESCRIPTION</div>
                  <div style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.6 }}>{result.description}</div>
                </div>
              )}

              {result.lastReportedAt && result.status !== "SAFE" && (
                <div style={{ marginTop: 10, color: "#475569", fontSize: 12 }}>
                  Last reported: {new Date(result.lastReportedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              )}
            </div>

            {/* Related Case IDs */}
            {result.relatedCaseIds?.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px" }}>
                <h3 style={{ color: "white", fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>Related Case IDs ({result.relatedCaseIds.length})</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {result.relatedCaseIds.map(id => (
                    <span key={id} style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#93c5fd", padding: "4px 12px", borderRadius: 8, fontSize: 12, fontFamily: "monospace" }}>{id}</span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ color: "white", fontSize: 14, fontWeight: 600 }}>Encountered this scam?</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>File a report to help protect others.</div>
              </div>
              <button onClick={() => navigate("/register")}
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "white", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                Report This Scam →
              </button>
            </div>
          </div>
        )}

        {/* How it works */}
        {!result && !loading && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 16 }}>
            {[
              { icon: "📱", title: "Phone Numbers", desc: "Check if a number has been reported for fraud calls or SMS scams." },
              { icon: "🔗", title: "URLs & Links", desc: "Verify if a website or link is a known phishing or scam site." },
              { icon: "💳", title: "UPI / Email IDs", desc: "Check if a UPI ID or email has been used in financial fraud." },
            ].map(c => (
              <div key={c.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 16px" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{c.title}</div>
                <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.5 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
