import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function OTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl w-[360px]">
        <h2 className="text-xl font-bold text-center mb-4">OTP Verification</h2>

        <input
          className="w-full p-3 rounded bg-gray-700 mb-4"
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
        />

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <button
            onClick={handleVerify}
            className="w-full bg-blue-500 py-2 rounded font-bold"
          >
            Verify OTP
          </button>
        )}

        {error && <p className="text-red-400 mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}
