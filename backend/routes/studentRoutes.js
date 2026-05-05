const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');


const { browseAdvisors, getAdvisorDetails } = require('../controllers/studentController');

// Shaj controllers
const { recommendAdvisors } = require('../controllers/recommendationController');
const { searchByExpertise } = require('../controllers/expertiseSearchController');
const { filterSlots } = require('../controllers/slotFilterController');
const { getBookingHistory } = require('../controllers/bookingHistoryController');
const { cancelBooking } = require('../controllers/notificationController');

// ── My Routes ───────────────────────────────────────────────────────────
router.get('/advisors', protect, browseAdvisors);
router.get('/advisors/:advisorId', protect, getAdvisorDetails);

// ── Shaj Routes ────────────────────────────────────────────────────────────
router.get('/recommend', protect, recommendAdvisors);
router.get('/search-expertise', protect, searchByExpertise);
router.get('/slots', protect, filterSlots);
router.get('/booking-history', protect, getBookingHistory);
router.delete('/cancel/:id', protect, cancelBooking);

module.exports = router;