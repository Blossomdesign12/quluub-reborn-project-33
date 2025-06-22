
const express = require('express');
const { 
  getAdminStats, 
  getAllUsers, 
  updateUserStatus 
} = require('../controllers/adminController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Admin middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.type === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

router.get('/stats', protect, isAdmin, getAdminStats);
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id/status', protect, isAdmin, updateUserStatus);

module.exports = router;
