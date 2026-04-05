const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');

const DATA_DIR = path.join(__dirname, '../../data');
const RAG_UPLOADS_FILE = path.join(DATA_DIR, 'uploaded-documents.txt');
const ALLOWED_CATEGORIES = ['Course Material', 'Circular', 'Research Paper', 'Syllabus', 'Exam Schedule', 'Other'];
const CATEGORY_MAP = {
  notes: 'Course Material',
  'course material': 'Course Material',
  circular: 'Circular',
  circulars: 'Circular',
  research: 'Research Paper',
  'research paper': 'Research Paper',
  'research publication': 'Research Paper',
  syllabus: 'Syllabus',
  exam: 'Exam Schedule',
  'exam schedule': 'Exam Schedule',
  'past exam papers': 'Exam Schedule',
  assignment: 'Other',
  assignments: 'Other',
  other: 'Other',
};

function normalizeCategory(category) {
  if (!category || typeof category !== 'string') return '';

  if (ALLOWED_CATEGORIES.includes(category)) {
    return category;
  }

  return CATEGORY_MAP[category.trim().toLowerCase()] || '';
}

async function extractTextFromFile(filePath, mimeType) {
  const buffer = await fsp.readFile(filePath);

  if (mimeType === 'application/pdf') {
    const parser = new PDFParse({ data: buffer });
    try {
      const parsed = await parser.getText();
      return (parsed?.text || '').trim();
    } finally {
      await parser.destroy();
    }
  }

  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const parsed = await mammoth.extractRawText({ buffer });
    return (parsed?.value || '').trim();
  }

  return '';
}

async function appendDocumentToRagData({ title, category, description, originalName, content }) {
  await fsp.mkdir(DATA_DIR, { recursive: true });

  const safeContent = content && content.trim()
    ? content.trim()
    : 'No extractable text found in uploaded file. Please review original document.';

  const block = [
    '\n\n=== DOCUMENT START ===',
    `Title: ${title}`,
    `Category: ${category}`,
    `File Name: ${originalName}`,
    description ? `Description: ${description}` : '',
    'Content:',
    safeContent,
    '=== DOCUMENT END ===',
  ]
    .filter(Boolean)
    .join('\n');

  await fsp.appendFile(RAG_UPLOADS_FILE, block, 'utf8');
}

// POST /api/documents  (admin only)
exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, category, description, visibleToAll, requireSignature } = req.body;
    const normalizedCategory = normalizeCategory(category);

    if (!title || !normalizedCategory) {
      // Remove the uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Title is required and category must be valid' });
    }

    // Ingest uploaded document content into RAG data folder.
    try {
      const extractedContent = await extractTextFromFile(req.file.path, req.file.mimetype);
      await appendDocumentToRagData({
        title,
        category: normalizedCategory,
        description: description || '',
        originalName: req.file.originalname,
        content: extractedContent,
      });
    } catch (ingestErr) {
      console.error('RAG ingestion failed for uploaded document:', ingestErr.message);
    }

    const doc = await Document.create({
      title,
      category: normalizedCategory,
      description: description || '',
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      visibleToAll: visibleToAll === 'true',
      requireSignature: requireSignature === 'true',
      uploadedBy: req.user._id,
    });

    res.status(201).json({ document: doc });
  } catch (err) {
    next(err);
  }
};

// GET /api/documents  (admin: all | student: visibleToAll only)
exports.getDocuments = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (req.user.role === 'student') filter.visibleToAll = true;
    if (category) {
      const normalizedCategory = normalizeCategory(category);
      if (normalizedCategory) filter.category = normalizedCategory;
    }
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [documents, total] = await Promise.all([
      Document.find(filter)
        .populate('uploadedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Document.countDocuments(filter),
    ]);

    res.json({ documents, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// GET /api/documents/:id
exports.getDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (req.user.role === 'student' && !doc.visibleToAll) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json({ document: doc });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/documents/:id  (admin only)
exports.updateDocument = async (req, res, next) => {
  try {
    const { title, category, description, visibleToAll, requireSignature } = req.body;
    const update = {
      title,
      description,
      visibleToAll,
      requireSignature,
    };

    if (category !== undefined) {
      const normalizedCategory = normalizeCategory(category);
      if (!normalizedCategory) {
        return res.status(400).json({ message: 'Category must be valid' });
      }
      update.category = normalizedCategory;
    }

    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.json({ document: doc });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/documents/:id  (admin only)
exports.deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    // Remove physical file
    const filePath = path.join(__dirname, '../../uploads', path.basename(doc.fileUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ message: 'Document deleted' });
  } catch (err) {
    next(err);
  }
};
