import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/user/Login";
import UserRegister from "./pages/user/UserRegister";
import ForgotPassword from "./pages/user/ForgotPassword";
import ResetPassword from "./pages/user/ResetPassword";
import Dashboard from "./pages/admin/Dashboard";
import Complaints from "./pages/admin/Complaints";
import Users from "./pages/admin/Users";
import UserDashboard from "./pages/user/UserDashboard";
import SubmitComplaint from "./pages/user/SubmitComplaint";
import MyComplaints from "./pages/user/MyComplaints";
import Profile from "./pages/user/Profile";
import ScamChecker from "./pages/ScamChecker";
import Trending from "./pages/Trending";
import AnonReport from "./pages/AnonReport";
import ApiDocs from "./pages/ApiDocs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"           element={<Landing />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<UserRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/check-scam"     element={<ScamChecker />} />
        <Route path="/check/:value" element={<ScamChecker />} />
        <Route path="/trending"   element={<Trending />} />
        <Route path="/report"     element={<AnonReport />} />
        <Route path="/api-docs"   element={<ApiDocs />} />
        <Route path="/privacy"    element={<Privacy />} />
        <Route path="/terms"      element={<Terms />} />

        {/* Admin */}
        <Route path="/dashboard"  element={<ProtectedRoute allowedRole="admin"><Dashboard /></ProtectedRoute>} />
        <Route path="/complaints" element={<ProtectedRoute allowedRole="admin"><Complaints /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><Users /></ProtectedRoute>} />

        {/* User */}
        <Route path="/user-dashboard"   element={<ProtectedRoute allowedRole="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="/submit-complaint" element={<ProtectedRoute allowedRole="user"><SubmitComplaint /></ProtectedRoute>} />
        <Route path="/my-complaints"    element={<ProtectedRoute allowedRole="user"><MyComplaints /></ProtectedRoute>} />
        <Route path="/profile"          element={<ProtectedRoute allowedRole="user"><Profile /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen bg-[#E0F4FF] flex flex-col items-center justify-center font-sans p-6 text-center">
            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-soft flex items-center justify-center text-5xl mb-10 animate-bounce">
               🔍
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-6">Error 404</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic mb-10 max-w-xs leading-relaxed">
              Target node not found. The synchronization link has expired or never existed.
            </p>
            <a href="/" className="bg-slate-900 text-white px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all">
               Return to Landing
            </a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
