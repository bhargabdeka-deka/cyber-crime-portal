import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/user/Login";
import Dashboard from "./pages/admin/Dashboard";
import Complaints from "./pages/admin/Complaints";
import UserDashboard from "./pages/user/UserDashboard";
import UserRegister from "./pages/user/UserRegister";
import SubmitComplaint from "./pages/user/SubmitComplaint";
import MyComplaints from "./pages/user/MyComplaints";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/user-register" element={<UserRegister />} />

        {/* Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <ProtectedRoute allowedRole="admin">
              <Complaints />
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit-complaint"
          element={
            <ProtectedRoute allowedRole="user">
              <SubmitComplaint />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute allowedRole="user">
              <MyComplaints />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;