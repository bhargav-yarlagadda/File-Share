"use client";

import React, { useState, useEffect } from "react";
import { FaDownload, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Receive = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const handleReceiveFile = () => {
    if (!code.trim()) {
      setMessage("Please enter a valid code.");
      return;
    }
  
    setLoading(true);
    setMessage("");
  
    if (socket) {
      socket.close();
    }
  
    const ws = new WebSocket("ws://localhost:5000");
  
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      
      // Send a join-session message first
      ws.send(JSON.stringify({ type: "join-session", code: code.trim() }));
  
      // Then request the file
    };
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "file-ready" && data.code === code.trim()) {
        setMessage("✅ File is ready to download!");
      } else if (data.type === "error") {
        setMessage("❌ Error: " + data.message);
      }
      setLoading(false);
    };
  
    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setMessage("❌ Failed to connect to server.");
      setLoading(false);
    };
  
    ws.onclose = () => console.log("WebSocket disconnected");
  
    setSocket(ws);
  };
  

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-4">
      <h1 className="text-5xl font-extrabold mb-6 tracking-wide bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        Secure File Transfer
      </h1>
      <p className="text-gray-400 text-lg mb-8 text-center max-w-md">
        Enter your unique code below to securely retrieve your file.
      </p>

      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 flex flex-col items-center w-full max-w-md">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter access code"
          className="w-full px-4 py-3 bg-transparent border border-gray-500 text-white text-lg rounded-lg outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400 transition-all"
        />

        <button
          onClick={handleReceiveFile}
          disabled={loading}
          className={`mt-4 w-full flex items-center justify-center gap-3 px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-300
            ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }
          `}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <>
              <FaDownload />
              Receive File
            </>
          )}
        </button>

        {message && (
          <div
            className={`mt-4 flex items-center gap-2 px-6 py-3 rounded-lg text-lg shadow-md transition-all
              ${
                message.includes("✅")
                  ? "bg-green-700/20 border border-green-500 text-green-300"
                  : "bg-red-700/20 border border-red-500 text-red-300"
              }
            `}
          >
            {message.includes("✅") ? <FaCheckCircle /> : <FaTimesCircle />}
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Receive;
