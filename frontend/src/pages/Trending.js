import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import UserLayout from "../layouts/UserLayout";
import Footer from "../components/Footer";
import { useScrollDirection } from "../hooks/useScrollDirection";
import { 
  Zap, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  ChevronRight, 
  ArrowRight,
  PieChart,
  Flame,
  LayoutList,
  CreditCard, 
  Globe, 
  Briefcase, 
  Gift, 
  Heart, 
  User, 
  Unlock, 
  MessageCircle, 
  Info 
} from "lucide-react";

const scamTypeIcon = {
  "UPI Fraud": <CreditCard size={18} />,
  "Phishing": <Globe size={18} />,
  "Job Scam": <Briefcase size={18} />,
  "Lottery Scam": <Gift size={18} />,
  "Romance Scam": <Heart size={18} />,
  "Investment Scam": <TrendingUp size={18} />,
  "Identity Theft": <User size={18} />,
  "Account Hacking": <Unlock size={18} />,
  "Cyber Harassment": <MessageCircle size={18} />,
  "Other": <Info size={18} />
};

export default function Trending() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate   = useNavigate();
  const isVisible  = useScrollDirection();
  const user       = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!localStorage.getItem("token") && !!user;

  useEffect(() => {
    API.get("/scam/trending")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const pageContent = (
    <div className="max-w-6xl mx-auto py-10 px-4 md:px-0">
      <div className="mb-10 md:mb-16">
        <div className="inline-flex items-center gap-2 bg-rose-50 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-semibold text-rose-500 tracking-wide mb-4 border border-rose-100 shadow-sm">
           <Flame size={14} className="fill-rose-500" /> Live Threat Intel
        </div>
        <h1 className="text-3xl md:text-6xl font-bold font-brand text-slate-900 tracking-tight mb-3">Threat Advisories</h1>
        <p className="text-sm md:text-lg font-medium text-slate-500 tracking-wide">Real-time pattern analysis from the Cyber Intelligence Network.</p>
      </div>

      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-soft-teal rounded-full animate-spin" />
        </div>
      ) : !data ? (
        <div className="bg-slate-50 p-10 md:p-20 rounded-[2.5rem] md:rounded-[4rem] text-center border border-slate-100 italic font-bold uppercase text-slate-300">
           Awaiting synchronization...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16">
            {[
              { label: "Targets", value: data.stats?.totalScams||0, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Active",     value: data.stats?.recentCount||0, color: "text-orange-600", bg: "bg-orange-50" },
              { label: "Critical",   value: data.stats?.criticalCount||0, color: "text-rose-600", bg: "bg-rose-50" },
              { label: "Risk Mit.", value: `${data.stats?.highCount||0}%`, color: "text-emerald-600", bg: "bg-emerald-50" }
            ].map(s => (
              <div key={s.label} className={`${s.bg} p-5 md:p-8 rounded-[1.5rem] md:rounded-[3rem] border border-white flex flex-col items-center justify-center text-center shadow-soft`}>
                <div className="text-xl md:text-4xl font-brand font-bold tracking-tighter leading-none mb-1 md:mb-3">{s.value}</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] shadow-soft border border-slate-50">
               <div className="flex items-center gap-3 mb-8 md:mb-10">
                  <PieChart className="text-soft-teal" size={18} />
                  <h3 className="text-base md:text-lg font-bold font-brand tracking-tight text-slate-700">Sector Analysis</h3>
               </div>
               <div className="space-y-8 md:space-y-10">
                 {data.topCategories?.map(t => {
                   const pct = Math.round((t.count / (data.topCategories[0]?.count||1)) * 100);
                   return (
                     <div key={t.category}>
                       <div className="flex justify-between items-end mb-3 md:mb-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 rounded-lg md:rounded-2xl flex items-center justify-center text-slate-400">
                               {scamTypeIcon[t.category] || <Info size={16} />}
                            </div>
                            <span className="text-xs md:text-base font-semibold text-slate-700 capitalize tracking-wide">{t.category}</span>
                         </div>
                         <div className="text-right">
                            <span className="text-sm md:text-lg font-bold text-slate-800">{t.count}</span>
                         </div>
                       </div>
                       <div className="w-full bg-slate-50 h-1.5 md:h-2 rounded-full border border-white opacity-80">
                          <div className="h-full bg-soft-teal rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                       </div>
                     </div>
                   );
                 })}
               </div>
            </div>

            <div className="bg-slate-900 text-white p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] shadow-xl">
               <div className="flex items-center gap-3 mb-8 md:mb-10">
                  <Target className="text-rose-400" size={18} />
                  <h3 className="text-base md:text-lg font-bold font-brand tracking-tight text-slate-300">Critical Targets</h3>
               </div>
               <div className="space-y-3 md:space-y-4">
                 {data.topTargets?.slice(0,5).map((t,i) => (
                   <div key={t._id} onClick={() => navigate("/check-scam")} className="flex items-center justify-between p-4 md:p-6 bg-white/5 rounded-[1.25rem] md:rounded-[2.5rem] border border-white/10 group cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3 md:gap-4 flex-grow min-w-0">
                         <div className="w-8 h-8 md:w-10 md:h-10 bg-rose-500 rounded-lg md:rounded-xl flex items-center justify-center text-white text-[9px] font-black shrink-0">
                            #{i+1}
                         </div>
                         <div className="flex-grow min-w-0">
                            <div className="text-xs md:text-base font-semibold tracking-wide text-slate-100 truncate">{t.value}</div>
                            <div className="text-[9px] md:text-xs font-medium text-slate-400 capitalize tracking-wide mt-0.5 md:mt-1 opacity-80">Security Threat</div>
                         </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                         <div className="text-sm md:text-lg font-bold text-rose-500 leading-none">{t.reports}×</div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (isLoggedIn) return <UserLayout>{pageContent}</UserLayout>;

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
          <div className="flex gap-2 md:gap-4">
            <button onClick={() => navigate("/check-scam")} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-all px-2 md:px-4 tracking-wide">Checker</button>
            <button onClick={() => navigate("/login")} className="bg-slate-900 text-white rounded-full px-4 md:px-8 py-2 md:py-3 text-sm font-semibold tracking-wide shadow-lg">Access</button>
          </div>
        </nav>
      </header>
      <div className="px-4 md:px-6 flex-grow">{pageContent}</div>
      <Footer />
    </div>
  );
}
