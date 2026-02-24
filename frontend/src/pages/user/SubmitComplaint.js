import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout";
import analyzeComplaint from "../../utils/riskAnalyzer";

const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    evidence: null
  });

  const [analysis, setAnalysis] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  /* ================= REAL-TIME AI ANALYSIS ================= */

  useEffect(() => {
    if (formData.title || formData.description) {
      const result = analyzeComplaint(
        formData.title,
        formData.description
      );
      setAnalysis(result);
    } else {
      setAnalysis(null);
    }
  }, [formData.title, formData.description]);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    if (e.target.name === "evidence") {
      setFormData({ ...formData, evidence: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  /* ================= HANDLE SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);

      if (formData.evidence) {
        data.append("evidence", formData.evidence);
      }

      await API.post("/complaints", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setMessage("Complaint submitted successfully!");

      setTimeout(() => {
        navigate("/user-dashboard");
      }, 1500);

    } catch (err) {
      setMessage("Failed to submit complaint");
    }
  };

  /* ================= RISK STYLE ================= */

  const getRiskStyle = (score) => {
    if (score >= 80)
      return {
        background: "#ef4444",
        color: "white",
        padding: "4px 10px",
        borderRadius: "20px",
        fontWeight: "bold"
      };

    if (score >= 60)
      return {
        background: "#f59e0b",
        color: "white",
        padding: "4px 10px",
        borderRadius: "20px",
        fontWeight: "bold"
      };

    return {
      background: "#10b981",
      color: "white",
      padding: "4px 10px",
      borderRadius: "20px",
      fontWeight: "bold"
    };
  };

  /* ================= UI ================= */

  return (
    <UserLayout>
      <h2 style={styles.title}>Submit Complaint</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>

        <input
          type="text"
          name="title"
          placeholder="Complaint Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Describe the issue..."
          value={formData.description}
          onChange={handleChange}
          required
          rows="5"
        />

        {/* ===== LIVE AI PREVIEW ===== */}

        {analysis && (
          <div style={styles.previewBox}>
            <p>
              <strong>Detected Crime Type:</strong>{" "}
              {analysis.crimeType}
            </p>

            <p>
              <strong>Risk Level:</strong>{" "}
              <span style={getRiskStyle(analysis.riskScore)}>
                {analysis.priority}
              </span>
            </p>
          </div>
        )}

        <input
          type="file"
          name="evidence"
          onChange={handleChange}
        />

        <button type="submit" style={styles.button}>
          Submit
        </button>

      </form>
    </UserLayout>
  );
};

/* ================= STYLES ================= */

const styles = {
  title: {
    marginBottom: "20px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxWidth: "500px"
  },
  previewBox: {
    padding: "12px",
    background: "#f3f4f6",
    borderRadius: "8px"
  },
  button: {
    padding: "10px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default SubmitComplaint;