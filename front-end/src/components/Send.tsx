"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaFileUpload, FaCode, FaClipboard, FaTrash } from "react-icons/fa";

const Send = () => {
  const [code, setCode] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const generateCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let newCode = "";
    for (let i = 0; i < 9; i++) {
      if (i > 0 && i % 3 === 0) newCode += "-";
      newCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCode(newCode);

    if (socketRef.current) {
      socketRef.current.close();
    }

    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      ws.send(JSON.stringify({ type: "create-session", code: newCode }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received:", message);
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => console.log("WebSocket Closed");

    socketRef.current = ws;
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const handleFileChange = () => {
    if (fileInputRef.current?.files?.[0]) {
      setFile(fileInputRef.current.files[0]);
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleCopyCode = () => {
    if (code) navigator.clipboard.writeText(code);
  };

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative overflow-hidden">
      <h1 className="text-5xl font-extrabold mb-6 z-10 drop-shadow-lg">
        Upload & Share
      </h1>

      {/* File Upload Box */}
      <div
        className="relative bg-[#B2A5FF] backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl flex flex-col items-center justify-center h-[300px] max-w-[500px] w-full mx-auto cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 z-10"
        onClick={handleUploadClick}
      >
        <span className="text-blue-100 text-2xl"><FaFileUpload /></span>
        <span className="font-thin text-lg tracking-wide text-gray-800 truncate max-w-[200px]">
          {file ? file.name.substring(0, 30) + "..." : "Click to Upload File"}
        </span>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* File Actions */}
      <div className="flex items-center justify-center gap-4 mt-6 z-10">
        {file && (
          <button
            onClick={handleClearFile}
            className="px-6 py-3 cursor-pointer bg-red-500 text-white font-bold rounded-lg flex items-center gap-2 transition-all duration-300 hover:bg-red-600 shadow-md hover:shadow-xl"
          >
            <FaTrash /> Clear File
          </button>
        )}

        <button
          onClick={generateCode}
          className="px-6 py-3 bg-blue-500 cursor-pointer text-white font-bold rounded-lg flex items-center gap-2 transition-all duration-300 hover:bg-blue-600 shadow-md hover:shadow-xl"
        >
          <FaCode /> Generate Code
        </button>
      </div>

      {/* Generated Code Display */}
      {code && (
        <div className="mt-6 flex items-center gap-4 px-6 py-4 bg-gray-900/80 backdrop-blur-lg rounded-lg text-lg font-mono tracking-widest border border-blue-400 shadow-lg">
          <FaCode />
          <span className="text-blue-200">{code}</span>
          <button
            onClick={handleCopyCode}
            className="p-2 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-600 transition-all duration-300"
          >
            <FaClipboard />
          </button>
        </div>
      )}
    </div>
  );
};

export default Send;
