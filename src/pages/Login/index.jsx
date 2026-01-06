import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ENV_USERNAME = import.meta.env.VITE_LOGIN_USERNAME;
const ENV_PASSWORD = import.meta.env.VITE_LOGIN_PASSWORD;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === ENV_USERNAME && password === ENV_PASSWORD) {
      navigate("/dashboard");
    } else {
      setError("Username atau password salah");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
  },
  card: {
    background: "white",
    padding: 24,
    borderRadius: 10,
    width: 320,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    padding: 10,
    borderRadius: 6,
    border: "none",
    background: "#800000",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: 14,
  },
};
