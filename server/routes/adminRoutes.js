const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getPendingResources,
  getAllResources,
  approveResource,
  rejectResource,
  deleteResource,
  getUsersList,
  getReportsList,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/resources/pending', getPendingResources);
router.get('/resources', getAllResources);
router.patch('/resources/:id/approve', approveResource);
router.patch('/resources/:id/reject', rejectResource);
router.delete('/resources/:id', deleteResource);
router.get('/users', getUsersList);
router.get('/reports', getReportsList);

module.exports = router;
