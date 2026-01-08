import { Routes, Route, Navigate } from "react-router-dom";
import Client1 from "./pages/Client1";
import Client2 from "./pages/Client2";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/DashboardAdmin";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* --- ROUTE PUBLIK --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- ROUTE ADMIN (Hanya Bisa Diakses Admin) --- */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}> {/* <--- Tambahkan prop ini */}
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* --- ROUTE TERPROTEKSI (User & Admin Bisa Akses) --- */}
        <Route 
          path="/client1" 
          element={
            <ProtectedRoute>
              <Client1 />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/client2" 
          element={
            <ProtectedRoute>
              <Client2 />
            </ProtectedRoute>
          } 
        />

        {/* --- REDIRECT LOGIC --- */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;