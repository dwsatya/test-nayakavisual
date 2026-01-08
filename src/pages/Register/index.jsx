import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          role: "user" // Default role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registrasi Berhasil! Silakan Login.");
        navigate("/login"); // Pindah ke login setelah sukses
      } else {
        setError(data.message || "Gagal mendaftar");
      }
    } catch (err) {
      setError("Server tidak merespon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.card}>
        <h2 style={{ textAlign: "center", color: "#333" }}>Buat Akun</h2>
        
        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          style={styles.input}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Mendaftarkan..." : "Daftar"}
        </button>

        <p style={{ textAlign: "center", fontSize: 14 }}>
          Sudah punya akun?{" "}
          <span onClick={() => navigate("/login")} style={{ color: "#800000", cursor: "pointer", fontWeight: "bold" }}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

// Gunakan styles yang sama dengan Login agar konsisten
const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" },
  card: { background: "white", padding: 32, borderRadius: 12, width: 350, display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" },
  input: { padding: "12px 15px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 },
  button: { padding: "12px", borderRadius: 8, border: "none", background: "#800000", color: "white", fontWeight: "600", cursor: "pointer" },
  error: { color: "red", background: "#fee", padding: 10, borderRadius: 6, textAlign: "center", fontSize: 13 }
};