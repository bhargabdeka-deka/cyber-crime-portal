import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import Logo from "../../components/Logo";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";

export default function UserRegister() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (formData.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await API.post("/users/register", formData);
      setSuccess("Account created. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  const strength = formData.password.length === 0 ? 0 : formData.password.length < 6 ? 1 : formData.password.length < 10 ? 2 : 3;
  const strengthColor = ["bg-slate-100", "bg-red-500", "bg-orange-400", "bg-emerald-500"][strength];

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-center p-4 font-sans">

      {/* Top Bar */}
      <div className="w-full max-w-sm mb-6 flex items-center gap-3">
        <Logo size={30} fontSize={14} />
      </div>

      {/* Register Card */}
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-lg shadow-sm p-8">

        <h1 className="text-xl font-bold text-slate-900 mb-1">Create an account</h1>
        <p className="text-sm text-slate-500 mb-6">Join to report and track cyber crime incidents.</p>

        {/* Feedback */}
        {(error || success) && (
          <div className={`mb-5 p-3 rounded-md border flex items-start gap-2 text-sm ${
            error
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}>
            {error ? <AlertTriangle size={15} className="shrink-0 mt-0.5" /> : <CheckCircle size={15} className="shrink-0 mt-0.5" />}
            <span>{error || success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="name" type="text" required
                value={formData.name} onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="email" type="email" required
                value={formData.email} onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="password" type={showPass ? "text" : "password"} required
                value={formData.password} onChange={handleChange}
                placeholder="••••••••"
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

            {/* Password Strength */}
            {formData.password.length > 0 && (
              <div className="flex gap-1 mt-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-slate-100"}`} />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2.5 rounded-md text-sm font-semibold hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mt-2"
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : "Create Account"
            }
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-slate-800 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6">
        <Link to="/" className="text-xs text-slate-400 hover:text-slate-600 transition">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
