import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";   // ✅ Use central API

function UserRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await API.post("/users/register", formData);

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div style={styles.container}>
      <h2>User Registration</h2>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Already have an account?{" "}
        <span
          style={styles.link}
          onClick={() => navigate("/")}
        >
          Login here
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "300px"
  },
  error: {
    color: "red"
  },
  success: {
    color: "green"
  },
  link: {
    color: "blue",
    cursor: "pointer",
    textDecoration: "underline"
  }
};

export default UserRegister;
