import { useNavigate } from "react-router-dom";
import { ShieldCheck, FileCode, ArrowLeft, ChevronRight, Globe, Lock, Terminal, Zap } from "lucide-react";
import { useScrollDirection } from "../hooks/useScrollDirection";
import Footer from "../components/Footer";

const BASE = "https://cyber-crime-portal-2.onrender.com";

const endpoints = [
  {
    method: "GET", path: "/api/scam/check?query=9876543210",
    desc: "Check if a phone number, URL, or UPI ID has been reported as a scam.",
    auth: "None",
    response: `{
  "status": "SCAM",
  "verdict": "dangerous",
  "reports": 14,
  "riskLevel": "CRITICAL",
  "category": "UPI Fraud"
}`
  },
  {
    method: "GET", path: "/api/scam/trending",
    desc: "Get trending scam categories and most-reported targets.",
    auth: "None",
    response: `{
  "topTargets": [...],
  "topCategories": [...],
  "stats": { "totalScams": 16, "recentCount": 5 }
}`
  },
  {
    method: "POST", path: "/api/complaints/anonymous",
    desc: "Submit an anonymous scam report without creating an account.",
    auth: "None",
    body: `{
  "title": "Fake job offer",
  "scamType": "Job Scam",
  "scamTarget": "9876543210"
}`,
    response: `{
  "success": true,
  "caseId": "ANON-171"
}`
  },
];

const methodColors = {
  GET: "bg-emerald-100 text-emerald-700 border-emerald-200",
  POST: "bg-blue-100 text-blue-700 border-blue-200",
  PUT: "bg-amber-100 text-amber-700 border-amber-200",
  DELETE: "bg-rose-100 text-rose-700 border-rose-200"
};

export default function ApiDocs() {
  const navigate = useNavigate();
  const isVisible = useScrollDirection();

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
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-soft-teal transition-all tracking-wide">
           <ArrowLeft size={16} /> Go Back
        </button>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto py-10 md:py-20 px-4 md:px-6 flex-grow">
          <div className="mb-12 md:mb-16 text-center md:text-left">
             <div className="inline-flex items-center gap-2 bg-soft-blue px-4 py-2 rounded-full text-[10px] md:text-xs font-semibold text-soft-teal tracking-wide mb-6">
                <Terminal size={14} /> Network Protocols
             </div>
             <h1 className="text-3xl md:text-5xl font-brand font-black text-slate-900 tracking-tighter leading-tight mb-6">API Documentation</h1>
             <p className="text-base md:text-lg font-medium text-slate-500 max-w-xl leading-relaxed mx-auto md:mx-0">
                Integrate the Cyber Intelligence Network (CIN) into your own applications via standard REST protocols.
             </p>
          </div>
 
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white shadow-soft mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0">
                   <Globe size={24} />
                </div>
                <div>
                   <div className="text-[10px] md:text-xs font-semibold text-slate-500 tracking-wide">Base Endpoint</div>
                   <div className="text-xs md:text-sm font-bold text-slate-800 mt-1 break-all">{BASE}</div>
                </div>
             </div>
             <div className="bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] md:text-xs font-semibold text-emerald-600 tracking-wide">Secure Node</span>
             </div>
          </div>
 
          <div className="space-y-12">
             {endpoints.map((ep, i) => (
                <div key={i} className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-white shadow-soft overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700" style={{ animationDelay: `${i*100}ms` }}>
                   <div className="p-6 md:p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                         <span className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wide border-2 shrink-0 ${methodColors[ep.method]}`}>{ep.method}</span>
                         <code className="text-xs md:text-sm font-bold text-slate-800 tracking-tight break-all">{ep.path}</code>
                      </div>
                      <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-full border border-slate-100 self-start md:self-auto">
                         <Lock size={12} className="text-slate-400" />
                         <span className="text-[10px] md:text-xs font-semibold text-slate-500 tracking-wide">Auth: {ep.auth}</span>
                      </div>
                   </div>
                   <div className="p-6 md:p-14">
                      <p className="text-xs md:text-sm font-medium text-slate-600 mb-8 md:mb-10 leading-relaxed">{ep.desc}</p>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                         {ep.body && (
                            <div>
                               <div className="text-[10px] font-semibold text-slate-500 tracking-wide mb-4 flex items-center gap-2">
                                  <FileCode size={14} /> Request Body
                               </div>
                               <pre className="bg-slate-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-800 text-[10px] md:text-xs text-soft-teal font-bold overflow-x-auto leading-relaxed shadow-inner">
                                  {ep.body}
                               </pre>
                            </div>
                         )}
                         <div className={ep.body ? "" : "lg:col-span-2"}>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                               <Zap size={14} className="fill-slate-400" /> Response Format
                            </div>
                            <pre className="bg-slate-50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white text-[10px] md:text-xs text-slate-600 font-medium overflow-x-auto leading-relaxed shadow-inner">
                               {ep.response}
                            </pre>
                         </div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
 
          <div className="mt-16 md:mt-20 bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-brand font-bold text-white tracking-tight mb-6">Scale Your Project</h3>
                <p className="text-slate-400 text-xs md:text-sm font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                   Join the developer network to get higher rate limits, authenticated endpoints, and priority support.
                </p>
                <button onClick={() => navigate("/register")} className="bg-soft-teal text-white w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 rounded-full text-xs md:text-sm font-semibold tracking-wide hover:scale-105 transition-all shadow-lg">
                   Generate API Key <ChevronRight size={16} className="inline ml-2" />
                </button>
             </div>
             <div className="absolute top-0 left-0 w-full h-full bg-soft-teal/5 pointer-events-none" />
          </div>
       </div> <Footer />
    </div>
  );
}
