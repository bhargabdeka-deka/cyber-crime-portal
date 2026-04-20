import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ShieldCheck, ArrowLeft, Mail, Key, ChevronRight, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await API.post("/users/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Node communication failure");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#E0F4FF] font-sans flex items-center justify-center p-6 relative overflow-hidden">
      {/* Visual background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-soft-teal/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/40 rounded-full blur-[100px]" />

      <button 
        onClick={() => navigate("/login")} 
        className="fixed top-8 left-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-soft-teal transition-all bg-white/50 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-white"
      >
        <ArrowLeft size={16} /> GO_BACK
      </button>

      <div className="w-full max-w-md bg-white p-12 rounded-[4rem] shadow-soft border border-white animate-in zoom-in-95 duration-700 relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-soft-blue rounded-[2rem] flex items-center justify-center text-soft-teal mx-auto mb-8 shadow-soft">
            <Key size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-4">Reset Access</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed italic px-4">Initialize protocol to recover forgotten node credentials.</p>
        </div>

        {sent ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-emerald-50 border-2 border-emerald-100 p-10 rounded-[3rem] text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-6 shadow-sm">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-2 italic">Transmission Sent</h3>
              <p className="text-[11px] font-bold text-emerald-800 uppercase italic leading-relaxed">Check your localized inbox for the recovery packet.</p>
              <button 
                onClick={() => navigate("/login")} 
                className="mt-8 bg-emerald-500 text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all font-sans"
              >
                RETURN TO LOGIN
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-5 rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                <span className="shrink-0">⚠️</span> {error}
              </div>
            )}
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 block">Authorized Email</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-soft-teal transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="USER@DOMAIN.COM" 
                  required
                  className="w-full bg-slate-50 pl-14 pr-8 py-5 rounded-full text-xs font-black uppercase tracking-widest outline-none border border-transparent focus:border-soft-teal/20 focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white h-20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-xl hover:brightness-110 active:scale-95 transition-all"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>SEND RECOVERY LINK <ChevronRight size={18} /></>
              )}
            </button>

            <div className="text-center">
               <button 
                 type="button" 
                 onClick={() => navigate("/login")}
                 className="text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-600 transition-colors"
               >
                 I remember my credentials
               </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
