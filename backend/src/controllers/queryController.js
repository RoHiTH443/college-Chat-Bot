const Query = require('../models/Query');

// POST /api/queries  (student submits a query)
exports.createQuery = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const query = await Query.create({
      student: req.user._id,
      studentName: req.user.name,
      registerNumber: req.body.registerNumber || '',
      subject,
      message,
      status: 'Pending',
    });

    res.status(201).json({ query });
  } catch (err) {
    next(err);
  }
};

// GET /api/queries
// Admin sees all; student sees only their own
exports.getQueries = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (req.user.role === 'student') filter.student = req.user._id;
    if (status && status !== 'All Statuses') filter.status = status;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [queries, total] = await Promise.all([
      Query.find(filter)
        .populate('student', 'name email')
        .populate('resolvedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Query.countDocuments(filter),
    ]);

    res.json({ queries, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// GET /api/queries/:id
exports.getQuery = async (req, res, next) => {
  try {
    const query = await Query.findById(req.params.id)
      .populate('student', 'name email')
      .populate('resolvedBy', 'name');
    if (!query) return res.status(404).json({ message: 'Query not found' });

    // Students can only see their own
    if (req.user.role === 'student' && String(query.student._id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ query });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/queries/:id  (admin updates status / reply)
exports.updateQuery = async (req, res, next) => {
  try {
    const { status, adminReply } = req.body;
    const update = { status, adminReply };

    if (status === 'Resolved') {
      update.resolvedBy = req.user._id;
      update.resolvedAt = new Date();
    }

    const query = await Query.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!query) return res.status(404).json({ message: 'Query not found' });

    res.json({ query });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/queries/:id  (admin only)
exports.deleteQuery = async (req, res, next) => {
  try {
    const query = await Query.findByIdAndDelete(req.params.id);
    if (!query) return res.status(404).json({ message: 'Query not found' });
    res.json({ message: 'Query deleted' });
  } catch (err) {
    next(err);
  }
};
