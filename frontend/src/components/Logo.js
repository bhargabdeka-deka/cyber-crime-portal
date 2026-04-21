/**
 * CyberShield — Canonical Logo Component
 *
 * Usage:
 *   <Logo />                        → dark text (for light bg, e.g. navbar)
 *   <Logo theme="light" />          → white text (for dark bg, e.g. footer)
 *   <Logo size={36} />              → custom image size
 *   <Logo showText={false} />       → icon-only (e.g. collapsed sidebar)
 */
export default function Logo({
  size      = 36,
  fontSize  = 15,
  theme     = "dark",   // "dark" | "light"
  showText  = true,
}) {
  const cyberColor  = theme === "light" ? "#f1f5f9" : "#0f172a";  // slate-100 or slate-900
  const shieldColor = "#2563eb";                                    // blue-600 — always consistent

  return (
    <div className="flex items-center gap-2">

      {/* White circular wrapper masks JPEG dark background */}
      <div
        className="bg-white rounded-full flex items-center justify-center shrink-0"
        style={{
          width:     size + 8,   // +8 for padding ring
          height:    size + 8,
          boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
          border:    "1px solid #e5e7eb",  // gray-200
        }}
      >
        <img
          src="/logo1.jpeg"
          alt="CyberShield"
          className="rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      </div>

      {/* Brand name — always "Cyber" dark + "Shield" blue */}
      {showText && (
        <span
          className="font-semibold tracking-tight select-none"
          style={{ fontSize, lineHeight: 1 }}
        >
          <span style={{ color: cyberColor }}>Cyber</span>
          <span style={{ color: shieldColor }}>Shield</span>
        </span>
      )}
    </div>
  );
}
