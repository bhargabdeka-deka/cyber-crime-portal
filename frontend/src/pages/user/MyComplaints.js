import { useEffect, useState } from "react";
import API from "../../services/api";
import UserLayout from "../../layouts/UserLayout";
import { useNavigate } from "react-router-dom";
import {
  Plus, ChevronRight, Search, X,
  FileText, Clock, CheckCircle, Download
} from "lucide-react";

const BASE_URL = process.env.REACT_APP_API_URL;

const statusMeta = {
  Pending:       { color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200",   label: "Pending",     icon: Clock },
  Investigating: { color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200",    label: "In Progress", icon: Search },
  Resolved:      { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Resolved",    icon: CheckCircle },
};

const priorityMeta = {
  Critical: { color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200" },
  High:     { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  Medium:   { color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  Low:      { color: "text-slate-600",  bg: "bg-slate-50",  border: "border-slate-200" },
};

const riskMeta = (score) => {
  if (score >= 80) return { label: "High",   color: "text-red-600" };
  if (score >= 50) return { label: "Medium", color: "text-orange-600" };
  return               { label: "Low",    color: "text-emerald-600" };
};

const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
};

const STEPS = ["Pending", "Investigating", "Resolved"];

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [filter, setFilter]         = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/complaints/my")
      .then(res => setComplaints(res.data.complaints || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);



  const complaintsSafe = Array.isArray(complaints) ? complaints : [];
  const filtered = filter === "All" ? complaintsSafe : complaintsSafe.filter(c => c.status === filter);

  if (loading) {
    return (
      <UserLayout>
        <div className="min-h-[400px] flex items-center justify-center text-sm text-slate-400">
          <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin mr-3" />
          Loading your reports...
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Reports</h1>
          <p className="text-sm text-slate-500 mt-0.5">{(complaints?.length || 0)} report{(complaints?.length || 0) !== 1 ? "s" : ""} on record</p>
        </div>
        <button
          onClick={() => navigate("/submit-complaint")}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition"
        >
          <Plus size={15} /> New Report
        </button>
      </div>

      {/* Filter Tabs */}
      {complaintsSafe.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {["All", "Pending", "Investigating", "Resolved"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                filter === f
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
              }`}
            >
              {f}
              <span className="ml-1.5 opacity-60">
                {f === "All" ? complaintsSafe.length : complaintsSafe.filter(c => c.status === f).length}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {complaintsSafe.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg py-20 flex flex-col items-center text-slate-400">
          <FileText size={32} className="mb-3 opacity-30" />
          <p className="text-sm">No reports filed yet.</p>
          <button
            onClick={() => navigate("/submit-complaint")}
            className="mt-4 text-sm text-slate-700 font-medium hover:underline"
          >
            File your first report →
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400">
          No reports match the selected filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => {
            const sm = statusMeta[c.status] || statusMeta.Pending;
            const pm = priorityMeta[c.priority] || priorityMeta.Low;
            const stepIdx = STEPS.indexOf(c.status);
            return (
              <div
                key={c._id}
                onClick={() => setSelected(c)}
                className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-grow min-w-0">
                    {/* Case header */}
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-xs font-mono text-slate-400">{c.caseId?.slice(0, 14)}...</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${pm.bg} ${pm.color} ${pm.border}`}>
                        {c.priority}
                      </span>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${sm.bg} ${sm.color} ${sm.border}`}>
                        <sm.icon size={10} /> {sm.label}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-800 truncate">{c.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {c.crimeType} · {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 shrink-0 mt-1 transition" />
                </div>

                {/* Progress bar */}
                <div className="flex gap-1 mt-3">
                  {STEPS.map((step, i) => (
                    <div
                      key={step}
                      className={`flex-1 h-1 rounded-full transition-all ${
                        i <= stepIdx ? sm.color.replace("text-", "bg-") : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
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
              <div className="min-w-0">
                <h2 className="font-semibold text-slate-900 truncate">{selected.title}</h2>
                <p className="text-xs font-mono text-slate-400 mt-0.5 truncate">{selected.caseId}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-md text-slate-400 hover:bg-slate-100 transition">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-5">

              {/* Status & Priority */}
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const sm = statusMeta[selected.status] || statusMeta.Pending;
                  const pm = priorityMeta[selected.priority] || priorityMeta.Low;
                  return (
                    <>
                      <span className={`px-3 py-1 rounded text-xs font-medium border ${sm.bg} ${sm.color} ${sm.border}`}>{sm.label}</span>
                      <span className={`px-3 py-1 rounded text-xs font-medium border ${pm.bg} ${pm.color} ${pm.border}`}>{selected.priority}</span>
                    </>
                  );
                })()}
              </div>

              {/* Progress Stepper */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Status Progress</p>
                <div className="flex flex-wrap gap-2">
                  {STEPS.map((step, i) => {
                    const stepIdx = STEPS.indexOf(selected.status);
                    const done = i <= stepIdx;
                    return (
                      <div
                        key={step}
                        className={`flex-1 min-w-[70px] py-2 rounded-md text-xs font-medium text-center border transition ${
                          done
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-400 border-slate-200"
                        }`}
                      >
                        {step}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Crime Type</p>
                  <p className="text-sm text-slate-800">{selected.crimeType}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Risk Score</p>
                  <p className={`text-lg font-bold ${riskMeta(selected.riskScore).color}`}>{selected.riskScore}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Filed On</p>
                  <p className="text-sm text-slate-700">
                    {new Date(selected.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                {selected.location && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Location</p>
                    <p className="text-sm text-slate-700">{selected.location}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Description</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-100">
                  {selected.description}
                </p>
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
                  <a
                    href={buildImageUrl(selected.evidence)}
                    download
                    className="mt-2 inline-flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 font-medium transition"
                  >
                    <Download size={13} /> Download attachment
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
