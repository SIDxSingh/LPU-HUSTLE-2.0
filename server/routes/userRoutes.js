const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  getUserResources,
  deleteUserResource,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/profile', getUserProfile);
router.get('/resources', getUserResources);
router.delete('/resources/:id', deleteUserResource);

module.exports = router;
