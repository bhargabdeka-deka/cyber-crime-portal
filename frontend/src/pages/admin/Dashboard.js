import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Layout from "../../components/Layout";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    // 🔐 Proper Admin Protection
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await API.get("/complaints/analytics");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics");
      }
    };

    fetchStats();
  }, [navigate]);

  if (!stats) return <Layout><p>Loading analytics...</p></Layout>;

  return (
    <Layout>
      <h1 style={styles.title}>Dashboard Analytics</h1>
       {stats.criticalCases > 0 && (
  <div style={styles.alertBox}>
    🚨 {stats.criticalCases} Critical Case(s) Need Immediate Attention!
  </div>
)}
      <div style={styles.chartGrid}>

        {/* Monthly Trend */}
        <div style={styles.chartCard}>
          <h3>Monthly Complaints Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Crime Distribution */}
        <div style={styles.chartCard}>
          <h3>Crime Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.crimeDistribution}
                dataKey="count"
                nameKey="crimeType"
                outerRadius={100}
                label
              >
                {stats.crimeDistribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div style={styles.chartCard}>
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.statusDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </Layout>
  );
};

const styles = {
  title: {
    marginBottom: "30px",
    fontSize: "26px",
    fontWeight: "600"
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "30px"
  },
  chartCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
  },
  alertBox: {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "25px",
  fontWeight: "600",
  border: "1px solid #fecaca"
},
};

export default Dashboard;