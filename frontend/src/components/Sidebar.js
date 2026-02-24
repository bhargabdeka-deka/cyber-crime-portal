import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.sidebar}>
      <h2 style={{ color: "white" }}>Cyber Admin</h2>

      <button style={styles.button} onClick={() => navigate("/dashboard")}>
        Dashboard
      </button>

      <button style={styles.button} onClick={() => navigate("/complaints")}>
        Complaints
      </button>

      <button
        style={{ ...styles.button, marginTop: "auto", background: "#e74c3c" }}
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#1e293b",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    position: "fixed"
  },
  button: {
    marginTop: "15px",
    padding: "10px",
    background: "#334155",
    color: "white",
    border: "none",
    cursor: "pointer",
    textAlign: "left"
  }
};

export default Sidebar;
