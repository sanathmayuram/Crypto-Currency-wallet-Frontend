import { useEffect, useState } from "react";
import api from "../api";

export default function History() {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [decryptLoading, setDecryptLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  /* =========================
     FETCH HISTORY
     ========================= */
  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/history");
      setSent(res.data.sent || []);
      setReceived(res.data.received || []);
    } catch {
      setError("Failed to fetch transaction history");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     REQUEST OTP
     ========================= */
  const requestDecryptOtp = async () => {
    setOtpLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/history/request-decrypt-otp");
      setSuccess(res.data.message || "OTP sent to your email");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  /* =========================
     DECRYPT TRANSACTION
     ========================= */
  const decryptTransaction = async (txId) => {
    const otp = prompt("Enter OTP sent to your email");
    if (!otp) return;

    setDecryptLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/history/decrypt", {
        transactionId: txId,
        otp,
      });

      alert(
        "🔓 Decrypted Details\n\n" +
          "Amount: " +
          res.data.amount +
          "\nMessage: " +
          res.data.message
      );
    } catch (err) {
      setError(err.response?.data?.error || "Decryption failed");
    } finally {
      setDecryptLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        📜 Transaction History
      </h2>

      {/* STATUS */}
      {loading && (
        <div className="flex justify-center mb-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-center mb-4">{error}</p>
      )}
      {success && (
        <p className="text-green-400 text-center mb-4">{success}</p>
      )}

      {/* OTP BUTTON */}
      <div className="max-w-md mx-auto mb-8">
        <button
          onClick={requestDecryptOtp}
          disabled={otpLoading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded"
        >
          {otpLoading
            ? "Sending OTP..."
            : "🔐 Request OTP for Decryption"}
        </button>
      </div>

      {/* SENT TRANSACTIONS */}
      <div className="max-w-3xl mx-auto mb-10">
        <h3 className="text-xl font-semibold mb-4 text-red-400">
          ⬆ Sent Transactions
        </h3>

        {sent.length === 0 && (
          <p className="text-gray-400">No sent transactions</p>
        )}

        {sent.map((tx) => (
          <div
            key={tx._id}
            className="bg-gray-800 p-4 rounded mb-4 border border-red-500"
          >
            <p className="text-sm">
              <b>To:</b> {tx.receiverEmail}
            </p>

            <p className="text-xs text-yellow-400 break-all mt-1">
              <b>Encrypted Amount:</b> {tx.encryptedAmount}
            </p>

            <p className="text-xs text-yellow-400 break-all mt-1">
              <b>Encrypted Message:</b> {tx.encryptedMessage}
            </p>

            <button
              onClick={() => decryptTransaction(tx._id)}
              disabled={decryptLoading}
              className="mt-3 bg-green-500 hover:bg-green-600 text-black px-4 py-1 rounded"
            >
              {decryptLoading ? "Decrypting..." : "🔓 Decrypt"}
            </button>
          </div>
        ))}
      </div>

      {/* RECEIVED TRANSACTIONS */}
      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-green-400">
          ⬇ Received Transactions
        </h3>

        {received.length === 0 && (
          <p className="text-gray-400">No received transactions</p>
        )}

        {received.map((tx) => (
          <div
            key={tx._id}
            className="bg-gray-800 p-4 rounded mb-4 border border-green-500"
          >
            <p className="text-sm">
              <b>From:</b> {tx.senderEmail}
            </p>

            <p className="text-xs text-yellow-400 break-all mt-1">
              <b>Encrypted Amount:</b> {tx.encryptedAmount}
            </p>

            <p className="text-xs text-yellow-400 break-all mt-1">
              <b>Encrypted Message:</b> {tx.encryptedMessage}
            </p>

            <button
              onClick={() => decryptTransaction(tx._id)}
              disabled={decryptLoading}
              className="mt-3 bg-green-500 hover:bg-green-600 text-black px-4 py-1 rounded"
            >
              {decryptLoading ? "Decrypting..." : "🔓 Decrypt"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
