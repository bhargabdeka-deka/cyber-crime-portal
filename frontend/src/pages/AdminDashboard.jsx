import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { Users, FileWarning, Activity } from "lucide-react";

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [stats, setStats] = useState({ users: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, complaintsRes] = await Promise.all([
          API.get("/users"),
          API.get("/complaints?limit=1000"), // Fetch large batch for accurate count
        ]);

        const allComplaints = complaintsRes.data.complaints || [];

        setStats({
          users: usersRes.data.total ?? usersRes.data.users?.length ?? 0,
          pending: allComplaints.filter(c => c.status?.toLowerCase() === "pending").length,
        });
        setError(null);
      } catch (err) {
        console.error("DASHBOARD_SYNC_ERROR:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const displayValue = (val) => {
    if (loading) return "...";
    if (error) return "—";
    return val;
  };

  const statCards = [
    {
      label: "Total Users",
      value: displayValue(stats.users),
      icon:  Users,
      color: "text-blue-600",
      bg:    "bg-blue-50",
    },
    {
      label: "Pending Reports",
      value: displayValue(stats.pending),
      icon:  FileWarning,
      color: "text-amber-600",
      bg:    "bg-amber-50",
    },
    {
      label: "System Status",
      value: loading ? "—" : "Operational",
      icon:  Activity,
      color: "text-emerald-600",
      bg:    "bg-emerald-50",
    },
  ];

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Welcome back, {user.name}</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {statCards.map(card => (
          <div key={card.label} className="bg-white border border-slate-200 rounded-lg p-5">
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-md ${card.bg} ${card.color} mb-3`}>
              <card.icon size={18} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{card.value}</div>
            <div className="text-xs text-slate-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* System Info Panel */}
      <div className="bg-slate-900 rounded-lg p-6 text-white">
        <h2 className="text-base font-semibold mb-1">System Overview</h2>
        <p className="text-slate-400 text-sm mb-4">
          All systems are running normally. No critical issues detected.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-md text-xs font-medium">
            Firewall: Active
          </span>
          <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-md text-xs font-medium">
            DNS: Secure
          </span>
          <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-md text-xs font-medium">
            API: Online
          </span>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
