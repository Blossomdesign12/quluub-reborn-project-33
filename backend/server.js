
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const User = require('./models/User'); // Import the User model
const Chat = require('./models/Chat'); // Import the Chat model
const Relationship = require('./models/Relationship'); // Import the Relationship model
const UserActivityLog = require('./models/UserActivityLog'); // Import the UserActivityLog model
const WaliChat = require('./models/WaliChat'); // Import the WaliChat model
const serverLogger = require('./utils/serverLogger'); // Import our new server logger

// Load environment variables
dotenv.config();

// Database connection
const { connectDB } = require('./config/db');

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// CORS configuration with more detailed options
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/relationships', require('./routes/relationshipRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));

// Add a debug route for logging data
app.get('/api/debug/logs', async (req, res) => {
  try {
    await serverLogger.logAllModelData();
    res.json({ success: true, message: 'Server logs generated. Check your server console.' });
  } catch (error) {
    console.error('Error generating debug logs:', error);
    res.status(500).json({ success: false, message: 'Error generating debug logs' });
  }
});

// Add a route to log data for a specific user
app.get('/api/debug/logs/user/:userId', async (req, res) => {
  try {
    const success = await serverLogger.logAllDataForUser(req.params.userId);
    if (success) {
      res.json({ success: true, message: `Logs for user ${req.params.userId} generated. Check your server console.` });
    } else {
      res.status(404).json({ success: false, message: `User ${req.params.userId} not found` });
    }
  } catch (error) {
    console.error(`Error generating debug logs for user ${req.params.userId}:`, error);
    res.status(500).json({ success: false, message: 'Error generating debug logs' });
  }
});

// Root route for API check
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Quluub API!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Connect to DB and start server
const PORT = process.env.PORT || 5000;

// IIFE to use async/await
(async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Log all model data after connecting to the database
    console.log('Connected to database. Generating initial debug logs...');
    await serverLogger.logAllModelData();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
