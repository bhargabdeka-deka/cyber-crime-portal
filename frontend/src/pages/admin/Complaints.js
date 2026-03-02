import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-createdAt");

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  /* ---------------- SAFE IMAGE BUILDER ---------------- */

  const buildImageUrl = (path) => {
    if (!path) return null;

    // If already Cloudinary URL
    if (path.startsWith("http")) {
      return path;
    }

    // If local upload (future safety)
    const cleanPath = path.replace(/^\/+/, "");
    return `${process.env.REACT_APP_API_URL}/${cleanPath}`;
  };

  /* ---------------- FETCH ---------------- */

  const fetchComplaints = useCallback(async () => {
    try {
      const res = await API.get("/complaints", {
        params: {
          page,
          limit: 5,
          priority: priorityFilter,
          status: statusFilter,
          search,
          sort
        }
      });

      setComplaints(res.data.complaints);
      setTotalPages(res.data.pages);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch complaints");
      setLoading(false);
    }
  }, [page, priorityFilter, statusFilter, search, sort]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  /* ---------------- STATUS UPDATE ---------------- */

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/complaints/${id}/status`, {
        status: newStatus
      });
      fetchComplaints();
    } catch (err) {
      console.error("Failed to update status");
    }
  };

  /* ---------------- CSV EXPORT ---------------- */

  const handleExport = () => {
    if (!complaints.length) return;

    const headers = [
      "Case ID",
      "User",
      "Crime Type",
      "Priority",
      "Risk Score",
      "Status",
      "Date"
    ];

    const rows = complaints.map((c) => [
      c.caseId,
      c.user?.name || "N/A",
      c.crimeType,
      c.priority,
      c.riskScore,
      c.status,
      new Date(c.createdAt).toLocaleDateString()
    ]);

    const csvContent =
      [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "complaints_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p style={{ padding: "30px" }}>Loading...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>All Complaints</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Case ID</th>
            <th>User</th>
            <th>Crime Type</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Date</th>
            <th>Evidence</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((c) => (
            <tr key={c._id} onClick={() => setSelectedComplaint(c)}>
              <td>{c.caseId}</td>
              <td>{c.user?.name}</td>
              <td>{c.crimeType}</td>
              <td>{c.priority}</td>

              <td onClick={(e) => e.stopPropagation()}>
                <select
                  value={c.status}
                  onChange={(e) =>
                    handleStatusChange(c._id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </td>

              <td>{new Date(c.createdAt).toLocaleDateString()}</td>

              <td onClick={(e) => e.stopPropagation()}>
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

      {/* Modal */}
      {selectedComplaint && (
        <div style={styles.modalOverlay} onClick={() => setSelectedComplaint(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Case Details</h2>

            <p><strong>Case ID:</strong> {selectedComplaint.caseId}</p>
            <p><strong>User:</strong> {selectedComplaint.user?.name}</p>
            <p><strong>Crime Type:</strong> {selectedComplaint.crimeType}</p>
            <p><strong>Priority:</strong> {selectedComplaint.priority}</p>
            <p><strong>Status:</strong> {selectedComplaint.status}</p>
            <p><strong>Risk Score:</strong> {selectedComplaint.riskScore}</p>
            <p><strong>Description:</strong> {selectedComplaint.description}</p>

            {selectedComplaint.evidence && (
              <img
                src={buildImageUrl(selectedComplaint.evidence)}
                alt="Evidence"
                style={{ width: "100%", marginTop: "10px", borderRadius: "8px" }}
              />
            )}

            <button onClick={() => setSelectedComplaint(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse"
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
    alignItems: "center"
  },
  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "500px"
  }
};

export default Complaints;