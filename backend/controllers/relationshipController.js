
const { v4: uuidv4 } = require('uuid');
const Relationship = require('../models/Relationship');
const User = require('../models/User');
const UserActivityLog = require('../models/UserActivityLog');

// @desc    Send a follow/match request
// @route   POST /api/relationships/request
// @access  Private
exports.sendRequest = async (req, res) => {
  try {
    const { followedUserId } = req.body;
    const followerUserId = req.user._id.toString();
    
    // Check if users exist
    const followedUser = await User.findById(followedUserId);
    if (!followedUser) {
      return res.status(404).json({ message: 'User to follow not found' });
    }
    
    // Check if relationship already exists
    const existingRelationship = await Relationship.findOne({
      $or: [
        { follower_user_id: followerUserId, followed_user_id: followedUserId },
        { follower_user_id: followedUserId, followed_user_id: followerUserId }
      ]
    });
    
    if (existingRelationship) {
      return res.status(400).json({ 
        message: 'Relationship already exists',
        relationship: existingRelationship
      });
    }
    
    // Create new relationship
    const newRelationship = await Relationship.create({
      id: uuidv4(),
      follower_user_id: followerUserId,
      followed_user_id: followedUserId,
      status: 'pending'
    });
    
    // Log activity
    await UserActivityLog.create({
      userId: followerUserId,
      receiverId: followedUserId,
      action: 'FOLLOWED'
    });
    
    res.status(201).json(newRelationship);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Respond to a relationship request
// @route   PUT /api/relationships/:id/status
// @access  Private
exports.respondToRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'rejected' or 'matched'
    
    // Validate status
    if (!['rejected', 'matched'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const relationship = await Relationship.findOne({ id: req.params.id });
    
    if (!relationship) {
      return res.status(404).json({ message: 'Relationship not found' });
    }
    
    // Only the followed user can respond
    if (relationship.followed_user_id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this relationship' });
    }
    
    // Update relationship status
    relationship.status = status;
    await relationship.save();
    
    // Log activity
    await UserActivityLog.create({
      userId: req.user._id.toString(),
      receiverId: relationship.follower_user_id,
      action: status === 'rejected' ? 'REJECTED' : 'FOLLOWED'
    });
    
    res.json(relationship);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Withdraw a pending request
// @route   DELETE /api/relationships/withdraw/:id
// @access  Private
exports.withdrawRequest = async (req, res) => {
  try {
    const relationship = await Relationship.findOne({ id: req.params.id });
    
    if (!relationship) {
      return res.status(404).json({ message: 'Relationship not found' });
    }
    
    // Only the follower can withdraw
    if (relationship.follower_user_id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to withdraw this request' });
    }
    
    // Only pending requests can be withdrawn
    if (relationship.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be withdrawn' });
    }
    
    // Log activity
    await UserActivityLog.create({
      userId: req.user._id.toString(),
      receiverId: relationship.followed_user_id,
      action: 'WITHDREW'
    });
    
    // Delete the relationship
    await relationship.deleteOne();
    
    res.json({ message: 'Request withdrawn successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get matches for current user
// @route   GET /api/relationships/matches
// @access  Private
exports.getMatches = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    
    // Find all relationships where status is 'matched' and user is involved
    const matches = await Relationship.find({
      status: 'matched',
      $or: [
        { follower_user_id: userId },
        { followed_user_id: userId }
      ]
    });
    
    // Extract other user IDs
    const matchedUserIds = matches.map(match => {
      return match.follower_user_id === userId 
        ? match.followed_user_id 
        : match.follower_user_id;
    });
    
    // Get user details for matches
    const matchedUsers = await User.find({
      _id: { $in: matchedUserIds }
    }).select('-password -resetPasswordToken -resetPasswordTokenExpiration -validationToken');
    
    // Create response with relationship info and user details
    const matchesWithUserDetails = matches.map(match => {
      const otherUserId = match.follower_user_id === userId 
        ? match.followed_user_id 
        : match.follower_user_id;
      
      const userDetails = matchedUsers.find(
        u => u._id.toString() === otherUserId
      );
      
      return {
        relationship: match,
        user: userDetails
      };
    });
    
    res.json(matchesWithUserDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
