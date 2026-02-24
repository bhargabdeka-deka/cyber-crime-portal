import { useEffect, useState } from "react";
import API from "../../services/api";
import UserLayout from "../../layouts/UserLayout";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/my");
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to fetch complaints");
    }
  };

  // -------- COUNTS --------
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const investigating = complaints.filter(c => c.status === "Investigating").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const highRisk = complaints.filter(c => c.riskScore >= 80).length;

  // -------- CHART DATA --------
  const chartData = [
    { status: "Pending", count: pending },
    { status: "Investigating", count: investigating },
    { status: "Resolved", count: resolved }
  ];

  // -------- STATUS BADGE STYLE --------
  const getStatusStyle = (status) => {
    if (status === "Pending")
      return {
        background: "#fef3c7",
        color: "#92400e",
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "12px"
      };

    if (status === "Investigating")
      return {
        background: "#dbeafe",
        color: "#1e3a8a",
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "12px"
      };

    return {
      background: "#dcfce7",
      color: "#065f46",
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "12px"
    };
  };

  // -------- RECENT COMPLAINTS --------
  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // -------- GREETING --------
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <UserLayout>
      <h2 style={{ marginBottom: "10px" }}>
        {greeting} 👋
      </h2>

      <p style={{ marginBottom: "30px", color: "#555" }}>
        Here is your complaint activity overview.
      </p>

      {/* -------- STAT CARDS -------- */}
      <div style={styles.cardContainer}>

        <div style={styles.card}>
          <h3>Total Complaints</h3>
          <p style={styles.number}>{total}</p>
        </div>

        <div style={{ ...styles.card, background: "#fef3c7" }}>
          <h3>Pending</h3>
          <p style={styles.number}>{pending}</p>
        </div>

        <div style={{ ...styles.card, background: "#dbeafe" }}>
          <h3>Investigating</h3>
          <p style={styles.number}>{investigating}</p>
        </div>

        <div style={{ ...styles.card, background: "#dcfce7" }}>
          <h3>Resolved</h3>
          <p style={styles.number}>{resolved}</p>
        </div>

        <div style={{ ...styles.card, background: "#fee2e2" }}>
          <h3>High Risk</h3>
          <p style={styles.number}>{highRisk}</p>
        </div>

      </div>

      {/* -------- CHART SECTION -------- */}
      <div style={styles.chartCard}>
        <h3>Status Distribution</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="count">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.status === "Pending"
                      ? "#facc15"
                      : entry.status === "Investigating"
                      ? "#3b82f6"
                      : "#22c55e"
                  }
                />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* -------- RECENT COMPLAINTS -------- */}
      <div style={styles.recentSection}>
        <h3 style={{ marginBottom: "15px" }}>Recent Complaints</h3>

        {recentComplaints.length === 0 ? (
          <p>No complaints yet.</p>
        ) : (
          recentComplaints.map((c) => (
            <div key={c._id} style={styles.recentCard}>
              <strong>{c.caseId}</strong>
              <p>{c.crimeType}</p>
              <span style={getStatusStyle(c.status)}>
                {c.status}
              </span>
            </div>
          ))
        )}
      </div>

    </UserLayout>
  );
};

const styles = {
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginBottom: "40px"
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    textAlign: "center"
  },
  number: {
    fontSize: "28px",
    fontWeight: "bold",
    marginTop: "10px"
  },
  chartCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    marginBottom: "40px"
  },
  recentSection: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
  },
  recentCard: {
    padding: "10px",
    borderBottom: "1px solid #eee"
  }
};

export default UserDashboard;