import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      // Call login API (OTP will be sent)
      await api.post("/auth/login", {
        email,
        password,
      });

      // Save email for OTP page
      localStorage.setItem("email", email);

      // Go to OTP verification page
      navigate("/otp");
    } catch (err) {
      setError(
        err.response?.data?.error || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl w-[380px] shadow-lg">
        <h2 className="text-2xl text-white font-bold text-center mb-6">
          🔐 Login
        </h2>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* BUTTON / LOADER */}
        {loading ? (
          <div className="flex justify-center my-4">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-black font-bold py-3 rounded transition"
          >
            Login
          </button>
        )}

        {/* REGISTER LINK */}
        <p className="text-center text-gray-400 text-sm mt-4">
          New user?{" "}
          <span
            className="text-green-400 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}
