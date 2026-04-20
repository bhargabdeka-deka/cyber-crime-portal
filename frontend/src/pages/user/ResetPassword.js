import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import { Lock, Eye, EyeOff, CheckCircle, ChevronRight, ArrowLeft } from "lucide-react";
import { useScrollDirection } from "../../hooks/useScrollDirection";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState("");
  const [showPass, setShowPass]   = useState(false);
  const navigate = useNavigate();
  const isVisible = useScrollDirection();

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["bg-slate-100", "bg-rose-400", "bg-amber-400", "bg-emerald-400"];
  const strengthLabels = ["NONE", "WEAK", "SECURE", "ENCRYPTED"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6)  { setError("Password too short (min. 6)"); return; }
    setLoading(true); setError("");
    try {
      await API.post(`/users/reset-password/${token}`, { password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Link authentication failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#E0F4FF] font-sans flex items-center justify-center p-6 relative overflow-hidden flex-col">
      {/* Identity Bar */}
      <div className={`bg-slate-900 text-white py-2.5 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-3 fixed top-0 w-full z-[100] transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <span>CyberShield Global Network</span>
        <span className="opacity-30">·</span>
        <span className="text-emerald-400 font-medium">Secure Session Active</span>
      </div>

      {/* Floating Return Button */}
      <button 
        onClick={() => navigate("/login")} 
        className={`fixed top-20 left-8 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-soft-teal transition-all bg-white/50 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-white tracking-wide z-50 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}
      >
        <ArrowLeft size={16} /> Go Back
      </button>

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-soft-teal/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md bg-white p-10 md:p-14 rounded-[3.5rem] shadow-soft border border-white animate-in zoom-in-95 duration-700 relative z-10">
        {done ? (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-lg">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-black font-brand text-slate-900 tracking-tighter leading-none mb-4">Reset Successful</h2>
            <p className="text-sm font-medium text-slate-500 tracking-wide mb-10">Your node credentials have been updated and synchronized across the network.</p>
            <button 
              onClick={() => navigate("/login")} 
              className="w-full bg-slate-900 text-white px-10 py-5 rounded-full text-xs font-bold tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all uppercase"
            >
              Authenticate Now
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-soft-blue/20 rounded-[1.5rem] flex items-center justify-center text-soft-teal mx-auto mb-6 shadow-sm">
                <Lock size={28} />
              </div>
              <h2 className="text-3xl font-black font-brand text-slate-900 tracking-tighter leading-none mb-3">Set Protocol</h2>
              <p className="text-sm font-medium text-slate-500 tracking-wide max-w-[280px] mx-auto uppercase">Provide new administrative credentials for network node access.</p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-5 rounded-[2rem] text-xs font-bold tracking-wide mb-8 flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0">⚠️</div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] px-5 block">New Encryption Key</label>
                <div className="relative group">
                  <input 
                    type={showPass ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Min. 6 characters" 
                    required 
                    className="w-full bg-slate-50 px-8 py-5 rounded-full text-sm font-semibold tracking-wide outline-none border border-transparent focus:border-soft-teal/20 focus:bg-white transition-all shadow-inner"
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
                  <div className="px-5">
                     <div className="flex gap-2 mb-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i <= strength ? strengthColors[strength] : "bg-slate-100"}`} />
                        ))}
                     </div>
                     <div className="flex justify-between items-center">
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${strengthColors[strength].replace('bg-', 'text-')}`}>
                          Strength: {strengthLabels[strength]}
                        </span>
                        <span className="text-[9px] font-medium text-slate-400">Encrypted Protocol</span>
                     </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] px-5 block">Confirm Protocol</label>
                <input 
                  type="password" 
                  value={confirm} 
                  onChange={e => setConfirm(e.target.value)} 
                  placeholder="Repeat encryption key" 
                  required 
                  className={`w-full bg-slate-50 px-8 py-5 rounded-full text-sm font-semibold tracking-wide outline-none border transition-all shadow-inner ${confirm && confirm !== password ? "border-rose-200 bg-rose-50/30" : "border-transparent focus:border-soft-teal/20 focus:bg-white"}`}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || (confirm && confirm !== password)}
                className="w-full bg-slate-900 text-white h-20 rounded-full text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl hover:bg-soft-teal hover:shadow-soft-teal/30 active:scale-95 transition-all disabled:opacity-30 mt-4"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Finalize Reset <ChevronRight size={18} /></>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
