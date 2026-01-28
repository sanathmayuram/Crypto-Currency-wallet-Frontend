import { useEffect, useState } from "react";

export default function Blockchain() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    // Dummy blockchain data (for CNS + exam demo)
    const demoChain = [
      {
        index: 1,
        timestamp: new Date().toLocaleString(),
        data: "Genesis Block",
        hash: "0000abcd1234",
        prevHash: "0000",
      },
      {
        index: 2,
        timestamp: new Date().toLocaleString(),
        data: "Encrypted Transaction Block",
        hash: "0000efgh5678",
        prevHash: "0000abcd1234",
      },
    ];

    setBlocks(demoChain);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        ⛓️ Blockchain Ledger
      </h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {blocks.map((block) => (
          <div
            key={block.index}
            className="bg-gray-800 p-4 rounded border border-indigo-500"
          >
            <p><b>Block #:</b> {block.index}</p>
            <p><b>Timestamp:</b> {block.timestamp}</p>
            <p className="break-all">
              <b>Data:</b> {block.data}
            </p>
            <p className="break-all text-green-400">
              <b>Hash:</b> {block.hash}
            </p>
            <p className="break-all text-yellow-400">
              <b>Previous Hash:</b> {block.prevHash}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
