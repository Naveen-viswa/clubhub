const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const {
  getAllClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  joinClub
} = require('../controllers/clubController');

// Public routes
router.get('/', getAllClubs);
router.get('/:clubId', getClubById);

// Protected routes
router.post('/', verifyToken, requireAdmin, createClub); // Admin only
router.put('/:clubId', verifyToken, requireAdmin, updateClub); // Admin only
router.delete('/:clubId', verifyToken, requireAdmin, deleteClub); // Admin only
router.post('/:clubId/join', verifyToken, joinClub); // Any authenticated user

module.exports = router;
