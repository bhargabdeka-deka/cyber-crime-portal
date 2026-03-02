import { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import Layout from "../../components/Layout";

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

    if (path.startsWith("http")) {
      return path;
    }

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

  if (loading) return <Layout><p style={{ padding: "30px" }}>Loading...</p></Layout>;

  return (
    <Layout>
      <div style={{ padding: "30px" }}>

        {/* Header */}
        <div style={styles.header}>
          <h2>All Complaints</h2>
        </div>

        {/* Filters */}
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

        {/* Table */}
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
              const isCritical = c.priority === "Critical";

              return (
                <tr
                  key={c._id}
                  style={{
                    ...styles.row,
                    ...(isCritical && styles.criticalRow)
                  }}
                  onClick={() => setSelectedComplaint(c)}
                >
                  <td style={styles.cell}>{c.caseId}</td>
                  <td style={styles.cell}>{c.user?.name}</td>
                  <td style={styles.cell}>{c.crimeType}</td>

                  <td style={styles.cell}>
                    <span style={getPriorityStyle(c.priority)}>
                      {c.priority}
                    </span>
                  </td>

                  <td
                    style={styles.cell}
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

                  <td style={styles.cell}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>

                  <td
                    style={styles.cell}
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
              );
            })}
          </tbody>
        </table>

      </div>
    </Layout>
  );
};

/* ---------------- STYLES ---------------- */

const getPriorityStyle = (priority) => {
  if (priority === "Critical")
    return { background: "#ef4444", color: "white", padding: "4px 8px", borderRadius: "6px" };

  if (priority === "High")
    return { background: "#f59e0b", color: "white", padding: "4px 8px", borderRadius: "6px" };

  return { background: "#e5e7eb", padding: "4px 8px", borderRadius: "6px" };
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
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
  criticalRow: {
    backgroundColor: "#fee2e2",
    borderLeft: "6px solid #ef4444"
  },
  cell: {
    padding: "12px",
    borderBottom: "1px solid #f1f1f1",
    textAlign: "center"
  }
};

export default Complaints;