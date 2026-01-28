import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Otp from "./pages/Otp";
import Home from "./pages/Home";
import History from "./pages/History";
import Blockchain from "./pages/BlockChain";

/* =========================
   PROTECTED ROUTE WRAPPER
   ========================= */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<Otp />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      <Route
        path="/blockchain"
        element={
          <ProtectedRoute>
            <Blockchain />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
