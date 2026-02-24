import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password }
      );

      const { token, user } = res.data;

      // Store token and user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Role-based redirect
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/user-dashboard");
      }

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: "15px" }}>
        New user?{" "}
        <span
          style={styles.link}
          onClick={() => navigate("/user-register")}
        >
          Register here
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
  link: {
    color: "blue",
    cursor: "pointer",
    textDecoration: "underline"
  }
};

export default Login;