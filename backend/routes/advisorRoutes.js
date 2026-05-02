const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  getAdvisorProfile,
  upsertAdvisorProfile,
  toggleAcceptingStatus,
  getRoutines,
  addRoutine,
  updateRoutine,
  deleteRoutine
} = require('../controllers/advisorController');

router.get('/profile/:userId', protect, getAdvisorProfile);
router.put('/profile', protect, restrictTo('advisor'), upsertAdvisorProfile);
router.patch('/status', protect, restrictTo('advisor'), toggleAcceptingStatus);
router.get('/routines', protect, restrictTo('advisor'), getRoutines);
router.post('/routines', protect, restrictTo('advisor'), addRoutine);
router.put('/routines/:routineId', protect, restrictTo('advisor'), updateRoutine);
router.delete('/routines/:routineId', protect, restrictTo('advisor'), deleteRoutine);

module.exports = router;