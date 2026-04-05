const User = require('../models/User');
const Document = require('../models/Document');
const Query = require('../models/Query');
const ChatSession = require('../models/ChatSession');

// GET /api/dashboard/stats  (admin only)
exports.getAdminStats = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalStudents,
      uploadedPDFs,
      pendingQueries,
      urgentQueries,
      recentActivity,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Document.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Query.countDocuments({ status: 'Pending' }),
      Query.countDocuments({ status: 'Urgent' }),
      // Last 5 queries as recent activity
      Query.find()
        .populate('student', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('studentName subject status createdAt'),
    ]);

    res.json({
      stats: {
        totalStudents,
        uploadedPDFs,
        pendingQueries,
        urgentQueries,
      },
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/dashboard/student  (student only)
exports.getStudentStats = async (req, res, next) => {
  try {
    const [myQueries, mySessions, availableDocs] = await Promise.all([
      Query.countDocuments({ student: req.user._id }),
      ChatSession.countDocuments({ student: req.user._id }),
      Document.countDocuments({ visibleToAll: true }),
    ]);

    res.json({
      stats: {
        myQueries,
        mySessions,
        availableDocs,
      },
      user: {
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};
