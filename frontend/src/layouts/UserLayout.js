import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import useWindowWidth from "../hooks/useWindowWidth";
import {
  LayoutDashboard, Search, TrendingUp,
  PlusCircle, LogOut, Menu, X, History,
  ChevronLeft, ChevronRight
} from "lucide-react";
import Logo from "../components/Logo";

const NAV = [
  { path: "/user-dashboard",   icon: LayoutDashboard, label: "Dashboard" },
  { path: "/check-scam",       icon: Search,          label: "Check Scam" },
  { path: "/trending",         icon: TrendingUp,      label: "Trending" },
  { path: "/submit-complaint", icon: PlusCircle,      label: "File Report" },
  { path: "/my-complaints",    icon: History,         label: "My Reports" },
];

export default function UserLayout({ children }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = JSON.parse(localStorage.getItem("user") || "{}");
  const [collapsed, setCollapsed]       = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const w        = useWindowWidth();
  const isMobile = w < 1024;

  const initials    = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";
  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  return (
    <div className="min-h-screen flex bg-[#f5f7fa] font-sans text-slate-900">

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className={`bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-56"}`}>

          {/* Logo */}
          <div className="h-14 flex items-center px-4 border-b border-slate-100 overflow-hidden">
            <Logo size={28} fontSize={13} showText={!collapsed} />
          </div>

          {/* Nav Links */}
          <nav className="flex-grow py-4 px-2 space-y-1">
            {NAV.map(item => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* User + Logout */}
          <div className="p-3 border-t border-slate-100 space-y-2">
            {!collapsed && (
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold shrink-0">
                  {initials}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-slate-800 truncate">{user?.name}</div>
                  <div className="text-[10px] text-slate-400">User</div>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut size={16} className="shrink-0" />
              {!collapsed && <span>Sign out</span>}
            </button>
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center py-2 border-t border-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </aside>
      )}

      {/* Main Area */}
      <div className="flex-grow flex flex-col min-w-0">

        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-3">
            {isMobile && <Logo size={26} fontSize={13} />}
            {!isMobile && (
              <span className="text-sm text-slate-500">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:block">{user?.name}</span>
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-slate-500 hover:bg-slate-100 transition"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
          </div>
        </header>

        {/* Mobile Drawer */}
        {isMobile && mobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl flex flex-col">
              <div className="h-14 flex items-center px-4 border-b border-slate-100">
                <Logo size={26} fontSize={13} />
              </div>
              <nav className="flex-grow py-4 px-3 space-y-1">
                {NAV.map(item => {
                  const active = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-left transition-all ${
                        active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
              <div className="p-3 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          </>
        )}

        {/* Page Content */}
        <main className="flex-grow overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
