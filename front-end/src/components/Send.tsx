"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FaFileUpload,
  FaCode,
  FaClipboard,
  FaTrash,
  FaPaperPlane,
} from "react-icons/fa";
import ShowRecipients from "./ShowReceiptants";

const Send = () => {
  const [code, setCode] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [receiverJoined, setReceiverJoined] = useState(false);
  const [receivers, setReceivers] = useState<
    { id: number; joinedAt: string }[]
  >([]); // Track receivers
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  const generateCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let newCode = "";
    for (let i = 0; i < 9; i++) {
      if (i > 0 && i % 3 === 0) newCode += "-";
      newCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setCode(newCode);
    setReceiverJoined(false);
    setReceivers([]); // Reset receivers list

    if (socketRef.current) {
      console.log("Closing previous WebSocket connection");
      socketRef.current.close();
    }

    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      console.log(`Sending create-session for code: ${newCode}`);
      ws.send(JSON.stringify({ type: "create-session", code: newCode }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received WebSocket message:", message);
      handleSignalingMessage(message, ws);
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => console.log("WebSocket Closed");

    socketRef.current = ws;
  };

  const setupWebRTC = (sessionCode: string, ws: WebSocket) => {
    console.log("Setting up WebRTC for session:", sessionCode);
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    const dataChannel = pc.createDataChannel("fileTransfer");
    dataChannelRef.current = dataChannel;

    dataChannel.onopen = () => {
      console.log("Data channel opened");
      if (file) sendFile(file, dataChannel);
    };
    dataChannel.onclose = () => console.log("Data channel closed");
    dataChannel.onerror = (error) =>
      console.error("Data channel error:", error);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Generated ICE candidate:", event.candidate);
        ws.send(
          JSON.stringify({
            type: "ice-candidate",
            code: sessionCode,
            candidate: event.candidate,
            fromSender: true,
          })
        );
      } else {
        console.log("ICE candidate gathering complete");
      }
    };

    pc.onnegotiationneeded = async () => {
      try {
        console.log("Negotiation needed, creating offer...");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log("Offer created and set as local description:", offer);
        ws.send(JSON.stringify({ type: "offer", code: sessionCode, offer }));
        console.log("Offer sent to server");
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", pc.iceConnectionState);
      if (pc.iceConnectionState === "failed") {
        console.error("ICE connection failed");
      }
    };
  };

  const handleSignalingMessage = async (message: any, ws: WebSocket) => {
    console.log("Handling signaling message:", message);
    const pc = pcRef.current;

    if (message.type === "receiver-joined") {
      console.log("Receiver joined, ready to send file");
      setReceiverJoined(true);
      // Add new receiver to the list
      setReceivers((prev) => [
        ...prev,
        { id: message.receiverId, joinedAt: new Date().toLocaleTimeString() },
      ]);
    } else if (message.type === "answer" && pc) {
      console.log("Received answer, setting remote description...");
      await pc.setRemoteDescription(new RTCSessionDescription(message.answer));
      console.log("Remote description set successfully");
    } else if (message.type === "ice-candidate" && pc) {
      console.log("Received ICE candidate:", message.candidate);
      await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
      console.log("ICE candidate added successfully");
    }
  };

  const handleSendFile = () => {
    if (!file) {
      console.log("No file selected to send");
      return;
    }
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not connected");
      return;
    }
    console.log("Initiating file send...");
    setupWebRTC(code, socketRef.current);
  };

  const sendFile = (file: File, dataChannel: RTCDataChannel) => {
    console.log("Starting file transfer:", file.name);
    const chunkSize = 16384; // 16KB chunks
    const reader = new FileReader();
    let offset = 0;

    reader.onload = (event) => {
      if (event.target?.result) {
        console.log(`Sending file chunk at offset: ${offset}`);
        dataChannel.send(event.target.result as ArrayBuffer);
        offset += chunkSize;
        if (offset < file.size) {
          readSlice(offset);
        } else {
          console.log("File transfer complete");
          dataChannel.send(JSON.stringify({ type: "file-complete" }));
        }
      }
    };

    const readSlice = (start: number) => {
      const slice = file.slice(start, start + chunkSize);
      reader.readAsArrayBuffer(slice);
    };

    readSlice(0);
  };

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
      if (dataChannelRef.current) {
        console.log("Cleaning up: Closing RTCDataChannel");
        dataChannelRef.current.close();
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
    <div className="w-full min-h-screen flex pt-16 lg:pt-8 flex-col items-center justify-center bg-gray-900 text-white relative overflow-hidden">
      <h1 className="text-5xl font-extrabold mb-6 z-10 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
        Upload & Share
      </h1>
      <div className="flex flex-col-reverse justify-center items-center lg:flex-row  md:items-start  gap-6 w-full px-20">
        {
          <div className="w-full flex justify-center  lg:w-1/3 flex-shrink-0">
            <ShowRecipients receivers={receivers} />
          </div>
        }
        <div className="w-full lg:w-2/3 flex flex-col items-center">
          <div
            className="relative bg-[#B2A5FF] backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl flex flex-col items-center justify-center h-[300px] max-w-[500px] w-full mx-auto cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 z-10"
            onClick={handleUploadClick}
          >
            <span className="text-blue-100 text-2xl">
              <FaFileUpload />
            </span>
            <span className="font-thin text-lg tracking-wide text-gray-800 truncate max-w-[200px]">
              {file
                ? file.name.substring(0, 30) + "..."
                : "Click to Upload File"}
            </span>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
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
            {file && receiverJoined && (
              <button
                onClick={handleSendFile}
                className="px-6 py-3 bg-green-500 cursor-pointer text-white font-bold rounded-lg flex items-center gap-2 transition-all duration-300 hover:bg-green-600 shadow-md hover:shadow-xl"
              >
                <FaPaperPlane /> Send File
              </button>
            )}
          </div>
          {code && (
            <div className="mt-6 flex items-center gap-4 px-6 py-4 bg-gray-800/80 backdrop-blur-lg rounded-lg text-lg font-mono tracking-widest border border-blue-400 shadow-lg">
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
      </div>
    </div>
  );
};

export default Send;
