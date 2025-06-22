
const User = require('../models/User');
const Relationship = require('../models/Relationship');
const Chat = require('../models/Chat');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getAdminStats = async (req, res) => {
  try {
    // Get total user counts
    const totalUsers = await User.countDocuments();
    const maleUsers = await User.countDocuments({ gender: 'male' });
    const femaleUsers = await User.countDocuments({ gender: 'female' });
    const premiumUsers = await User.countDocuments({ 
      plan: { $in: ['premium', 'pro'] } 
    });

    // Get active users (last seen within 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeToday = await User.countDocuments({
      lastSeen: { $gte: yesterday }
    });

    // Get relationship statistics
    const totalMatches = await Relationship.countDocuments({ status: 'matched' });
    const pendingRequests = await Relationship.countDocuments({ status: 'pending' });
    
    // Get message statistics
    const totalMessages = await Chat.countDocuments();

    // Calculate success rate (matched / total relationships)
    const totalRelationships = await Relationship.countDocuments();
    const successRate = totalRelationships > 0 ? Math.round((totalMatches / totalRelationships) * 100) : 0;

    // Calculate average matches per user
    const avgMatchesPerUser = totalUsers > 0 ? (totalMatches * 2 / totalUsers).toFixed(1) : 0;

    const stats = {
      totalMembers: totalUsers,
      maleMembers: maleUsers,
      femaleMembers: femaleUsers,
      premiumMembers: premiumUsers,
      activeToday,
      totalMatches,
      successRate,
      avgMatchesPerUser: parseFloat(avgMatchesPerUser),
      pendingRequests,
      activeUsers: activeToday,
      messagesExchanged: totalMessages,
      avgSessionTime: "14.3 min" // This would need tracking in a real app
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users for admin management
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 100, search = '', gender = '', plan = '' } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { fname: { $regex: search, $options: 'i' } },
        { lname: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (gender) {
      filter.gender = gender;
    }
    
    if (plan) {
      filter.plan = plan;
    }

    const users = await User.find(filter)
      .select('-password -resetPasswordToken -resetPasswordTokenExpiration -validationToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user status (admin only)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
