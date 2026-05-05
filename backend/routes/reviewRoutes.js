const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { submitReview, getAdvisorReviews } = require('../controllers/reviewController');

router.post('/:bookingId', protect, restrictTo('student'), submitReview);
router.get('/advisor/:advisorId', protect, getAdvisorReviews);

module.exports = router;