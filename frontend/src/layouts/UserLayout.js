import { useNavigate } from "react-router-dom";

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={{ color: "white" }}>User Portal</h2>

        <div style={styles.menu}>
          <button onClick={() => navigate("/user-dashboard")} style={styles.link}>
            Dashboard
          </button>

          <button onClick={() => navigate("/submit-complaint")} style={styles.link}>
            Submit Complaint
          </button>

          <button onClick={() => navigate("/my-complaints")} style={styles.link}>
            My Complaints
          </button>

          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.topbar}>
          <h3>Welcome, {user?.name}</h3>
        </div>

        <div style={styles.pageContent}>{children}</div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh"
  },
  sidebar: {
    width: "230px",
    background: "#111827",
    padding: "20px"
  },
  menu: {
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  link: {
    padding: "10px",
    background: "#1f2937",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    textAlign: "left"
  },
  logout: {
    padding: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "20px"
  },
  content: {
    flex: 1,
    background: "#f3f4f6",
    display: "flex",
    flexDirection: "column"
  },
  topbar: {
    background: "white",
    padding: "15px 30px",
    borderBottom: "1px solid #e5e7eb"
  },
  pageContent: {
    padding: "30px",
    overflowY: "auto"
  }
};

export default UserLayout;