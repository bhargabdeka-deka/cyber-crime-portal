import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const scamTypeIcon = {
  "UPI Fraud": "💳", "Phishing": "🎣", "Job Scam": "💼",
  "Lottery Scam": "🎰", "Romance Scam": "💔", "Investment Scam": "📈",
  "Identity Theft": "🪪", "Account Hacking": "🔓", "Cyber Harassment": "😡", "Other": "⚠️"
};

const riskColor = (score) => score >= 80 ? "#ef4444" : score >= 50 ? "#f59e0b" : "#10b981";

export default function Trending() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/complaints/trending")
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "white" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 70% 30%, rgba(239,68,68,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 70%, rgba(59,130,246,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,15,30,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => navigate("/")}>
          <span style={{ fontSize: 20 }}>⚔️</span>
          <span style={{ fontWeight: 700, fontSize: 16 }}>CyberShield</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => navigate("/check-scam")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>Scam Checker</button>
          <button onClick={() => navigate("/login")} style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "white", padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Login</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "inline-block", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", padding: "5px 14px", borderRadius: 20, fontSize: 12, marginBottom: 16 }}>🔥 Live Intelligence</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, margin: "0 0 10px", letterSpacing: "-0.5px" }}>Trending Scams</h1>
          <p style={{ color: "#94a3b8", fontSize: 15, margin: 0 }}>Real-time scam intelligence from community reports. Stay informed, stay safe.</p>
        </div>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 36, height: 36, border: "3px solid rgba(59,130,246,0.3)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
              <p style={{ color: "#64748b", fontSize: 14 }}>Loading intelligence data...</p>
            </div>
          </div>
        ) : !data ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <p style={{ color: "#64748b" }}>No data available yet.</p>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 36 }}>
              {[
                { icon: "📋", label: "Total Reports",    value: (data.topTargets?.reduce((s, t) => s + t.count, 0) || 0), color: "#60a5fa" },
                { icon: "🔥", label: "Reports This Week", value: data.recentCount || 0,                                    color: "#f59e0b" },
                { icon: "🎯", label: "Scam Types Tracked", value: data.topScamTypes?.length || 0,                          color: "#a78bfa" },
                { icon: "🚨", label: "High Risk Targets",  value: data.topTargets?.filter(t => t.avgRisk >= 70).length || 0, color: "#ef4444" },
              ].map(s => (
                <div key={s.label} style={{ background: `${s.color}12`, border: `1px solid ${s.color}30`, borderRadius: 12, padding: "18px 16px" }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

              {/* Top Scam Types */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px" }}>
                <h3 style={{ color: "white", fontSize: 15, fontWeight: 600, margin: "0 0 18px" }}>🎯 Top Scam Categories</h3>
                {data.topScamTypes?.length === 0 ? (
                  <p style={{ color: "#475569", fontSize: 13 }}>No data yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {data.topScamTypes?.map((t, i) => {
                      const maxCount = data.topScamTypes[0]?.count || 1;
                      const pct = Math.round((t.count / maxCount) * 100);
                      return (
                        <div key={t.scamType}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ color: "#e2e8f0", fontSize: 13 }}>{scamTypeIcon[t.scamType] || "⚠️"} {t.scamType}</span>
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                              <span style={{ color: riskColor(t.avgRisk), fontSize: 11 }}>Avg Risk {t.avgRisk}</span>
                              <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>{t.count}</span>
                            </div>
                          </div>
                          <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, #3b82f6, #8b5cf6)`, borderRadius: 2, transition: "width 0.6s" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Latest Reports */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px" }}>
                <h3 style={{ color: "white", fontSize: 15, fontWeight: 600, margin: "0 0 18px" }}>🕐 Latest Reports</h3>
                {data.latest?.length === 0 ? (
                  <p style={{ color: "#475569", fontSize: 13 }}>No reports yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {data.latest?.map((r, i) => (
                      <div key={r.caseId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < data.latest.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                        <div>
                          <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{r.title}</div>
                          <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{scamTypeIcon[r.scamType] || "⚠️"} {r.scamType} {r.location ? `· ${r.location}` : ""}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ color: riskColor(r.riskScore), fontSize: 12, fontWeight: 700 }}>Risk {r.riskScore}</div>
                          <div style={{ color: "#475569", fontSize: 11 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Most Reported Targets */}
            {data.topTargets?.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px", marginBottom: 24 }}>
                <h3 style={{ color: "white", fontSize: 15, fontWeight: 600, margin: "0 0 18px" }}>🎯 Most Reported Numbers / Links</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
                  {data.topTargets.map((t, i) => (
                    <div key={t.target} onClick={() => navigate(`/check-scam?q=${encodeURIComponent(t.target)}`)}
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "border-color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <span style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
                          <span style={{ color: "white", fontSize: 13, fontWeight: 600, fontFamily: "monospace" }}>{t.target}</span>
                        </div>
                        <div style={{ color: "#64748b", fontSize: 11 }}>{scamTypeIcon[t.scamType] || "⚠️"} {t.scamType}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "#ef4444", fontSize: 14, fontWeight: 800 }}>{t.count}×</div>
                        <div style={{ color: riskColor(t.avgRisk), fontSize: 11 }}>Risk {t.avgRisk}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 14, padding: "28px", textAlign: "center" }}>
              <h3 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>Spotted a scam not listed here?</h3>
              <p style={{ color: "#94a3b8", fontSize: 14, margin: "0 0 20px" }}>Report it to help protect others in the community.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => navigate("/check-scam")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white", padding: "10px 22px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>Check a Number/Link</button>
                <button onClick={() => navigate("/register")} style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "white", padding: "10px 22px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Report a Scam →</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
