import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";

// Lazy load pages for performance
const Landing         = lazy(() => import("./pages/Landing"));
const Login           = lazy(() => import("./pages/user/Login"));
const UserRegister    = lazy(() => import("./pages/user/UserRegister"));
const ForgotPassword  = lazy(() => import("./pages/user/ForgotPassword"));
const ResetPassword   = lazy(() => import("./pages/user/ResetPassword"));
const Dashboard       = lazy(() => import("./pages/admin/Dashboard"));
const Complaints      = lazy(() => import("./pages/admin/Complaints"));
const Users           = lazy(() => import("./pages/admin/Users"));
const AdminDashboard  = lazy(() => import("./pages/AdminDashboard"));
const UserDashboard   = lazy(() => import("./pages/user/UserDashboard"));
const SubmitComplaint = lazy(() => import("./pages/user/SubmitComplaint"));
const MyComplaints    = lazy(() => import("./pages/user/MyComplaints"));
const Profile         = lazy(() => import("./pages/user/Profile"));
const ScamChecker     = lazy(() => import("./pages/ScamChecker"));
const Trending        = lazy(() => import("./pages/Trending"));
const AnonReport      = lazy(() => import("./pages/AnonReport"));
const ApiDocs         = lazy(() => import("./pages/ApiDocs"));
const Privacy         = lazy(() => import("./pages/Privacy"));
const Terms           = lazy(() => import("./pages/Terms"));

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa]">
    <div className="w-8 h-8 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
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

          {/* Admin & Superadmin */}
          <Route path="/admin"      element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/superadmin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
