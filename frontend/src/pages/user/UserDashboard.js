import { useEffect, useState } from "react";
import API from "../../services/api";
import UserLayout from "../../layouts/UserLayout";
import { useNavigate } from "react-router-dom";
import { Clock, Search, CheckCircle, Plus, FileText, ShieldCheck, TrendingUp } from "lucide-react";

const statusConfig = {
  Pending:      { color: "text-amber-600",   bg: "bg-amber-50",   label: "Pending",     icon: Clock },
  Investigating:{ color: "text-blue-600",    bg: "bg-blue-50",    label: "In Progress", icon: Search },
  Resolved:     { color: "text-emerald-600", bg: "bg-emerald-50", label: "Resolved",    icon: CheckCircle },
};

export default function UserDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [impact, setImpact]         = useState(null);
  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

  useEffect(() => {
    if (!user) return;
    API.get("/complaints/my")
      .then(res => setComplaints(res.data.complaints || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
    API.get("/users/impact")
      .then(res => setImpact(res.data))
      .catch(() => {});
  }, [user]);

  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
          Loading User Session...
        </div>
      </div>
    );
  }

  const total         = complaints?.length || 0;
  const pending       = (Array.isArray(complaints) ? complaints : []).filter(c => c.status === "Pending").length;
  const investigating = (Array.isArray(complaints) ? complaints : []).filter(c => c.status === "Investigating").length;
  const resolved      = (Array.isArray(complaints) ? complaints : []).filter(c => c.status === "Resolved").length;

  const recent = Array.isArray(complaints) 
    ? [...complaints].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
    : [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const statCards = [
    { label: "Total Reports",  value: total,                  color: "text-blue-600",    bg: "bg-blue-50" },
    { label: "Resolved",       value: resolved,               color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "In Progress",    value: pending + investigating, color: "text-amber-600",   bg: "bg-amber-50" },
  ];

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-[400px] flex items-center justify-center text-sm text-slate-400">
          <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin mr-3" />
          Loading your dashboard...
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>

      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{greeting}, {user?.name?.split(" ")[0] || "User"}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {total === 0 ? "No reports filed yet." : `You have ${total} report${total > 1 ? "s" : ""} on record.`}
          </p>
        </div>
        <button
          onClick={() => navigate("/submit-complaint")}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition"
        >
          <Plus size={15} /> File Report
        </button>
      </div>

      {/* Impact Banner */}
      {impact && impact.estimatedProtected > 0 && (
        <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-sm text-emerald-800">
          <ShieldCheck size={18} className="shrink-0 text-emerald-600" />
          <span>Your reports have helped protect an estimated <strong>{impact.estimatedProtected}</strong> people.</span>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {statCards.map(stat => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-lg p-4">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Two-column grid */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">

        {/* Status Breakdown */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Status Breakdown</h3>
          {total === 0 ? (
            <div className="py-8 flex flex-col items-center text-slate-400">
              <FileText size={28} className="mb-2 opacity-30" />
              <p className="text-sm">No reports yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(statusConfig).map(([key, cfg]) => {
                const count = (Array.isArray(complaints) ? complaints : []).filter(c => c.status === key).length;
                const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700">{cfg.label}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${cfg.color.replace("text-", "bg-")}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Recent Reports</h3>
            {total > 0 && (
              <button
                onClick={() => navigate("/my-complaints")}
                className="text-xs text-slate-500 hover:text-slate-800 transition"
              >
                View all →
              </button>
            )}
          </div>
          {recent.length === 0 ? (
            <div className="py-8 flex flex-col items-center text-slate-400">
              <FileText size={28} className="mb-2 opacity-30" />
              <p className="text-sm">No reports filed.</p>
              <button
                onClick={() => navigate("/submit-complaint")}
                className="mt-3 text-sm text-slate-600 hover:text-slate-900 font-medium transition"
              >
                File your first report →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map(c => {
                const cfg = statusConfig[c.status] || statusConfig.Pending;
                const Icon = cfg.icon;
                return (
                  <div
                    key={c._id}
                    onClick={() => navigate("/my-complaints")}
                    className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${cfg.bg}`}>
                        <Icon size={14} className={cfg.color} />
                      </div>
                      <div>
                        <div className="text-xs font-mono text-slate-700">{c.caseId?.slice(0, 14)}...</div>
                        <div className="text-[10px] text-slate-400">{c.crimeType}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/check-scam")}
          className="flex items-center gap-4 bg-slate-900 text-white p-5 rounded-lg hover:bg-slate-800 transition text-left"
        >
          <div className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center shrink-0">
            <Search size={20} />
          </div>
          <div>
            <div className="font-semibold text-sm">Check a Number or URL</div>
            <div className="text-xs text-slate-400 mt-0.5">Verify against our scam database.</div>
          </div>
        </button>
        <button
          onClick={() => navigate("/trending")}
          className="flex items-center gap-4 bg-white border border-slate-200 p-5 rounded-lg hover:bg-slate-50 transition text-left"
        >
          <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center text-slate-700 shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-900">Trending Threats</div>
            <div className="text-xs text-slate-500 mt-0.5">Browse recently detected scam patterns.</div>
          </div>
        </button>
      </div>

    </UserLayout>
  );
}
