import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  ChevronRight, 
  AlertTriangle, 
  Phone, 
  Globe, 
  CreditCard,
  Target,
  CheckCircle,
  ArrowRight,
  Info,
  Search,
  Lock,
  Zap,
  Activity,
  ExternalLink
} from "lucide-react";
import API from "../services/api";
import Footer from "../components/Footer";

const verdictConfig = {
  SAFE:    { icon: CheckCircle,   color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-100", label: "VERIFIED SAFE" },
  CAUTION: { icon: Info,          color: "text-amber-600",   bg: "bg-amber-50",    border: "border-amber-100",  label: "SUSPICIOUS" },
  DANGER:  { icon: AlertTriangle, color: "text-rose-600",    bg: "bg-rose-50",     border: "border-rose-100",   label: "VERIFIED SCAM" },
};

export default function Landing() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ticker, setTicker] = useState([]);

  useEffect(() => {
    API.get("/public/scams/recent").then(res => setTicker(res.data)).catch(() => {});
  }, []);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await API.get(`/public/check?query=${query}`);
      setCheckResult(res.data);
    } catch {
      setCheckResult({ verdict: "CAUTION", note: "Security database unreachable. Proceed with awareness." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#E0F4FF]">
      {/* 1. Header Navigation */}
      <header className="px-4 md:px-6 py-4 md:py-6 sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md px-4 md:px-8 py-3 md:py-4 rounded-full flex items-center justify-between shadow-soft border border-white/50">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate("/")}>
             <div className="w-8 h-8 md:w-10 md:h-10 bg-soft-teal rounded-full flex items-center justify-center text-white">
                <ShieldCheck size={18} className="md:w-[22px] md:h-[22px]" />
             </div>
             <span className="text-lg md:text-xl font-extrabold tracking-tight text-slate-800">Cyber<span className="text-soft-teal font-medium">Shield</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
             <button onClick={() => navigate("/report")} className="text-sm font-semibold text-slate-600 hover:text-soft-teal transition-colors uppercase tracking-wider">Report</button>
             <button onClick={() => navigate("/trending")} className="text-sm font-semibold text-slate-600 hover:text-soft-teal transition-colors uppercase tracking-wider">Alerts</button>
             <button onClick={() => navigate("/api-docs")} className="text-sm font-semibold text-slate-600 hover:text-soft-teal transition-colors uppercase tracking-wider">Docs</button>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
             <button onClick={() => navigate("/login")} className="text-[11px] md:text-sm font-bold text-slate-700 hover:text-soft-teal px-2 md:px-4 transition-colors">LOGIN</button>
             <button onClick={() => navigate("/register")} className="bg-soft-teal text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-[11px] md:text-sm font-bold tracking-wide hover:shadow-lg hover:scale-105 transition-all">SIGN UP</button>
          </div>
        </nav>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-grow pt-10 pb-20">
        <section className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
           <div className="space-y-10">
              <div className="inline-flex items-center gap-2 bg-white/50 border border-white px-4 py-2 rounded-full text-[11px] font-bold text-soft-teal tracking-widest uppercase shadow-sm">
                 <Zap size={14} className="fill-soft-teal" /> Instant Security Verification
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter">
                Stay Safe In <br/>
                <span className="text-soft-teal italic">Digital World.</span>
              </h1>
              
              <p className="text-sm md:text-lg font-medium text-slate-500 leading-relaxed max-w-[280px] md:max-w-md">
                Fastest way to verify UPI IDs, Phone Numbers, and URLs. Trusted by thousands of users across the globe.
              </p>

              <form onSubmit={handleCheck} className="relative w-full max-w-lg group">
                <div className="absolute inset-y-0 left-4 md:left-6 flex items-center text-slate-400 group-focus-within:text-soft-teal transition-colors">
                   <Search size={18} className="md:w-[22px] md:h-[22px]" />
                </div>
                <input 
                   type="text" 
                   value={query} 
                   onChange={e => { setQuery(e.target.value); setCheckResult(null); }}
                   placeholder="phone, url or upi..."
                   className="w-full bg-white pl-12 md:pl-16 pr-32 md:pr-44 py-5 md:py-7 rounded-full text-sm md:text-lg font-semibold shadow-soft focus:shadow-hover focus:outline-none placeholder:text-slate-300 transition-all border border-transparent focus:border-soft-teal/20"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 md:right-3 top-2 md:top-3 bottom-2 md:top-3 md:bottom-3 bg-soft-teal text-white px-6 md:px-10 rounded-full font-bold text-[10px] md:text-sm tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center justify-center"
                >
                  {loading ? "..." : "ANALYZE"}
                </button>
              </form>

              {checkResult && (
                <div className={`p-8 rounded-[2.5rem] border-2 animate-in zoom-in-95 duration-500 shadow-soft ${verdictConfig[checkResult.verdict].bg} ${verdictConfig[checkResult.verdict].border}`}>
                   <div className="flex gap-6">
                      <div className={`mt-1 p-3 rounded-2xl bg-white shadow-sm ${verdictConfig[checkResult.verdict].color}`}>
                         {(() => {
                            const Icon = verdictConfig[checkResult.verdict].icon;
                            return <Icon size={32} />;
                         })()}
                      </div>
                      <div>
                         <div className={`text-[10px] font-black tracking-[0.25em] mb-2 ${verdictConfig[checkResult.verdict].color}`}>
                            {verdictConfig[checkResult.verdict].label}
                         </div>
                         <h3 className="text-xl font-bold text-slate-900 leading-tight">
                            {checkResult.verdict === 'SAFE' 
                               ? "Security analysis completed. No threats found in active nodes."
                               : checkResult.note}
                         </h3>
                         <div className="mt-6 flex gap-6">
                           <button className="text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors flex items-center gap-1 uppercase tracking-widest">
                               Full Report <ChevronRight size={14} />
                           </button>
                           <button className="text-xs font-bold text-soft-teal hover:underline transition-colors flex items-center gap-1 uppercase tracking-widest">
                               Share Result <ExternalLink size={14} />
                           </button>
                         </div>
                      </div>
                   </div>
                </div>
              )}
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
                   <h4 className={`text-2xl font-black uppercase italic mb-4 leading-none ${item.text}`}>{item.title}</h4>
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
                 <div>
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-[0.95] tracking-tighter uppercase mb-6 italic">
                       Zero Trust. <br/>
                       <span className="text-soft-teal">Maximum Safety.</span>
                    </h2>
                    <p className="text-base md:text-lg text-slate-400 font-medium mb-10 max-w-sm">
                       Join the network and help others stay protected from evolving digital threats.
                    </p>
                    <button onClick={() => navigate("/register")} className="bg-white text-slate-900 px-10 py-5 rounded-full font-black text-sm tracking-widest hover:bg-soft-teal hover:text-white transition-all uppercase w-full md:w-auto">
                       get started now
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
                            <stat.icon className="text-soft-teal mb-4" size={28} />
                            <div className="text-white text-xs font-black uppercase tracking-widest">{stat.label}</div>
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
