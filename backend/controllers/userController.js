
const User = require('../models/User');
const UserActivityLog = require('../models/UserActivityLog');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    // req.user is set from the auth middleware
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users (for admin)
// @route   GET /api/users/users
// @access  Private
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    // Only allow updating own profile unless admin
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    const updatableFields = [
      'fname', 'lname', 'nationality', 'country', 'build', 
      'appearance', 'maritalStatus', 'patternOfSalaah', 
      'genotype', 'summary', 'workEducation', 'hidden',
      'profile_pic', 'kunya', 'dob', 'ethnicity'
    ];
    
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });
    
    // Save user
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      fname: updatedUser.fname,
      lname: updatedUser.lname,
      plan: updatedUser.plan,
      gender: updatedUser.gender,
      nationality: updatedUser.nationality,
      country: updatedUser.country,
      build: updatedUser.build,
      appearance: updatedUser.appearance,
      maritalStatus: updatedUser.maritalStatus,
      patternOfSalaah: updatedUser.patternOfSalaah,
      genotype: updatedUser.genotype,
      summary: updatedUser.summary,
      workEducation: updatedUser.workEducation,
      hidden: updatedUser.hidden,
      kunya: updatedUser.kunya,
      dob: updatedUser.dob,
      ethnicity: updatedUser.ethnicity,  
      profile_pic: updatedUser.profile_pic
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get users for browsing (with filtering)
// @route   GET /api/users/browse
// @access  Private
exports.getBrowseUsers = async (req, res) => {
  try {
    console.log("Getting browse users with query:", req.query);
    const currentUser = await User.findById(req.user._id);
    
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Default filters - only exclude current user
    const filters = {
      _id: { $ne: req.user._id }, // Exclude current user
    };
    
    // If not showing all users, filter by gender
    if (!req.query.showAll) {
      // Match with opposite gender
      filters.gender = currentUser.gender === 'male' ? 'female' : 'male';
      
      // Match with same country if provided
      if (currentUser.country) {
        filters.country = currentUser.country;
      }
    }
    
    // Additional filters from query
    if (req.query.country) {
      filters.country = req.query.country;
    }
    
    if (req.query.nationality) {
      filters.nationality = req.query.nationality;
    }
    
    console.log("Applying filters:", filters);
    
    // Allow pagination for large datasets
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    
    const users = await User.find(filters)
      .select('-password -resetPasswordToken -resetPasswordTokenExpiration -validationToken')
      .sort({ lastSeen: -1 }) // Most recently active first
      .limit(limit);
    
    console.log(`Found ${users.length} users matching the criteria`);
    
    res.json(users);
  } catch (error) {
    console.error("Error in getBrowseUsers:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upgrade user plan
// @route   POST /api/users/upgrade-plan
// @access  Public (called by webhook)
exports.upgradePlan = async (req, res) => {
  try {
    const { email, plan } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.plan = plan || 'premium';
    await user.save();
    
    res.json({ message: 'Plan upgraded successfully' });
  } catch (error) {
    console.error('Upgrade plan error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add user to favorites
// @route   POST /api/users/favorites/:userId
// @access  Private
exports.addToFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const favoriteUserId = req.params.userId;
    
    console.log(`Adding user ${favoriteUserId} to favorites for user ${userId}`);
    
    if (userId.toString() === favoriteUserId) {
      return res.status(400).json({ message: "You cannot add yourself to favorites" });
    }
    
    // Check if user exists
    const favoriteUser = await User.findById(favoriteUserId);
    if (!favoriteUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Add to favorites if not already there
    const user = await User.findById(userId);
    if (!user.favorites) {
      user.favorites = [];
    }
    
    if (!user.favorites.includes(favoriteUserId)) {
      user.favorites.push(favoriteUserId);
      await user.save();
      console.log(`Successfully added to favorites. New favorites array:`, user.favorites);
    }
    
    res.json({ message: "User added to favorites", favorites: user.favorites });
  } catch (error) {
    console.error("Add to favorites error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove user from favorites
// @route   DELETE /api/users/favorites/:userId
// @access  Private
exports.removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const favoriteUserId = req.params.userId;
    
    console.log(`Removing user ${favoriteUserId} from favorites for user ${userId}`);
    
    const user = await User.findById(userId);
    if (!user.favorites) {
      user.favorites = [];
    }
    
    user.favorites = user.favorites.filter(id => id.toString() !== favoriteUserId);
    await user.save();
    
    console.log(`Successfully removed from favorites. New favorites array:`, user.favorites);
    
    res.json({ message: "User removed from favorites", favorites: user.favorites });
  } catch (error) {
    console.error("Remove from favorites error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's favorites
// @route   GET /api/users/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    
    console.log(`Getting favorites for user ${userId}`);
    
    const user = await User.findById(userId).populate('favorites', '-password');
    
    console.log(`Found ${user.favorites?.length || 0} favorites`);
    
    res.json({ favorites: user.favorites || [] });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
