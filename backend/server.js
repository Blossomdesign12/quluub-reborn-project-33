
// const express = require('express');
// const cors = require('cors');
// const { connectDB } = require('./config/db');
// require('dotenv').config();

// const app = express();

// // Connect to database
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/relationships', require('./routes/relationshipRoutes'));
// app.use('/api/chats', require('./routes/chatRoutes'));
// app.use('/api/payments', require('./routes/paymentRoutes'));
// app.use('/api/referrals', require('./routes/referralRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const { connectDB } = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/relationships', require('./routes/relationshipRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/referrals', require('./routes/referralRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// --- WebRTC Signaling Setup ---
// In-memory map of conversation rooms to connected WebSocket clients
const rooms = new Map();

// Create HTTP server wrapping Express app
const server = http.createServer(app);

// Create WebSocket server, but do not attach directly to a port
const wss = new WebSocket.Server({ noServer: true });

// Handle HTTP upgrade requests to WebSocket for signaling
server.on('upgrade', (request, socket, head) => {
  const { pathname, query } = url.parse(request.url, true);
  if (pathname === '/signaling') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      // Attach conversation ID to ws client
      ws.conversationId = query.conversation;
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// On new WebSocket connection
wss.on('connection', (ws) => {
  const roomId = ws.conversationId;
  if (!roomId) {
    ws.close(1008, 'Missing conversation ID');
    return;
  }

  // Add to room
  if (!rooms.has(roomId)) rooms.set(roomId, new Set());
  const clients = rooms.get(roomId);
  clients.add(ws);
  console.log(`Client joined room ${roomId}. ${clients.size} clients.`);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      // Broadcast to other clients in same room
      clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (err) {
      console.error('Invalid signaling message', err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`Client left room ${roomId}. ${clients.size} remaining.`);
    if (clients.size === 0) rooms.delete(roomId);
  });
});

// Start HTTP & WebSocket server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (HTTP + WebSocket for /signaling)`);
});

