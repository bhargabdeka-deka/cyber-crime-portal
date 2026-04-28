import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import UserLayout from "../layouts/UserLayout";
import Footer from "../components/Footer";
import { useScrollDirection } from "../hooks/useScrollDirection";
import { Search, AlertTriangle, CheckCircle, Share2, ChevronRight } from "lucide-react";
import Logo from "../components/Logo";

const verdictConfig = {
  safe:      { color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200", icon: CheckCircle,  title: "No Reports Found",   sub: "This target has no records in our database." },
  caution:   { color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   icon: AlertTriangle, title: "Reported Once",       sub: "One incident found. Proceed with caution." },
  warning:   { color: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-200",  icon: AlertTriangle, title: "Suspicious",          sub: "Multiple reports found. Do not engage." },
  dangerous: { color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200",     icon: AlertTriangle, title: "Highly Dangerous",    sub: "Confirmed scam. Do NOT engage with this entity." },
};

export default function ScamChecker() {
  const { value: paramValue } = useParams();
  const [query, setQuery]     = useState(paramValue || "");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [copied, setCopied]   = useState(false);
  const [activity, setActivity] = useState([]);
  const navigate   = useNavigate();
  const isVisible  = useScrollDirection();
  const user       = JSON.parse(localStorage.getItem("user") || "null");
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
      setError(err.response?.data?.message || "Check failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleCheck   = (e) => { e.preventDefault(); doCheck(query); };
  const handleShare   = () => {
    if (!result) return;
    const url    = `${window.location.origin}/check/${encodeURIComponent(result.value || query)}`;
    const waText = result.reports > 0
      ? `⚠️ SCAM ALERT: ${result.value} has been reported ${result.reports} times. Verify: ${url}`
      : `✅ "${result.value}" has no scam reports on CyberShield. Check: ${url}`;
    navigator.clipboard.writeText(waText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const vc = result ? (verdictConfig[result.verdict] || verdictConfig.safe) : null;

  const pageContent = (
    <div className="max-w-3xl mx-auto py-10 min-h-screen">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Check a Number or URL</h1>
        <p className="text-sm text-slate-500 mt-1">
          Search any phone number, URL, or UPI ID against our scam database.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleCheck} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setResult(null); }}
              placeholder="Enter phone number, URL, or UPI ID..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : "Check"
            }
          </button>
        </div>

        {/* Quick examples */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-slate-400">Try:</span>
          {["9876543210", "sbi-kyc-update.com", "lottery@scam.in"].map(ex => (
            <button
              key={ex} type="button"
              onClick={() => { setQuery(ex); doCheck(ex); }}
              className="text-xs text-slate-500 border border-slate-200 px-3 py-1 rounded-md hover:border-slate-400 hover:text-slate-700 transition bg-white"
            >
              {ex}
            </button>
          ))}
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center gap-2">
          <AlertTriangle size={15} /> {error}
        </div>
      )}

      {/* Result Card */}
      {result && vc && (
        <div className={`${vc.bg} border ${vc.border} rounded-lg p-6 mb-6`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-md bg-white flex items-center justify-center ${vc.color} border ${vc.border}`}>
                <vc.icon size={20} />
              </div>
              <div>
                <h3 className={`font-bold text-base ${vc.color}`}>{vc.title}</h3>
                <p className="text-sm text-slate-600">{vc.sub}</p>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-xs font-medium border border-slate-200 bg-white px-3 py-2 rounded-md hover:bg-slate-50 transition text-slate-700"
            >
              {copied ? <><CheckCircle size={13} /> Copied</> : <><Share2 size={13} /> Share</>}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(() => {
              const score = result.riskScore || result.avgRiskScore || 0;
              
              // PART 1 & 3: Severity & Confidence Alignment
              let severity = "Low";
              let severityColor = "text-emerald-600";
              if (score >= 75)      { severity = "Critical"; severityColor = "text-red-600"; }
              else if (score >= 50) { severity = "High";     severityColor = "text-orange-600"; }
              else if (score >= 25) { severity = "Medium";   severityColor = "text-amber-600"; }

              const confidence = result.confidenceLevel || (score >= 75 ? "High" : score >= 40 ? "Medium" : "Low");

              return [
                { label: "Reports",    value: result.reports },
                { label: "Risk Score", value: `${score}/100` },
                { label: "Confidence", value: confidence },
                { label: "Severity",   value: severity, color: severityColor },
              ].map(s => (
                <div key={s.label} className="bg-white border border-white rounded-md p-3 text-center shadow-sm">
                  <div className={`text-lg sm:text-xl font-bold ${s.color || vc.color}`}>{s.value}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-medium uppercase tracking-wider">{s.label}</div>
                </div>
              ));
            })()}
          </div>

          {/* PART 5: Community Trust Badge */}
          {(result.reports >= 3 || result.communityVerified) && (
            <div className="mt-4 flex justify-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 uppercase tracking-wider animate-pulse">
                <CheckCircle size={12} /> Community Verified Threat
              </div>
            </div>
          )}

          {/* PART 2: Why this score? */}
          {result.reasonBreakdown && result.reasonBreakdown.length > 0 && (
            <div className="mt-4 p-5 bg-white/60 border border-white/40 rounded-lg shadow-sm">
              <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" /> Why this score?
              </h4>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {result.reasonBreakdown.map((reason, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-slate-600 font-medium leading-relaxed">
                    <span className="text-slate-400 text-lg leading-none">•</span> {reason}
                  </li>
                ))}
                {!result.reasonBreakdown.some(r => r.includes("reports")) && (
                   <li className="flex items-center gap-3 text-xs text-slate-600 font-medium leading-relaxed">
                     <span className="text-slate-400 text-lg leading-none">•</span> Based on community reports
                   </li>
                )}
              </ul>
            </div>
          )}

          {/* Action Advice */}
          {result.actionAdvice && (
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-white rounded-md p-4 border border-red-100">
                <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">What to avoid</h4>
                <ul className="space-y-1.5">
                  {result.actionAdvice.avoid.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-red-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1 shrink-0" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-md p-4 border border-emerald-100">
                <h4 className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">Recommended steps</h4>
                <ul className="space-y-1.5">
                  {result.actionAdvice.doThis.filter(a => !a.includes("CyberShield")).map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" /> {a}
                    </li>
                  ))}
                  <li className="flex items-start gap-2 text-xs text-emerald-800 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" /> 
                    Create a CyberShield account and report this scam
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Premium CTA Box */}
          {result.reports > 0 && (
            <div className="mt-6 p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Logo size={80} />
              </div>
              <div className="relative z-10">
                <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="text-emerald-400">🛡</span> Help protect others
                </h4>
                <p className="text-slate-400 text-sm mb-5 max-w-md">
                  Create a CyberShield account and report this scam to strengthen our scam intelligence network and prevent others from being victims.
                </p>
                <button
                  onClick={() => {
                    if (isLoggedIn) navigate(`/submit-complaint?target=${encodeURIComponent(result.value)}`);
                    else navigate("/register");
                  }}
                  className="bg-white text-slate-900 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-50 transition shadow-lg"
                >
                  {isLoggedIn ? "Report This Scam" : "Create Account & Report"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Activity */}
      {!result && !loading && activity.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Recently Checked</h3>
          <div className="space-y-2">
            {activity.slice(0, 6).map((a, i) => (
              <div
                key={i}
                onClick={() => { setQuery(a.value); doCheck(a.value); }}
                className="bg-white border border-slate-200 rounded-md px-4 py-3 flex items-center justify-between cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition group"
              >
                <div>
                  <div className="text-sm font-medium text-slate-800">{a.value}</div>
                  <div className="text-xs text-slate-400 capitalize">{a.category}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold ${
                    a.riskLevel?.toUpperCase() === "CRITICAL" ? "text-red-600" : 
                    a.riskLevel?.toUpperCase() === "HIGH" ? "text-orange-600" : 
                    "text-amber-600"
                  }`}>
                    {a.riskLevel}
                  </span>
                  <ChevronRight size={15} className="text-slate-300 group-hover:text-slate-600 transition" />
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
    <div className="min-h-screen bg-[#f5f7fa] font-sans flex flex-col">
      {/* Minimal Navbar for logged-out users */}
      <header className={`h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 sticky top-0 z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <Logo size={30} fontSize={14} />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/login")} className="text-sm text-slate-600 hover:text-slate-900 transition font-medium">
            Sign In
          </button>
          <button onClick={() => navigate("/register")} className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition">
            Register
          </button>
        </div>
      </header>
      <div className="px-5 flex-grow">{pageContent}</div>
      <Footer />
    </div>
  );
}
