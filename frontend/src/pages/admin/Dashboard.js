import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Layout from "../../components/Layout";
import {
  LineChart, Line, PieChart, Pie, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"];

const priorityMeta = {
  Critical: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", icon: "🚨" },
  High:     { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", icon: "⚠️" },
  Medium:   { color: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)", icon: "📋" },
  Low:      { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", icon: "✅" },
};

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

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") { navigate("/login"); return; }

    API.get("/complaints/analytics")
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <Layout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 36, height: 36, border: "3px solid rgba(59,130,246,0.3)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            <p style={{ color: "#64748b", fontSize: 14 }}>Loading analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!stats) {
    return (
      <Layout>
        <div style={{ textAlign: "center", padding: 60 }}>
          <p style={{ color: "#64748b" }}>Failed to load analytics. Please refresh.</p>
        </div>
      </Layout>
    );
  }

  const total    = stats.statusDistribution?.reduce((s, i) => s + i.count, 0) || 0;
  const pending  = stats.statusDistribution?.find(s => s.status === "Pending")?.count || 0;
  const invest   = stats.statusDistribution?.find(s => s.status === "Investigating")?.count || 0;
  const resolved = stats.statusDistribution?.find(s => s.status === "Resolved")?.count || 0;

  const statCards = [
    { label: "Total Cases",    value: total,              icon: "📋", color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.2)" },
    { label: "Pending",        value: pending,            icon: "⏳", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
    { label: "Investigating",  value: invest,             icon: "🔍", color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.2)" },
    { label: "Resolved",       value: resolved,           icon: "✅", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
    { label: "Critical Cases", value: stats.criticalCases || 0, icon: "🚨", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
  ];

  return (
    <Layout>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Analytics Dashboard</h1>
        <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>Overview of all complaint activity.</p>
      </div>

      {/* Critical Alert */}
      {stats.criticalCases > 0 && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🚨</span>
            <div>
              <div style={{ color: "#fca5a5", fontWeight: 700, fontSize: 14 }}>{stats.criticalCases} Critical Case{stats.criticalCases > 1 ? "s" : ""} Require Immediate Attention</div>
              <div style={{ color: "#f87171", fontSize: 12, marginTop: 2 }}>These cases have a risk score of 80 or above.</div>
            </div>
          </div>
          <button onClick={() => navigate("/complaints")}
            style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            Review Now →
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 28 }}>
        {statCards.map(card => (
          <div key={card.label} style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: 12, padding: "18px 16px" }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>{card.icon}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: card.color, lineHeight: 1 }}>{card.value}</div>
            <div style={{ color: "#64748b", fontSize: 12, marginTop: 6 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Monthly Trend */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px" }}>
          <h3 style={{ color: "white", fontSize: 14, fontWeight: 600, margin: "0 0 20px" }}>Monthly Complaints Trend</h3>
          {stats.monthlyTrend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(59,130,246,0.3)" }} />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4 }} activeDot={{ r: 6, fill: "#60a5fa" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: "#475569", fontSize: 13 }}>No trend data yet</p>
            </div>
          )}
        </div>

        {/* Crime Distribution Pie */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px" }}>
          <h3 style={{ color: "white", fontSize: 14, fontWeight: 600, margin: "0 0 20px" }}>Crime Types</h3>
          {stats.crimeDistribution?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={stats.crimeDistribution} dataKey="count" nameKey="crimeType" outerRadius={70} labelLine={false} label={<CustomPieLabel />}>
                    {stats.crimeDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                {stats.crimeDistribution.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      <span style={{ color: "#94a3b8", fontSize: 11 }}>{item.crimeType}</span>
                    </div>
                    <span style={{ color: "white", fontSize: 11, fontWeight: 600 }}>{item.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: "#475569", fontSize: 13 }}>No data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Status Distribution Bar */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px" }}>
          <h3 style={{ color: "white", fontSize: 14, fontWeight: 600, margin: "0 0 20px" }}>Status Distribution</h3>
          {stats.statusDistribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.statusDistribution} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="status" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.statusDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.status === "Pending" ? "#f59e0b" : entry.status === "Investigating" ? "#3b82f6" : "#10b981"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: "#475569", fontSize: 13 }}>No data yet</p>
            </div>
          )}
        </div>

        {/* Priority Breakdown */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px" }}>
          <h3 style={{ color: "white", fontSize: 14, fontWeight: 600, margin: "0 0 20px" }}>Priority Breakdown</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {["Critical", "High", "Medium", "Low"].map(p => {
              const meta = priorityMeta[p];
              const count = stats.priorityDistribution?.find(d => d.priority === p)?.count || 0;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={p}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: "#94a3b8", fontSize: 13 }}>{meta.icon} {p}</span>
                    <span style={{ color: meta.color, fontSize: 13, fontWeight: 600 }}>{count} <span style={{ color: "#475569", fontWeight: 400 }}>({pct}%)</span></span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: meta.color, borderRadius: 2, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => navigate("/complaints")}
            style={{ marginTop: 20, width: "100%", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa", padding: "10px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            Manage All Complaints →
          </button>
        </div>
      </div>
    </Layout>
  );
}
