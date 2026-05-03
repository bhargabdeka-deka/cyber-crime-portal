import { useNavigate } from "react-router-dom";
import { FileCode, ArrowLeft, Globe, Lock, Zap, ChevronRight } from "lucide-react";
import { useScrollDirection } from "../hooks/useScrollDirection";
import Logo from "../components/Logo";

const BASE = "https://cyber-crime-portal-2.onrender.com";

const endpoints = [
  {
    method: "GET", path: "/api/scam/check?query=9876543210",
    desc: "Check if a phone number, URL, or UPI ID has been reported as a scam.",
    auth: "None",
    response: `{
  "status": "SCAM",
  "verdict": "dangerous",
  "reports": 14,
  "riskLevel": "CRITICAL",
  "category": "UPI Fraud"
}`
  },
  {
    method: "GET", path: "/api/scam/trending",
    desc: "Get trending scam categories and most-reported targets.",
    auth: "None",
    response: `{
  "topTargets": [...],
  "topCategories": [...],
  "stats": { "totalScams": 16, "recentCount": 5 }
}`
  },
  {
    method: "POST", path: "/api/complaints/anonymous",
    desc: "Submit an anonymous scam report without creating an account.",
    auth: "None",
    body: `{
  "title": "Fake job offer",
  "scamType": "Job Scam",
  "scamTarget": "9876543210"
}`,
    response: `{
  "success": true,
  "caseId": "ANON-171"
}`
  },
];

const methodColors = {
  GET: "bg-emerald-50 text-emerald-700 border-emerald-100",
  POST: "bg-blue-50 text-blue-700 border-blue-100",
  PUT: "bg-amber-50 text-amber-700 border-amber-100",
  DELETE: "bg-rose-50 text-rose-700 border-rose-100"
};

export default function ApiDocs() {
  const navigate = useNavigate();
  const isVisible = useScrollDirection();

  return (
    <div className="min-h-screen bg-[#f5f7fa] font-sans text-slate-800 pb-20">

      {/* Navbar - Matched with Terms.js */}
      <header className={`h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 sticky top-0 z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <Logo size={30} fontSize={14} />
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft size={15} /> Back
        </button>
      </header>

      {/* Content - Matched with Terms.js Layout */}
      <div className="max-w-3xl mx-auto mt-10 px-5">
        <div className="bg-white border border-slate-200 rounded-lg p-8 md:p-12">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">API Documentation</h1>
            <p className="text-sm text-slate-500">Integrate the Cyber Intelligence Network (CIN) via standard REST protocols.</p>
          </div>

          <div className="space-y-10">
            
            {/* Base Endpoint Section */}
            <section>
              <h3 className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Globe size={18} /> Base Endpoint
              </h3>
              <div className="bg-slate-50 border border-slate-100 rounded-md p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <code className="text-sm font-bold text-slate-700 break-all">{BASE}</code>
                <div className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Secure Node</span>
                </div>
              </div>
            </section>

            {/* Endpoints List */}
            <div className="space-y-12">
              {endpoints.map((ep, i) => (
                <section key={i} className="pt-8 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase border ${methodColors[ep.method]}`}>
                        {ep.method}
                      </span>
                      <code className="text-sm font-bold text-slate-800 break-all">{ep.path}</code>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Lock size={12} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">Auth: {ep.auth}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">{ep.desc}</p>

                  <div className="space-y-4">
                    {ep.body && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <FileCode size={14} /> Request Body
                        </div>
                        <pre className="bg-slate-900 p-5 rounded-md text-[11px] text-emerald-400 font-mono overflow-x-auto">
                          {ep.body}
                        </pre>
                      </div>
                    )}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Zap size={14} /> Response Format
                      </div>
                      <pre className="bg-slate-50 border border-slate-100 p-5 rounded-md text-[11px] text-slate-600 font-mono overflow-x-auto">
                        {ep.response}
                      </pre>
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Footer CTA Section - Matched style from Terms.js bottom */}
            <section className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Scale Your Project</h4>
                <p className="text-sm text-slate-500 max-w-sm">
                  Join the developer network to get higher rate limits and authenticated endpoints.
                </p>
              </div>
              <button
                onClick={() => navigate("/register")}
                className="bg-slate-900 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-slate-700 transition flex items-center gap-2"
              >
                Get API Key <ChevronRight size={16} />
              </button>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
