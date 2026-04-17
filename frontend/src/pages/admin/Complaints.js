import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import Layout from "../../components/Layout";
import useWindowWidth from "../../hooks/useWindowWidth";

const BASE_URL = process.env.REACT_APP_API_URL;

const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
};

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
  if (score >= 80) return { label: "High",   color: "#ef4444" };
  if (score >= 50) return { label: "Medium", color: "#f59e0b" };
  return               { label: "Low",    color: "#10b981" };
};

const STEPS = ["Pending", "Investigating", "Resolved"];

export default function Complaints() {
  const [complaints, setComplaints]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalCount, setTotalCount]     = useState(0);
  const [priorityFilter, setPriority]   = useState("");
  const [statusFilter, setStatus]       = useState("");
  const [search, setSearch]             = useState("");
  const [sort, setSort]                 = useState("-createdAt");
  const [selected, setSelected]         = useState(null);
  const [updating, setUpdating]         = useState(null);
  const [toast, setToast]               = useState(null);
  const w = useWindowWidth();
  const isMobile = w < 768;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/complaints", {
        params: { page, limit: 8, priority: priorityFilter, status: statusFilter, search, sort }
      });
      setComplaints(res.data.complaints);
      setTotalPages(res.data.pages);
      setTotalCount(res.data.total || 0);
    } catch {
      showToast("Failed to load complaints", "error");
    } finally {
      setLoading(false);
    }
  }, [page, priorityFilter, statusFilter, search, sort]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      await API.put(`/complaints/${id}/status`, { status: newStatus });
      showToast(`Status updated to ${newStatus}`);
      fetchComplaints();
      if (selected?._id === id) setSelected(prev => ({ ...prev, status: newStatus }));
    } catch {
      showToast("Failed to update status", "error");
    } finally {
      setUpdating(null);
    }
  };

  const resetFilters = () => {
    setPriority(""); setStatus(""); setSearch(""); setSort("-createdAt"); setPage(1);
  };

  const hasFilters = priorityFilter || statusFilter || search;

  return (
    <Layout>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 2000, background: toast.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", border: `1px solid ${toast.type === "success" ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`, color: toast.type === "success" ? "#6ee7b7" : "#fca5a5", padding: "12px 18px", borderRadius: 10, fontSize: 14, backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 8 }}>
          {toast.type === "success" ? "✅" : "⚠️"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>All Complaints</h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>{totalCount} total complaint{totalCount !== 1 ? "s" : ""}</p>
        </div>
        <a href={`${process.env.REACT_APP_API_URL || ""}/api/complaints/export/csv`}
          style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)", color:"#6ee7b7", padding:"9px 16px", borderRadius:8, fontSize:13, fontWeight:600, textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}>
          📥 Export CSV
        </a>
      </div>

      {/* Filters */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 14 }}>🔍</span>
          <input type="text" placeholder="Search by Case ID..." value={search}
            onChange={e => { setPage(1); setSearch(e.target.value); }}
            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 12px 9px 36px", color: "white", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>

        {[
          { value: priorityFilter, setter: setPriority, options: [["", "All Priority"], ["Critical", "Critical"], ["High", "High"], ["Medium", "Medium"], ["Low", "Low"]] },
          { value: statusFilter,   setter: setStatus,   options: [["", "All Status"], ["Pending", "Pending"], ["Investigating", "Investigating"], ["Resolved", "Resolved"]] },
          { value: sort,           setter: setSort,     options: [["-createdAt", "Newest First"], ["createdAt", "Oldest First"], ["-riskScore", "Highest Risk"]] },
        ].map((sel, i) => (
          <select key={i} value={sel.value} onChange={e => { setPage(1); sel.setter(e.target.value); }}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 12px", color: "white", fontSize: 13, outline: "none", cursor: "pointer" }}>
            {sel.options.map(([v, l]) => <option key={v} value={v} style={{ background: "#1e293b" }}>{l}</option>)}
          </select>
        ))}

        {hasFilters && (
          <button onClick={resetFilters} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", padding: "9px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 36, height: 36, border: "3px solid rgba(59,130,246,0.3)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            <p style={{ color: "#64748b", fontSize: 14 }}>Loading complaints...</p>
          </div>
        </div>
      ) : complaints.length === 0 ? (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p style={{ color: "#64748b", fontSize: 14 }}>No complaints found{hasFilters ? " for the selected filters." : "."}</p>
          {hasFilters && <button onClick={resetFilters} style={{ marginTop: 12, background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>Clear Filters</button>}
        </div>
      ) : (
        <>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
            {/* Table Header — desktop only */}
            {!isMobile && (
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1.2fr 0.8fr 0.8fr 1.4fr 0.7fr 0.6fr", gap: 0, padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                {["Case ID", "User", "Crime Type", "Priority", "Risk", "Status", "Date", "Evidence"].map(h => (
                  <div key={h} style={{ color: "#64748b", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</div>
                ))}
              </div>
            )}

            {/* Rows */}
            {complaints.map((c, idx) => {
              const pm = priorityMeta[c.priority] || priorityMeta.Low;
              const sm = statusMeta[c.status] || statusMeta.Pending;
              const rm = riskMeta(c.riskScore);
              const isCritical = c.priority === "Critical";

              if (isMobile) {
                return (
                  <div key={c._id} onClick={() => setSelected(c)}
                    style={{ padding:"14px 16px", borderBottom: idx < complaints.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: isCritical ? "rgba(239,68,68,0.04)" : "transparent", borderLeft: isCritical ? "3px solid rgba(239,68,68,0.5)" : "3px solid transparent", cursor:"pointer" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                      <div>
                        <div style={{ color:"white", fontSize:13, fontWeight:700 }}>{c.caseId}</div>
                        <div style={{ color:"#64748b", fontSize:12, marginTop:2 }}>{c.user?.name} · {c.crimeType}</div>
                      </div>
                      <span style={{ background:pm.bg, color:pm.color, border:`1px solid ${pm.border}`, padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, flexShrink:0 }}>{c.priority}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
                      <div onClick={e => e.stopPropagation()}>
                        <select value={c.status} disabled={updating===c._id} onChange={e => handleStatusChange(c._id, e.target.value)}
                          style={{ background:sm.bg, border:`1px solid ${sm.border}`, color:sm.color, padding:"5px 10px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", outline:"none" }}>
                          <option value="Pending" style={{ background:"#1e293b",color:"white" }}>⏳ Pending</option>
                          <option value="Investigating" style={{ background:"#1e293b",color:"white" }}>🔍 Investigating</option>
                          <option value="Resolved" style={{ background:"#1e293b",color:"white" }}>✅ Resolved</option>
                        </select>
                      </div>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span style={{ color:rm.color, fontSize:13, fontWeight:700 }}>Risk {c.riskScore}</span>
                        <span style={{ color:"#64748b", fontSize:12 }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={c._id}
                  style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1.2fr 0.8fr 0.8fr 1.4fr 0.7fr 0.6fr", gap: 0, padding: "14px 20px", borderBottom: idx < complaints.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: isCritical ? "rgba(239,68,68,0.04)" : "transparent", borderLeft: isCritical ? "3px solid rgba(239,68,68,0.5)" : "3px solid transparent", cursor: "pointer", transition: "background 0.15s", alignItems: "center" }}
                  onClick={() => setSelected(c)}
                  onMouseEnter={e => e.currentTarget.style.background = isCritical ? "rgba(239,68,68,0.07)" : "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = isCritical ? "rgba(239,68,68,0.04)" : "transparent"}>

                  <div>
                    <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{c.caseId}</div>
                  </div>

                  <div style={{ color: "#94a3b8", fontSize: 13 }}>{c.user?.name || "—"}</div>

                  <div style={{ color: "#94a3b8", fontSize: 13 }}>{c.crimeType}</div>

                  <div>
                    <span style={{ background: pm.bg, color: pm.color, border: `1px solid ${pm.border}`, padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{c.priority}</span>
                  </div>

                  <div style={{ color: rm.color, fontSize: 13, fontWeight: 700 }}>{c.riskScore}</div>

                  <div onClick={e => e.stopPropagation()}>
                    <select value={c.status} disabled={updating === c._id}
                      onChange={e => handleStatusChange(c._id, e.target.value)}
                      style={{ background: sm.bg, border: `1px solid ${sm.border}`, color: sm.color, padding: "5px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", outline: "none", opacity: updating === c._id ? 0.5 : 1 }}>
                      <option value="Pending" style={{ background: "#1e293b", color: "white" }}>⏳ Pending</option>
                      <option value="Investigating" style={{ background: "#1e293b", color: "white" }}>🔍 Investigating</option>
                      <option value="Resolved" style={{ background: "#1e293b", color: "white" }}>✅ Resolved</option>
                    </select>
                  </div>

                  <div style={{ color: "#64748b", fontSize: 12 }}>{new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>

                  <div onClick={e => e.stopPropagation()}>
                    {c.evidence ? (
                      <a href={buildImageUrl(c.evidence)} target="_blank" rel="noreferrer"
                        style={{ color: "#60a5fa", fontSize: 12, textDecoration: "none", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", padding: "3px 8px", borderRadius: 6 }}>
                        View
                      </a>
                    ) : (
                      <span style={{ color: "#475569", fontSize: 12 }}>None</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 12 }}>
              <span style={{ color: "#64748b", fontSize: 13 }}>Page {page} of {totalPages}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: page === 1 ? "#475569" : "white", padding: "7px 14px", borderRadius: 8, cursor: page === 1 ? "not-allowed" : "pointer", fontSize: 13 }}>
                  ← Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ background: p === page ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${p === page ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.1)"}`, color: p === page ? "#60a5fa" : "#94a3b8", padding: "7px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: p === page ? 600 : 400 }}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: page === totalPages ? "#475569" : "white", padding: "7px 14px", borderRadius: 8, cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: 13 }}>
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* DETAIL MODAL */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", zIndex: 1000, padding: isMobile ? 0 : 16 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: isMobile ? "16px 16px 0 0" : 16, width: "100%", maxWidth: isMobile ? "100%" : 540, maxHeight: isMobile ? "90vh" : "88vh", overflowY: "auto", padding: isMobile ? "20px 16px" : 28 }}>

            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h3 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>{selected.caseId}</h3>
                <span style={{ color: "#64748b", fontSize: 13 }}>{selected.crimeType}</span>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#94a3b8", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            {/* User Info */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 14px", marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                {selected.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{selected.user?.name || "Unknown"}</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>{selected.user?.email || "—"}</div>
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {[
                { label: `${(statusMeta[selected.status] || statusMeta.Pending).icon} ${selected.status}`, meta: statusMeta[selected.status] || statusMeta.Pending },
                { label: selected.priority, meta: priorityMeta[selected.priority] || priorityMeta.Low },
                { label: `Risk ${riskMeta(selected.riskScore).label} · ${selected.riskScore}`, meta: { color: riskMeta(selected.riskScore).color, bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)" } },
              ].map((b, i) => (
                <span key={i} style={{ background: b.meta.bg, color: b.meta.color, border: `1px solid ${b.meta.border}`, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{b.label}</span>
              ))}
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: "#64748b", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Description</div>
              <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.7, margin: 0, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "12px 14px" }}>
                {selected.description}
              </p>
            </div>

            {/* Status Timeline */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: "#64748b", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Status Timeline</div>
              <div style={{ display: "flex" }}>
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

            {/* Update Status */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: "#64748b", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Update Status</div>
              <div style={{ display: "flex", gap: 8 }}>
                {STEPS.map(step => {
                  const sm = statusMeta[step];
                  const active = selected.status === step;
                  return (
                    <button key={step} onClick={() => handleStatusChange(selected._id, step)}
                      disabled={active || updating === selected._id}
                      style={{ flex: 1, padding: "9px 8px", borderRadius: 8, border: `1px solid ${active ? sm.border : "rgba(255,255,255,0.1)"}`, background: active ? sm.bg : "rgba(255,255,255,0.03)", color: active ? sm.color : "#94a3b8", cursor: active ? "default" : "pointer", fontSize: 12, fontWeight: active ? 600 : 400 }}>
                      {sm.icon} {step}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Evidence */}
            {selected.evidence && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: "#64748b", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Evidence</div>
                {/\.(jpg|jpeg|png|gif|webp)/i.test(selected.evidence) || selected.evidence.startsWith("http") ? (
                  <img src={buildImageUrl(selected.evidence)} alt="Evidence"
                    style={{ width: "100%", borderRadius: 10, objectFit: "cover", maxHeight: 220, border: "1px solid rgba(255,255,255,0.08)" }} />
                ) : null}
                <a href={buildImageUrl(selected.evidence)} target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, color: "#60a5fa", fontSize: 13, textDecoration: "none" }}>
                  📎 View / Download Evidence
                </a>
              </div>
            )}

            <div style={{ color: "#475569", fontSize: 12, marginBottom: 16 }}>
              Filed on {new Date(selected.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </div>

            <button onClick={() => setSelected(null)}
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "11px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
