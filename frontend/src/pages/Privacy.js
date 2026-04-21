import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Logo from "../components/Logo";
import { useScrollDirection } from "../hooks/useScrollDirection";

export default function Privacy() {
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
            <p className="text-sm text-slate-500">Last updated: January 2026</p>
          </div>

          <div className="space-y-8 text-sm text-slate-600 leading-relaxed">

            <section>
              <h3 className="text-base font-semibold text-slate-800 mb-3">1. Data We Collect</h3>
              <div className="bg-slate-50 border border-slate-100 rounded-md p-5 space-y-3">
                <p>At CyberShield, we collect only the data necessary to provide and improve our services:</p>
                <ul className="space-y-2">
                  {[
                    "Email address and name for account management.",
                    "Report data (description, scam target, evidence) submitted by you.",
                    "IP address for security and anti-spam verification.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-base font-semibold text-slate-800 mb-3">2. How We Use Your Data</h3>
              <p>Your reports are processed by our automated risk analyzer to extract threat indicators (phone numbers, URLs, UPI IDs) and populate our public scam database.</p>
              <p className="mt-3">We do <strong className="text-slate-900">NOT</strong> sell your personal data to third-party advertisers. Data is used exclusively for threat intelligence within the CyberShield platform and with authorized security partners.</p>
            </section>

            <section>
              <h3 className="text-base font-semibold text-slate-800 mb-3">3. Data Retention</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-md p-4">
                  <p className="text-xs text-slate-500 mb-1">Private User Records</p>
                  <p className="font-semibold text-slate-800">60 months</p>
                </div>
                <div className="border border-slate-200 rounded-md p-4">
                  <p className="text-xs text-slate-500 mb-1">Public Scam Data</p>
                  <p className="font-semibold text-slate-800">Permanently stored</p>
                </div>
              </div>
            </section>

            <section className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Your Rights</h4>
                <p className="text-sm text-slate-500">Contact us at <span className="text-slate-700 font-medium">privacy@cybershield.net</span> for data deletion or access requests.</p>
              </div>
              <button
                onClick={() => navigate("/register")}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-slate-700 transition whitespace-nowrap"
              >
                Create Account →
              </button>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
