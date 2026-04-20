import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import UserLayout from "../layouts/UserLayout";
import Footer from "../components/Footer";
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Activity, 
  Zap, 
  Share2, 
  ChevronRight, 
  Phone, 
  Globe, 
  CreditCard,
  MessageCircle,
  Copy,
  ArrowRight
} from "lucide-react";

const verdictConfig = {
  safe:      { color:"text-emerald-600", bg:"bg-emerald-50",  border:"border-emerald-100", icon: CheckCircle, title:"No Reports Found",  sub:"This node appears safe across our global intelligence network." },
  caution:   { color:"text-amber-600",   bg:"bg-amber-50",   border:"border-amber-100",   icon: AlertTriangle, title:"Reported Once",      sub:"Single incident log detected. Proceed with extreme caution." },
  warning:   { color:"text-orange-600",  bg:"bg-orange-50",  border:"border-orange-100",  icon: AlertTriangle, title:"Suspicious Pattern",  sub:"Multiple intelligence nodes have flagged this activity." },
  dangerous: { color:"text-rose-600",    bg:"bg-rose-50",    border:"border-rose-100",    icon: AlertTriangle, title:"Highly Dangerous",   sub:"Confirmed threat vector. Do NOT engage with this entity." },
};

export default function ScamChecker() {
  const { value: paramValue } = useParams();
  const [query, setQuery]       = useState(paramValue || "");
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [copied, setCopied]     = useState(false);
  const [activity, setActivity] = useState([]);
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!localStorage.getItem("token") && !!user;

  useEffect(() => {
    if (paramValue) doCheck(paramValue);
    API.get("/scam/activity").then(r => setActivity(r.data)).catch(() => {});
  }, [paramValue]); 

  const doCheck = async (val) => {
    if (!val?.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await API.get("/scam/check", { params: { query: val.trim() } });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Check failed. Try again.");
    } finally { setLoading(false); }
  };

  const handleCheck = (e) => { e.preventDefault(); doCheck(query); };

  const handleShare = () => {
    if (!result) return;
    const url  = `${window.location.origin}/check/${encodeURIComponent(result.value || query)}`;
    const waText = result.reports > 0
      ? `⚠️ SCAM ALERT ⚠️\n\n${result.value} has been reported ${result.reports} times as ${result.category}\n\n🔍 Verify yourself: ${url}`
      : `✅ "${result.value}" has no scam reports on CyberShield.\n\n🔍 Check any number/link: ${url}`;
    
    navigator.clipboard.writeText(waText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const vc = result ? (verdictConfig[result.verdict] || verdictConfig.safe) : null;

  const pageContent = (
    <div className="max-w-4xl mx-auto py-10 min-h-screen">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-soft-blue px-4 py-1.5 rounded-full text-[10px] font-black text-soft-teal tracking-widest uppercase mb-6">
           <Zap size={14} className="fill-soft-teal" /> Global Intelligence Scan
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-6">Verify Safety</h1>
        <p className="text-sm md:text-lg font-medium text-slate-400 max-w-xl mx-auto leading-relaxed italic px-4">
          Search any phone number, URL, or UPI ID to verify against our global threat database.
        </p>
      </div>

      <form onSubmit={handleCheck} className="mb-12 px-2 md:px-0">
        <div className="flex flex-col md:flex-row gap-4 bg-white p-3 md:p-4 rounded-[2.5rem] md:rounded-[4rem] border-2 border-slate-50 shadow-soft focus-within:border-soft-teal/20 transition-all">
          <div className="flex-grow flex items-center px-4 md:px-6">
             <Search className="text-slate-200 shrink-0" size={20} />
             <input 
               type="text" 
               value={query} 
               onChange={e => { setQuery(e.target.value); setResult(null); }}
               placeholder="IDENTIFIER..."
               className="w-full bg-none border-none text-slate-800 placeholder:text-slate-200 text-sm md:text-lg font-black uppercase tracking-widest p-4 outline-none "
             />
          </div>
          <button 
            type="submit" 
            disabled={loading || !query.trim()}
            className="bg-slate-900 text-white rounded-full px-8 md:px-12 py-4 md:py-5 font-black text-[10px] md:text-xs tracking-widest uppercase hover:brightness-110 shadow-lg disabled:opacity-30 transition-all flex items-center justify-center gap-3"
          >
            {loading ? <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : "EXECUTE SCAN"}
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest py-2">Quick Verify:</span>
           {["9876543210","sbi-kyc-update.com","lottery@scam.in"].map(ex => (
             <button key={ex} type="button" onClick={() => { setQuery(ex); doCheck(ex); }}
               className="bg-white border-2 border-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 rounded-full hover:border-soft-teal/20 transition-all shadow-sm">
               {ex}
             </button>
           ))}
        </div>
      </form>

      {error && <div className="bg-rose-50 border-2 border-rose-100 text-rose-600 p-6 rounded-[2rem] text-center font-black uppercase tracking-widest text-xs mb-10">{error}</div>}

      {result && vc && (
        <div className="animate-in fade-in zoom-in-95 duration-500">
           <div className={`${vc.bg} border-2 ${vc.border} rounded-[4rem] p-12 shadow-soft relative overflow-hidden`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-12 relative z-10">
                 <div className="flex items-center gap-10">
                    <div className={`w-24 h-24 rounded-[3rem] bg-white flex items-center justify-center ${vc.color} shadow-lg shadow-white/50 border border-white`}>
                       <vc.icon size={48} strokeWidth={3} />
                    </div>
                    <div className="text-center md:text-left">
                       <h3 className={`text-4xl font-black uppercase italic tracking-tighter leading-none mb-3 ${vc.color}`}>{vc.title}</h3>
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">{vc.sub}</p>
                    </div>
                 </div>
                 <button 
                   onClick={handleShare} 
                   className="bg-white px-8 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-hover text-slate-700 hover:text-soft-teal transition-all flex items-center gap-3"
                 >
                    {copied ? <CheckCircle size={18} /> : <Share2 size={18} />} {copied ? "SYNCED" : "SHARE INTEL"}
                 </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
                 {[{label:"Threats",value:result.reports},{label:"Risk Matrix",value:result.avgRiskScore||"—"},{label:"Severity",value:result.riskLevel||"SAFE"}].map(s => (
                    <div key={s.label} className="bg-white/40 p-8 rounded-[3rem] text-center border border-white shadow-sm">
                       <div className={`text-4xl font-black italic tracking-tighter mb-2 ${vc.color}`}>{s.value}</div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
                    </div>
                 ))}
              </div>

              {result.actionAdvice && (
                <div className="grid md:grid-cols-2 gap-8 mt-12 relative z-10">
                   <div className="bg-rose-50/50 p-8 rounded-[3rem] border border-rose-100">
                      <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] mb-6">DO NOT ENGAGE</h4>
                      <ul className="space-y-4">
                         {result.actionAdvice.avoid.map((a,i) => (
                           <li key={i} className="flex items-center gap-3 text-xs font-bold text-rose-800 uppercase italic">
                              <span className="w-2 h-2 rounded-full bg-rose-400" /> {a}
                           </li>
                         ))}
                      </ul>
                   </div>
                   <div className="bg-emerald-50/50 p-8 rounded-[3rem] border border-emerald-100">
                      <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-6">RECOMMENDED ACTION</h4>
                      <ul className="space-y-4">
                         {result.actionAdvice.doThis.map((a,i) => (
                           <li key={i} className="flex items-center gap-3 text-xs font-bold text-emerald-800 uppercase italic">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" /> {a}
                           </li>
                         ))}
                      </ul>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      {!result && !loading && activity.length > 0 && (
        <div className="mt-20">
           <div className="flex items-center gap-4 mb-10">
              <div className="h-1 flex-grow bg-slate-100 rounded-full" />
              <div className="flex items-center gap-3">
                 <Activity className="text-soft-teal" size={20} />
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Recent Activity</h3>
              </div>
              <div className="h-1 flex-grow bg-slate-100 rounded-full" />
           </div>
           <div className="grid md:grid-cols-2 gap-6">
              {activity.slice(0,6).map((a,i) => (
                <div 
                  key={i} 
                  onClick={() => { setQuery(a.value); doCheck(a.value); }}
                  className="bg-white p-8 rounded-[3rem] border-2 border-slate-50 flex items-center justify-between group cursor-pointer hover:border-soft-teal/20 transition-all shadow-sm"
                >
                  <div>
                    <div className="text-sm font-black text-slate-800 uppercase italic tracking-tighter mb-1">{a.value}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{a.category}</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`text-[10px] font-black uppercase ${a.riskLevel==="CRITICAL"?"text-rose-500":"text-amber-500"}`}>{a.riskLevel}</span>
                    <ChevronRight size={20} className="text-slate-200 group-hover:text-soft-teal" />
                  </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );

  if (isLoggedIn) return <UserLayout>{pageContent}</UserLayout>;

  return (
    <div className="min-h-screen bg-[#E0F4FF] font-sans flex flex-col">
      <nav className="sticky top-0 z-[100] bg-white/70 backdrop-blur-lg border-b border-white px-4 md:px-10 py-4 md:py-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-soft-teal rounded-2xl flex items-center justify-center text-white shadow-soft">
            <ShieldCheck size={18} className="md:w-[22px] md:h-[22px]" />
          </div>
          <span className="text-lg md:text-xl font-black italic tracking-tighter uppercase text-slate-800">Shield</span>
        </div>
        <div className="flex gap-2 md:gap-4 items-center">
          <button onClick={() => navigate("/login")} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all px-2 md:px-4">Sign In</button>
          <button onClick={() => navigate("/register")} className="bg-slate-900 text-white rounded-full px-4 md:px-8 py-2 md:py-3 text-[10px] font-black uppercase tracking-widest shadow-lg">New Access</button>
        </div>
      </nav>
      <div className="px-6 flex-grow">{pageContent}</div>
      <Footer />
    </div>
  );
}
