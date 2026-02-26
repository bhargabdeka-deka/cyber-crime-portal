import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";

const BASE_URL = "https://cyber-crime-portal-2.onrender.com";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-createdAt");

  // ✅ Modal state added
  const [selectedComplaint, setSelectedComplaint] = useState(null);

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
      <div style={styles.header}>
        <h2>All Complaints</h2>
        <button style={styles.exportBtn} onClick={handleExport}>
          Export CSV
        </button>
      </div>

      {/* FILTERS */}
      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search by Case ID..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          style={styles.search}
        />

        <select
          value={priorityFilter}
          onChange={(e) => {
            setPage(1);
            setPriorityFilter(e.target.value);
          }}
        >
          <option value="">All Priority</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Investigating">Investigating</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
        </select>
      </div>

      {/* TABLE */}
      <table style={styles.table}>
        <thead style={styles.thead}>
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
          {complaints.map((c) => {
            const isHighRisk = c.riskScore >= 80;

            return (
              <tr
                key={c._id}
                style={{
                  ...styles.row,
                  ...(isHighRisk && styles.highRiskRow)
                }}
                onClick={() => setSelectedComplaint(c)}
              >
                <td style={styles.normalCell}>{c.caseId}</td>
                <td style={styles.normalCell}>{c.user?.name}</td>
                <td style={styles.normalCell}>{c.crimeType}</td>

                <td style={styles.normalCell}>
                  <span style={getPriorityStyle(c.priority)}>
                    {c.priority}
                  </span>
                </td>

                {/* STOP modal when clicking dropdown */}
                <td
                  style={styles.normalCell}
                  onClick={(e) => e.stopPropagation()}
                >
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

                <td style={styles.normalCell}>
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>

                {/* STOP modal when clicking evidence */}
                <td
                  style={styles.normalCell}
                  onClick={(e) => e.stopPropagation()}
                >
                  {c.evidence ? (
                    <a
                      href={`${BASE_URL}/${c.evidence}`}
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
            );
          })}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div style={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* ✅ MODAL */}
      {selectedComplaint && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedComplaint(null)}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Case Details</h2>

            <p><strong>Case ID:</strong> {selectedComplaint.caseId}</p>
            <p><strong>User:</strong> {selectedComplaint.user?.name}</p>
            <p><strong>Crime Type:</strong> {selectedComplaint.crimeType}</p>
            <p><strong>Priority:</strong> {selectedComplaint.priority}</p>
            <p><strong>Status:</strong> {selectedComplaint.status}</p>
            <p><strong>Risk Score:</strong> {selectedComplaint.riskScore}</p>
            <p><strong>Description:</strong> {selectedComplaint.description}</p>

            <button
              style={styles.closeBtn}
              onClick={() => setSelectedComplaint(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- HELPERS ---------------- */

const getPriorityStyle = (priority) => {
  if (priority === "Critical")
    return { background: "#ef4444", color: "white", padding: "4px 8px", borderRadius: "6px" };

  if (priority === "High")
    return { background: "#f59e0b", color: "white", padding: "4px 8px", borderRadius: "6px" };

  return { background: "#e5e7eb", padding: "4px 8px", borderRadius: "6px" };
};

/* ---------------- STYLES ---------------- */

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  exportBtn: {
    background: "#3b82f6",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  controls: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },
  search: {
    padding: "6px",
    width: "220px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  },
  thead: {
    background: "#f4f4f4"
  },
  row: {
    cursor: "pointer"
  },
  normalCell: {
    padding: "12px",
    borderBottom: "1px solid #f1f1f1",
    textAlign: "center"
  },
  highRiskRow: {
    backgroundColor: "#fee2e2",
    borderLeft: "6px solid #ef4444"
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "20px"
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
    padding: "30px",
    borderRadius: "12px",
    width: "500px",
    maxWidth: "90%"
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

export default Complaints;
