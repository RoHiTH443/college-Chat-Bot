const express = require('express');
const {
  createQuery,
  getQueries,
  getQuery,
  updateQuery,
  deleteQuery,
} = require('../controllers/queryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getQueries)
  .post(authorize('student'), createQuery);

router
  .route('/:id')
  .get(getQuery)
  .patch(authorize('admin'), updateQuery)
  .delete(authorize('admin'), deleteQuery);

module.exports = router;
