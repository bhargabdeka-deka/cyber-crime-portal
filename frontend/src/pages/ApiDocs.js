import { useNavigate } from "react-router-dom";
import { ShieldCheck, FileCode, ArrowLeft, ChevronRight, Globe, Lock, Terminal, Zap } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-[#E0F4FF] font-sans flex flex-col">
      <nav className="sticky top-0 z-[100] bg-white/70 backdrop-blur-lg border-b border-white px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-soft-teal rounded-2xl flex items-center justify-center text-white shadow-soft">
            <ShieldCheck size={22} />
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase text-slate-800">Shield</span>
        </div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-soft-teal transition-all">
           <ArrowLeft size={16} /> GO_BACK
        </button>
      </nav>

      <div className="max-w-4xl mx-auto py-20 px-6 flex-grow">
         <div className="mb-16">
            <div className="inline-flex items-center gap-2 bg-soft-blue px-4 py-1.5 rounded-full text-[10px] font-black text-soft-teal tracking-widest uppercase mb-6">
               <Terminal size={14} /> Network Protocols
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-6">API Documentation</h1>
            <p className="text-lg font-medium text-slate-400 max-w-xl leading-relaxed italic">
              Integrate the Cyber Intelligence Network (CIN) into your own applications via standard REST protocols.
            </p>
         </div>

         <div className="bg-white p-10 rounded-[3rem] border border-white shadow-soft mb-12 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                  <Globe size={24} />
               </div>
               <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Endpoint</div>
                  <div className="text-sm font-black text-slate-800 italic uppercase mt-1">{BASE}</div>
               </div>
            </div>
            <div className="bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Secure Node</span>
            </div>
         </div>

         <div className="space-y-12">
            {endpoints.map((ep, i) => (
               <div key={i} className="bg-white rounded-[4rem] border border-white shadow-soft overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700" style={{ animationDelay: `${i*100}ms` }}>
                  <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50">
                     <div className="flex items-center gap-4">
                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${methodColors[ep.method]}`}>{ep.method}</span>
                        <code className="text-sm font-black text-slate-800 uppercase tracking-tighter italic">{ep.path}</code>
                     </div>
                     <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-full border border-slate-100">
                        <Lock size={12} className="text-slate-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">AUTH: {ep.auth}</span>
                     </div>
                  </div>
                  <div className="p-10 md:p-14">
                     <p className="text-sm font-semibold text-slate-500 mb-10 leading-relaxed italic uppercase tracking-wide">{ep.desc}</p>
                     
                     <div className="grid lg:grid-cols-2 gap-10">
                        {ep.body && (
                           <div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                 <FileCode size={14} /> Request Body
                              </div>
                              <pre className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 text-xs text-soft-teal font-bold overflow-auto leading-relaxed shadow-inner">
                                 {ep.body}
                              </pre>
                           </div>
                        )}
                        <div className={ep.body ? "" : "lg:col-span-2"}>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Zap size={14} className="fill-slate-400" /> Response Format
                           </div>
                           <pre className="bg-slate-50 p-8 rounded-[2.5rem] border border-white text-xs text-slate-600 font-bold overflow-auto leading-relaxed shadow-inner italic">
                              {ep.response}
                           </pre>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         <div className="mt-20 bg-slate-900 rounded-[4rem] p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">Scale Your Project</h3>
               <p className="text-slate-400 text-sm font-medium mb-10 max-w-md mx-auto leading-relaxed">
                  Join the developer network to get higher rate limits, authenticated endpoints, and priority support.
               </p>
               <button onClick={() => navigate("/register")} className="bg-soft-teal text-white px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-lg">
                  GENERATE API KEY <ChevronRight size={16} className="inline ml-2" />
               </button>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-soft-teal/5 pointer-events-none" />
         </div>
      </div>
      <Footer />
    </div>
  );
}
