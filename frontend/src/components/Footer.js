import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="py-16 px-6 mt-auto border-t border-slate-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Brand */}
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <Logo size={30} fontSize={15} />
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-6 md:gap-10 text-sm font-medium text-slate-500">
          <button onClick={() => navigate("/privacy")} className="hover:text-slate-900 transition-colors">
            Privacy Policy
          </button>
          <button onClick={() => navigate("/terms")} className="hover:text-slate-900 transition-colors">
            Terms of Service
          </button>
          <button onClick={() => navigate("/api-docs")} className="hover:text-slate-900 transition-colors">
            Documentation
          </button>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-400 font-medium">
          © 2026 CyberShield. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
