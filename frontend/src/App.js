import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/user/Login";
import UserRegister from "./pages/user/UserRegister";
import Dashboard from "./pages/admin/Dashboard";
import Complaints from "./pages/admin/Complaints";
import UserDashboard from "./pages/user/UserDashboard";
import SubmitComplaint from "./pages/user/SubmitComplaint";
import MyComplaints from "./pages/user/MyComplaints";
import ScamChecker from "./pages/ScamChecker";
import Trending from "./pages/Trending";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"           element={<Landing />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<UserRegister />} />
        <Route path="/check-scam" element={<ScamChecker />} />
        <Route path="/check/:value" element={<ScamChecker />} />
        <Route path="/trending"   element={<Trending />} />

        {/* Admin */}
        <Route path="/dashboard"  element={<ProtectedRoute allowedRole="admin"><Dashboard /></ProtectedRoute>} />
        <Route path="/complaints" element={<ProtectedRoute allowedRole="admin"><Complaints /></ProtectedRoute>} />

        {/* User */}
        <Route path="/user-dashboard"   element={<ProtectedRoute allowedRole="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="/submit-complaint" element={<ProtectedRoute allowedRole="user"><SubmitComplaint /></ProtectedRoute>} />
        <Route path="/my-complaints"    element={<ProtectedRoute allowedRole="user"><MyComplaints /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Segoe UI", color: "white", gap: 16 }}>
            <div style={{ fontSize: 72 }}>🔍</div>
            <h1 style={{ fontSize: 32, fontWeight: 700 }}>404 — Page Not Found</h1>
            <p style={{ color: "#94a3b8" }}>The page you're looking for doesn't exist.</p>
            <a href="/" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white", padding: "12px 24px", borderRadius: 10, textDecoration: "none", fontWeight: 600, marginTop: 8 }}>Go Home</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
