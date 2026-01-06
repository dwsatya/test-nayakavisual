import { Routes, Route } from "react-router-dom";
import Client1 from "./pages/client1/index.jsx";
import Client2 from "./pages/client2/index.jsx";
import Login from "./pages/Login/index.jsx";

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/client1" element={<Client1 />} />
        <Route path="/client2" element={<Client2 />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
