const ChatSession = require('../models/ChatSession');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { retrieveRelevantContext } = require('../services/ragService');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const error = new Error('Missing GEMINI_API_KEY in environment variables');
    error.status = 500;
    throw error;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: GEMINI_MODEL });
}

async function generateGeminiReply(userText) {
  const model = getGeminiModel();
  const { context, sources } = await retrieveRelevantContext(userText);

  const contextBlock = context
    ? `Knowledge base context:\n${context}`
    : 'Knowledge base context: No matching context found in local data files.';

  const prompt = [
    'You are a helpful university FAQ chatbot.',
    'Use the provided knowledge base context when it is relevant and do not invent facts.',
    'If context is not enough, say you are unsure and suggest official university support.',
    contextBlock,
    `Student question: ${userText}`,
  ].join('\n');

  const result = await model.generateContent(prompt);
  const reply = result?.response?.text?.() || '';

  return {
    replyText: reply.trim() || 'I could not generate a response right now. Please try again.',
    sources,
  };
}

// GET /api/chat/sessions  — list all sessions for logged-in student (sidebar recent chats)
exports.getSessions = async (req, res, next) => {
  try {
    const sessions = await ChatSession.find({ student: req.user._id })
      .select('title lastMessageAt createdAt')
      .sort({ lastMessageAt: -1 })
      .limit(20);
    res.json({ sessions });
  } catch (err) {
    next(err);
  }
};
exports.createSession = async (req, res, next) => {
  try {
    const { title } = req.body;
    const session = await ChatSession.create({
      student: req.user._id,
      title: title || 'New Chat',
      messages: [],
    });
    res.status(201).json({ session });
  } catch (err) {
    next(err);
  }
};

// GET /api/chat/sessions/:id  — load a full session with messages
exports.getSession = async (req, res, next) => {
  try {
    const session = await ChatSession.findOne({
      _id: req.params.id,
      student: req.user._id,
    });
    if (!session) return res.status(404).json({ message: 'Chat session not found' });
    res.json({ session });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/chat/sessions/:id  — delete a session
exports.deleteSession = async (req, res, next) => {
  try {
    const session = await ChatSession.findOneAndDelete({
      _id: req.params.id,
      student: req.user._id,
    });
    if (!session) return res.status(404).json({ message: 'Chat session not found' });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    next(err);
  }
};

// POST /api/chat/message  — direct chatbot response (without storing a session)
exports.sendBotMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const { replyText, sources } = await generateGeminiReply(text.trim());
    res.status(200).json({ message: { role: 'bot', text: replyText }, sources });
  } catch (err) {
    next(err);
  }
};

// POST /api/chat/sessions/:id/messages  — send a user message & get bot reply
exports.sendMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const session = await ChatSession.findOne({
      _id: req.params.id,
      student: req.user._id,
    });
    if (!session) return res.status(404).json({ message: 'Chat session not found' });

    // Push user message
    const userMessage = { role: 'user', text: text.trim() };
    session.messages.push(userMessage);

    const { replyText, sources } = await generateGeminiReply(text.trim());
    const botReply = {
      role: 'bot',
      text: replyText,
      sources,
    };
    session.messages.push(botReply);

    // Update title from first user message if still default
    if (session.title === 'New Chat') {
      session.title = text.trim().slice(0, 60);
    }

    await session.save();

    // Return only the two new messages
    const addedMessages = session.messages.slice(-2);
    res.status(201).json({ messages: addedMessages });
  } catch (err) {
    next(err);
  }
};
