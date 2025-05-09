
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { username, email, password, fname, lname, gender } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user with proper default values
    const user = await User.create({
      username,
      email,
      password,
      fname,
      lname,
      gender,
      plan: "freemium", // Set default plan
      status: "active"  // Set default status
    });
    
    if (user) {
      res.status(201).json({
        user: {
          _id: user._id,
          id: user._id, // Virtual field
          username: user.username,
          email: user.email,
          fname: user.fname,
          lname: user.lname,
          gender: user.gender,
          plan: user.plan,
          status: user.status
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Login attempt for username:', username);
    
    // Find user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      console.log('Password mismatch for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last seen
    user.lastSeen = new Date();
    await user.save();
    
    console.log('User logged in successfully:', username);
    
    res.json({
      user: {
        _id: user._id,
        id: user._id, // Virtual field
        username: user.username,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        gender: user.gender,
        plan: user.plan,
        status: user.status,
        nationality: user.nationality,
        country: user.country,
        build: user.build,
        appearance: user.appearance,
        maritalStatus: user.maritalStatus,
        patternOfSalaah: user.patternOfSalaah,
        genotype: user.genotype,
        summary: user.summary,
        workEducation: user.workEducation
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      res.json({
        _id: user._id,
        id: user._id, // Virtual field
        username: user.username,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        gender: user.gender,
        plan: user.plan,
        status: user.status,
        nationality: user.nationality,
        country: user.country,
        build: user.build,
        appearance: user.appearance,
        maritalStatus: user.maritalStatus,
        patternOfSalaah: user.patternOfSalaah,
        genotype: user.genotype,
        summary: user.summary,
        workEducation: user.workEducation,
        referralCode: user.referralCode,
        referralStats: user.referralStats,
        videoCallCredits: user.videoCallCredits,
        lastSeen: user.lastSeen
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    List all users (for debugging)
// @route   GET /api/auth/users
// @access  Public (for debugging only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
