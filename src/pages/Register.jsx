import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");            // ✅ PIN state
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !pin) {
      setError("All fields are required");
      return;
    }

    if (pin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        email,
        password,
        pin,            // ✅ PIN sent to backend
      });

      setMessage(res.data.message);
      setError("");
      setTimeout(() => navigate("/"), 1500); // Login page
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl w-[380px] shadow-lg">
        <h2 className="text-2xl text-white font-bold text-center mb-6">
          📝 Register
        </h2>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* TRANSACTION PIN */}
        <input
          type="password"
          placeholder="Transaction PIN (4 digits)"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        {message && <p className="text-green-400 text-sm mb-3">{message}</p>}

        <button
          onClick={handleRegister}
          className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded"
        >
          Create Account
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
