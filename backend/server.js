
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const User = require('./models/User'); // Import the User model

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
    
    // Fetch and log all users after connecting to the database
    console.log('Fetching all users from database...');
    const users = await User.find().select('-password');
    console.log('All users in database:');
    console.log(JSON.stringify(users, null, 2));
    console.log(`Total users: ${users.length}`);
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
