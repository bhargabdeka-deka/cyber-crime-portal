import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../../services/api";
import Logo from "../../components/Logo";
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColor = ["bg-slate-100", "bg-red-500", "bg-orange-400", "bg-emerald-500"][strength];
  const strengthLabel = ["", "Weak", "Fair", "Strong"][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    try {
      await API.post(`/users/reset-password/${token}`, { password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Reset link is invalid or expired.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-center p-4 font-sans">

      {/* Top Bar */}
      <div className="w-full max-w-sm mb-6 flex items-center gap-3">
        <Logo size={30} fontSize={14} />
      </div>

      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-lg shadow-sm p-8">

        {done ? (
          /* Success State */
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={24} className="text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Password updated</h2>
            <p className="text-sm text-slate-500 mb-6">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-slate-900 text-white py-2.5 rounded-md text-sm font-semibold hover:bg-slate-700 transition"
            >
              Sign In
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-slate-900 mb-1">Set new password</h1>
            <p className="text-sm text-slate-500 mb-6">
              Choose a strong password for your account.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Password strength */}
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-slate-100"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400">{strengthLabel}</p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className={`w-full px-3 py-2.5 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition ${
                    confirm && confirm !== password
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300"
                  }`}
                />
                {confirm && confirm !== password && (
                  <p className="text-xs text-red-600 mt-1">Passwords do not match.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || (!!confirm && confirm !== password)}
                className="w-full bg-slate-900 text-white py-2.5 rounded-md text-sm font-semibold hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mt-2"
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : "Reset Password"
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
