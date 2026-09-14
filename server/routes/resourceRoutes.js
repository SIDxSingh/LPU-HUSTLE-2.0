const express = require('express');
const router = express.Router();
const {
  getResources,
  getResourceById,
  createResource,
  downloadResource,
  reportResource,
  getFeaturedResources,
  getSemestersSummary,
  getSubjectsList,
} = require('../controllers/resourceController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public overview & meta endpoints
router.get('/featured', getFeaturedResources);
router.get('/semesters-summary', getSemestersSummary);
router.get('/subjects', getSubjectsList);

// Standard resource CRUD
router.get('/', getResources);
router.get('/:id', optionalAuth, getResourceById);
router.post('/', protect, upload.single('file'), createResource);
router.get('/:id/download', downloadResource);
router.post('/:id/report', protect, reportResource);

module.exports = router;
