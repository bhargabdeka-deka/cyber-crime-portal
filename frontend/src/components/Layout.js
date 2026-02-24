import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={{ color: "white" }}>Cyber Admin</h2>

        <div style={styles.menu}>
          <button style={styles.link} onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button style={styles.link} onClick={() => navigate("/complaints")}>
            Complaints
          </button>

          <button
            style={styles.logout}
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
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
    minHeight: "100vh",
    fontFamily: "Segoe UI"
  },
  sidebar: {
    width: "230px",
    background: "#111827",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
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

export default Layout;