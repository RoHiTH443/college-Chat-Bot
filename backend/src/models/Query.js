const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Denormalized for quick display (no need to populate every time)
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    registerNumber: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Resolved', 'Urgent'],
      default: 'Pending',
    },
    // Admin reply / resolution note
    adminReply: {
      type: String,
      trim: true,
      default: '',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes for filtering and search
querySchema.index({ status: 1 });
querySchema.index({ student: 1 });
querySchema.index({ createdAt: -1 });
querySchema.index({ studentName: 'text', registerNumber: 'text', message: 'text' });

module.exports = mongoose.model('Query', querySchema);
