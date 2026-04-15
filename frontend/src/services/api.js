import axios from "axios";

// ── Priority order ────────────────────────────────────────────────────────────
// 1. REACT_APP_API_URL from .env (local dev → http://localhost:5000)
// 2. REACT_APP_API_URL set on Render/Vercel dashboard (production)
// 3. Fallback to same origin (if frontend + backend served together)
// ─────────────────────────────────────────────────────────────────────────────
const BASE = process.env.REACT_APP_API_URL || "";

const API = axios.create({
  baseURL: BASE ? `${BASE}/api` : "/api",
  timeout: 15000,
});

// Attach JWT token automatically on every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Global response error handler — log clearly in dev
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", err.config?.url, err.response?.status, err.response?.data);
    }
    return Promise.reject(err);
  }
);

export default API;
