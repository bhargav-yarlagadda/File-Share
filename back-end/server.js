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
    console.log(activeSessions)
    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            
            // ✅ Create a new session (sender)
            if (data.type === "create-session" && typeof data.code === "string") {
                activeSessions[data.code] = { sender: ws, receivers: [] };
                console.log(`Session created: ${data.code}`);
                ws.send(JSON.stringify({ status: "Session created" }));
            } 
            
            // ✅ Receiver joins a session
            else if (data.type === "join-session" && typeof data.code === "string") {
                const session = activeSessions[data.code];

                if (session) {
                    session.receivers.push(ws); // Store receiver
                    console.log(`Receiver joined session: ${data.code}`);

                    // Notify sender that a receiver has joined
                    session.sender.send(JSON.stringify({ type: "receiver-joined" }));
                    ws.send(JSON.stringify({ status: "Connected to sender" }));
                } else {
                    ws.send(JSON.stringify({ error: "Invalid Code" }));
                }
            } 
            
            // ✅ Unknown message type
            else {
                ws.send(JSON.stringify({ error: "Unknown request type" }));
            }
        } catch (error) {
            console.error("Invalid message format:", error);
            ws.send(JSON.stringify({ error: "Invalid message format" }));
        }
    });

    // ✅ Handle disconnections
    ws.on("close", () => {
        Object.keys(activeSessions).forEach((key) => {
            const session = activeSessions[key];

            // If the sender disconnects, remove the session
            if (session.sender === ws) {
                console.log(`Session closed: ${key}`);
                delete activeSessions[key];
            } 
            
            // If a receiver disconnects, remove it from the list
            else {
                const index = session.receivers.indexOf(ws);
                if (index !== -1) {
                    session.receivers.splice(index, 1);
                    console.log(`Receiver left session: ${key}`);

                    // Notify sender that a receiver left
                    session.sender.send(JSON.stringify({ type: "receiver-left" }));
                }
            }
        });
    });

    ws.onerror = (error) => {
        console.log("WebSocket Error:", error);
    };
});

// ✅ Start server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
