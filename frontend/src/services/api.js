import axios from "axios";

// ── Priority order ────────────────────────────────────────────────────────────
// 1. REACT_APP_API_URL from .env (local dev → http://localhost:5000)
// 2. REACT_APP_API_URL set on Render/Vercel dashboard (production)
// 3. Fallback to same origin (if frontend + backend served together)
// ─────────────────────────────────────────────────────────────────────────────
const rawBase = process.env.REACT_APP_API_URL || "http://localhost:5000";
const BASE = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;

const API = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 30000, // Increased for Render cold starts
});

// Attach JWT token automatically on every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Global response error handler with retry logic
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    const isAuthRequest = originalRequest.url.includes("/login") || originalRequest.url.includes("/register");

    // Retry once if request timed out or network error (common on cold starts)
    // DO NOT retry for login/register to avoid confusing the user with multiple failures
    if ((err.code === "ECONNABORTED" || !err.response) && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;
      console.warn("⚠️ Connection issue. Retrying request...");
      return API(originalRequest);
    }

    // Auto-logout on expired / invalid token
    if (err.response?.status === 401 && !isAuthRequest) {
      console.warn("Unauthorized! Clearing session...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      const publicPaths = ["/", "/login", "/register", "/forgot-password"];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(err);
  }
);

export default API;
