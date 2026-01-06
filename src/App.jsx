import { Routes, Route, Link } from "react-router-dom";
import Client1 from "./pages/client1";
import Client2 from "./pages/client2";
import Login from "./pages/Login";

function App() {
  return (
    <div className="App">
      {/* NAVBAR */}
      <nav style={{ padding: 16 }}>
        <Link to="/" style={{ marginRight: 12 }}>Client 1</Link>
        <Link to="/client2">Client 2</Link>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Client1 />} />
        <Route path="/client2" element={<Client2 />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
