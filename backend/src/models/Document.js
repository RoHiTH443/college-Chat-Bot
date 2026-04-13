const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Course Material', 'Circular', 'Research Paper', 'Syllabus', 'Exam Schedule', 'Other'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    // File metadata (store path or cloud URL after upload)
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number, // bytes
      required: true,
    },
    mimeType: {
      type: String,
      enum: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
      required: true,
    },
    visibleToAll: {
      type: Boolean,
      default: false,
    },
    requireSignature: {
      type: Boolean,
      default: false,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Index for search
documentSchema.index({ title: 'text', description: 'text', category: 1 });

module.exports = mongoose.model('Document', documentSchema);
