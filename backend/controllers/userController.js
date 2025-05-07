
const User = require('../models/User');
const UserActivityLog = require('../models/UserActivityLog');
const { toObjectId } = require('../config/db');

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
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

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Log view activity
    if (req.user._id.toString() !== req.params.id) {
      await UserActivityLog.create({
        userId: req.user._id.toString(),
        receiverId: req.params.id,
        action: 'VIEWED'
      });
    }
    
    res.json(user);
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
      'genotype', 'summary', 'workEducation', 'hidden'
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
      hidden: updatedUser.hidden
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
    const currentUser = await User.findById(req.user._id);
    
    // Default filters
    const filters = {
      _id: { $ne: req.user._id }, // Exclude current user
      hidden: { $ne: true }, // Exclude hidden profiles
      status: 'active' // Only active users
    };
    
    // Gender filtering based on user preferences
    if (currentUser.gender === 'male') {
      filters.gender = 'female';
    } else {
      filters.gender = 'male';
    }
    
    // Additional filters from query
    if (req.query.country) {
      filters.country = req.query.country;
    }
    
    if (req.query.nationality) {
      filters.nationality = req.query.nationality;
    }
    
    const users = await User.find(filters)
      .select('-password -resetPasswordToken -resetPasswordTokenExpiration -validationToken')
      .sort({ lastSeen: -1 }) // Most recently active first
      .limit(50);
    
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
