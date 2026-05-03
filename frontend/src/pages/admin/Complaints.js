import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import Layout from "../../components/Layout";
import {
  Search, AlertTriangle, CheckCircle, Clock,
  Download, X, ChevronLeft, ChevronRight, FileText, ArrowRight
} from "lucide-react";

const BASE_URL = process.env.REACT_APP_API_URL;

const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
};

const statusConfig = {
  Pending:       { label: "Pending",     className: "text-amber-700 bg-amber-50 border-amber-200",     icon: Clock },
  Investigating: { label: "In Progress", className: "text-blue-700 bg-blue-50 border-blue-200",        icon: Search },
  Resolved:      { label: "Resolved",    className: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: CheckCircle },
  Rejected:      { label: "Rejected",    className: "text-red-700 bg-red-50 border-red-200",            icon: AlertTriangle },
};

const priorityConfig = {
  Critical: "text-red-700 bg-red-50 border-red-200",
  High:     "text-orange-700 bg-orange-50 border-orange-200",
  Medium:   "text-blue-700 bg-blue-50 border-blue-200",
  Low:      "text-slate-600 bg-slate-50 border-slate-200",
};

const statusOptions = {
  Pending:       ["Pending", "Investigating", "Rejected"],
  Investigating: ["Investigating", "Resolved", "Rejected"],
  Resolved:      ["Resolved"],
  Rejected:      ["Rejected"]
};

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
  const [exporting, setExporting]     = useState(false);
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
    const confirmAction = window.confirm(
      `Are you sure you want to update the status to "${newStatus}"? \n\nThis action is irreversible and cannot be changed back.`
    );

    if (!confirmAction) return;

    setUpdating(id);
    try {
      await API.put(`/complaints/${id}/status`, { status: newStatus });
      showToast("Status updated successfully.");
      fetchComplaints();
      if (selected?._id === id) setSelected(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update status.";
      showToast(errorMsg, "error");
    } finally {
      setUpdating(null);
    }
  };

  const resetFilters = () => {
    setPriority(""); setStatus(""); setSearch(""); setSort("-createdAt"); setPage(1);
  };

  const handleExportCSV = async () => {
    console.log("Premium AI Export Triggered — Connecting to Intelligence Server...");
    if (exporting) return;
    setExporting(true);
    try {
      const res = await API.get("/complaints/export/csv", {
        params: { 
          priority: priorityFilter, 
          status: statusFilter, 
          search, 
          sort 
        },
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      
      const dateStr = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `CyberShield_Complaints_${dateStr}.csv`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showToast("AI-enhanced complaint intelligence exported successfully");
    } catch (err) {
      console.error("EXPORT_ERROR:", err);
      showToast("Export failed. Please try again.", "error");
    } finally {
      setExporting(false);
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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Complaints</h1>
          <p className="text-sm text-slate-500 mt-0.5">{totalCount} total records</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className={`flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition ${exporting ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {exporting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download size={15} /> Export CSV
            </>
          )}
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
          className="text-sm border border-slate-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition min-w-[120px]"
        >
          <option value="">All Priorities</option>
          {["Critical", "High", "Medium", "Low"].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={e => { setPage(1); setStatus(e.target.value); }}
          className="text-sm border border-slate-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition min-w-[130px]"
        >
          <option value="">All Statuses</option>
          {["Pending", "Investigating", "Resolved", "Rejected"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={sort}
          onChange={e => { setPage(1); setSort(e.target.value); }}
          className="text-sm border border-slate-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition min-w-[100px]"
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
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <div className="md:hidden px-4 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 flex items-center gap-2">
               <ArrowRight size={10} className="animate-pulse" /> Swipe to see all columns
            </div>
            <table className="w-full text-sm min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 min-w-[120px]">Case ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 min-w-[120px]">Reporter</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 min-w-[120px]">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 min-w-[80px]">Priority</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 min-w-[60px]">Risk</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 min-w-[150px]">AI Intelligence</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 min-w-[120px]">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Array.isArray(complaints) ? complaints : []).map(c => {
                  const reporterDisabled = !!c.user?.isDisabled;
                  return (
                    <tr
                      key={c._id}
                      onClick={() => setSelected(c)}
                      className={`transition cursor-pointer ${
                        reporterDisabled
                          ? "bg-red-50 opacity-80"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="text-xs font-mono text-slate-700">{c.caseId?.slice(0, 12)}...</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{new Date(c.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium text-sm ${ reporterDisabled ? "text-slate-400" : "text-slate-700" }`}>
                          {c.user?.name || "Anonymous"}
                        </span>
                        {reporterDisabled && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-500 border border-red-200">
                            Disabled
                          </span>
                        )}
                      </td>
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
                      <td className="px-4 py-3">
                         {c.aiCategory ? (
                           <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-1.5">
                               <span className={`w-1.5 h-1.5 rounded-full ${
                                 c.aiSeverity === "Critical" ? "bg-red-500" :
                                 c.aiSeverity === "High" ? "bg-orange-500" :
                                 c.aiSeverity === "Medium" ? "bg-amber-500" :
                                 "bg-emerald-500"
                               }`} />
                               <span className="text-[11px] font-bold text-slate-700 truncate max-w-[120px]">
                                 {c.aiCategory}
                               </span>
                             </div>
                             <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                               c.aiSeverity === "Critical" ? "bg-red-50 text-red-600 border-red-100" :
                               c.aiSeverity === "High" ? "bg-orange-50 text-orange-600 border-orange-100" :
                               c.aiSeverity === "Medium" ? "bg-amber-50 text-amber-600 border-amber-100" :
                               "bg-emerald-50 text-emerald-600 border-emerald-100"
                             }`}>
                               {c.aiConfidence ? `${c.aiConfidence}%` : c.aiSeverity} • {c.aiSeverity}
                             </span>
                           </div>
                         ) : (
                           <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 italic">AI Pending</span>
                         )}
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        {reporterDisabled ? (
                          <span
                            title="Reporter account is disabled — status locked"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold bg-red-50 text-red-400 border border-red-100 cursor-not-allowed select-none"
                          >
                            🔒 Locked
                          </span>
                        ) : (
                          <select
                            value={c.status}
                            disabled={updating === c._id || c.status === "Resolved" || c.status === "Rejected"}
                            onChange={e => handleStatusChange(c._id, e.target.value)}
                            className={`text-xs border rounded px-2 py-1 focus:outline-none cursor-pointer ${statusConfig[c.status]?.className || "bg-white border-slate-200"}`}
                          >
                            {(statusOptions[c.status] || [c.status]).map(s => (
                              <option key={s} value={s} disabled={s === c.status}>{s}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-xs text-slate-400 hover:text-slate-700 transition">View →</button>
                      </td>
                    </tr>
                  );
                })}
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
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-800 font-medium">{selected.user?.name || "Anonymous"}</p>
                  {selected.user?.isDisabled && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-600 border border-red-200">
                      Account Disabled
                    </span>
                  )}
                </div>
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

              {/* AI Intelligence Layer */}
              {selected.aiSummary && (
                <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-lg border border-white/10 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <div className="text-[9px] font-black text-white tracking-[0.2em] uppercase bg-blue-600/30 px-2 py-1 rounded">AI Investigator</div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Search size={18} />
                      </div>
                      <h4 className="text-white font-bold text-xs uppercase tracking-wider">AI Investigator Assistant</h4>
                    </div>

                    <p className="text-blue-100/90 text-[13px] leading-relaxed mb-4 font-medium italic">
                      "{selected.aiSummary}"
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <div className="text-[9px] font-bold text-blue-300 uppercase tracking-widest mb-1.5">Category</div>
                        <div className="text-[12px] font-bold text-white">{selected.aiCategory || "Unclassified"}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-blue-300 uppercase tracking-widest mb-1.5">Confidence</div>
                        <div className="text-[12px] font-bold text-white">{selected.aiConfidence}%</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-blue-300 uppercase tracking-widest mb-1.5">Severity</div>
                        <div className={`text-[12px] font-bold ${
                          selected.aiSeverity === "Critical" ? "text-red-400" :
                          selected.aiSeverity === "High" ? "text-orange-400" :
                          "text-emerald-400"
                        }`}>{selected.aiSeverity || "Low"}</div>
                      </div>
                    </div>

                    {selected.aiTrendContribution && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="text-[9px] font-bold text-blue-300 uppercase tracking-widest mb-2">Emerging Trend Cluster</div>
                        <div className="inline-flex items-center gap-2 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[11px] text-blue-200 font-bold">
                          <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" /> {selected.aiTrendContribution}
                        </div>
                      </div>
                    )}

                    <div className="mt-5 space-y-4">
                      <div>
                        <div className="text-[9px] font-bold text-blue-300 uppercase tracking-widest mb-2">Pattern Analysis</div>
                        <ul className="space-y-1.5">
                          {(selected.aiExplanation || []).map((exp, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px] text-white/70">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 shrink-0" /> {exp}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-blue-300 uppercase tracking-widest mb-2">Keywords</div>
                        <div className="flex flex-wrap gap-1.5">
                          {(selected.aiKeywords || []).map((word, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white/10 border border-white/10 rounded text-[10px] text-white/80 font-medium capitalize">
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>

                      {selected.aiRecommendation && (
                        <div className="mt-5 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                          <div className="text-[9px] font-bold text-blue-300 uppercase tracking-widest mb-1.5">AI Investigator Recommendation</div>
                          <p className="text-[12px] text-white font-semibold flex items-center gap-2">
                            <span className="text-blue-400">⚡</span> {selected.aiRecommendation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Status Stepper */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Update Status</p>
                  {selected.status === "Pending" && selected.aiSeverity && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[10px] font-bold text-indigo-700">
                      AI Suggested Priority: {selected.aiSeverity}
                    </div>
                  )}
                </div>
                {selected.user?.isDisabled ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-red-50 border border-red-200 text-xs text-red-600">
                    🔒 Status updates are locked — reporter account is disabled.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(statusOptions[selected.status] || [selected.status]).map(step => {
                      const active = selected.status === step;
                      return (
                        <button
                          key={step}
                          onClick={() => handleStatusChange(selected._id, step)}
                          disabled={active || updating === selected._id}
                          className={`flex-1 min-w-[80px] py-2 rounded-md text-xs font-semibold transition border ${
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
                )}
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
