const express = require('express');
const router = express.Router();

const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  browseAdvisors,
  getAdvisorDetails,
  getFilteredSlots // 👈 added
} = require('../controllers/studentController');

// 🔍 Browse advisors (search/filter)
router.get('/advisors', protect, browseAdvisors);

// 👤 Get advisor details + slots
router.get('/advisors/:advisorId', protect, getAdvisorDetails);

// 🔥 NEW: Filter slots by date/status
router.get('/slots', protect, getFilteredSlots);

module.exports = router;