// CyberShield Design System — serious, functional, security-grade
export const T = {
  bg:       "#f8fafc", // Very light grey/white background
  bgDark:   "#0f172a", // Dark blue for headers
  surface:  "#ffffff",
  surface2: "#f1f5f9",
  border:   "#e2e8f0",
  border2:  "#cbd5e1",
  text:     "#1e293b",
  text2:    "#475569",
  text3:    "#94a3b8",
  accent:   "#0284c7", // Professional blue
  accentHover: "#0369a1",
  danger:   "#dc2626",
  warning:  "#ca8a04",
  success:  "#16a34a",
  radius:   "0.25rem",  // Subdued rounding
  radiusMd: "0.375rem",
};

export const riskColor = (level) => {
  if (level === "CRITICAL") return T.danger;
  if (level === "HIGH")     return T.danger;
  if (level === "MEDIUM")   return T.warning;
  if (level === "LOW")      return T.success;
  return T.text3;
};

export const riskBg = (level) => {
  if (level === "CRITICAL") return "#fee2e2";
  if (level === "HIGH")     return "#fee2e2";
  if (level === "MEDIUM")   return "#fef9c3";
  if (level === "LOW")      return "#dcfce7";
  return "#f1f5f9";
};
