
const express = require('express');
const { signup, login, getUserProfile, getAllUsers, changePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getUserProfile);
router.get('/users', getAllUsers);
router.put('/change-password', protect, changePassword);

module.exports = router;
