import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Phone, 
  Globe, 
  CreditCard,
  Target,
  CheckCircle,
  ArrowRight,
  Search,
  Zap,
  Share2
} from "lucide-react";
import API from "../services/api";
import { useScrollDirection } from "../hooks/useScrollDirection";
import useWindowWidth from "../hooks/useWindowWidth";
import Footer from "../components/Footer";

const verdictConfig = {
  safe:      { color:"text-emerald-600", bg:"bg-emerald-50",  border:"border-emerald-100", icon: CheckCircle, title:"No Reports Found",  sub:"This node appears safe across our global intelligence network." },
  caution:   { color:"text-amber-600",   bg:"bg-amber-50",   border:"border-amber-100",   icon: AlertTriangle, title:"Reported Once",      sub:"Single incident log detected. Proceed with extreme caution." },
  warning:   { color:"text-orange-600",  bg:"bg-orange-50",  border:"border-orange-100",  icon: AlertTriangle, title:"Suspicious Pattern",  sub:"Multiple intelligence nodes have flagged this activity." },
  dangerous: { color:"text-rose-600",    bg:"bg-rose-50",    border:"border-rose-100",    icon: AlertTriangle, title:"Highly Dangerous",   sub:"Confirmed threat vector. Do NOT engage with this entity." },
};

export default function Landing() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ticker, setTicker] = useState([]);
  const isVisible = useScrollDirection();
  const w = useWindowWidth();

  useEffect(() => {
    API.get("/scam/activity").then(res => setTicker(res.data)).catch(() => {});
  }, []);

  const triggerCheck = async (val) => {
    if (!val) return;
    setLoading(true);
    try {
      const res = await API.get(`/scam/check?query=${val}`);
      setCheckResult(res.data);
    } catch {
      setCheckResult({ verdict: "caution", note: "Security database unreachable. Proceed with awareness." });
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = (e) => {
    e.preventDefault();
    triggerCheck(query);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#E0F4FF] overflow-x-hidden w-full">
      {/* Identity Bar */}
      <div className={`bg-slate-900 text-white py-2.5 px-2 text-[10px] sm:text-xs font-semibold tracking-wide flex flex-wrap items-center justify-center gap-2 sm:gap-3 sticky top-0 z-[100] transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} w-full text-center`}>
        <span>CyberShield Global Network</span>
        <span className="opacity-30 hidden sm:inline">·</span>
        <span className="text-emerald-400 font-medium">Secure Session Active</span>
      </div>

      {/* 1. Header Navigation */}
      <header className={`px-4 md:px-6 py-4 md:py-6 sticky top-[37px] z-50 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-[200%]'}`}>
        <nav className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md px-4 md:px-8 py-3 md:py-4 rounded-full flex items-center justify-between shadow-soft border border-white/50">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate("/")}>
             <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-full flex items-center justify-center text-white overflow-hidden shadow-sm border border-white">
                <img src="/logo1.jpeg" alt="CyberShield Logo" className="w-full h-full object-cover scale-[1.05]" />
             </div>
             <span className="text-2xl font-black tracking-[-0.04em] text-slate-900 font-brand flex items-center">
                CYBER<span className="text-soft-teal ml-0.5">SHIELD</span>
             </span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
             <button onClick={() => navigate("/report")} className="text-sm font-semibold text-slate-600 hover:text-soft-teal transition-colors uppercase tracking-wider">Report</button>
             <button onClick={() => navigate("/trending")} className="text-sm font-semibold text-slate-600 hover:text-soft-teal transition-colors uppercase tracking-wider">Alerts</button>
             <button onClick={() => navigate("/api-docs")} className="text-sm font-semibold text-slate-600 hover:text-soft-teal transition-colors uppercase tracking-wider">Docs</button>
          </div>

          <div className="flex items-center gap-1 md:gap-4 shrink-0">
             <button onClick={() => navigate("/login")} className="text-[10px] md:text-sm font-bold text-slate-700 hover:text-soft-teal px-2 md:px-4 transition-colors">LOGIN</button>
             <button onClick={() => navigate("/register")} className="bg-soft-teal text-white px-3 md:px-6 py-2 md:py-3 rounded-full text-[10px] md:text-sm font-bold tracking-wide hover:shadow-lg hover:scale-105 transition-all">SIGN UP</button>
          </div>
        </nav>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-grow pt-10 pb-20">
        <section className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
           <div className="space-y-10">
               <div className="flex flex-col items-center gap-6">
                 <div className="inline-flex items-center gap-2 bg-white/50 border border-white px-4 py-2 rounded-full text-[11px] font-black text-soft-teal tracking-widest uppercase shadow-sm">
                    <Zap size={14} className="fill-soft-teal" /> Instant Security Verification
                 </div>
                 <p className="font-serif italic text-slate-600 text-base md:text-xl font-medium tracking-tight px-2 text-center w-full">"Protecting Your Digital Assets, Our Priority"</p>
               </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black font-brand text-slate-900 leading-[0.95] tracking-tighter text-center mx-auto">
                Stay Safe In <br/>
                <span className="text-soft-teal">Digital World.</span>
              </h1>
              
              <p className="text-sm md:text-lg font-medium text-slate-500 leading-relaxed max-w-[280px] md:max-w-md mx-auto text-center">
                Fastest way to verify UPI IDs, Phone Numbers, and URLs. Trusted by thousands of users across the globe.
              </p>

              <form onSubmit={handleCheck} className="relative group max-w-2xl mx-auto w-full">
                <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-soft-teal transition-all">
                  <Search size={22} className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <input 
                  type="text" 
                  placeholder={w < 640 ? "Analyze Query..." : "Analyze Phone, URL, or UPI Database..."}
                  value={query}
                  onChange={e => { setQuery(e.target.value); setCheckResult(null); }}
                  className="w-full bg-white/70 backdrop-blur-md border border-white pl-12 md:pl-20 pr-24 md:pr-40 py-4 md:py-7 rounded-full text-sm md:text-lg font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-soft-teal/10 shadow-soft transition-all"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 md:px-10 py-2.5 md:py-4 rounded-full text-[10px] md:text-xs font-bold tracking-[0.1em] md:tracking-[0.2em] shadow-lg hover:bg-soft-teal transition-all flex items-center gap-1 md:gap-3"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <>SCAN <ShieldCheck size={14} className="md:w-4 md:h-4" /></>}
                </button>
              </form>
              
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-6 px-4">
                <span className="w-full md:w-auto text-[9px] font-bold text-slate-400 py-2 uppercase tracking-widest block md:inline">Quick Verify:</span>
                {["9876543210", "sbi-kyc-check.in", "lottery@scam.in"].map(ex => (
                  <button 
                    key={ex} 
                    onClick={() => { setQuery(ex); triggerCheck(ex); }}
                    className="bg-white/50 backdrop-blur-sm border border-white text-[9px] font-bold text-slate-500 px-3 md:px-4 py-2 rounded-full hover:border-soft-teal hover:text-soft-teal transition-all shadow-sm uppercase tracking-wider"
                  >
                    {ex}
                  </button>
                ))}
              </div>

               {(() => {
                 const vc = checkResult ? (verdictConfig[checkResult.verdict] || verdictConfig.safe) : null;
                 if (!vc) return null;
                 return (
                   <div className="mt-12 animate-in fade-in zoom-in-95 duration-500 w-full max-w-4xl mx-auto text-left">
                     <div className={`${vc.bg} border-2 ${vc.border} rounded-[3rem] p-8 md:p-10 shadow-soft relative overflow-hidden`}>
                       <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 relative z-10">
                         <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                           <div className={`w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center ${vc.color} shadow-lg shadow-white/50 border border-white shrink-0`}>
                             <vc.icon size={40} strokeWidth={2.5} />
                           </div>
                           <div className="text-center md:text-left">
                             <h3 className={`text-3xl md:text-4xl font-brand font-black tracking-tighter leading-none mb-3 ${vc.color}`}>{vc.title}</h3>
                             <p className="text-sm font-medium text-slate-500 tracking-wide max-w-lg">{vc.sub}</p>
                           </div>
                         </div>
                         <button 
                           onClick={() => navigate(`/check-scam/${query}`)}
                           className="bg-white px-8 py-4 rounded-full text-xs font-bold shadow-hover text-slate-700 hover:text-soft-teal transition-all flex items-center gap-3 shrink-0"
                         >
                           <Share2 size={18} /> Share Intel
                         </button>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                         <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white text-center shadow-sm transition-all hover:shadow-md">
                           <div className={`text-4xl font-brand font-bold tracking-tighter mb-2 ${vc.color}`}>
                             {checkResult.reports || 0}
                           </div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Reports Found</div>
                         </div>
                         <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white text-center shadow-sm transition-all hover:shadow-md">
                           <div className={`text-4xl font-brand font-bold tracking-tighter mb-2 ${vc.color}`}>
                             {checkResult.riskLevel === 'LOW' ? '—' : checkResult.avgRiskScore || '—'}
                           </div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Risk Score</div>
                         </div>
                         <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white text-center shadow-sm transition-all hover:shadow-md">
                           <div className={`text-4xl font-brand font-bold tracking-tighter mb-2 ${vc.color}`}>
                             {checkResult.riskLevel || 'LOW'}
                           </div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Severity</div>
                         </div>
                       </div>

                       {checkResult.actionAdvice && (
                         <div className="grid md:grid-cols-2 gap-8 mt-12 relative z-10">
                           <div className="bg-rose-50/50 p-8 rounded-[2.5rem] border border-rose-100/50">
                             <h4 className="text-xs font-brand font-bold text-rose-500 uppercase tracking-widest mb-6">Security Warnings</h4>
                             <ul className="space-y-4">
                               {checkResult.actionAdvice.avoid.map((a, i) => (
                                 <li key={i} className="flex items-center gap-3 text-[11px] font-semibold text-rose-800">
                                   <span className="w-2 h-2 rounded-full bg-rose-400" /> {a}
                                 </li>
                               ))}
                             </ul>
                           </div>
                           <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100/50">
                             <h4 className="text-xs font-brand font-bold text-emerald-600 uppercase tracking-widest mb-6">Recommended Actions</h4>
                             <ul className="space-y-4">
                               {checkResult.actionAdvice.doThis.map((a, i) => (
                                 <li key={i} className="flex items-center gap-3 text-[11px] font-semibold text-emerald-800">
                                   <span className="w-2 h-2 rounded-full bg-emerald-400" /> {a}
                                 </li>
                               ))}
                             </ul>
                           </div>
                         </div>
                       )}
                     </div>
                   </div>
                 );
               })()}
           </div>
        </section>

        {/* 3. Category Sections as Pill Shapes */}
        <section className="max-w-6xl mx-auto px-6 py-20 mt-10">
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Report Threat", icon: ShieldCheck, color: "bg-[#D1FAE5]", text: "text-emerald-700", iconColor: "text-emerald-500", desc: "File an incident report instantly." },
                { title: "Quick Alerts", icon: AlertTriangle, color: "bg-[#FEF3C7]", text: "text-amber-700", iconColor: "text-amber-500", desc: "Latest trends in digital scams." },
                { title: "Verify ID", icon: Target, color: "bg-[#DBEAFE]", text: "text-blue-700", iconColor: "text-blue-500", desc: "Check links, phone nos and more." }
              ].map((item, i) => (
                <div key={i} className={`p-10 rounded-[3rem] shadow-soft hover:shadow-hover transition-soft cursor-pointer ${item.color} group`}>
                   <div className={`w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform ${item.iconColor}`}>
                      <item.icon size={28} />
                   </div>
                   <h4 className={`text-2xl font-black uppercase mb-4 leading-none ${item.text}`}>{item.title}</h4>
                   <p className={`text-sm font-medium leading-relaxed ${item.text} opacity-70`}>{item.desc}</p>
                   <div className="mt-8">
                      <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${item.text}`}>
                         <ArrowRight size={20} />
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* 4. Action Hero Banner */}
        <section className="px-4 md:px-6 mt-10">
           <div className="max-w-6xl mx-auto bg-slate-900 rounded-[3rem] md:rounded-[4rem] p-10 md:p-16 relative overflow-hidden">
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                 <div className="text-center lg:text-left">
                    <h2 className="text-4xl md:text-5xl font-bold font-serif text-white tracking-tight mb-4">
                       Trusted Security. <br/>
                       <span className="text-soft-teal italic font-medium">Verified Intelligence.</span>
                    </h2>
                     <p className="text-base md:text-lg text-slate-300 font-medium mb-10 max-w-sm mx-auto lg:mx-0">
                        Join our platform to access advanced threat intelligence and protect your digital assets.
                     </p>
                    <button onClick={() => navigate("/register")} className="bg-white text-slate-900 px-8 py-4 rounded-full font-semibold tracking-wide hover:bg-soft-teal hover:text-white transition-all shadow-lg hover:shadow-soft-teal/50 w-full md:w-auto">
                       Get Started Now
                    </button>
                 </div>
                 <div className="flex justify-center">
                    <div className="grid grid-cols-2 gap-6 w-full">
                       {[
                         { label: "Phone Phishing", icon: Phone },
                         { label: "UPI Scams", icon: CreditCard },
                         { label: "Fake Links", icon: Globe },
                         { label: "Identity Theft", icon: ShieldCheck }
                       ].map((stat, i) => (
                         <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                             <stat.icon className="text-soft-teal mb-3" size={24} strokeWidth={2} />
                             <div className="text-white text-sm font-medium tracking-wide">{stat.label}</div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-soft-teal/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
