import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import Logo from "../../components/Logo";
import { Mail, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await API.post("/users/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-center p-4 font-sans">

      {/* Top Bar */}
      <div className="w-full max-w-sm mb-6 flex items-center gap-3">
        <Logo size={30} fontSize={14} />
      </div>

      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-lg shadow-sm p-8">

        {sent ? (
          /* Success State */
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={24} className="text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Check your email</h2>
            <p className="text-sm text-slate-500 mb-6">
              We've sent a password reset link to <span className="font-medium text-slate-700">{email}</span>.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-slate-900 text-white py-2.5 rounded-md text-sm font-semibold hover:bg-slate-700 transition"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-slate-900 mb-1">Forgot password?</h1>
            <p className="text-sm text-slate-500 mb-6">
              Enter your email and we'll send you a reset link.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full bg-slate-900 text-white py-2.5 rounded-md text-sm font-semibold hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : "Send Reset Link"
                }
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              <Link to="/login" className="flex items-center justify-center gap-1 text-slate-600 hover:text-slate-900 font-medium transition">
                <ArrowLeft size={13} /> Back to Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
