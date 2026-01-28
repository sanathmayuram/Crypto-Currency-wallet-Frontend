import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Home() {
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState(""); // 🔒 secret message
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchBalance();
  }, []);

  /* =========================
     FETCH BALANCE
     ========================= */
  const fetchBalance = async () => {
    try {
      const res = await api.post("/wallet/balance");
      setBalance(res.data.balance);
    } catch {
      setError("Failed to fetch balance");
    }
  };

  /* =========================
     SEND ENCRYPTED MESSAGE
     ========================= */
  const handleSend = async () => {
    setError("");
    setSuccess("");

    if (!receiverEmail || !amount || !message) {
      setError("All fields are required");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than zero");
      return;
    }

    if (Number(amount) > balance) {
      alert("❌ Insufficient balance");
      return;
    }

    if (!pin || pin.length < 4) {
      setError("Transaction PIN must be at least 4 digits");
      return;
    }

    setLoading(true);

    try {
      await api.post("/wallet/send", {
        receiverEmail,
        amount: Number(amount),
        pin,
        message, // 🔐 encrypted at backend
      });

      setSuccess("✅ Transaction successful & message encrypted");
      setReceiverEmail("");
      setAmount("");
      setPin("");
      setMessage("");
      fetchBalance();
    } catch (err) {
      setError(err.response?.data?.error || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        💰 Crypto Wallet
      </h2>

      {/* BALANCE */}
      <div className="bg-gray-800 p-4 rounded mb-6 text-center">
        <p className="text-gray-400">Wallet Balance</p>
        <h3 className="text-3xl font-bold text-green-400">
          {balance} Coins
        </h3>
      </div>

      {/* SEND FORM */}
      <div className="bg-gray-800 p-6 rounded max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-center">
          🔐 Send Encrypted Message
        </h3>

        <input
          type="email"
          placeholder="Receiver Email"
          className="w-full p-3 mb-3 rounded bg-gray-700 text-white"
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          className="w-full p-3 mb-3 rounded bg-gray-700 text-white"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="password"
          placeholder="Transaction PIN"
          className="w-full p-3 mb-3 rounded bg-gray-700 text-white"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        {/* 🔒 SECRET MESSAGE INPUT */}
        <textarea
          placeholder="Secret Message (will be encrypted)"
          className="w-full p-3 mb-3 rounded bg-gray-700 text-white"
          rows="3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-2">{success}</p>}

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <button
            onClick={handleSend}
            className="w-full bg-blue-500 hover:bg-blue-600 text-black font-bold py-3 rounded"
          >
            Send Securely
          </button>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="max-w-md mx-auto mt-6 space-y-3">
        <button
          onClick={() => navigate("/history")}
          className="w-full bg-purple-500 py-2 rounded"
        >
          📜 Transaction History
        </button>

        <button
          onClick={() => navigate("/blockchain")}
          className="w-full bg-indigo-500 py-2 rounded"
        >
          ⛓️ View Blockchain
        </button>
      </div>
    </div>
  );
}
