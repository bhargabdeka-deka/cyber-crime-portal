import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle, ChevronRight } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState("");
  const [showPass, setShowPass]   = useState(false);
  const navigate = useNavigate();

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["bg-slate-100", "bg-rose-400", "bg-amber-400", "bg-emerald-400"];
  const strengthLabels = ["MISSING", "WEAK_HASH", "SECURE_NODE", "ENCRYPTED"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError("Sequence mismatch"); return; }
    if (password.length < 6)  { setError("Entropy insufficient (min. 6)"); return; }
    setLoading(true); setError("");
    try {
      await API.post(`/users/reset-password/${token}`, { password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Link authentication failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#E0F4FF] font-sans flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-soft-teal/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md bg-white p-12 rounded-[4rem] shadow-soft border border-white animate-in zoom-in-95 duration-700 relative z-10">
        {done ? (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-10 shadow-lg scale-110">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-6">Reset Success</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic mb-10">Node credentials updated and synchronized.</p>
            <button 
              onClick={() => navigate("/login")} 
              className="w-full bg-slate-900 text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:brightness-110 active:scale-95 transition-all"
            >
              AUTHENTICATE NOW
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-soft-blue rounded-[2rem] flex items-center justify-center text-soft-teal mx-auto mb-8 shadow-soft">
                <Lock size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-4">Set Protocol</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed italic">Provide new administrative credentials for node access.</p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-5 rounded-3xl text-[10px] font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                <span className="shrink-0">⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 block">New Encryption key</label>
                <div className="relative group">
                  <input 
                    type={showPass ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="MIN. 6 CHARS" 
                    required 
                    className="w-full bg-slate-50 px-8 py-5 rounded-full text-xs font-black uppercase tracking-widest outline-none border border-transparent focus:border-soft-teal/20 focus:bg-white transition-all shadow-inner"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-soft-teal transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="px-4">
                     <div className="flex gap-2 mb-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i <= strength ? strengthColors[strength] : "bg-slate-100"}`} />
                        ))}
                     </div>
                     <span className={`text-[8px] font-black uppercase tracking-widest ${strengthColors[strength].replace('bg-', 'text-')}`}>
                        LOG_STRENGTH: {strengthLabels[strength]}
                     </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 block">Confirm Protocol</label>
                <input 
                  type="password" 
                  value={confirm} 
                  onChange={e => setConfirm(e.target.value)} 
                  placeholder="REPEAT KEY" 
                  required 
                  className={`w-full bg-slate-50 px-8 py-5 rounded-full text-xs font-black uppercase tracking-widest outline-none border transition-all shadow-inner ${confirm && confirm !== password ? "border-rose-200 bg-rose-50/30" : "border-transparent focus:border-soft-teal/20 focus:bg-white"}`}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || (confirm && confirm !== password)}
                className="w-full bg-slate-900 text-white h-20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-30"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>FINALIZE RESET <ChevronRight size={18} /></>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
