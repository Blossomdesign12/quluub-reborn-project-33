
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const User = require('./models/User'); // Import the User model
const Chat = require('./models/Chat'); // Import the Chat model
const Relationship = require('./models/Relationship'); // Import the Relationship model
const UserActivityLog = require('./models/UserActivityLog'); // Import the UserActivityLog model
const WaliChat = require('./models/WaliChat'); // Import the WaliChat model

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
const allowedOrigins = process.env.CLIENT_URL.split(',');

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
    console.log(`Total users: ${users.length}`);
    
    // Get detailed data for 3 users
    console.log('\n==========================================');
    console.log('DETAILED USER DATA FOR 3 SAMPLE USERS');
    console.log('==========================================\n');
    
    // Fetch 3 random users for detailed logging
    const sampleUsers = await User.find().limit(3).select('-password');
    
    for (const user of sampleUsers) {
      const userId = user._id;
      console.log(`\n\n==========================================`);
      console.log(`DETAILED DATA FOR USER ID: ${userId}`);
      console.log(`==========================================`);
      
      // Fetch user data
      console.log('\nUser Data:');
      console.log(JSON.stringify(user, null, 2));
      
      // Fetch chat data for this user
      const chatData = await Chat.find({
        $or: [
          { senderId: userId.toString() },
          { receiverId: userId.toString() }
        ]
      });
      console.log('\nChat Data:');
      console.log(JSON.stringify(chatData, null, 2));
      
      // Fetch relationship data
      const relationshipData = await Relationship.find({
        $or: [
          { follower_user_id: userId.toString() },
          { followed_user_id: userId.toString() }
        ]
      });
      console.log('\nRelationship Data:');
      console.log(JSON.stringify(relationshipData, null, 2));
      
      // Fetch activity log data
      const activityLogData = await UserActivityLog.find({
        $or: [
          { userId: userId.toString() },
          { receiverId: userId.toString() }
        ]
      });
      console.log('\nUser Activity Log Data:');
      console.log(JSON.stringify(activityLogData, null, 2));
      
      // Fetch wali chat data
      const waliChatData = await WaliChat.find({
        wardid: userId.toString()
      });
      console.log('\nWali Chat Data:');
      console.log(JSON.stringify(waliChatData, null, 2));
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
