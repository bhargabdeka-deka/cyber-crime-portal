import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import analyzeComplaint from "../utils/riskAnalyzer";
import Footer from "../components/Footer";
import { useScrollDirection } from "../hooks/useScrollDirection";
import {
  AlertTriangle, CheckCircle, MapPin, Paperclip, Lock
} from "lucide-react";
import Logo from "../components/Logo";

const SCAM_TYPES = [
  "UPI Fraud","Phishing","Job Scam","Lottery Scam","Romance Scam",
  "Investment Scam","Identity Theft","Account Hacking","Cyber Harassment","Other"
];

const priorityMeta = {
  Critical: { color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    icon: AlertTriangle },
  High:     { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", icon: AlertTriangle },
  Medium:   { color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   icon: AlertTriangle },
  Low:      { color: "text-emerald-700",bg: "bg-emerald-50",border: "border-emerald-200",icon: CheckCircle },
};

export default function AnonReport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isVisible = useScrollDirection();

  const [form, setForm] = useState({
    title: "", description: "",
    scamType: "", scamTarget: searchParams.get("target") || "",
    location: "", evidence: null
  });
  const [analysis, setAnalysis] = useState(null);
  const [status, setStatus]     = useState({ type: "", msg: "" });
  const [loading, setLoading]   = useState(false);
  const [fileName, setFileName] = useState("");
  const [done, setDone]         = useState(null);

  useEffect(() => {
    if (form.title || form.description) setAnalysis(analyzeComplaint(form.title, form.description));
    else setAnalysis(null);
  }, [form.title, form.description]);

  const handleChange = (e) => {
    if (e.target.name === "evidence") {
      setForm({ ...form, evidence: e.target.files[0] });
      setFileName(e.target.files[0]?.name || "");
    } else setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setStatus({ type: "", msg: "" });
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v && k !== "evidence") data.append(k, v); });
      if (form.evidence) data.append("evidence", form.evidence);
      const res = await API.post("/complaints/anonymous", data, { headers: { "Content-Type": "multipart/form-data" } });
      setDone(res.data.caseId);
    } catch (err) {
      setStatus({ type: "error", msg: err.response?.data?.message || "Submission failed. Please try again." });
    } finally { setLoading(false); }
  };

  const meta = analysis ? (priorityMeta[analysis.priority] || priorityMeta.Low) : null;

  const pageContent = (
    <div className="max-w-2xl mx-auto py-10 min-h-screen">

      {done ? (
        /* Success State */
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={28} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Report Submitted</h1>
          <p className="text-sm text-slate-500 mb-8">
            Thank you for your report. Save your Case ID to track progress later.
          </p>

          <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6 text-left">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Case ID</p>
            <p className="text-sm font-mono text-slate-900 bg-slate-50 border border-slate-100 rounded-md px-4 py-3 break-all">
              {done}
            </p>
            <p className="text-xs text-slate-400 mt-2">Keep this ID to reference your submission.</p>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/check-scam")}
              className="px-4 py-2 rounded-md text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
            >
              Check Another
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 rounded-md text-sm font-medium bg-slate-900 text-white hover:bg-slate-700 transition"
            >
              Create Account →
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Page Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md mb-3">
              <Lock size={12} /> Anonymous — no account required
            </div>
            <h1 className="text-2xl font-bold text-slate-900">File an Anonymous Report</h1>
            <p className="text-sm text-slate-500 mt-1">Your identity will not be recorded or stored.</p>
          </div>

          {/* Error Banner */}
          {status.msg && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center gap-2">
              <AlertTriangle size={15} /> {status.msg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
              <input
                name="title" type="text" required
                placeholder="e.g. UPI fraud during online purchase"
                value={form.title} onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
              />
            </div>

            {/* Scam Type + Target */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Scam Type</label>
                <select
                  name="scamType" value={form.scamType} onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                >
                  <option value="">Auto-detect</option>
                  {SCAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Scam Target (ID / URL)</label>
                <input
                  name="scamTarget" type="text"
                  placeholder="9876543210 or fake-site.com"
                  value={form.scamTarget} onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="location" type="text"
                  placeholder="Guwahati, Assam"
                  value={form.location} onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea
                name="description" required rows={5}
                placeholder="Describe what happened in detail..."
                value={form.description} onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition resize-none"
              />
            </div>

            {/* Risk Analysis Preview */}
            {analysis && meta && (
              <div className={`p-4 rounded-md border ${meta.bg} ${meta.border}`}>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${meta.color}`}>
                  Auto-detected Risk Analysis
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] text-slate-500 mb-0.5">Type</p>
                    <p className="text-xs font-semibold text-slate-800">{analysis.scamType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 mb-0.5">Priority</p>
                    <p className={`text-xs font-semibold ${meta.color}`}>{analysis.priority}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 mb-0.5">Risk Score</p>
                    <p className={`text-sm font-bold ${meta.color}`}>{analysis.riskScore}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Evidence */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Evidence (optional)</label>
              <label className="flex items-center gap-3 border border-dashed border-slate-300 rounded-md p-4 cursor-pointer hover:border-slate-500 transition bg-white">
                <Paperclip size={18} className="text-slate-400 shrink-0" />
                <div className="text-sm text-slate-600">
                  {fileName || "Click to attach a file"}
                  <span className="block text-xs text-slate-400 mt-0.5">PNG, JPG, PDF — max 10MB</span>
                </div>
                <input type="file" name="evidence" onChange={handleChange} className="hidden" accept="image/*,.pdf,.doc,.docx" />
              </label>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-md text-sm font-semibold hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                : "Submit Anonymous Report"
              }
            </button>

            <p className="text-center text-xs text-slate-400">
              Your identity is not recorded. <a href="/register" className="text-slate-600 hover:underline">Create an account</a> to track your reports.
            </p>
          </form>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fa] font-sans flex flex-col">
      <header className={`h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 sticky top-0 z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <Logo size={30} fontSize={14} />
        </div>
        <button onClick={() => navigate("/login")} className="text-sm text-slate-600 hover:text-slate-900 font-medium transition">
          Sign In
        </button>
      </header>
      <div className="px-5 flex-grow">{pageContent}</div>
      <Footer />
    </div>
  );
}
