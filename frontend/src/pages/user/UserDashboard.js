import { useEffect, useState } from "react";
import API from "../../services/api";
import UserLayout from "../../layouts/UserLayout";
import { useNavigate } from "react-router-dom";
import useWindowWidth from "../../hooks/useWindowWidth";
import {
  BarChart, Bar, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const statusConfig = {
  Pending:      { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)",  icon: "⏳" },
  Investigating:{ color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.25)",  icon: "🔍" },
  Resolved:     { color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)",  icon: "✅" },
};

const priorityColor = { Critical: "#ef4444", High: "#f59e0b", Medium: "#3b82f6", Low: "#10b981" };

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px" }}>
        <p style={{ color: "#94a3b8", fontSize: 12, margin: "0 0 4px" }}>{label}</p>
        <p style={{ color: "white", fontSize: 16, fontWeight: 700, margin: 0 }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function UserDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [impact, setImpact] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const w = useWindowWidth();
  const isMobile = w < 640;

  useEffect(() => {
    API.get("/complaints/my")
      .then(res => setComplaints(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
    API.get("/users/impact")
      .then(res => setImpact(res.data))
      .catch(() => {});
  }, []);

  const total        = complaints.length;
  const pending      = complaints.filter(c => c.status === "Pending").length;
  const investigating= complaints.filter(c => c.status === "Investigating").length;
  const resolved     = complaints.filter(c => c.status === "Resolved").length;
  const highRisk     = complaints.filter(c => c.riskScore >= 80).length;

  const chartData = [
    { status: "Pending",       count: pending,       fill: "#f59e0b" },
    { status: "Investigating", count: investigating, fill: "#3b82f6" },
    { status: "Resolved",      count: resolved,      fill: "#10b981" },
  ];

  const recent = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const statCards = [
    { label: "Total Filed",    value: total,        icon: "📋", color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.2)" },
    { label: "Pending",        value: pending,      icon: "⏳", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
    { label: "Investigating",  value: investigating,icon: "🔍", color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.2)" },
    { label: "Resolved",       value: resolved,     icon: "✅", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
    { label: "High Risk",      value: highRisk,     icon: "🚨", color: "#ef4444", bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.2)" },
  ];

  if (loading) {
    return (
      <UserLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 36, height: 36, border: "3px solid rgba(59,130,246,0.3)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            <p style={{ color: "#64748b", fontSize: 14 }}>Loading your dashboard...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>
          {greeting}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
          {total === 0 ? "You haven't filed any complaints yet." : `You have ${total} complaint${total > 1 ? "s" : ""} on record.`}
        </p>
      </div>

      {/* Impact Banner — shown when user has reports with targets */}
      {impact && impact.estimatedProtected > 0 && (
        <div style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:12, padding:"14px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ fontSize:28 }}>🛡️</span>
          <div>
            <div style={{ color:"#6ee7b7", fontSize:15, fontWeight:700 }}>
              Your reports helped ~{impact.estimatedProtected} {impact.estimatedProtected === 1 ? "person" : "people"} avoid this scam
            </div>
            <div style={{ color:"#64748b", fontSize:13, marginTop:2 }}>
              Keep reporting — every complaint makes the database smarter.
            </div>
          </div>
        </div>
      )}

      {/* Quick Action — show only if no complaints */}
      {total === 0 && (
        <div style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 14, padding: "24px 28px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h3 style={{ color: "white", fontSize: 16, fontWeight: 600, margin: "0 0 6px" }}>Ready to report a cyber crime?</h3>
            <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>File your first complaint and our AI will analyze it instantly.</p>
          </div>
          <button onClick={() => navigate("/submit-complaint")} style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "white", padding: "10px 22px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>
            File Complaint →
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        {statCards.map(card => (
          <div key={card.label} style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: 12, padding: "18px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: card.color, lineHeight: 1 }}>{card.value}</div>
            <div style={{ color: "#64748b", fontSize: 12, marginTop: 6 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Chart + Recent side by side */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* Chart */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 16px" }}>
          <h3 style={{ color: "white", fontSize: 14, fontWeight: 600, margin: "0 0 20px" }}>Status Breakdown</h3>
          {total === 0 ? (
            <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: "#475569", fontSize: 13 }}>No data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="status" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status Summary */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px" }}>
          <h3 style={{ color: "white", fontSize: 14, fontWeight: 600, margin: "0 0 20px" }}>Case Status</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {Object.entries(statusConfig).map(([status, cfg]) => {
              const count = complaints.filter(c => c.status === status).length;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={status}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: "#94a3b8", fontSize: 13 }}>{cfg.icon} {status}</span>
                    <span style={{ color: cfg.color, fontSize: 13, fontWeight: 600 }}>{count}</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: cfg.color, borderRadius: 2, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Complaints */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ color: "white", fontSize: 14, fontWeight: 600, margin: 0 }}>Recent Complaints</h3>
          {total > 0 && (
            <button onClick={() => navigate("/my-complaints")} style={{ background: "none", border: "none", color: "#60a5fa", fontSize: 13, cursor: "pointer" }}>View all →</button>
          )}
        </div>

        {recent.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
            <p style={{ color: "#475569", fontSize: 14, margin: "0 0 16px" }}>No complaints filed yet.</p>
            <button onClick={() => navigate("/submit-complaint")} style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "white", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              File Your First Complaint
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {recent.map((c, i) => (
              <div key={c._id} onClick={() => navigate("/my-complaints")}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < recent.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${priorityColor[c.priority] || "#64748b"}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                    {c.priority === "Critical" ? "🚨" : c.priority === "High" ? "⚠️" : c.priority === "Medium" ? "📋" : "📄"}
                  </div>
                  <div>
                    <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{c.caseId}</div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>{c.crimeType}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ background: statusConfig[c.status]?.bg || "rgba(255,255,255,0.05)", color: statusConfig[c.status]?.color || "#94a3b8", border: `1px solid ${statusConfig[c.status]?.border || "transparent"}`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                    {c.status}
                  </span>
                  <span style={{ color: "#475569", fontSize: 11 }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
