import { useEffect, useState } from "react";
import API from "../../services/api";
import UserLayout from "../../layouts/UserLayout";

const BASE_URL = process.env.REACT_APP_API_URL;

/* ================= HELPER FUNCTIONS ================= */

const getRiskLabel = (score) => {
  if (score >= 80) return "HIGH";
  if (score >= 50) return "MEDIUM";
  return "LOW";
};

const getRiskBadgeStyle = (score) => {
  if (score >= 80)
    return {
      background: "#ef4444",
      color: "white",
      padding: "4px 10px",
      borderRadius: "20px",
      fontWeight: "bold"
    };

  if (score >= 50)
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

const getStepStyle = (currentStatus, step) => {
  const active = currentStatus === step;

  return {
    padding: "4px 8px",
    borderRadius: "20px",
    fontSize: "12px",
    background: active ? "#3b82f6" : "#e5e7eb",
    color: active ? "white" : "#555",
    fontWeight: active ? "600" : "400"
  };
};

/* ================= COMPONENT ================= */

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/my");
      setComplaints(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch complaints");
      setLoading(false);
    }
  };

  /* ✅ NEW: Fetch fresh complaint when row clicked */
  const openComplaintDetails = async (id) => {
    try {
      const res = await API.get(`/complaints/${id}`);
      setSelectedComplaint(res.data);
    } catch (error) {
      console.error("Failed to fetch complaint details", error);
    }
  };

  const buildImageUrl = (path) => {
    if (!path) return null;
    const cleanPath = path.replace(/^\/+/, "");
    return `${BASE_URL}/${cleanPath}`;
  };

  if (loading) {
    return (
      <UserLayout>
        <p>Loading complaints...</p>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <h2 style={{ marginBottom: "20px" }}>My Complaints</h2>

      {complaints.length === 0 ? (
        <p>No complaints submitted yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Case ID</th>
              <th style={styles.th}>Crime Type</th>
              <th style={styles.th}>Priority</th>
              <th style={styles.th}>Risk</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Evidence</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <tr
                key={c._id}
                style={styles.tr}
                /* ✅ UPDATED HERE */
                onClick={() => openComplaintDetails(c._id)}
              >
                <td style={styles.td}>{c.caseId}</td>
                <td style={styles.td}>{c.crimeType}</td>
                <td style={styles.td}>{c.priority}</td>

                <td style={styles.td}>
                  <span style={getRiskBadgeStyle(c.riskScore)}>
                    {getRiskLabel(c.riskScore)}
                  </span>
                </td>

                <td style={styles.td}>
                  <div style={styles.timeline}>
                    <span style={getStepStyle(c.status, "Pending")}>
                      Pending
                    </span>
                    <span style={getStepStyle(c.status, "Investigating")}>
                      Investigating
                    </span>
                    <span style={getStepStyle(c.status, "Resolved")}>
                      Resolved
                    </span>
                  </div>
                </td>

                <td style={styles.td}>
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>

                <td
                  style={styles.td}
                  onClick={(e) => e.stopPropagation()}
                >
                  {c.evidence ? (
                    <a
                      href={buildImageUrl(c.evidence)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    "No File"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= MODAL ================= */}

      {selectedComplaint && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedComplaint(null)}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Complaint Details</h3>

            <p><strong>Case ID:</strong> {selectedComplaint.caseId}</p>
            <p><strong>Crime Type:</strong> {selectedComplaint.crimeType}</p>
            <p><strong>Priority:</strong> {selectedComplaint.priority}</p>

            <p>
              <strong>Risk Level:</strong>{" "}
              <span style={getRiskBadgeStyle(selectedComplaint.riskScore)}>
                {getRiskLabel(selectedComplaint.riskScore)}
              </span>
            </p>

            <p><strong>Status:</strong> {selectedComplaint.status}</p>

            <p><strong>Description:</strong></p>
            <p>{selectedComplaint.description}</p>

            {selectedComplaint.evidence && (
              <div>
                <p><strong>Evidence:</strong></p>
                <img
                  src={buildImageUrl(selectedComplaint.evidence)}
                  alt="Evidence"
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    borderRadius: "8px",
                    objectFit: "cover"
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

            <button
              style={styles.closeBtn}
              onClick={() => setSelectedComplaint(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </UserLayout>
  );
};

/* ================= STYLES ================= */

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  },
  th: {
    padding: "12px",
    textAlign: "center",
    background: "#f3f4f6",
    fontWeight: "600",
    borderBottom: "1px solid #e5e7eb"
  },
  td: {
    padding: "12px",
    textAlign: "center",
    borderBottom: "1px solid #f1f1f1"
  },
  tr: {
    cursor: "pointer",
    transition: "0.2s"
  },
  timeline: {
    display: "flex",
    gap: "6px",
    justifyContent: "center",
    alignItems: "center"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modal: {
    background: "white",
    padding: "25px",
    width: "500px",
    borderRadius: "12px",
    maxHeight: "80vh",
    overflowY: "auto"
  },
  closeBtn: {
    marginTop: "20px",
    padding: "8px 15px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default MyComplaints;