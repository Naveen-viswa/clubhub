const express = require('express');
const router = express.Router();
const { verifyToken, requireEventCoordinator } = require('../middleware/authMiddleware');
const {
  getAllEvents,
  getEventById,
  getEventsByClub,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent
} = require('../controllers/eventController');

// Public routes
router.get('/', getAllEvents);
router.get('/:eventId', getEventById);
router.get('/club/:clubId', getEventsByClub);

// Protected routes
router.post('/', verifyToken, requireEventCoordinator, createEvent); // Admin or EventCoordinator
router.put('/:eventId', verifyToken, requireEventCoordinator, updateEvent); // Admin or EventCoordinator
router.delete('/:eventId', verifyToken, requireEventCoordinator, deleteEvent); // Admin or EventCoordinator
router.post('/:eventId/register', verifyToken, registerForEvent); // Any authenticated user

module.exports = router;
