
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
    
    const user = await User.create({
      username,
      email,
      password,
      fname,
      lname,
      gender
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
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    
    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: usernameOrEmail },
        { username: usernameOrEmail }
      ]
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last seen
    user.lastSeen = new Date();
    await user.save();
    
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
    console.error(error);
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
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
