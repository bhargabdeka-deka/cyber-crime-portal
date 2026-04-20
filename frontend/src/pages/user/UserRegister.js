import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ShieldCheck, User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";

export default function UserRegister() {
  const [formData, setFormData] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (formData.password.length < 6) { setError("MINIMUM_SECURITY: 6 CHARACTERS REQUIRED"); return; }
    setLoading(true);
    try {
      await API.post("/users/register", formData);
      setSuccess("IDENTITY CREATED. INITIALIZING REDIRECT...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "REGISTRATION_FAILURE: SYSTEM_DENIED");
    } finally { setLoading(false); }
  };

  const strength = formData.password.length === 0 ? 0 : formData.password.length < 6 ? 1 : formData.password.length < 10 ? 2 : 3;
  const strengthColor = ["bg-slate-100", "bg-rose-500", "bg-orange-500", "bg-emerald-500"][strength];

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
            <div className="inline-flex items-center justify-center w-14 h-14 bg-soft-teal rounded-3xl shadow-soft mb-8 text-white rotate-6">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none mb-6">
              Establish Your <span className="text-soft-teal">Network Identity</span>
            </h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed mb-10 italic">
              Join India's most advanced community-driven cyber defense portal. Secure. Anonymous. Real-time.
            </p>
            
            <div className="space-y-6">
               {[
                 { l: "Global Threat Intelligence", s: "Access real-time scam database" },
                 { l: "AI Incident Analysis", s: "Instant diagnostic on your reports" },
                 { l: "Secure Case Logging", s: "Track incidents from filing to resolution" }
               ].map((item, i) => (
                 <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-soft-blue flex items-center justify-center text-soft-teal shrink-0">
                       <CheckCircle size={14} />
                    </div>
                    <div>
                       <div className="text-[10px] font-black uppercase text-slate-800 tracking-widest">{item.l}</div>
                       <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.s}</div>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Right Form */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-2xl font-black text-slate-800 mb-8 uppercase tracking-tighter italic">Create Access Node</h2>
            
            {(error || success) && (
              <div className={`mb-8 p-6 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-2 border ${error ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                {error ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                <p className="text-[10px] font-black uppercase tracking-widest">{error || success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Identity Name</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-soft-teal" size={18} />
                  <input 
                    name="name" 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={handleChange}
                    placeholder="JOHN DOE"
                    className="w-full bg-slate-50 pl-14 pr-6 py-4 rounded-full border border-transparent focus:border-soft-teal/20 focus:bg-white focus:outline-none text-xs font-black uppercase tracking-widest transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Communication Address (Email)</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-soft-teal" size={18} />
                  <input 
                    name="email" 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={handleChange}
                    placeholder="NAME@NETWORK.COM"
                    className="w-full bg-slate-50 pl-14 pr-6 py-4 rounded-full border border-transparent focus:border-soft-teal/20 focus:bg-white focus:outline-none text-xs font-black uppercase tracking-widest transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Security Protocol Secret (Password)</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-soft-teal" size={18} />
                  <input 
                    name="password" 
                    type={showPass ? "text" : "password"} 
                    required 
                    value={formData.password} 
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 pl-14 pr-14 py-4 rounded-full border border-transparent focus:border-soft-teal/20 focus:bg-white focus:outline-none text-xs font-black uppercase tracking-widest transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-soft-teal">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.password.length > 0 && (
                  <div className="px-6 flex gap-2 mt-3">
                     {[1,2,3].map(i => (
                       <div key={i} className={`flex-grow h-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-slate-100'}`} />
                     ))}
                  </div>
                )}
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-900 text-white h-16 rounded-full font-black text-[10px] tracking-[0.3em] uppercase hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-xl"
                >
                  {loading ? "INITIALIZING..." : <>CREATE ACCESS NODE <ArrowRight size={16} /></>}
                </button>
              </div>

              <div className="pt-8 text-center border-t border-slate-50">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Already part of the network? <Link to="/login" className="text-soft-teal hover:underline ml-2">Login Here</Link>
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
