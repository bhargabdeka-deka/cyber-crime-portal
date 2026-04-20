import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import useWindowWidth from "../hooks/useWindowWidth";
import { 
  LayoutDashboard, 
  Search, 
  TrendingUp, 
  PlusCircle, 
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  Activity,
  History,
  Zap,
  ChevronRight
} from "lucide-react";

const NAV = [
  { path:"/user-dashboard",   icon: LayoutDashboard, label:"Dashboard" },
  { path:"/check-scam",       icon: Search,          label:"Global Check" },
  { path:"/trending",         icon: TrendingUp,      label:"Threat Alerts" },
  { path:"/submit-complaint", icon: PlusCircle,      label:"File Report" },
  { path:"/my-complaints",    icon: History,         label:"My History" },
];

export default function UserLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [collapsed, setCollapsed] = useState(false);
  const w = useWindowWidth();
  const isMobile = w < 1024;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = user?.name ? user.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) : "U";
  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  return (
    <div className="min-h-screen flex flex-col bg-[#E0F4FF] font-sans text-slate-100">
      {/* Network Connectivity Bar */}
      <div className="bg-slate-900 text-white py-2 px-4 text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 sticky top-0 z-[100] shrink-0 font-bold">
        <span>CyberShield Global Network</span>
        <span className="opacity-20">||</span>
        <span>Secure Session Active</span>
      </div>

      <div className="flex-grow flex overflow-hidden lg:p-6 lg:gap-6">
        {isMobile ? (
          <div className="flex flex-col w-full">
            {/* Mobile Top Header */}
            <header className="bg-white px-6 h-20 flex items-center justify-between sticky top-[33px] z-[60] shadow-soft rounded-b-[2rem]">
               <div className="flex items-center gap-3" onClick={() => navigate("/")}>
                  <div className="w-10 h-10 bg-soft-teal rounded-2xl flex items-center justify-center text-white">
                     <ShieldCheck size={22} />
                  </div>
                  <span className="text-xl font-black tracking-tighter uppercase italic text-slate-800">Shield</span>
               </div>
               <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-2xl text-slate-500 shadow-sm border border-slate-100">
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
               </button>
            </header>

            {/* Mobile Overlay Menu */}
            {mobileMenuOpen && (
              <div className="fixed inset-0 bg-white z-[100] pt-24 px-8 flex flex-col animate-in fade-in zoom-in-95">
                <nav className="flex flex-col gap-4">
                  {NAV.map(item => {
                    const active = location.pathname === item.path;
                    return (
                      <button 
                        key={item.path} 
                        onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                        className={`flex items-center gap-6 text-lg font-black uppercase italic tracking-tighter p-6 rounded-[2rem] transition-all ${active ? 'bg-soft-teal text-white shadow-lg shadow-soft-teal/20' : 'text-slate-400 bg-slate-50'}`}
                      >
                        <item.icon size={24} />
                        {item.label}
                      </button>
                    );
                  })}
                  <div className="h-px bg-slate-100 my-4" />
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-6 text-lg font-black uppercase italic tracking-tighter p-6 rounded-[2rem] text-rose-500 bg-rose-50"
                  >
                    <LogOut size={24} />
                    SIGNOUT
                  </button>
                </nav>
              </div>
            )}
            <div className="flex-grow overflow-y-auto p-6">{children}</div>
          </div>
        ) : (
          <>
            {/* Desktop User Sidebar */}
            <aside className={`bg-white shadow-soft card-rounded flex flex-col transition-all duration-500 rounded-[3rem] border border-white shrink-0 overflow-hidden ${collapsed ? 'w-24' : 'w-72'}`}>
              <div className="h-24 flex items-center px-8 shrink-0 overflow-hidden whitespace-nowrap">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-soft-teal rounded-[1.25rem] flex items-center justify-center text-white shrink-0 shadow-lg shadow-soft-teal/20">
                      <ShieldCheck size={24} />
                   </div>
                   {!collapsed && (
                     <div className="flex flex-col">
                       <span className="text-xl font-black tracking-tighter uppercase italic text-slate-800 leading-none">Shield</span>
                       <span className="text-[10px] font-black text-soft-teal tracking-[0.2em] mt-1">USER CONSOLE</span>
                     </div>
                   )}
                </div>
              </div>

              <nav className="flex-grow py-8 px-6 space-y-3">
                {NAV.map(item => {
                  const active = location.pathname === item.path;
                  return (
                    <button 
                      key={item.path} 
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-5 px-6 py-4 rounded-[1.5rem] text-[13px] font-black uppercase italic tracking-tight transition-all ${active ? 'bg-soft-teal text-white shadow-lg shadow-soft-teal/20' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'}`}
                    >
                      <item.icon className="shrink-0" size={20} strokeWidth={2.5} />
                      {!collapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </nav>

              <div className="p-6">
                 {!collapsed && (
                   <div className="mb-6 p-6 bg-soft-blue/50 rounded-[2rem] flex items-center gap-4 border border-white">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-soft text-soft-teal font-black text-sm">
                         {initials}
                      </div>
                      <div className="overflow-hidden">
                         <div className="text-xs font-black text-slate-800 uppercase truncate">{user?.name}</div>
                         <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Status: User</div>
                      </div>
                   </div>
                 )}
                 <button 
                   onClick={handleLogout}
                   className="w-full h-16 flex items-center justify-center gap-4 bg-slate-900 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-lg"
                 >
                   <LogOut className="shrink-0" size={18} strokeWidth={2.5} />
                   {!collapsed && <span>LOGOUT</span>}
                 </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col min-w-0 gap-6">
              <header className="h-24 bg-white/70 backdrop-blur-lg rounded-[3rem] border border-white shadow-soft flex items-center justify-between px-10 shrink-0">
                 <div className="flex items-center gap-6">
                    <button onClick={() => setCollapsed(!collapsed)} className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-soft-teal transition-all shadow-sm">
                      {collapsed ? <ChevronRight size={20} /> : <Zap size={20} />}
                    </button>
                    <div className="hidden lg:flex flex-col">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Security Pulse</span>
                       <span className="text-sm font-black text-emerald-600 uppercase italic tracking-tighter leading-none mt-1">Verified Session</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-8">
                    <div className="hidden xl:flex items-center gap-4 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100 shadow-sm">
                       <Activity className="text-emerald-500" size={18} />
                       <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none mt-0.5 font-bold">Network: Secure</span>
                    </div>
                    <div className="flex flex-col items-end">
                       <div className="text-xs font-black text-slate-800 uppercase">{new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 font-mono">NODE ACTIVE</div>
                    </div>
                    <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl p-1 shadow-soft cursor-pointer" onClick={() => navigate("/profile")}>
                       <div className="w-full h-full bg-soft-blue flex items-center justify-center text-soft-teal rounded-xl">
                          {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-xl" alt="P" /> : <User size={24} />}
                       </div>
                    </div>
                 </div>
              </header>

              <main className="flex-grow overflow-y-auto bg-white rounded-[4rem] border border-white shadow-soft p-12 custom-scrollbar">
                <div className="max-w-5xl mx-auto text-slate-900">
                  {children}
                </div>
              </main>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
