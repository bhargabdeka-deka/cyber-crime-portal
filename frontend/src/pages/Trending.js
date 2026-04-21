import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import UserLayout from "../layouts/UserLayout";
import Footer from "../components/Footer";
import { useScrollDirection } from "../hooks/useScrollDirection";
import {
  TrendingUp, AlertTriangle, ChevronRight,
  CreditCard, Globe, Briefcase, Gift,
  Heart, User, Unlock, MessageCircle, Info
} from "lucide-react";
import Logo from "../components/Logo";

const scamTypeIcon = {
  "UPI Fraud":       <CreditCard size={16} />,
  "Phishing":        <Globe size={16} />,
  "Job Scam":        <Briefcase size={16} />,
  "Lottery Scam":    <Gift size={16} />,
  "Romance Scam":    <Heart size={16} />,
  "Investment Scam": <TrendingUp size={16} />,
  "Identity Theft":  <User size={16} />,
  "Account Hacking": <Unlock size={16} />,
  "Cyber Harassment":<MessageCircle size={16} />,
  "Other":           <Info size={16} />,
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
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const pageContent = (
    <div className="max-w-4xl mx-auto py-10">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Trending Threats</h1>
        <p className="text-sm text-slate-500 mt-1">
          Most reported scam patterns and top flagged targets.
        </p>
      </div>

      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center text-sm text-slate-400">
          <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin mr-3" />
          Loading data...
        </div>
      ) : !data ? (
        <div className="py-20 text-center text-sm text-slate-400">
          No data available. Check back later.
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Targets", value: data.stats?.totalScams  || 0, color: "text-blue-600",    bg: "bg-blue-50" },
              { label: "Recent",        value: data.stats?.recentCount || 0, color: "text-orange-600",  bg: "bg-orange-50" },
              { label: "Critical",      value: data.stats?.criticalCount||0, color: "text-red-600",     bg: "bg-red-50" },
              { label: "High Risk",     value: data.stats?.highCount   || 0, color: "text-emerald-600", bg: "bg-emerald-50" },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border border-white rounded-lg p-4`}>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-2 gap-5">

            {/* Category Breakdown */}
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">By Scam Type</h3>
              <div className="space-y-4">
                {(Array.isArray(data.topCategories) ? data.topCategories : []).map(t => {
                  const pct = Math.round((t.count / (data.topCategories[0]?.count || 1)) * 100);
                  return (
                    <div key={t.category}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <span className="text-slate-400">{scamTypeIcon[t.category] || <Info size={14} />}</span>
                          {t.category}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{t.count}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full">
                        <div
                          className="h-full bg-slate-700 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Targets */}
            <div className="bg-slate-900 text-white rounded-lg p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-400" /> Most Reported Targets
              </h3>
              <div className="space-y-2">
                {(Array.isArray(data.topTargets) ? data.topTargets : []).slice(0, 5).map((t, i) => (
                  <div
                    key={t._id}
                    onClick={() => navigate("/check-scam")}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-md border border-white/10 hover:bg-white/10 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 flex-grow min-w-0">
                      <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="text-sm text-slate-100 font-medium truncate">{t.value}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Reported</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold text-red-400">{t.reports}×</span>
                      <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-300 transition" />
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
    <div className="min-h-screen bg-[#f5f7fa] font-sans flex flex-col">
      <header className={`h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 sticky top-0 z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <Logo size={30} fontSize={14} />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/login")} className="text-sm text-slate-600 hover:text-slate-900 font-medium transition">Sign In</button>
          <button onClick={() => navigate("/register")} className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition">Register</button>
        </div>
      </header>
      <div className="px-5 flex-grow">{pageContent}</div>
      <Footer />
    </div>
  );
}
