const express = require('express');
const {
  getSessions,
  createSession,
  getSession,
  deleteSession,
  sendBotMessage,
  sendMessage,  
} = require('../controllers/chatController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public chatbot endpoint (no JWT required)
router.post('/message', sendBotMessage);

router.use(protect);
router.use(authorize('student')); // chat is student-only

router.route('/sessions').get(getSessions).post(createSession);

router.route('/sessions/:id').get(getSession).delete(deleteSession);

router.post('/sessions/:id/messages', sendMessage);

module.exports = router;
