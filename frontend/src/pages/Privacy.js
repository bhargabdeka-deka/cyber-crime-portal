import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, ChevronRight, CheckCircle, Lock } from "lucide-react";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#E0F4FF] font-sans text-slate-800 pb-20">
      <nav className="sticky top-0 z-[100] bg-white/70 backdrop-blur-lg border-b border-white px-6 md:px-10 py-4 md:py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-soft-teal rounded-2xl flex items-center justify-center text-white shadow-soft">
            <ShieldCheck size={18} className="md:w-[22px] md:h-[22px]" />
          </div>
          <span className="text-lg md:text-xl font-black italic tracking-tighter uppercase text-slate-800">Shield</span>
        </div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-soft-teal transition-all">
           <ArrowLeft size={16} /> GO_BACK
        </button>
      </nav>

      <div className="max-w-4xl mx-auto mt-10 md:mt-20 px-4 md:px-6">
         <div className="bg-white p-8 md:p-20 rounded-[2.5rem] md:rounded-[4rem] border border-white shadow-soft animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="mb-10 md:mb-16">
               <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-full text-[10px] font-black text-emerald-500 tracking-widest uppercase mb-4">
                  <Lock size={14} /> Data Sovereignty
               </div>
               <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-6">Privacy Policy</h1>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] italic">Last entry revision: Jan 2026</p>
            </div>

            <div className="space-y-12">
               <section>
                  <h3 className="text-xl font-black italic tracking-tighter uppercase mb-6 flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-soft-teal" /> Collection Protocol
                  </h3>
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-white text-sm font-medium leading-relaxed text-slate-600 space-y-4">
                     <p>At CyberShield, we prioritize your digital safety without compromising your identity. We collect data solely to identify threat patterns and protect the network collective.</p>
                     <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                           <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                           <span>Operational identifiers (Email, Username) for session management.</span>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                           <span>Incident log data provided during report filing.</span>
                        </li>
                        <li className="flex items-start gap-3">
                           <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                           <span>Technical signals (IP Address) for security and anti-spam verification.</span>
                        </li>
                     </ul>
                  </div>
               </section>

               <section>
                  <h3 className="text-xl font-black italic tracking-tighter uppercase mb-6 flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-soft-teal" /> AI Diagnostics & Usage
                  </h3>
                  <div className="text-sm font-semibold leading-relaxed text-slate-500 space-y-6">
                     <p>Your reports are processed by our automated risk analyzer. This component extracts keywords—such as phone numbers, URLs, and UPI IDs—to populate our global threat map.</p>
                     <p>We do <span className="text-slate-900 underline">NOT</span> sell individual user data to third-party advertisers. Data is exclusively utilized for intelligence sharing within the CyberShield network and authorized security partners.</p>
                  </div>
               </section>

               <section>
                  <h3 className="text-xl font-black italic tracking-tighter uppercase mb-6 flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-soft-teal" /> Retention Ledger
                  </h3>
                  <div className="bg-soft-blue/30 p-8 rounded-[2.5rem] border border-white">
                     <div className="grid md:grid-cols-2 gap-8">
                        <div>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Private User Logs</div>
                           <div className="text-sm font-black italic">60 MONTHS ARCHIVAL</div>
                        </div>
                        <div>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Public Threat Data</div>
                           <div className="text-sm font-black italic">PERMANENT DECENTRALIZED RECORD</div>
                        </div>
                     </div>
                  </div>
               </section>

               <section className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-8">
                  <div>
                     <h4 className="text-sm font-black italic tracking-tighter uppercase mb-2">Exert Your Rights</h4>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Contact DPO at privacy@cybershield.net for data deletion requests.</p>
                  </div>
                  <button onClick={() => navigate("/register")} className="bg-slate-900 text-white rounded-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-3 hover:scale-105 transition-all self-start">
                     JOIN_NETWORK <ChevronRight size={16} />
                  </button>
               </section>
            </div>
         </div>
      </div>
    </div>
  );
}
