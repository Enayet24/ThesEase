const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { recommendAdvisors } = require('../controllers/features/recommendationController');
const { searchByExpertise } = require('../controllers/features/expertiseSearchController');
const { filterSlots } = require('../controllers/features/slotFilterController');
const { getBookingHistory } = require('../controllers/features/bookingHistoryController');
const { cancelBooking } = require('../controllers/features/notificationController');

// Routes
router.get('/recommend', protect, recommendAdvisors);
router.get('/search-expertise', protect, searchByExpertise);
router.get('/filter-slots', protect, filterSlots);
router.get('/booking-history', protect, getBookingHistory);
router.delete('/cancel/:id', protect, cancelBooking);

module.exports = router;