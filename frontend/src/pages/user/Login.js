import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertTriangle, CheckCircle, Zap } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setError(err.response?.data?.message || "ACCESS_DENIED: VERIFY CREDENTIALS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-soft-blue">
      {/* Identity Bar */}
      <div className="bg-slate-900 text-white py-1.5 px-4 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 fixed top-0 w-full z-50">
        <span>Cyber Intelligence Network</span>
        <span className="opacity-30">|</span>
        <span>Secure Access Node</span>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 md:p-6 pt-16 md:pt-12">
        <div className="w-full max-w-4xl bg-white border border-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[4rem] shadow-soft flex flex-col md:flex-row gap-10 md:gap-16">
          
          {/* Left Summary */}
          <div className="md:w-1/2 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-50 pb-16 md:pb-0 md:pr-16">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-soft-teal rounded-3xl shadow-soft mb-8 text-white -rotate-6">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none mb-6">
              Access Your <span className="text-soft-teal">Security Console</span>
            </h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed mb-10 italic">
              Authenticate your identity to manage your cyber intelligence logs and access real-time threat maps.
            </p>
            
            <div className="space-y-4">
               <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-white flex items-center gap-4 shadow-sm">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-soft-teal shadow-sm">
                     <Zap size={20} className="fill-soft-teal" />
                  </div>
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Network Status: <span className="text-emerald-500">OPERATIONAL</span></div>
               </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-2xl font-black text-slate-800 mb-8 uppercase tracking-tighter italic">Identity Verification</h2>
            
            {error && (
              <div className="mb-8 p-6 rounded-3xl bg-rose-50 border border-rose-100 flex items-center gap-4 animate-in slide-in-from-top-2 text-rose-700">
                <AlertTriangle size={18} />
                <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Access Identifier (Email)</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-soft-teal" size={18} />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="NAME@NETWORK.COM"
                    className="w-full bg-slate-50 pl-14 pr-6 py-4 rounded-full border border-transparent focus:border-soft-teal/20 focus:bg-white focus:outline-none text-xs font-black uppercase tracking-widest transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret Protocol (Password)</label>
                  <Link to="/forgot-password" title="Recover Access" className="text-[10px] font-black text-soft-teal uppercase hover:underline">RECOVER</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-soft-teal" size={18} />
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 pl-14 pr-6 py-4 rounded-full border border-transparent focus:border-soft-teal/20 focus:bg-white focus:outline-none text-xs font-black uppercase tracking-widest transition-all"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-900 text-white h-16 rounded-full font-black text-[10px] tracking-[0.3em] uppercase hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-xl"
                >
                  {loading ? "VERIFYING..." : <>INITIATE ACCESS <ArrowRight size={16} /></>}
                </button>
              </div>

              <div className="pt-8 text-center border-t border-slate-50">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    New to the mission? <Link to="/register" className="text-soft-teal hover:underline ml-2">Request Identity</Link>
                 </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="text-center py-10">
         <Link to="/" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors">← RETURN TO SYSTEM GATEWAY</Link>
      </div>
    </div>
  );
}
