import { useEffect, useState } from "react";
import API from "../../services/api";
import UserLayout from "../../layouts/UserLayout";
import { useNavigate } from "react-router-dom";
import useWindowWidth from "../../hooks/useWindowWidth";

const BASE_URL = process.env.REACT_APP_API_URL;

const statusMeta = {
  Pending:       { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)",  icon: "⏳" },
  Investigating: { color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.25)",  icon: "🔍" },
  Resolved:      { color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)",  icon: "✅" },
};

const priorityMeta = {
  Critical: { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)" },
  High:     { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)" },
  Medium:   { color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.25)" },
  Low:      { color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)" },
};

const riskMeta = (score) => {
  if (score >= 80) return { label: "High",   color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)" };
  if (score >= 50) return { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)" };
  return               { label: "Low",    color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)" };
};

const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
};

const STEPS = ["Pending", "Investigating", "Resolved"];

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const w = useWindowWidth();
  const isMobile = w < 640;

  useEffect(() => {
    API.get("/complaints/my")
      .then(res => setComplaints(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openDetails = async (id) => {
    try {
      const res = await API.get(`/complaints/${id}`);
      setSelected(res.data);
    } catch {}
  };

  const filtered = filter === "All" ? complaints : complaints.filter(c => c.status === filter);

  if (loading) {
    return (
      <UserLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 36, height: 36, border: "3px solid rgba(59,130,246,0.3)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            <p style={{ color: "#64748b", fontSize: 14 }}>Loading complaints...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>My Complaints</h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>{complaints.length} complaint{complaints.length !== 1 ? "s" : ""} filed</p>
        </div>
        <button onClick={() => navigate("/submit-complaint")}
          style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "white", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          + New Complaint
        </button>
      </div>

      {/* Filter Tabs */}
      {complaints.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {["All", "Pending", "Investigating", "Resolved"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "6px 16px", borderRadius: 20, border: filter === f ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.08)", background: filter === f ? "rgba(59,130,246,0.15)" : "transparent", color: filter === f ? "#60a5fa" : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: filter === f ? 600 : 400 }}>
              {f} {f === "All" ? `(${complaints.length})` : `(${complaints.filter(c => c.status === f).length})`}
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {complaints.length === 0 ? (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <h3 style={{ color: "white", fontSize: 16, fontWeight: 600, margin: "0 0 8px" }}>No complaints yet</h3>
          <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 20px" }}>When you file a complaint, it will appear here.</p>
          <button onClick={() => navigate("/submit-complaint")}
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "white", padding: "10px 22px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            File First Complaint
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "40px 24px", textAlign: "center" }}>
          <p style={{ color: "#64748b", fontSize: 14 }}>No {filter} complaints.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(c => {
            const sm = statusMeta[c.status] || statusMeta.Pending;
            const pm = priorityMeta[c.priority] || priorityMeta.Low;
            const rm = riskMeta(c.riskScore);
            return (
              <div key={c._id} onClick={() => openDetails(c._id)}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px", cursor: "pointer", transition: "border-color 0.2s, background 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"; e.currentTarget.style.background = "rgba(59,130,246,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>

                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  {/* Left */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ color: "white", fontSize: 14, fontWeight: 700 }}>{c.caseId}</span>
                      <span style={{ background: pm.bg, color: pm.color, border: `1px solid ${pm.border}`, padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{c.priority}</span>
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 4 }}>{c.title}</div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>{c.crimeType} · {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>

                  {/* Right */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ background: rm.bg, color: rm.color, border: `1px solid ${rm.border}`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                      Risk {rm.label} · {c.riskScore}
                    </span>
                    <span style={{ background: sm.bg, color: sm.color, border: `1px solid ${sm.border}`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                      {sm.icon} {c.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", gap: 0 }}>
                    {STEPS.map((step, i) => {
                      const stepIdx = STEPS.indexOf(c.status);
                      const done = i <= stepIdx;
                      return (
                        <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: i === 0 ? "flex-start" : i === STEPS.length - 1 ? "flex-end" : "center" }}>
                          <div style={{ height: 3, width: "100%", background: done ? sm.color : "rgba(255,255,255,0.07)", borderRadius: i === 0 ? "2px 0 0 2px" : i === STEPS.length - 1 ? "0 2px 2px 0" : 0, transition: "background 0.3s" }} />
                          <span style={{ color: done ? sm.color : "#475569", fontSize: 10, marginTop: 4 }}>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)", display:"flex", alignItems: isMobile ? "flex-end" : "center", justifyContent:"center", zIndex:1000, padding: isMobile ? 0 : 16 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background:"#1e293b", border:"1px solid rgba(255,255,255,0.1)", borderRadius: isMobile ? "16px 16px 0 0" : 16, width:"100%", maxWidth: isMobile ? "100%" : 520, maxHeight: isMobile ? "90vh" : "85vh", overflowY:"auto", padding: isMobile ? "20px 16px" : 28 }}>

            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h3 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>{selected.caseId}</h3>
                <span style={{ color: "#64748b", fontSize: 13 }}>{selected.crimeType}</span>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#94a3b8", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            {/* Badges */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {[
                { label: `${(statusMeta[selected.status] || statusMeta.Pending).icon} ${selected.status}`, meta: statusMeta[selected.status] || statusMeta.Pending },
                { label: selected.priority, meta: priorityMeta[selected.priority] || priorityMeta.Low },
                { label: `Risk ${riskMeta(selected.riskScore).label} · ${selected.riskScore}`, meta: riskMeta(selected.riskScore) },
              ].map((b, i) => (
                <span key={i} style={{ background: b.meta.bg, color: b.meta.color, border: `1px solid ${b.meta.border}`, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{b.label}</span>
              ))}
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: "#64748b", fontSize: 12, marginBottom: 6 }}>DESCRIPTION</div>
              <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.7, margin: 0, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "12px 14px" }}>
                {selected.description}
              </p>
            </div>

            {/* Status Timeline */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: "#64748b", fontSize: 12, marginBottom: 10 }}>STATUS TIMELINE</div>
              <div style={{ display: "flex", gap: 0 }}>
                {STEPS.map((step, i) => {
                  const stepIdx = STEPS.indexOf(selected.status);
                  const done = i <= stepIdx;
                  const sm = statusMeta[selected.status] || statusMeta.Pending;
                  return (
                    <div key={step} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ height: 4, background: done ? sm.color : "rgba(255,255,255,0.07)", borderRadius: i === 0 ? "2px 0 0 2px" : i === STEPS.length - 1 ? "0 2px 2px 0" : 0 }} />
                      <span style={{ color: done ? sm.color : "#475569", fontSize: 11, marginTop: 6, display: "block" }}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date */}
            <div style={{ color: "#64748b", fontSize: 12, marginBottom: 20 }}>
              Filed on {new Date(selected.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </div>

            {/* Evidence */}
            {selected.evidence && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: "#64748b", fontSize: 12, marginBottom: 8 }}>EVIDENCE</div>
                {selected.evidence.match(/\.(jpg|jpeg|png|gif|webp)$/i) || selected.evidence.startsWith("http") ? (
                  <img src={buildImageUrl(selected.evidence)} alt="Evidence"
                    style={{ width: "100%", borderRadius: 10, objectFit: "cover", maxHeight: 240, border: "1px solid rgba(255,255,255,0.08)" }} />
                ) : null}
                <a href={buildImageUrl(selected.evidence)} target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, color: "#60a5fa", fontSize: 13, textDecoration: "none" }}>
                  📎 View / Download Evidence
                </a>
              </div>
            )}

            <button onClick={() => setSelected(null)}
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "11px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
