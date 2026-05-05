const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  createSlot,
  getAdvisorSlots,
  updateSlot,
  deleteSlot,
  bookSlot,
  cancelBooking
} = require('../controllers/slotController');

// Advisor routes
router.post('/', protect, restrictTo('advisor'), createSlot);
router.get('/my-slots', protect, restrictTo('advisor'), getAdvisorSlots);
router.put('/:slotId', protect, restrictTo('advisor'), updateSlot);
router.delete('/:slotId', protect, restrictTo('advisor'), deleteSlot);

// Student routes
router.post('/:slotId/book', protect, restrictTo('student'), bookSlot);
router.patch('/cancel/:bookingId', protect, restrictTo('student'), cancelBooking);

module.exports = router;