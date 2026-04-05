const express = require('express');
const {
  uploadDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
} = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect); // all document routes require login

router
  .route('/')
  .get(getDocuments)
  .post(authorize('admin'), upload.single('file'), uploadDocument);

router
  .route('/:id')
  .get(getDocument)
  .patch(authorize('admin'), updateDocument)
  .delete(authorize('admin'), deleteDocument);

module.exports = router;
