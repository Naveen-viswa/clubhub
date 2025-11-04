const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  createUserProfile,
  getUserProfile,
  updateUserProfile
} = require('../controllers/authController');

// Public routes
router.post('/profile', createUserProfile); // Called after Cognito signup

// Protected routes
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);

module.exports = router;
