import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import Layout from "../../components/Layout";
import {
  Search, AlertTriangle, CheckCircle, Clock,
  Download, X, ChevronLeft, ChevronRight, FileText
} from "lucide-react";

const BASE_URL = process.env.REACT_APP_API_URL;

const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
};

const statusConfig = {
  Pending:       { label: "Pending",     className: "text-amber-700 bg-amber-50 border-amber-200",   icon: Clock },
  Investigating: { label: "In Progress", className: "text-blue-700 bg-blue-50 border-blue-200",      icon: Search },
  Resolved:      { label: "Resolved",    className: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: CheckCircle },
};

const priorityConfig = {
  Critical: "text-red-700 bg-red-50 border-red-200",
  High:     "text-orange-700 bg-orange-50 border-orange-200",
  Medium:   "text-blue-700 bg-blue-50 border-blue-200",
  Low:      "text-slate-600 bg-slate-50 border-slate-200",
};

const STEPS = ["Pending", "Investigating", "Resolved"];

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [priorityFilter, setPriority] = useState("");
  const [statusFilter, setStatus]     = useState("");
  const [search, setSearch]           = useState("");
  const [sort, setSort]               = useState("-createdAt");
  const [selected, setSelected]       = useState(null);
  const [updating, setUpdating]       = useState(null);
  const [toast, setToast]             = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/complaints", {
        params: { page, limit: 12, priority: priorityFilter, status: statusFilter, search, sort }
      });
      setComplaints(res.data.complaints);
      setTotalPages(res.data.pages);
      setTotalCount(res.data.total || 0);
    } catch {
      showToast("Failed to load complaints.", "error");
    } finally {
      setLoading(false);
    }
  }, [page, priorityFilter, statusFilter, search, sort]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      await API.put(`/complaints/${id}/status`, { status: newStatus });
      showToast(`Status updated to "${newStatus}".`);
      fetchComplaints();
      if (selected?._id === id) setSelected(prev => ({ ...prev, status: newStatus }));
    } catch {
      showToast("Failed to update status.", "error");
    } finally {
      setUpdating(null);
    }
  };

  const resetFilters = () => {
    setPriority(""); setStatus(""); setSearch(""); setSort("-createdAt"); setPage(1);
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        return;
      }

      // Hardcoded production URL for Render as requested
      const response = await fetch(
        "https://cyber-crime-portal-2.onrender.com/api/complaints/export/csv",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unauthorized or failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "complaints.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  };

  return (
    <Layout>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[150] px-4 py-3 rounded-md shadow-lg border flex items-center gap-3 text-sm font-medium ${
          toast.type === "success"
            ? "bg-white border-emerald-200 text-emerald-800"
            : "bg-white border-red-200 text-red-800"
        }`}>
          {toast.type === "success"
            ? <CheckCircle size={15} />
            : <AlertTriangle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Complaints</h1>
          <p className="text-sm text-slate-500 mt-0.5">{totalCount} total records</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition"
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-grow min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by case ID or keyword..."
            value={search}
            onChange={e => { setPage(1); setSearch(e.target.value); }}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
          />
        </div>
        <select
          value={priorityFilter}
          onChange={e => { setPage(1); setPriority(e.target.value); }}
          className="text-sm border border-slate-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
        >
          <option value="">All Priorities</option>
          {["Critical", "High", "Medium", "Low"].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={e => { setPage(1); setStatus(e.target.value); }}
          className="text-sm border border-slate-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
        >
          <option value="">All Statuses</option>
          {["Pending", "Investigating", "Resolved"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={sort}
          onChange={e => { setPage(1); setSort(e.target.value); }}
          className="text-sm border border-slate-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="-riskScore">High Risk</option>
        </select>
        {(priorityFilter || statusFilter || search) && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 border border-slate-300 rounded-md px-3 py-2 bg-white transition"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center items-center text-sm text-slate-400">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin mr-3" />
            Loading complaints...
          </div>
        ) : (Array.isArray(complaints) ? complaints : []).length === 0 ? (
          <div className="py-20 flex flex-col items-center text-slate-400">
            <FileText size={32} className="mb-3 opacity-30" />
            <p className="text-sm">No complaints found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500">Case ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500">Reporter</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500">Priority</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500">Risk</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Array.isArray(complaints) ? complaints : []).map(c => (
                  <tr key={c._id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => setSelected(c)}>
                    <td className="px-4 py-3">
                      <div className="text-xs font-mono text-slate-700">{c.caseId?.slice(0, 12)}...</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{new Date(c.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{c.user?.name || "Anonymous"}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{c.crimeType}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${priorityConfig[c.priority] || "text-slate-500 bg-slate-50 border-slate-200"}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold text-sm ${c.riskScore >= 80 ? "text-red-600" : "text-slate-700"}`}>
                        {c.riskScore}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <select
                        value={c.status}
                        disabled={updating === c._id}
                        onChange={e => handleStatusChange(c._id, e.target.value)}
                        className={`text-xs border rounded px-2 py-1 focus:outline-none cursor-pointer ${statusConfig[c.status]?.className || "bg-white border-slate-200"}`}
                      >
                        {STEPS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-slate-400 hover:text-slate-700 transition">View →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-semibold text-slate-900">Case Details</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selected.caseId}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-md text-slate-400 hover:bg-slate-100 transition">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-5">

              {/* Reporter */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Reporter</p>
                <p className="text-sm text-slate-800 font-medium">{selected.user?.name || "Anonymous"}</p>
                <p className="text-xs text-slate-400">{selected.user?.email || "No Email"}</p>
              </div>

              {/* Type & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Crime Type</p>
                  <p className="text-sm text-slate-800">{selected.crimeType}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Priority</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${priorityConfig[selected.priority] || ""}`}>
                    {selected.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Risk Score</p>
                  <p className={`text-lg font-bold ${selected.riskScore >= 80 ? "text-red-600" : "text-slate-800"}`}>
                    {selected.riskScore}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Date</p>
                  <p className="text-sm text-slate-600">
                    {new Date(selected.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Description</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-100">
                  {selected.description}
                </p>
              </div>

              {/* Status Stepper */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Update Status</p>
                <div className="flex gap-2">
                  {STEPS.map(step => {
                    const active = selected.status === step;
                    return (
                      <button
                        key={step}
                        onClick={() => handleStatusChange(selected._id, step)}
                        disabled={active || updating === selected._id}
                        className={`flex-1 py-2 rounded-md text-xs font-semibold transition border ${
                          active
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-600 border-slate-300 hover:border-slate-500"
                        }`}
                      >
                        {step}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Evidence */}
              {selected.evidence && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Evidence</p>
                  <a href={buildImageUrl(selected.evidence)} target="_blank" rel="noreferrer">
                    <img
                      src={buildImageUrl(selected.evidence)}
                      alt="Evidence"
                      className="w-full rounded-md border border-slate-200 hover:opacity-90 transition"
                    />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
