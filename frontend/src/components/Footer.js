import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();
  
  return (
    <footer className="py-20 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <ShieldCheck className="text-soft-teal" size={32} />
          <span className="text-2xl font-black text-slate-900 uppercase italic">
            Cyber<span className="text-soft-teal font-medium">Shield</span>
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-6 md:gap-10 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <button 
            onClick={() => navigate("/privacy")} 
            className="hover:text-soft-teal transition-colors"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => navigate("/terms")} 
            className="hover:text-soft-teal transition-colors"
          >
            Terms of Service
          </button>
          <button 
            onClick={() => navigate("/api-docs")} 
            className="hover:text-soft-teal transition-colors"
          >
            Documentation
          </button>
        </div>
        
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">
          © 2026 CYBERSHIELD NETWORK
        </div>
      </div>
    </footer>
  );
}
