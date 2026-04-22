import axios from "axios";

// ── Priority order ────────────────────────────────────────────────────────────
// 1. REACT_APP_API_URL from .env (local dev → http://localhost:5000)
// 2. REACT_APP_API_URL set on Render/Vercel dashboard (production)
// 3. Fallback to same origin (if frontend + backend served together)
// ─────────────────────────────────────────────────────────────────────────────
const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 15000,
});

// Attach JWT token automatically on every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Global response error handler
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", err.config?.url, err.response?.status, err.response?.data);
    }

    // Auto-logout on expired / invalid token
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Only redirect if not already on a public page
      const publicPaths = ["/", "/login", "/register", "/forgot-password"];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default API;
