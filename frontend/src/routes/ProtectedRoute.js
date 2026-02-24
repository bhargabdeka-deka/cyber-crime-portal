import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔐 Not logged in
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // 🔐 Role mismatch
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;