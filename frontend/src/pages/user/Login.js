import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { useScrollDirection } from "../../hooks/useScrollDirection";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isVisible = useScrollDirection();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(res.data.user.role === "admin" ? "/dashboard" : "/user-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Access denied. Verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E0F4FF] font-sans">
      {/* Identity Bar */}
      <div className={`bg-slate-900 text-white py-2.5 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-3 fixed top-0 w-full z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <span>CyberShield Global Network</span>
        <span className="opacity-30">·</span>
        <span className="text-emerald-400 font-medium">Secure Session Active</span>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 md:p-6 pt-20 md:pt-12">
        <div className="w-full max-w-4xl bg-white border border-white p-10 md:p-14 rounded-[3.5rem] md:rounded-[4.5rem] shadow-soft flex flex-col md:flex-row gap-12 md:gap-20">
          
          {/* Left Summary */}
          <div className="md:w-1/2 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-50 pb-12 md:pb-0 md:pr-20">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-black rounded-full shadow-soft mb-8 text-white -rotate-6 overflow-hidden border border-slate-50">
              <img src="/logo1.jpeg" alt="Logo" className="w-full h-full object-cover scale-[1.05]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-6">
              Access Your <br/><span className="text-soft-teal">Security Console</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium tracking-wide leading-relaxed mb-10 max-w-sm">
              Authenticate your identity to manage your cyber intelligence logs and access real-time threat maps.
            </p>
            
            <div className="space-y-4">
               <div className="p-6 bg-slate-50/50 rounded-[2.5rem] border border-white flex items-center gap-4 shadow-sm">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-soft-teal shadow-sm border border-slate-100">
                     <Zap size={20} className="fill-soft-teal" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.15em] mb-0.5">Network Status</div>
                    <div className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">Operational & Secure</div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Identity Verification</h2>
            
            {error && (
              <div className="mb-8 p-5 rounded-[2rem] bg-rose-50 border border-rose-100 flex items-center gap-4 animate-in slide-in-from-top-2 text-rose-700">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <AlertTriangle size={16} />
                </div>
                <p className="text-xs font-bold tracking-wide">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] ml-5">Access Identifier</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-soft-teal transition-colors" size={18} />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@network.com"
                    className="w-full bg-slate-50 pl-14 pr-8 py-5 rounded-full border border-transparent focus:border-soft-teal/20 focus:bg-white focus:outline-none text-sm font-semibold tracking-wide transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Secret Protocol</label>
                  <Link to="/forgot-password" title="Recover Access" className="text-[10px] font-bold text-soft-teal uppercase tracking-widest hover:underline">Recover</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-soft-teal transition-colors" size={18} />
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 pl-14 pr-8 py-5 rounded-full border border-transparent focus:border-soft-teal/20 focus:bg-white focus:outline-none text-sm font-semibold tracking-wide transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-900 text-white h-20 rounded-full font-bold text-xs tracking-[0.2em] uppercase hover:bg-soft-teal hover:shadow-soft-teal/30 active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-xl shadow-slate-200"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Initiate Access <ArrowRight size={18} /></>
                  )}
                </button>
              </div>

              <div className="pt-8 text-center border-t border-slate-50">
                 <p className="text-xs font-bold text-slate-400 tracking-wide">
                    New to the mission? <Link to="/register" className="text-soft-teal hover:underline ml-2 uppercase tracking-widest">Request Identity</Link>
                 </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="text-center py-10">
         <Link to="/" className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors">← Return to System Gateway</Link>
      </div>
    </div>
  );
}
