require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const Session = require("./models/Session"); 
const Poll = require("./models/Poll"); 

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

/* =======================
      SESSION ROUTES
   ======================= */

// Create a Session
app.post("/create-session", async (req, res) => {
  try {
    let sessionCode, sessionExists;

    do {
      sessionCode = Math.floor(100000 + Math.random() * 900000).toString();
      sessionExists = await Session.findOne({ sessionCode });
    } while (sessionExists);

    const newSession = new Session({ sessionCode, polls: [] });
    await newSession.save();

    console.log("✅ Session Created:", newSession);
    res.status(201).json(newSession);
  } catch (error) {
    console.error("❌ Error creating session:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
});

// Join a Session
app.get("/session/:sessionCode", async (req, res) => {
  try {
    const { sessionCode } = req.params;
    const session = await Session.findOne({ sessionCode }).populate("polls");

    if (!session) return res.status(404).json({ error: "Session not found" });

    res.json(session);
  } catch (error) {
    console.error("❌ Error fetching session:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
});

/* =======================
      POLL ROUTES
   ======================= */

// Create a Poll inside a Session
app.post("/session/:sessionCode/create-poll", async (req, res) => {
  try {
    const { sessionCode } = req.params;
    const { question, type, options } = req.body;

    const session = await Session.findOne({ sessionCode });
    if (!session) return res.status(404).json({ error: "Session not found" });

    const newPoll = new Poll({
      sessionId: session._id,
      accessCode: sessionCode,
      question,
      type,
      options,
      results: {}
    });

    await newPoll.save();
    session.polls.push(newPoll._id);
    await session.save();

    console.log("✅ Poll Added to Session:", newPoll);

    // Notify users in the session
    broadcastToRoom(
      sessionCode,
      JSON.stringify({ event: "newPoll", data: newPoll })
    );

    res.status(201).json(newPoll);
  } catch (error) {
    console.error("❌ Error creating poll:", error);
    res.status(500).json({ error: "Failed to create poll" });
  }
});

// Vote on a Poll
app.post("/poll/:pollId/vote", async (req, res) => {
  try {
    const { pollId } = req.params;
    const { option } = req.body;

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    poll.results[option] = (poll.results[option] || 0) + 1;
    await poll.save();

    console.log(`📢 Broadcasting updated results for poll ${pollId}`);

    // Broadcast updated results to session
    broadcastToRoom(
      poll.accessCode,
      JSON.stringify({
        event: "updateResults",
        data: { pollId, results: poll.results }
      })
    );

    res.json({ message: "Vote recorded", results: poll.results });
  } catch (error) {
    console.error("❌ Error voting:", error);
    res.status(500).json({ error: "Failed to record vote" });
  }
});

/* =======================
      WEBSOCKET EVENTS
   ======================= */

const rooms = new Map();

wss.on("connection", (ws) => {
  console.log("🔌 A user connected");

  ws.isAlive = true;
  ws.on("pong", () => (ws.isAlive = true));

  ws.on("message", async (message) => {
    try {
      const { event, data } = JSON.parse(message);

      if (event === "joinSession") {
        const session = await Session.findOne({ sessionCode: data });
        if (session) {
          if (!rooms.has(data)) rooms.set(data, new Set());
          rooms.get(data).add(ws);
          console.log(`🚀 User joined session: ${data}`);
          ws.send(
            JSON.stringify({
              event: "sessionJoined",
              data: `Successfully joined session ${data}`
            })
          );
        } else {
          ws.send(
            JSON.stringify({ event: "sessionError", data: "Session not found" })
          );
        }
      }
      
      // Vote on a Poll
if (event === "vote") {
  try {
    const { pollId, option } = data;
    console.log(`📩 Received vote for Poll ID: ${pollId}, Option: ${option}`);

    const poll = await Poll.findById(pollId);
    if (!poll) {
      console.error(`❌ Poll with ID ${pollId} not found`);
      ws.send(JSON.stringify({ event: "voteError", data: "Poll not found" }));
      return;
    }

    // Increment vote count
    poll.results[option] = (poll.results[option] || 0) + 1;
    await poll.save();

    console.log(`📊 Updated results for Poll ID: ${pollId}`, poll.results);

    // ✅ Send updated results back to all WebSocket clients in the session
    broadcastToRoom(poll.accessCode, JSON.stringify({
      event: "updateResults",
      data: { pollId, results: poll.results }
    }));

    // ✅ Send confirmation to the voter
    ws.send(JSON.stringify({ event: "voteSuccess", data: `Vote recorded for ${option}` }));

  } catch (error) {
    console.error("❌ Error handling vote:", error);
    ws.send(JSON.stringify({ event: "voteError", data: "Failed to process vote" }));
  }
}


    } catch (error) {
      console.error("❌ WebSocket Error:", error);
    }
  });

  ws.on("close", () => {
    console.log("🔌 User disconnected");
    rooms.forEach((clients, sessionCode) => {
      clients.delete(ws);
      if (clients.size === 0) rooms.delete(sessionCode);
    });
  });
});

setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

function broadcastToRoom(sessionCode, message) {
  if (rooms.has(sessionCode)) {
    rooms.get(sessionCode).forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
