// Reusable CyberShield logo component
export default function Logo({ size = 26, fontSize = 15, color = "white" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <img
        src="/logo1.jpeg"
        alt="CyberShield"
        style={{ width: size, height: size, borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
      />
      <span style={{ color, fontWeight: 700, fontSize, letterSpacing: "-0.3px" }}>
        CyberShield
      </span>
    </div>
  );
}
