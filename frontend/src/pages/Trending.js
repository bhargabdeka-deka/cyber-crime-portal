import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import UserLayout from "../layouts/UserLayout";
import Footer from "../components/Footer";
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

const riskColorClass = (score) => score >= 80 ? "text-rose-600" : score >= 50 ? "text-orange-600" : "text-emerald-600";

export default function Trending() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate   = useNavigate();
  const user       = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!localStorage.getItem("token") && !!user;

  useEffect(() => {
    API.get("/scam/trending").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const pageContent = (
    <div className="max-w-6xl mx-auto py-10">
      <div className="mb-10 md:mb-16">
        <div className="inline-flex items-center gap-2 bg-rose-50 px-4 py-1.5 rounded-full text-[10px] font-black text-rose-500 tracking-widest uppercase mb-6 border border-rose-100">
           <Flame size={14} className="fill-rose-500" /> Live Threat Intel
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-4">Threat Advisories</h1>
        <p className="text-[11px] md:text-sm font-bold text-slate-400 uppercase tracking-[0.2em] italic leading-relaxed">Real-time pattern analysis from the Cyber Intelligence Network.</p>
      </div>

      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-soft-teal rounded-full animate-spin" />
        </div>
      ) : !data ? (
        <div className="bg-slate-50 p-20 rounded-[4rem] text-center border border-slate-100 italic font-bold uppercase text-slate-300">
           Awaiting synchronization...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16">
            {[
              { label: "Targets", value: data.stats?.totalScams||0, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Active",     value: data.stats?.recentCount||0, color: "text-orange-600", bg: "bg-orange-50" },
              { label: "Critical",   value: data.stats?.criticalCount||0, color: "text-rose-600", bg: "bg-rose-50" },
              { label: "Risk Mit.", value: `${data.stats?.highCount||0}%`, color: "text-emerald-600", bg: "bg-emerald-50" }
            ].map(s => (
              <div key={s.label} className={`${s.bg} p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white flex flex-col items-center justify-center text-center shadow-soft`}>
                <div className="text-2xl md:text-4xl font-black italic tracking-tighter leading-none mb-2 md:mb-3">{s.value}</div>
                <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-soft border border-slate-50">
               <div className="flex items-center gap-3 mb-10">
                  <PieChart className="text-soft-teal" size={20} />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 italic">Sector Analysis</h3>
               </div>
               <div className="space-y-10">
                 {data.topCategories?.map(t => {
                   const pct = Math.round((t.count / (data.topCategories[0]?.count||1)) * 100);
                   return (
                     <div key={t.category}>
                       <div className="flex justify-between items-end mb-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 rounded-lg md:rounded-2xl flex items-center justify-center text-slate-400">
                               {scamTypeIcon[t.category] || <Info size={16} />}
                            </div>
                            <span className="text-xs md:text-sm font-black text-slate-800 uppercase italic tracking-tight">{t.category}</span>
                         </div>
                         <div className="text-right">
                            <span className="text-sm md:text-lg font-black text-slate-900 italic">{t.count}</span>
                         </div>
                       </div>
                       <div className="w-full bg-slate-50 h-2 rounded-full border border-white">
                          <div className="h-full bg-soft-teal rounded-full" style={{ width: `${pct}%` }} />
                       </div>
                     </div>
                   );
                 })}
               </div>
            </div>

            <div className="bg-slate-900 text-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-xl">
               <div className="flex items-center gap-3 mb-10">
                  <Target className="text-rose-400" size={20} />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 italic">Critical Targets</h3>
               </div>
               <div className="space-y-4">
                 {data.topTargets?.slice(0,5).map((t,i) => (
                   <div key={t.value} onClick={() => navigate("/check-scam")} className="flex items-center justify-between p-4 md:p-6 bg-white/5 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 group cursor-pointer hover:bg-white/10">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white text-[10px] font-black">
                            #{i+1}
                         </div>
                         <div className="max-w-[120px] md:max-w-none overflow-hidden text-ellipsis whitespace-nowrap">
                            <div className="text-[11px] md:text-sm font-black uppercase italic tracking-tight">{t.value}</div>
                            <div className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60">{t.category}</div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-sm md:text-lg font-black text-rose-500 italic leading-none">{t.reports}×</div>
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
      <nav className="sticky top-0 z-[100] bg-white/70 backdrop-blur-lg border-b border-white px-4 md:px-10 py-4 md:py-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-soft-teal rounded-2xl flex items-center justify-center text-white shadow-soft">
            <ShieldCheck size={18} className="md:w-[22px] md:h-[22px]" />
          </div>
          <span className="text-lg md:text-xl font-black italic tracking-tighter uppercase text-slate-800">Shield</span>
        </div>
        <div className="flex gap-2 md:gap-4">
          <button onClick={() => navigate("/check-scam")} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all px-2 md:px-4">Checker</button>
          <button onClick={() => navigate("/login")} className="bg-slate-900 text-white rounded-full px-4 md:px-8 py-2 md:py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg">Access</button>
        </div>
      </nav>
      <div className="px-4 md:px-6 flex-grow">{pageContent}</div>
      <Footer />
    </div>
  );
}
