import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 *
 * Props:
 *  allowedRole  — string  → single role check (legacy, still works)
 *  allowedRoles — array   → multi-role check (preferred)
 *
 * Superadmin can ALWAYS access admin routes.
 */
const ProtectedRoute = ({ children, allowedRole, allowedRoles }) => {
  const token = localStorage.getItem("token");

  // Safe parse — prevents crash if localStorage contains "undefined" / corrupt JSON
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  // ── Not authenticated ──────────────────────────────────────────
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ── Role check ─────────────────────────────────────────────────
  if (allowedRole || allowedRoles) {
    const role     = user.role?.toLowerCase();
    const allowed  = allowedRoles ?? [allowedRole]; // normalise to array

    // Superadmin inherits all "admin" permissions
    const isSuperAdmin = role === "superadmin";
    const needsAdmin   = allowed.includes("admin");

    const isAuthorized =
      allowed.includes(role) ||          // exact match
      (isSuperAdmin && needsAdmin);      // superadmin → admin routes

    if (!isAuthorized) {
      // Redirect to correct dashboard instead of home
      if (role === "admin" || role === "superadmin") {
        return <Navigate to="/admin/dashboard" replace />;
      }
      return <Navigate to="/user-dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;