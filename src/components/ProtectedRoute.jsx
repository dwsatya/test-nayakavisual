import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole"); // Ambil role dari storage
  const location = useLocation();

  // 1. Cek apakah sudah login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Cek jika rute butuh Admin, tapi yang login adalah User
  if (adminOnly && userRole !== "admin") {
    alert("Maaf, Anda tidak memiliki akses ke halaman Admin.");
    return <Navigate to="/client1" replace />; // Lempar balik ke halaman user
  }

  // Jika lolos semua pengecekan
  return children;
};

export default ProtectedRoute;