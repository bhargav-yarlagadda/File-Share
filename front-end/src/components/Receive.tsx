"use client"

import React, { useState } from "react";
import { FaDownload, FaCheckCircle } from "react-icons/fa";

const Receive = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleReceiveFile = () => {
    
    if (!code) {
      setMessage("Please enter a valid code.");
      return;
    }

    // Simulating a successful file fetch
    setTimeout(() => {
      setMessage("File received successfully!");
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-8 tracking-wide">Receive File</h1>

      {/* Input Box */}
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your code"
        className="w-[300px] px-4 py-3 bg-gray-700 text-white text-lg rounded-lg shadow-md outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Receive Button */}
      <button
        onClick={handleReceiveFile}
        className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-all duration-300 hover:bg-green-700 hover:shadow-xl"
      >
        <FaDownload />
        Receive File
      </button>

      {/* Message Display */}
      {message && (
        <div className="mt-4 flex items-center gap-2 px-6 py-3 bg-gray-700 rounded-lg text-lg font-mono border border-green-400 shadow-md">
          <FaCheckCircle />
          <span className="text-green-200">{message}</span>
        </div>
      )}
    </div>
  );
};

export default Receive;
