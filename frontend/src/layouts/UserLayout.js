import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const NAV = [
  { path: "/user-dashboard",   icon: "⊞", label: "Dashboard" },
  { path: "/check-scam",       icon: "🔍", label: "Scam Checker" },
  { path: "/trending",         icon: "🔥", label: "Trending Scams" },
  { path: "/submit-complaint", icon: "＋", label: "Submit Complaint" },
  { path: "/my-complaints",    icon: "☰", label: "My Complaints" },
];

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#0f172a" }}>

      {/* SIDEBAR */}
      <div style={{ width: collapsed ? 64 : 220, background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", transition: "width 0.25s", flexShrink: 0, overflow: "hidden" }}>

        {/* Logo */}
        <div style={{ padding: collapsed ? "20px 16px" : "20px 20px", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", minHeight: 64 }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>⚔️</span>
              <span style={{ color: "white", fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px" }}>CyberShield</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#94a3b8", width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(item => {
            const active = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px 0" : "10px 12px", justifyContent: collapsed ? "center" : "flex-start", background: active ? "rgba(59,130,246,0.15)" : "transparent", border: active ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent", borderRadius: 8, color: active ? "#60a5fa" : "#94a3b8", cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400, transition: "all 0.15s", width: "100%" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ color: "white", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
                <div style={{ color: "#64748b", fontSize: 11 }}>User</div>
              </div>
            </div>
          )}
          <button onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px 0" : "10px 12px", justifyContent: collapsed ? "center" : "flex-start", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#f87171", cursor: "pointer", fontSize: 13, width: "100%", transition: "all 0.15s" }}>
            <span style={{ fontSize: 16 }}>⏻</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#0f172a" }}>

        {/* Topbar */}
        <div style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <span style={{ color: "#94a3b8", fontSize: 13 }}>
              {NAV.find(n => n.path === location.pathname)?.label || "Portal"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700 }}>{initials}</div>
            <div>
              <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>Citizen</div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
