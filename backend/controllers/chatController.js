const Chat = require('../models/Chat');
const User = require('../models/User');
const Relationship = require('../models/Relationship');
const mongoose = require('mongoose');

// Helper function to check if two users are matched
const areUsersMatched = async (userId1, userId2) => {
  const relationship = await Relationship.findOne({
    $or: [
      { follower_user_id: userId1, followed_user_id: userId2, status: 'matched' },
      { follower_user_id: userId2, followed_user_id: userId1, status: 'matched' }
    ]
  });
  return !!relationship;
};

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
          "userDetails.profile_pic": 1,
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
    
    // Filter conversations to only include matched users
    const matchedConversations = [];
    for (const chat of chats) {
      const isMatched = await areUsersMatched(userId.toString(), chat._id.toString());
      if (isMatched) {
        matchedConversations.push(chat);
      }
    }
    
    res.json(matchedConversations);
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
    
    // Check if users are matched before allowing to see messages
    const isMatched = await areUsersMatched(currentUserId.toString(), otherUserId);
    if (!isMatched) {
      return res.status(403).json({ message: 'You can only chat with matched connections' });
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
    
    // Check if users are matched before allowing to send messages
    const isMatched = await areUsersMatched(senderId.toString(), receiverId);
    if (!isMatched) {
      return res.status(403).json({ message: 'You can only message matched connections' });
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
    
    // Count unread messages from matched users only
    const unreadChats = await Chat.find({
      receiverId: userId,
      status: "UNREAD"
    }).populate('senderId', '_id');
    
    let matchedUnreadCount = 0;
    for (const chat of unreadChats) {
      const isMatched = await areUsersMatched(userId.toString(), chat.senderId._id.toString());
      if (isMatched) {
        matchedUnreadCount++;
      }
    }
    
    res.json({ unreadCount: matchedUnreadCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
