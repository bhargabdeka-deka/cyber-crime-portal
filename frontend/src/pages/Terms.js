import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Logo from "../components/Logo";
import { useScrollDirection } from "../hooks/useScrollDirection";

export default function Terms() {
  const navigate  = useNavigate();
  const isVisible = useScrollDirection();

  return (
    <div className="min-h-screen bg-[#f5f7fa] font-sans text-slate-800 pb-20">

      {/* Navbar */}
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

      {/* Content */}
      <div className="max-w-3xl mx-auto mt-10 px-5">
        <div className="bg-white border border-slate-200 rounded-lg p-8 md:p-12">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
            <p className="text-sm text-slate-500">Effective: January 2026</p>
          </div>

          <div className="space-y-8 text-sm text-slate-600 leading-relaxed">

            <section>
              <h3 className="text-base font-semibold text-slate-800 mb-3">1. Acceptance of Terms</h3>
              <div className="bg-slate-50 border border-slate-100 rounded-md p-5">
                By accessing CyberShield, you agree to these Terms of Service. This platform is a community-driven tool for reporting cyber fraud. Misuse for harassment or false reporting is strictly prohibited and may result in account suspension.
              </div>
            </section>

            <section>
              <h3 className="text-base font-semibold text-slate-800 mb-3">2. Report Accuracy</h3>
              <p className="mb-3">All reports submitted must be accurate and based on real events. Filing false reports undermines the reliability of our scam database and the safety of other users.</p>
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>Intentionally submitting false information is a violation of these terms and may be reported to relevant authorities.</span>
              </div>
            </section>

            <section>
              <h3 className="text-base font-semibold text-slate-800 mb-3">3. Liability Disclaimer</h3>
              <div className="bg-slate-900 rounded-md p-6 text-slate-300 text-sm leading-relaxed">
                CyberShield provides community-sourced threat data and automated risk analysis. While we strive for accuracy, we cannot be held liable for any direct or indirect damages resulting from reliance on this information. Always exercise independent judgment.
              </div>
            </section>

            <section className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Report a Violation</h4>
                <p className="text-sm text-slate-500">
                  Contact us at <span className="text-slate-700 font-medium">admin@cybershield.net</span> to report ToS violations.
                </p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-slate-700 transition whitespace-nowrap"
              >
                Accept & Continue →
              </button>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
