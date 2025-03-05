"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaDownload, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Receive = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileReady, setFileReady] = useState(false); // Tracks if file is ready to download
  const socketRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const fileBufferRef = useRef<ArrayBuffer[]>([]);
  const fileNameRef = useRef<string>("downloaded_file");

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        console.log("Cleaning up: Closing WebSocket");
        socketRef.current.close();
      }
      if (pcRef.current) {
        console.log("Cleaning up: Closing RTCPeerConnection");
        pcRef.current.close();
      }
    };
  }, []);

  const handleReceiveFile = () => {
    if (!code.trim()) {
      setMessage("Please enter a valid code.");
      return;
    }

    setLoading(true);
    setMessage("");
    setFileReady(false); // Reset file ready state
    fileBufferRef.current = []; // Reset file buffer

    if (socketRef.current) {
      console.log("Closing previous WebSocket connection");
      socketRef.current.close();
    }

    const ws = new WebSocket("ws://localhost:5000");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      console.log(`Sending join-session for code: ${code.trim()}`);
      ws.send(JSON.stringify({ type: "join-session", code: code.trim() }));
      setupWebRTC(code.trim(), ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received WebSocket message:", data);
      if (data.error) {
        setMessage("❌ Error: " + data.error);
        setLoading(false);
      } else if (data.type === "session-closed") {
        setMessage("❌ Session closed by sender.");
        setLoading(false);
      } else {
        handleSignalingMessage(data, ws);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setMessage("❌ Failed to connect to server.");
      setLoading(false);
    };

    ws.onclose = () => console.log("WebSocket disconnected");
  };

  const setupWebRTC = (sessionCode: string, ws: WebSocket) => {
    console.log("Setting up WebRTC for session:", sessionCode);
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Generated ICE candidate:", event.candidate);
        ws.send(
          JSON.stringify({
            type: "ice-candidate",
            code: sessionCode,
            candidate: event.candidate,
            fromSender: false,
          })
        );
      } else {
        console.log("ICE candidate gathering complete");
      }
    };

    pc.ondatachannel = (event) => {
      console.log("Data channel received from sender");
      const dataChannel = event.channel;
      dataChannel.onmessage = (event) => {
        if (typeof event.data === "string") {
          const message = JSON.parse(event.data);
          console.log("Received data channel message:", message);
          if (message.type === "file-complete") {
            console.log("File transfer complete, ready for download");
            setMessage("✅ File received! Click Download to save.");
            setFileReady(true);
            setLoading(false);
          }
        } else {
          console.log("Received file chunk, size:", event.data.byteLength);
          fileBufferRef.current.push(event.data);
        }
      };
      dataChannel.onopen = () => console.log("Data channel opened");
      dataChannel.onclose = () => console.log("Data channel closed");
      dataChannel.onerror = (error) => console.error("Data channel error:", error);
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", pc.iceConnectionState);
      if (pc.iceConnectionState === "failed") {
        console.error("ICE connection failed");
        setMessage("❌ Connection failed.");
        setLoading(false);
      }
    };
  };

  const handleSignalingMessage = async (data: any, ws: WebSocket) => {
    console.log("Handling signaling message:", data);
    const pc = pcRef.current;
    if (!pc) {
      console.log("No RTCPeerConnection available yet");
      return;
    }

    if (data.type === "offer") {
      try {
        console.log("Received offer, setting remote description...");
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        console.log("Creating answer...");
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log("Answer created and set as local description:", answer);
        ws.send(JSON.stringify({ type: "answer", code: code.trim(), answer }));
        console.log("Answer sent to server");
      } catch (error) {
        console.error("Error handling offer:", error);
        setMessage("❌ Failed to process offer.");
        setLoading(false);
      }
    } else if (data.type === "ice-candidate") {
      console.log("Received ICE candidate:", data.candidate);
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      console.log("ICE candidate added successfully");
    }
  };

  const saveFile = () => {
    console.log("Saving file with", fileBufferRef.current.length, "chunks");
    const blob = new Blob(fileBufferRef.current);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileNameRef.current;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setFileReady(false); // Reset after download
    setMessage("✅ File downloaded successfully!");
  };

  const handleDownload = () => {
    if (fileReady) {
      saveFile();
    }
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

        {fileReady && (
          <button
            onClick={handleDownload}
            className="mt-4 w-full flex items-center justify-center gap-3 px-6 py-3 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300"
          >
            <FaDownload />
            Download
          </button>
        )}

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