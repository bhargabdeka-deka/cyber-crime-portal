import { useNavigate } from "react-router-dom";
import useWindowWidth from "../hooks/useWindowWidth";

const BASE = "https://cyber-crime-portal-2.onrender.com";

const endpoints = [
  {
    method: "GET", path: "/api/scam/check?query=9876543210",
    desc: "Check if a phone number, URL, or UPI ID has been reported as a scam.",
    auth: "None",
    response: `{
  "status": "SCAM",
  "verdict": "dangerous",
  "verdictLabel": "Highly Dangerous",
  "reports": 14,
  "riskLevel": "CRITICAL",
  "avgRiskScore": 88,
  "category": "UPI Fraud",
  "description": "Caller pretends to be SBI officer...",
  "locations": ["Guwahati", "Delhi"],
  "lastReportedAt": "2026-04-16T..."
}`
  },
  {
    method: "GET", path: "/api/scam/trending",
    desc: "Get trending scam categories, most-reported targets, and weekly stats.",
    auth: "None",
    response: `{
  "topTargets": [...],
  "topCategories": [...],
  "stats": {
    "totalScams": 16,
    "criticalCount": 8,
    "recentCount": 5
  }
}`
  },
  {
    method: "GET", path: "/api/scam/activity",
    desc: "Get the 8 most recently reported scam targets.",
    auth: "None",
    response: `[
  {
    "value": "fake-jobs.com",
    "type": "url",
    "category": "Job Scam",
    "reports": 8,
    "riskLevel": "HIGH",
    "lastReportedAt": "2026-04-16T..."
  }
]`
  },
  {
    method: "POST", path: "/api/complaints/anonymous",
    desc: "Submit an anonymous scam report without creating an account.",
    auth: "None",
    body: `{
  "title": "Fake job offer",
  "description": "Received a WhatsApp message...",
  "scamType": "Job Scam",
  "scamTarget": "9876543210",
  "location": "Guwahati"
}`,
    response: `{
  "success": true,
  "message": "Report submitted. Thank you!",
  "caseId": "ANON-1713456789"
}`
  },
];

const methodColor = { GET:"#10b981", POST:"#3b82f6", PUT:"#f59e0b", DELETE:"#ef4444" };

export default function ApiDocs() {
  const navigate = useNavigate();
  const w = useWindowWidth();
  const isMobile = w < 640;

  return (
    <div style={{ minHeight:"100vh", background:"#0a0f1e", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"white" }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 20% 30%,rgba(59,130,246,0.08) 0%,transparent 60%)", pointerEvents:"none" }} />

      <nav style={{ position:"sticky", top:0, zIndex:50, background:"rgba(10,15,30,0.92)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={() => navigate("/")}>
          <img src="/logo1.jpeg" alt="CyberShield" style={{ width:26, height:26, borderRadius:6, objectFit:"cover" }} />
          <span style={{ fontWeight:700, fontSize:15 }}>CyberShield</span>
          <span style={{ color:"#64748b", fontSize:13 }}>/ API Docs</span>
        </div>
        <button onClick={() => navigate("/")} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#94a3b8", padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:13 }}>← Home</button>
      </nav>

      <div style={{ maxWidth:860, margin:"0 auto", padding: isMobile ? "32px 16px 60px" : "48px 32px", position:"relative", zIndex:1 }}>

        {/* Header */}
        <div style={{ marginBottom:40 }}>
          <div style={{ display:"inline-block", background:"rgba(59,130,246,0.12)", border:"1px solid rgba(59,130,246,0.25)", color:"#93c5fd", padding:"4px 12px", borderRadius:20, fontSize:12, marginBottom:14 }}>Public API</div>
          <h1 style={{ fontSize: isMobile ? 24 : 34, fontWeight:800, margin:"0 0 10px", letterSpacing:"-0.5px" }}>CyberShield API</h1>
          <p style={{ color:"#94a3b8", fontSize:15, margin:"0 0 16px", lineHeight:1.7 }}>
            Free public API to check scam reports and access our intelligence database. No API key required for public endpoints.
          </p>
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ color:"#64748b", fontSize:12 }}>Base URL</span>
            <code style={{ color:"#60a5fa", fontSize:13, fontFamily:"monospace", background:"rgba(59,130,246,0.08)", padding:"2px 8px", borderRadius:4 }}>{BASE}</code>
          </div>
        </div>

        {/* Endpoints */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {endpoints.map((ep, i) => (
            <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, overflow:"hidden" }}>
              {/* Header */}
              <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                <span style={{ background:`${methodColor[ep.method]}20`, color:methodColor[ep.method], border:`1px solid ${methodColor[ep.method]}40`, padding:"3px 10px", borderRadius:6, fontSize:12, fontWeight:700, fontFamily:"monospace" }}>{ep.method}</span>
                <code style={{ color:"white", fontSize:13, fontFamily:"monospace", flex:1 }}>{ep.path}</code>
                <span style={{ background:"rgba(16,185,129,0.1)", color:"#6ee7b7", border:"1px solid rgba(16,185,129,0.2)", padding:"2px 8px", borderRadius:20, fontSize:11 }}>🔓 {ep.auth}</span>
              </div>

              <div style={{ padding:"16px 20px" }}>
                <p style={{ color:"#94a3b8", fontSize:14, margin:"0 0 16px", lineHeight:1.6 }}>{ep.desc}</p>

                {ep.body && (
                  <div style={{ marginBottom:16 }}>
                    <div style={{ color:"#64748b", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Request Body</div>
                    <pre style={{ background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 14px", fontSize:12, color:"#e2e8f0", overflow:"auto", margin:0, fontFamily:"monospace", lineHeight:1.6 }}>{ep.body}</pre>
                  </div>
                )}

                <div>
                  <div style={{ color:"#64748b", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Response</div>
                  <pre style={{ background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 14px", fontSize:12, color:"#6ee7b7", overflow:"auto", margin:0, fontFamily:"monospace", lineHeight:1.6 }}>{ep.response}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ marginTop:32, background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.15)", borderRadius:12, padding:"16px 20px" }}>
          <div style={{ color:"white", fontSize:14, fontWeight:600, marginBottom:6 }}>Want to integrate CyberShield into your app?</div>
          <p style={{ color:"#64748b", fontSize:13, margin:"0 0 12px" }}>The public endpoints are free to use. For higher rate limits or private endpoints, create an account.</p>
          <button onClick={() => navigate("/register")} style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", color:"white", padding:"9px 18px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 }}>Create Free Account</button>
        </div>
      </div>
    </div>
  );
}
