
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
    
    // Get a sample user for detailed logging
    if (users.length > 0) {
      const sampleUserId = users[0]._id;
      console.log(`\n\nDetailed data for user ID: ${sampleUserId}`);
      
      // Fetch user data
      const userData = await User.findById(sampleUserId).select('-password');
      console.log('\nUser Data:');
      console.log(JSON.stringify(userData, null, 2));
      
      // Fetch chat data for this user
      const chatData = await Chat.find({
        $or: [
          { senderId: sampleUserId },
          { receiverId: sampleUserId }
        ]
      }).limit(10);
      console.log('\nChat Data:');
      console.log(JSON.stringify(chatData, null, 2));
      
      // Fetch relationship data
      const relationshipData = await Relationship.find({
        $or: [
          { follower_user_id: sampleUserId.toString() },
          { followed_user_id: sampleUserId.toString() }
        ]
      }).limit(10);
      console.log('\nRelationship Data:');
      console.log(JSON.stringify(relationshipData, null, 2));
      
      // Fetch activity log data
      const activityLogData = await UserActivityLog.find({
        $or: [
          { userId: sampleUserId.toString() },
          { receiverId: sampleUserId.toString() }
        ]
      }).limit(10);
      console.log('\nUser Activity Log Data:');
      console.log(JSON.stringify(activityLogData, null, 2));
      
      // Fetch wali chat data
      const waliChatData = await WaliChat.find({
        wardid: sampleUserId
      }).limit(10);
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
