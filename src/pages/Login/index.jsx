import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Ambil halaman asal jika ada (misal dari /admin), jika tidak ada set null
  const from = location.state?.from?.pathname || null;

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
        // Simpan data ke LocalStorage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userName", data.user.username);

        // LOGIK REDIRECT:
        // 1. Jika ada 'from', utamakan ke sana
        // 2. Jika tidak ada, cek role (Admin ke /admin, User ke /client1)
        let destination = from;
        if (!destination) {
          destination = data.user.role === "admin" ? "/admin" : "/client1";
        }

        console.log("Login Berhasil! Mengarah ke:", destination);
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
        <h2 style={{ textAlign: "center", color: "#333", marginBottom: 10 }}>Login</h2>
        <p style={{ textAlign: "center", fontSize: 12, color: "#666", marginTop: -10, marginBottom: 10 }}>
          Nayaka Visuals Portal
        </p>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

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
          Belum punya akun?{" "}
          <span 
            onClick={() => navigate("/register")} 
            style={{ color: "#800000", cursor: "pointer", fontWeight: "bold" }}
          >
            Daftar
          </span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" },
  card: { background: "white", padding: 32, borderRadius: 12, width: 350, display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" },
  input: { padding: "12px 15px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, outline: "none" },
  button: { padding: "12px", borderRadius: 8, border: "none", background: "#800000", color: "white", fontWeight: "600", fontSize: 16 },
  error: { color: "#d9534f", background: "#f9ebeb", padding: "10px", borderRadius: 6, fontSize: 13, textAlign: "center", border: "1px solid #d9534f" },
};