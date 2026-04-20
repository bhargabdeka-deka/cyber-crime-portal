import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout";
import analyzeComplaint from "../../utils/riskAnalyzer";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Paperclip, 
  Plus, 
  ChevronRight, 
  Zap,
  Activity,
  CheckCircle,
  Clock,
  Search,
  MapPin,
  FileText
} from "lucide-react";

const SCAM_TYPES = [
  "UPI Fraud","Phishing","Job Scam","Lottery Scam",
  "Romance Scam","Investment Scam","Identity Theft",
  "Account Hacking","Cyber Harassment","Other"
];

const priorityMeta = {
  Critical: { color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", icon: AlertTriangle },
  High:     { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100", icon: AlertTriangle },
  Medium:   { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", icon: Info },
  Low:      { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: CheckCircle },
};

export default function SubmitComplaint() {
  const [formData, setFormData] = useState({
    title: "", description: "", scamType: "", scamTarget: "", location: "", evidence: null
  });
  const [analysis, setAnalysis] = useState(null);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [scamIntel, setScamIntel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.title || formData.description) {
      setAnalysis(analyzeComplaint(formData.title, formData.description));
    } else setAnalysis(null);
  }, [formData.title, formData.description]);

  const handleChange = (e) => {
    if (e.target.name === "evidence") {
      const file = e.target.files[0];
      setFormData({ ...formData, evidence: file });
      setFileName(file ? file.name : "");
    } else setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title",       formData.title);
      data.append("description", formData.description);
      data.append("scamType",    formData.scamType || (analysis?.scamType || "Other"));
      data.append("scamTarget",  formData.scamTarget);
      data.append("location",    formData.location);
      if (formData.evidence) data.append("evidence", formData.evidence);

      await API.post("/complaints", data, { headers: { "Content-Type": "multipart/form-data" } });

      if (formData.scamTarget) {
        try {
          const intel = await API.get("/scam/check", { params: { query: formData.scamTarget } });
          setScamIntel(intel.data);
        } catch {}
      }

      setStatus({ type: "success", msg: "INCIDENT RECORDED SUCCESSFULLY" });
      setTimeout(() => navigate("/my-complaints"), 3000);
    } catch (err) {
      setStatus({ type: "error", msg: err.response?.data?.message || "SYSTEM OVERLOAD: PLEASE RETRY" });
    } finally { setLoading(false); }
  };

  const meta = analysis ? (priorityMeta[analysis.priority] || priorityMeta.Low) : null;

  return (
    <UserLayout>
       <div className="max-w-3xl">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-soft-blue px-4 py-1.5 rounded-full text-xs font-semibold text-soft-teal tracking-wide mb-4 border border-slate-100 shadow-sm">
              <Plus size={14} /> New Incident Report
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 tracking-tight leading-none">File Complaint</h1>
            <p className="text-sm font-medium font-serif text-slate-500 tracking-wide mt-4">Secure log entry powered by AI diagnostics.</p>
          </div>

          {status.msg && (
            <div className={`p-6 rounded-[2.5rem] mb-10 flex items-center gap-4 border-2 animate-in fade-in slide-in-from-top-5 ${status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status.type === 'success' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                  {status.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">{status.msg}</span>
            </div>
          )}

          {/* Scam Intel Feedback */}
          {scamIntel && status.type === "success" && (
            <div className="bg-slate-900 text-white p-8 rounded-[3rem] mb-10 shadow-lg relative overflow-hidden">
               <div className="relative z-10">
                  <h4 className="text-sm font-black uppercase tracking-widest text-soft-teal mb-3">Threat Match Detected</h4>
                  <p className="text-sm font-medium leading-relaxed opacity-80 italic">
                    {scamIntel.reports > 0 ? `This target has ${scamIntel.reports} previous report(s) in our intelligence database.` : "This is a new pattern entry. Your report helps establish a new node."}
                  </p>
               </div>
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-soft-teal/20 rounded-full blur-3xl" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="bg-slate-50 p-10 rounded-[4rem] border border-slate-100 space-y-8">
               {/* Title */}
               <div>
                  <label className="text-xs font-semibold text-slate-700 capitalize tracking-wide mb-3 block px-4">Identify Case</label>
                  <input 
                    name="title" 
                    type="text" 
                    placeholder="e.g. UPI fraud during online purchase" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-white border border-transparent px-8 py-4 rounded-full text-sm font-medium tracking-wide focus:border-soft-teal/30 focus:shadow-md outline-none transition-all shadow-sm text-slate-800 placeholder:text-slate-500"
                  />
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 capitalize tracking-wide mb-3 block px-4">Classification</label>
                    <select 
                      name="scamType" 
                      value={formData.scamType} 
                      onChange={handleChange}
                      className="w-full bg-white border border-transparent px-8 py-4 rounded-full text-sm font-medium tracking-wide focus:border-soft-teal/30 outline-none cursor-pointer shadow-sm appearance-none text-slate-800"
                    >
                      <option value="">Auto-Detect</option>
                      {SCAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 capitalize tracking-wide mb-3 block px-4">Subject Target (ID/URL)</label>
                    <input 
                      name="scamTarget" 
                      type="text" 
                      placeholder="9876543210 or fake-site.com" 
                      value={formData.scamTarget} 
                      onChange={handleChange} 
                      className="w-full bg-white border border-transparent px-8 py-4 rounded-full text-sm font-medium tracking-wide focus:border-soft-teal/30 outline-none shadow-sm text-slate-800 placeholder:text-slate-500"
                    />
                  </div>
               </div>

               <div>
                  <label className="text-xs font-semibold text-slate-700 capitalize tracking-wide mb-3 block px-4">Operational Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      name="location" 
                      type="text" 
                      placeholder="Guwahati, Assam" 
                      value={formData.location} 
                      onChange={handleChange} 
                      className="w-full bg-white border border-transparent pl-14 pr-8 py-4 rounded-full text-sm font-medium tracking-wide focus:border-soft-teal/30 outline-none shadow-sm text-slate-800 placeholder:text-slate-500"
                    />
                  </div>
               </div>

               <div>
                  <label className="text-xs font-semibold text-slate-700 capitalize tracking-wide mb-3 block px-4">Incident Log Payload</label>
                  <textarea 
                    name="description" 
                    placeholder="Describe the sequence of events in detail..." 
                    value={formData.description} 
                    onChange={handleChange} 
                    required 
                    rows={6}
                    className="w-full bg-white border border-transparent px-8 py-6 rounded-[2.5rem] text-sm font-medium leading-relaxed text-slate-800 outline-none focus:border-soft-teal/30 shadow-sm transition-all placeholder:text-slate-500"
                  />
               </div>

               {/* AI Intelligence Preview */}
               {analysis && meta && (
                 <div className={`${meta.bg} ${meta.border} border-2 rounded-[3rem] p-8 shadow-soft animate-in zoom-in-95`}>
                    <div className="flex items-center gap-3 mb-6">
                       <Zap className={meta.color} size={18} />
                       <span className={`text-[10px] font-black uppercase tracking-widest ${meta.color}`}>AI Diagnostics Preview</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                       <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Threat Type</div>
                          <div className="text-[11px] font-black text-slate-800 uppercase italic leading-tight">{analysis.scamType}</div>
                       </div>
                       <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Priority</div>
                          <div className={`text-[11px] font-black uppercase flex items-center gap-1 ${meta.color}`}>
                             <meta.icon size={12} /> {analysis.priority}
                          </div>
                       </div>
                       <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Impact</div>
                          <div className="text-[11px] font-black text-slate-800 uppercase italic">HIGH_MATCH</div>
                       </div>
                       <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Risk Factor</div>
                          <div className={`text-2xl font-black italic tracking-tighter ${meta.color}`}>{analysis.riskScore}</div>
                       </div>
                    </div>
                 </div>
               )}

               {/* Evidence Upload */}
               <div>
                  <label className="text-xs font-semibold text-slate-700 capitalize tracking-wide mb-3 block px-4">Supporting Evidence</label>
                  <label className="flex items-center gap-5 bg-white border-2 border-dashed border-slate-200 p-8 rounded-[2.5rem] cursor-pointer hover:border-soft-teal transition-all group shadow-sm">
                     <div className="w-14 h-14 bg-soft-blue rounded-2xl flex items-center justify-center text-soft-teal group-hover:bg-soft-teal group-hover:text-white transition-all shadow-sm">
                        <Paperclip size={24} />
                     </div>
                     <div className="flex-grow">
                        <div className="text-sm font-semibold text-slate-700 capitalize tracking-wide">{fileName || "Attach Incident Evidence"}</div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">PNG, JPG, PDF (MAX 10MB)</div>
                     </div>
                     <input type="file" name="evidence" onChange={handleChange} className="hidden" accept="image/*,.pdf,.doc,.docx" />
                  </label>
               </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 h-20 rounded-full text-white text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:brightness-110 active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>EXECUTE LOG ENTRY <ChevronRight size={20} /></>
              )}
            </button>
          </form>
       </div>
    </UserLayout>
  );
}
