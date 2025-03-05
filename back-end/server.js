const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();

// Enable CORS for all origins (modify if needed)
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const activeSessions = {}; // Store active file-sharing sessions

wss.on("connection", (ws, req) => {
    console.log(`New WebSocket connection from ${req.socket.remoteAddress}`);

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);

            // Create a new session (sender)
            if (data.type === "create-session" && typeof data.code === "string") {
                activeSessions[data.code] = { sender: ws, receivers: [] };
                console.log(`Session created: ${data.code}`);
                ws.send(JSON.stringify({ status: "Session created" }));
            } 
            // Receiver joins a session
            else if (data.type === "join-session" && typeof data.code === "string") {
                const session = activeSessions[data.code];
                if (session) {
                    session.receivers.push(ws);
                    console.log(`Receiver joined session: ${data.code}`);
                    session.sender.send(JSON.stringify({ type: "receiver-joined" }));
                    ws.send(JSON.stringify({ status: "Connected to sender" }));
                } else {
                    console.log(`Invalid session code: ${data.code}`);
                    ws.send(JSON.stringify({ error: "Invalid Code" }));
                }
            } 
            // Relay WebRTC offer
            else if (data.type === "offer" && typeof data.code === "string") {
                const session = activeSessions[data.code];
                if (session && session.receivers.length > 0) {
                    console.log(`Relaying offer to ${session.receivers.length} receiver(s) for session: ${data.code}`);
                    session.receivers.forEach(receiver => {
                        receiver.send(JSON.stringify({ type: "offer", offer: data.offer }));
                    });
                } else {
                    console.log(`No receivers found for offer in session: ${data.code}`);
                    ws.send(JSON.stringify({ error: "No receivers available" }));
                }
            } 
            // Relay WebRTC answer
            else if (data.type === "answer" && typeof data.code === "string") {
                const session = activeSessions[data.code];
                if (session && session.sender) {
                    console.log(`Relaying answer to sender for session: ${data.code}`);
                    session.sender.send(JSON.stringify({ type: "answer", answer: data.answer }));
                } else {
                    console.log(`No sender found for answer in session: ${data.code}`);
                    ws.send(JSON.stringify({ error: "Session not found" }));
                }
            } 
            // Relay ICE candidates
            else if (data.type === "ice-candidate" && typeof data.code === "string") {
                const session = activeSessions[data.code];
                if (session) {
                    const target = data.fromSender ? session.receivers : [session.sender];
                    console.log(`Relaying ICE candidate to ${target.length} peer(s) for session: ${data.code}`);
                    target.forEach(peer => {
                        peer.send(JSON.stringify({ type: "ice-candidate", candidate: data.candidate }));
                    });
                } else {
                    console.log(`Session not found for ICE candidate: ${data.code}`);
                    ws.send(JSON.stringify({ error: "Session not found" }));
                }
            } 
            // Unknown message type
            else {
                console.log(`Unknown message type: ${data.type}`);
                ws.send(JSON.stringify({ error: "Unknown request type" }));
            }
        } catch (error) {
            console.error("Invalid message format:", error);
            ws.send(JSON.stringify({ error: "Invalid message format" }));
        }
    });

    // Handle disconnections
    ws.on("close", () => {
        Object.keys(activeSessions).forEach((key) => {
            const session = activeSessions[key];
            if (session.sender === ws) {
                console.log(`Session closed: ${key}`);
                session.receivers.forEach(receiver => {
                    receiver.send(JSON.stringify({ type: "session-closed" }));
                });
                delete activeSessions[key];
            } else {
                const index = session.receivers.indexOf(ws);
                if (index !== -1) {
                    session.receivers.splice(index, 1);
                    console.log(`Receiver left session: ${key}`);
                    if (session.sender) {
                        session.sender.send(JSON.stringify({ type: "receiver-left" }));
                    }
                }
            }
        });
    });

    ws.onerror = (error) => {
        console.log("WebSocket Error:", error);
    };
});

// Start server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));