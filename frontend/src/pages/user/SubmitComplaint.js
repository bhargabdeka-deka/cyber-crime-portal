import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout";
import analyzeComplaint from "../../utils/riskAnalyzer";

const SCAM_TYPES = [
  "UPI Fraud","Phishing","Job Scam","Lottery Scam",
  "Romance Scam","Investment Scam","Identity Theft",
  "Account Hacking","Cyber Harassment","Other"
];

const priorityMeta = {
  Critical: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", icon: "🚨" },
  High:     { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", icon: "⚠️" },
  Medium:   { color: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)", icon: "📋" },
  Low:      { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", icon: "✅" },
};

export default function SubmitComplaint() {
  const [formData, setFormData] = useState({
    title: "", description: "", scamType: "", scamTarget: "", location: "", evidence: null
  });
  const [analysis, setAnalysis] = useState(null);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.title || formData.description) {
      setAnalysis(analyzeComplaint(formData.title, formData.description));
    } else setAnalysis(null);
  }, [formData.title, formData.description]);

  const handleChange = (e) => {
    if (e.target.name === "evidence") {
      const file = e.target.files[0];
      setFormData({ ...formData, evidence: file });
      setFileName(file ? file.name : "");
    } else setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title",       formData.title);
      data.append("description", formData.description);
      data.append("scamType",    formData.scamType || (analysis?.scamType || "Other"));
      data.append("scamTarget",  formData.scamTarget);
      data.append("location",    formData.location);
      if (formData.evidence) data.append("evidence", formData.evidence);

      await API.post("/complaints", data, { headers: { "Content-Type": "multipart/form-data" } });
      setStatus({ type: "success", msg: "Complaint submitted! Redirecting..." });
      setTimeout(() => navigate("/my-complaints"), 1800);
    } catch (err) {
      setStatus({ type: "error", msg: err.response?.data?.message || "Failed to submit. Try again." });
    } finally { setLoading(false); }
  };

  const meta = analysis ? (priorityMeta[analysis.priority] || priorityMeta.Low) : null;

  return (
    <UserLayout>
      <div style={{ maxWidth: 700 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>File a Complaint</h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>Report a scam or cyber crime. AI will analyze it instantly.</p>
        </div>

        {status.msg && (
          <div style={{ background: status.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${status.type === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`, color: status.type === "success" ? "#6ee7b7" : "#fca5a5", padding: "12px 16px", borderRadius: 10, fontSize: 14, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            {status.type === "success" ? "✅" : "⚠️"} {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Title */}
            <div>
              <label style={lbl}>Complaint Title <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="title" type="text" placeholder="e.g. Received fake job offer, UPI fraud..." value={formData.title} onChange={handleChange} required style={inp}
                onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>

            {/* Scam Type + Target row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={lbl}>Scam Type</label>
                <select name="scamType" value={formData.scamType} onChange={handleChange}
                  style={{ ...inp, cursor: "pointer" }}>
                  <option value="" style={{ background: "#1e293b" }}>Auto-detect</option>
                  {SCAM_TYPES.map(t => <option key={t} value={t} style={{ background: "#1e293b" }}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Phone / URL / UPI ID <span style={{ color: "#64748b", fontWeight: 400 }}>(scam target)</span></label>
                <input name="scamTarget" type="text" placeholder="e.g. 9876543210 or fake-site.com" value={formData.scamTarget} onChange={handleChange} style={inp}
                  onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
            </div>

            {/* Location */}
            <div>
              <label style={lbl}>Location <span style={{ color: "#64748b", fontWeight: 400 }}>(optional — city/state)</span></label>
              <input name="location" type="text" placeholder="e.g. Guwahati, Assam" value={formData.location} onChange={handleChange} style={inp}
                onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>

            {/* Description */}
            <div>
              <label style={lbl}>Description <span style={{ color: "#ef4444" }}>*</span></label>
              <textarea name="description" placeholder="Describe what happened in detail..." value={formData.description} onChange={handleChange} required rows={5}
                style={{ ...inp, resize: "vertical", minHeight: 120 }}
                onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              <div style={{ textAlign: "right", color: "#475569", fontSize: 11, marginTop: 4 }}>{formData.description.length} characters</div>
            </div>

            {/* AI Preview */}
            {analysis && meta && (
              <div style={{ background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ color: meta.color, fontWeight: 600, fontSize: 13, marginBottom: 10 }}>⚡ AI Analysis Preview</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                  <div><div style={{ color: "#64748b", fontSize: 11, marginBottom: 3 }}>Crime Type</div><div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{analysis.crimeType}</div></div>
                  <div><div style={{ color: "#64748b", fontSize: 11, marginBottom: 3 }}>Scam Type</div><div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{analysis.scamType}</div></div>
                  <div><div style={{ color: "#64748b", fontSize: 11, marginBottom: 3 }}>Priority</div><span style={{ background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{meta.icon} {analysis.priority}</span></div>
                  <div><div style={{ color: "#64748b", fontSize: 11, marginBottom: 3 }}>Risk Score</div><div style={{ color: meta.color, fontSize: 18, fontWeight: 800 }}>{analysis.riskScore}<span style={{ fontSize: 11, color: "#64748b" }}>/100</span></div></div>
                </div>
              </div>
            )}

            {/* Evidence */}
            <div>
              <label style={lbl}>Evidence <span style={{ color: "#64748b", fontWeight: 400 }}>(optional)</span></label>
              <label style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: 10, padding: "14px 16px", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}>
                <span style={{ fontSize: 22 }}>📎</span>
                <div>
                  <div style={{ color: fileName ? "white" : "#64748b", fontSize: 13 }}>{fileName || "Attach screenshot, document, or file"}</div>
                  <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>PNG, JPG, PDF up to 10MB</div>
                </div>
                <input type="file" name="evidence" onChange={handleChange} style={{ display: "none" }} accept="image/*,.pdf,.doc,.docx" />
              </label>
            </div>

            <button type="submit" disabled={loading}
              style={{ background: loading ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "white", padding: "14px", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Submitting...</> : "Submit Complaint →"}
            </button>
          </div>
        </form>
      </div>
    </UserLayout>
  );
}

const lbl = { color: "#94a3b8", fontSize: 13, fontWeight: 500, display: "block", marginBottom: 8 };
const inp = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s" };
