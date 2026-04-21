import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck, AlertTriangle, Phone, Globe,
  CreditCard, CheckCircle, ArrowRight, Search, Share2,
  Menu, X
} from "lucide-react";
import API from "../services/api";
import { useScrollDirection } from "../hooks/useScrollDirection";
import useWindowWidth from "../hooks/useWindowWidth";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

/* ─── Step 2+3: accent color token ─────────────────────────── */
const ACCENT = "#0ea5e9"; // sky-500 — professional, not garish

const verdictConfig = {
  safe:      { color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200", icon: CheckCircle,  title: "No Reports Found",  sub: "This target has no records in our database." },
  caution:   { color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   icon: AlertTriangle, title: "Reported Once",      sub: "One incident found. Proceed with caution." },
  warning:   { color: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-200",  icon: AlertTriangle, title: "Suspicious",         sub: "Multiple reports found. Do not engage." },
  dangerous: { color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200",     icon: AlertTriangle, title: "Highly Dangerous",   sub: "Confirmed scam. Do NOT engage with this entity." },
};

export default function Landing() {
  const navigate = useNavigate();
  const [query, setQuery]             = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [loading, setLoading]         = useState(false);
  const isVisible = useScrollDirection();
  const w = useWindowWidth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const triggerCheck = async (val) => {
    if (!val) return;
    setLoading(true);
    try {
      const res = await API.get(`/scam/check?query=${val}`);
      setCheckResult(res.data);
    } catch {
      setCheckResult({ verdict: "caution", note: "Could not reach database. Proceed with caution." });
    } finally { setLoading(false); }
  };

  const handleCheck = (e) => { e.preventDefault(); triggerCheck(query); };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f5f7fa] overflow-x-hidden">

      {/* ── Navbar ──────────────────────────────────────────── */}
      <header className={`h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 sticky top-0 z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate("/")}>
          <Logo size={30} fontSize={14} />
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
          <button onClick={() => navigate("/report")}    className="hover:text-slate-900 transition-colors">Report</button>
          <button onClick={() => navigate("/trending")}  className="hover:text-slate-900 transition-colors">Trends</button>
          <button onClick={() => navigate("/api-docs")}  className="hover:text-slate-900 transition-colors">Docs</button>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            <button onClick={() => navigate("/login")}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Sign In
            </button>
            <button onClick={() => navigate("/register")}
              className="text-sm font-semibold text-white px-4 py-2 rounded-md transition-colors"
              style={{ background: "#0f172a" }}
              onMouseEnter={e => e.currentTarget.style.background = "#1e293b"}
              onMouseLeave={e => e.currentTarget.style.background = "#0f172a"}
            >
              Sign Up
            </button>
          </div>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[60]" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-64 bg-white z-[70] shadow-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <Logo size={28} fontSize={13} />
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={20} /></button>
            </div>
            <nav className="space-y-4 mb-10">
              <button onClick={() => { navigate("/report"); setMobileMenuOpen(false); }} className="w-full text-left text-sm font-medium text-slate-600 hover:text-slate-900 block">File a Report</button>
              <button onClick={() => { navigate("/trending"); setMobileMenuOpen(false); }} className="w-full text-left text-sm font-medium text-slate-600 hover:text-slate-900 block">Scam Trends</button>
              <button onClick={() => { navigate("/api-docs"); setMobileMenuOpen(false); }} className="w-full text-left text-sm font-medium text-slate-600 hover:text-slate-900 block">API Documentation</button>
            </nav>
            <div className="mt-auto space-y-3">
              <button onClick={() => { navigate("/login"); setMobileMenuOpen(false); }} className="w-full py-2.5 text-sm font-medium text-slate-900 border border-slate-200 rounded-md">Sign In</button>
              <button onClick={() => { navigate("/register"); setMobileMenuOpen(false); }} className="w-full py-2.5 text-sm font-semibold text-white rounded-md bg-slate-900">Get Started</button>
            </div>
          </div>
        </>
      )}

      <main className="flex-grow">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-6 py-20 text-center">

          {/* Step 2: accent on one key word only */}
          <h1
            className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-4"
            style={{ letterSpacing: "-0.5px" }}
          >
            Stay Safe{" "}
            <span style={{ color: ACCENT }}>Online.</span>
          </h1>

          {/* Step 3: subtext — muted, comfortable line-height */}
          <p
            className="text-base md:text-lg text-slate-500 mb-10 max-w-xl mx-auto"
            style={{ lineHeight: 1.7 }}
          >
            Instantly verify phone numbers, UPI IDs, and URLs against India's
            largest community-driven scam database.
          </p>

          {/* Search bar */}
          <form onSubmit={handleCheck} className="flex gap-2 max-w-xl mx-auto mb-4">
            <div className="relative flex-grow">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={w < 640 ? "Enter number or URL..." : "Phone number, UPI ID, or URL..."}
                value={query}
                onChange={e => { setQuery(e.target.value); setCheckResult(null); }}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition"
              />
            </div>
            {/* Step 4: consistent primary button */}
            <button
              type="submit" disabled={loading}
              className="text-white text-sm font-semibold px-5 py-2.5 rounded-md disabled:opacity-50 transition-colors flex items-center gap-2"
              style={{ background: "#0f172a" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#1e293b"; }}
              onMouseLeave={e => e.currentTarget.style.background = "#0f172a"}
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Search size={13} /> Check</>
              }
            </button>
          </form>

          {/* Quick examples */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <span className="text-xs text-slate-400 self-center">Try:</span>
            {["9876543210", "sbi-kyc-check.in", "lottery@scam.in"].map(ex => (
              <button
                key={ex}
                onClick={() => { setQuery(ex); triggerCheck(ex); }}
                className="text-xs text-slate-500 border border-slate-200 bg-white px-3 py-1 rounded-md hover:border-slate-400 hover:text-slate-800 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Inline Result Card */}
          {(() => {
            const vc = checkResult ? (verdictConfig[checkResult.verdict] || verdictConfig.safe) : null;
            if (!vc) return null;
            return (
              <div className={`${vc.bg} border ${vc.border} rounded-lg p-5 text-left mb-6 max-w-xl mx-auto`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-md bg-white border ${vc.border} flex items-center justify-center ${vc.color}`}>
                      <vc.icon size={18} />
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${vc.color}`}>{vc.title}</h3>
                      <p className="text-xs text-slate-600">{vc.sub}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/check-scam/${query}`)}
                    className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-800 border border-slate-200 bg-white px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
                  >
                    <Share2 size={12} /> Share
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Reports",    value: checkResult.reports || 0 },
                    { label: "Risk Score", value: checkResult.avgRiskScore || "—" },
                    { label: "Severity",   value: checkResult.riskLevel || "Low" },
                  ].map(s => (
                    <div key={s.label} className="bg-white border border-white rounded-md p-3 text-center">
                      <div className={`text-lg font-bold ${vc.color}`}>{s.value}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
                {checkResult.actionAdvice && (
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <div className="bg-white rounded-md p-3 border border-red-100">
                      <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wide mb-1.5">What to avoid</p>
                      <ul className="space-y-1">
                        {(checkResult.actionAdvice?.avoid || []).slice(0, 2).map((a, i) => (
                          <li key={i} className="text-xs text-red-800 flex gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1 shrink-0" />{a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white rounded-md p-3 border border-emerald-100">
                      <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mb-1.5">What to do</p>
                      <ul className="space-y-1">
                        {(checkResult.actionAdvice?.doThis || []).slice(0, 2).map((a, i) => (
                          <li key={i} className="text-xs text-emerald-800 flex gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />{a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </section>

        {/* ── Step 5: Feature Cards — hover lift ───────────── */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "Report Threat", icon: ShieldCheck,  bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", desc: "File an incident report for any cyber fraud.", route: "/report" },
              { title: "View Alerts",   icon: AlertTriangle, bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-800",   desc: "Browse the latest trending scam patterns.",  route: "/trending" },
              { title: "Verify IDs",    icon: CheckCircle,   bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-800",    desc: "Check phone numbers, links, and UPI IDs.",   route: "/check-scam" },
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(item.route)}
                className={`${item.bg} border ${item.border} rounded-lg p-5 cursor-pointer group`}
                style={{ transition: "transform 0.18s ease, box-shadow 0.18s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.07)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "none"; }}
              >
                <div className="w-9 h-9 bg-white rounded-md flex items-center justify-center mb-3 shadow-sm">
                  <item.icon size={17} className={item.text} />
                </div>
                {/* Step 3: tighter tracking on card titles */}
                <h4 className={`font-semibold text-sm mb-1 ${item.text}`} style={{ letterSpacing: "-0.2px" }}>
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500" style={{ lineHeight: 1.6 }}>{item.desc}</p>
                <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${item.text} opacity-60 group-hover:opacity-100 transition-opacity`}>
                  Learn more <ArrowRight size={11} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Step 6: Dark CTA — tighter, less clutter ─────── */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="bg-slate-900 rounded-lg p-10 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              {/* Step 2+7: accent on key word in dark section */}
              <h2
                className="text-2xl md:text-3xl font-bold text-white mb-3"
                style={{ letterSpacing: "-0.4px" }}
              >
                Trusted by thousands.<br />
                <span className="font-normal text-xl" style={{ color: "#94a3b8" }}>
                  Report. Track. Protect.
                </span>
              </h2>
              <p className="text-sm text-slate-400 mb-7" style={{ lineHeight: 1.7 }}>
                Create a free account to file reports, view your history, and help protect others.
              </p>
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-slate-900 px-6 py-2.5 rounded-md text-sm font-semibold transition-colors"
                onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              >
                Get Started →
              </button>
            </div>

            {/* Step 6+8: icon grid — cleaner, accent icon color */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Phone Phishing", icon: Phone },
                { label: "UPI Scams",      icon: CreditCard },
                { label: "Fake Links",     icon: Globe },
                { label: "Identity Theft", icon: ShieldCheck },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-md">
                  <stat.icon size={16} style={{ color: ACCENT, marginBottom: 8 }} />
                  <div className="text-white text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
