
const express = require('express');
const { getConversations, getMessages, sendMessage, getUnreadCount } = require('../controllers/chatController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/messages/:userId', protect, getMessages);
router.post('/send', protect, sendMessage);
router.get('/unread', protect, getUnreadCount);

module.exports = router;
