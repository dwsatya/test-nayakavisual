import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleBantuan = () => {
    const phoneNumber = import.meta.env.VITE_WA_NUMBER;
    const message = encodeURIComponent("Halo kak, aku terkendala dalam login sistem, mohon bantuannya!");
    
    if (phoneNumber) {
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    } else {
      console.error("Nomor WhatsApp tidak ditemukan di .env");
      alert("Layanan bantuan sedang tidak tersedia.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://famous-michaelina-nayakavisual-62f8d376.koyeb.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userName", data.user.username);

        let destination = from;
        if (!destination) {
          destination = data.user.role === "admin" ? "/admin" : "/client1";
        }
        navigate(destination, { replace: true });
      } else {
        setError(data.message || "Username atau password salah");
      }
    } catch (err) {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <p style={styles.subtitle}>NayakaVisuals</p>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />

        <div style={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.inputPassword}
            required
          />
          <span 
            onClick={() => setShowPassword(!showPassword)} 
            style={styles.toggleText}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button 
          type="submit" 
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
          disabled={loading}
        >
          {loading ? "Proses Masuk..." : "Login"}
        </button>

        <p style={{ textAlign: "center", fontSize: 14, marginTop: 10 }}>
          Terkendala untuk masuk?{" "}
          <span 
            onClick={handleBantuan}
            style={{ color: "#800000", cursor: "pointer", fontWeight: "bold" }}
          >
            Bantuan
          </span>
        </p>
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
  },
  card: { background: "rgba(255, 255, 255, 0.95)", padding: 32, borderRadius: 12, width: 350, display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", color: "#800000", marginBottom: 10, fontFamily: "poppins", fontSize: 24, fontWeight: "bold" },
  subtitle: { textAlign: "center", fontSize: 14, color: "#666", marginTop: -20, marginBottom: 10 },
  input: { padding: "12px 15px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, outline: "none" },
  
  passwordWrapper: { position: "relative", display: "flex", alignItems: "center" },
  inputPassword: { padding: "12px 60px 12px 15px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" },
  toggleText: { 
    position: "absolute", 
    right: 15, 
    cursor: "pointer", 
    fontSize: 12, 
    fontWeight: "600", 
    color: "#666", 
    userSelect: "none",
    textTransform: "uppercase"
  },
  
  button: { padding: "12px", borderRadius: 8, border: "none", background: "#800000", color: "white", fontWeight: "600", fontSize: 16 },
  error: { color: "#d9534f", background: "#f9ebeb", padding: "10px", borderRadius: 6, fontSize: 13, textAlign: "center", border: "1px solid #d9534f" },
};