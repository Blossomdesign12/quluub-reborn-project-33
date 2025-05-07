
const express = require('express');
const { getCurrentUser, getUserById, updateUserProfile, getBrowseUsers } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/me', protect, getCurrentUser);
router.get('/browse', protect, getBrowseUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUserProfile);

module.exports = router;
