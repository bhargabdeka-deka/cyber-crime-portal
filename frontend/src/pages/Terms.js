import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, ChevronRight, FileText, AlertOctagon } from "lucide-react";

export default function Terms() {
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
               <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-1.5 rounded-full text-[10px] font-black text-orange-500 tracking-widest uppercase mb-4">
                  <FileText size={14} /> Usage Protocol
               </div>
               <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-6">Terms of Service</h1>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] italic">Standard Binary Engagement v2.1</p>
            </div>

            <div className="space-y-12">
               <section>
                  <h3 className="text-xl font-black italic tracking-tighter uppercase mb-6 flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-soft-teal" /> 01. Acceptance of Terms
                  </h3>
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-white text-sm font-medium leading-relaxed text-slate-600">
                     By accessing the CyberShield portal, you agree to abide by our operational standards and security protocols. This platform is a proactive defense tool; misuse for harassment or false reporting is strictly prohibited and may result in immediate node termination.
                  </div>
               </section>

               <section>
                  <h3 className="text-xl font-black italic tracking-tighter uppercase mb-6 flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-soft-teal" /> 02. Integrity of Reports
                  </h3>
                  <div className="text-sm font-semibold leading-relaxed text-slate-500 space-y-6 italic">
                     <p>Users must ensure that all incident logs submitted are accurate and based on real-world events. Filing fraudulent reports undermines the network's collective intelligence.</p>
                     <p className="flex items-start gap-4 bg-rose-50 p-6 rounded-[2rem] border border-rose-100 text-rose-700 not-italic">
                        <AlertOctagon size={20} className="shrink-0 mt-1" />
                        <span>Submitting false information intentionally is a violation of protocol and will be flagged across our security partner nodes.</span>
                     </p>
                  </div>
               </section>

               <section>
                  <h3 className="text-xl font-black italic tracking-tighter uppercase mb-6 flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-soft-teal" /> 03. Liability Disclaimer
                  </h3>
                  <div className="bg-slate-900 p-10 rounded-[3rem] text-slate-300 text-xs font-bold leading-relaxed tracking-wide uppercase">
                     CyberShield is an independent intelligence network. We provide predictive diagnostics and community-sourced threat data. While we strive for absolute accuracy, CyberShield cannot be held liable for any direct or indirect damages resulting from the use of our analysis or reliance on threat advisories.
                  </div>
               </section>

               <section className="pt-10 border-t border-slate-100">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                     <div className="text-center md:text-left">
                        <h4 className="text-sm font-black italic tracking-tighter uppercase mb-2">Node Termination</h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Reports of TOS violations should be sent to admin@cybershield.net</p>
                     </div>
                     <button onClick={() => navigate("/")} className="bg-soft-teal text-white rounded-full px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:brightness-110 transition-all flex items-center gap-3">
                        ACCEPT & CONTINUE <ChevronRight size={16} />
                     </button>
                  </div>
               </section>
            </div>
         </div>
      </div>
    </div>
  );
}
