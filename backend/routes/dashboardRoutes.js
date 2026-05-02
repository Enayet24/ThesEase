const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { getAdvisorDashboard, getStudentDashboard } = require('../controllers/dashboardController');

router.get('/advisor', protect, restrictTo('advisor'), getAdvisorDashboard);
router.get('/student', protect, restrictTo('student'), getStudentDashboard);

module.exports = router;