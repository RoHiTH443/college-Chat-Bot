const mongoose = require('mongoose');

// ── Embedded sub-document for a single message ──
const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'bot'],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    // Optional: store source documents used for the bot answer (RAG reference)
    sources: [
      {
        documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
        title: String,
        snippet: String,
      },
    ],
  },
  { timestamps: true }
);

// ── Chat Session (one conversation thread per student) ──
const chatSessionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      trim: true,
      default: 'New Chat',
    },
    messages: [messageSchema],
    // Track the last activity for sidebar "Recent Chats"
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Update lastMessageAt whenever a message is pushed
chatSessionSchema.pre('save', function (next) {
  if (this.isModified('messages')) {
    this.lastMessageAt = new Date();
  }
  next();
});

chatSessionSchema.index({ student: 1, lastMessageAt: -1 });

module.exports = mongoose.model('ChatSession', chatSessionSchema);
