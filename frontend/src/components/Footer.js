import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();
  
  return (
    <footer className="py-20 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-full flex items-center justify-center text-white overflow-hidden shadow-sm border border-white">
             <img src="/logo1.jpeg" alt="CyberShield Logo" className="w-full h-full object-cover scale-[1.05]" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-[-0.04em] text-slate-900 font-brand flex items-center">
             CYBER<span className="text-soft-teal ml-0.5">SHIELD</span>
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-6 md:gap-10 text-sm md:text-base font-medium text-slate-500 font-serif">
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
        
        <div className="text-xs text-slate-400 font-medium tracking-wide">
          &copy; 2026 CyberShield Network. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
