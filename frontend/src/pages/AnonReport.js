import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import analyzeComplaint from "../utils/riskAnalyzer";
import Footer from "../components/Footer";
import { useScrollDirection } from "../hooks/useScrollDirection";
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  MapPin, 
  Paperclip, 
  Plus, 
  ChevronRight, 
  Zap,
  Lock,
  ArrowRight
} from "lucide-react";

const SCAM_TYPES = ["UPI Fraud","Phishing","Job Scam","Lottery Scam","Romance Scam","Investment Scam","Identity Theft","Account Hacking","Cyber Harassment","Other"];

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
  const [status, setStatus]     = useState({ type:"", msg:"" });
  const [loading, setLoading]   = useState(false);
  const [fileName, setFileName] = useState("");
  const [done, setDone]         = useState(null);

  useEffect(() => {
    if (form.title || form.description) setAnalysis(analyzeComplaint(form.title, form.description));
    else setAnalysis(null);
  }, [form.title, form.description]);

  const handleChange = (e) => {
    if (e.target.name === "evidence") {
      setForm({...form, evidence: e.target.files[0]});
      setFileName(e.target.files[0]?.name || "");
    } else setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setStatus({type:"",msg:""});
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k,v]) => { if (v && k !== "evidence") data.append(k, v); });
      if (form.evidence) data.append("evidence", form.evidence);
      const res = await API.post("/complaints/anonymous", data, { headers:{"Content-Type":"multipart/form-data"} });
      setDone(res.data.caseId);
    } catch (err) {
      setStatus({type:"error", msg: err.response?.data?.message || "Submission failed. Try again."});
    } finally { setLoading(false); }
  };

  const meta = analysis ? ({
    Critical:{color:"text-rose-600", bg:"bg-rose-50", border:"border-rose-100", icon: AlertTriangle},
    High:{color:"text-orange-600", bg:"bg-orange-50", border:"border-orange-100", icon: AlertTriangle},
    Medium:{color:"text-blue-600", bg:"bg-blue-50", border:"border-blue-100", icon: Zap},
    Low:{color:"text-emerald-600", bg:"bg-emerald-50", border:"border-emerald-100", icon: CheckCircle},
  }[analysis.priority] || {color:"text-emerald-600", bg:"bg-emerald-50", border:"border-emerald-100", icon: CheckCircle}) : null;

  const pageContent = (
    <div className="max-w-3xl mx-auto py-10 px-4 md:px-6 min-h-screen">
       {done ? (
         <div className="text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-soft-teal rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 md:mb-10 shadow-lg rotate-6">
               <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-6">Threat Logged</h1>
            <p className="text-base md:text-lg font-medium text-slate-400 mb-8 md:mb-10 px-4">Thank you for contributing to the network's collective security.</p>
            
            <div className="bg-white border-2 border-slate-50 p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] shadow-soft mb-10 md:mb-12">
               <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Permanent Reference ID</div>
               <div className="text-xl md:text-2xl font-black text-slate-900 tracking-widest bg-slate-50 py-5 md:py-6 rounded-2xl md:rounded-3xl border border-slate-100 mb-6 break-all">{done}</div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Store this ID to track your incident response.</p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
               <button onClick={() => navigate("/check-scam")} className="bg-slate-50 px-8 py-4 md:px-10 md:py-5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all border border-slate-100 shadow-sm">CHECK ANOTHER NODE</button>
               <button onClick={() => navigate("/register")} className="bg-slate-900 text-white px-8 py-4 md:px-10 md:py-5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                  CREATE IDENTITY <ArrowRight size={16} />
               </button>
            </div>
         </div>
       ) : (
         <>
           <div className="mb-12 md:mb-16">
             <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-full text-[10px] font-black text-emerald-500 tracking-widest uppercase mb-6 border border-emerald-100">
               <Lock size={14} /> Anonymous Entry Authorized
             </div>
             <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">File Incident</h1>
             <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-[0.15em] md:tracking-[0.2em] px-1">No identity verification required for public logs.</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 group mb-20">
              <div className="bg-slate-50 p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 space-y-6 md:space-y-8 shadow-sm">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-4">Identify Case</label>
                    <input 
                      name="title" 
                      type="text" 
                      placeholder="E.G. UPI FRAUD DURING ONLINE PURCHASE" 
                      value={form.title} 
                      onChange={handleChange} 
                      required 
                      className="w-full bg-white border border-transparent px-6 md:px-8 py-4 md:py-5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest focus:border-soft-teal/20 outline-none shadow-sm"
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-4">Threat Classification</label>
                       <select 
                         name="scamType" 
                         value={form.scamType} 
                         onChange={handleChange}
                         className="w-full bg-white border border-transparent px-6 md:px-8 py-4 md:py-5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest focus:border-soft-teal/20 outline-none shadow-sm appearance-none cursor-pointer"
                       >
                          <option value="">AUTO-DETECT</option>
                          {SCAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-4">Subject Target (ID/URL)</label>
                       <input 
                         name="scamTarget" 
                         type="text" 
                         placeholder="ENTITY IDENTIFIER" 
                         value={form.scamTarget} 
                         onChange={handleChange} 
                         className="w-full bg-white border border-transparent px-6 md:px-8 py-4 md:py-5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest focus:border-soft-teal/20 outline-none shadow-sm"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-4">Operational Location</label>
                    <div className="relative">
                       <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                         name="location" 
                         type="text" 
                         placeholder="GUWAHATI, ASSAM" 
                         value={form.location} 
                         onChange={handleChange} 
                         className="w-full bg-white border border-transparent pl-14 pr-8 py-4 md:py-5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest focus:border-soft-teal/20 outline-none shadow-sm"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-4">Full Incident Log</label>
                    <textarea 
                      name="description" 
                      placeholder="DETAILED SEQUENCE OF EVENTS..." 
                      value={form.description} 
                      onChange={handleChange} 
                      required 
                      rows={6}
                      className="w-full bg-white border border-transparent px-6 md:px-8 py-5 md:py-6 rounded-[1.5rem] md:rounded-[2.5rem] text-sm font-semibold leading-relaxed text-slate-600 outline-none focus:border-soft-teal/20 shadow-sm"
                    />
                 </div>

                 {analysis && meta && (
                   <div className={`${meta.bg} ${meta.border} border-2 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10 animate-in zoom-in-95`}>
                      <div className="flex items-center gap-3 mb-6 md:mb-8">
                         <Zap className={meta.color} size={16} />
                         <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${meta.color}`}>AI Live Extraction Preview</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                         <div>
                            <div className="text-[8px] font-black text-slate-400 uppercase mb-2">Category</div>
                            <div className="text-[10px] md:text-xs font-black text-slate-800 uppercase">{analysis.scamType}</div>
                         </div>
                         <div>
                            <div className="text-[8px] font-black text-slate-400 uppercase mb-2">Threat ID</div>
                            <div className="text-[10px] md:text-xs font-black text-slate-800 uppercase">NEW_LOG</div>
                         </div>
                         <div>
                            <div className="text-[8px] font-black text-slate-400 uppercase mb-2">Priority</div>
                            <div className={`text-[10px] md:text-xs font-black uppercase flex items-center gap-1 ${meta.color}`}>
                               <meta.icon size={12} /> {analysis.priority}
                            </div>
                         </div>
                         <div>
                            <div className="text-[8px] font-black text-slate-400 uppercase mb-2">Risk Rating</div>
                            <div className={`text-xl md:text-2xl font-black tracking-tighter ${meta.color}`}>{analysis.riskScore}</div>
                         </div>
                      </div>
                   </div>
                 )}

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-4">Digital Evidence</label>
                    <label className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 bg-white border-2 border-dashed border-slate-200 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] cursor-pointer hover:border-soft-teal transition-all text-center sm:text-left">
                       <div className="w-12 h-12 md:w-14 md:h-14 bg-soft-blue rounded-xl md:rounded-2xl flex items-center justify-center text-soft-teal">
                          <Paperclip size={20} />
                       </div>
                       <div>
                          <div className="text-[10px] md:text-xs font-black uppercase text-slate-800">{fileName || "Attach Incident Visuals"}</div>
                          <div className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-tight mt-1">LOG FORMAT: PNG, JPG, PDF (MAX 10MB)</div>
                       </div>
                       <input type="file" name="evidence" onChange={handleChange} className="hidden" accept="image/*,.pdf,.doc,.docx" />
                    </label>
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 h-20 md:h-24 rounded-full text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em] flex items-center justify-center gap-4 md:gap-6 shadow-xl hover:brightness-110 active:scale-95 transition-all"
              >
                 {loading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : <>TRANSMIT ANONYMOUS LOG <ArrowRight size={20} /></>}
              </button>

              <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                 Identity status: <span className="text-emerald-500">PROTECTED</span> • Network: <span className="text-soft-teal">ONLINE</span>
              </p>
           </form>
         </>
       )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E0F4FF] font-sans flex flex-col">
      {/* Identity Bar */}
      <div className={`bg-slate-900 text-white py-2.5 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-3 sticky top-0 z-[100] transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <span>CyberShield Global Network</span>
        <span className="opacity-30">·</span>
        <span className="text-emerald-400 font-medium">Secure Session Active</span>
      </div>

      {/* Header Navigation */}
      <header className={`px-4 md:px-6 py-4 md:py-6 sticky top-[37px] z-50 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-[200%]'}`}>
        <nav className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md px-4 md:px-8 py-3 md:py-4 rounded-full flex items-center justify-between shadow-soft border border-white/50">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-full flex items-center justify-center text-white overflow-hidden shadow-sm border border-slate-50">
              <img src="/logo1.jpeg" alt="Logo" className="w-full h-full object-cover scale-[1.05]" />
            </div>
            <span className="text-lg md:text-xl font-black tracking-[-0.04em] font-brand text-slate-900 flex items-center">
              CYBER<span className="text-soft-teal ml-0.5">SHIELD</span>
            </span>
          </div>
          <button onClick={() => navigate("/login")} className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-all px-4 tracking-wide">Sign In</button>
        </nav>
      </header>
      <div className="px-4 md:px-6 flex-grow">{pageContent}</div>
      <Footer />
    </div>
  );
}
