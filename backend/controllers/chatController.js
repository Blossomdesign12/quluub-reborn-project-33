
const Chat = require('../models/Chat');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get conversations for a user
// @route   GET /api/chats/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find all chats where user is sender or receiver
    const chats = await Chat.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      },
      {
        $sort: { created: -1 } // Sort by latest message
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", userId] },
              "$receiverId",
              "$senderId"
            ]
          },
          lastMessage: { $first: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: "$userDetails"
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          "userDetails.username": 1,
          "userDetails.fname": 1,
          "userDetails.lname": 1,
          "userDetails.gender": 1,
          "userDetails.country": 1,
          unreadCount: {
            $cond: [
              {
                $and: [
                  { $eq: ["$lastMessage.receiverId", userId] },
                  { $eq: ["$lastMessage.status", "UNREAD"] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    ]);
    
    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get messages between two users
// @route   GET /api/chats/messages/:userId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;
    
    // Validate other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get messages between the two users
    const messages = await Chat.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    }).sort({ created: 1 });
    
    // Mark unread messages as read
    await Chat.updateMany(
      {
        senderId: otherUserId,
        receiverId: currentUserId,
        status: "UNREAD"
      },
      {
        $set: { status: "READ" }
      }
    );
    
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/chats/send
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;
    
    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }
    
    // Create new message
    const newMessage = await Chat.create({
      senderId,
      receiverId,
      message,
      status: "UNREAD"
    });
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get unread message count
// @route   GET /api/chats/unread
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Count unread messages
    const unreadCount = await Chat.countDocuments({
      receiverId: userId,
      status: "UNREAD"
    });
    
    res.json({ unreadCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
