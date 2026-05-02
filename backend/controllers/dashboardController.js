const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const AdvisorProfile = require('../models/AdvisorProfile');

// ADVISOR dashboard data
const getAdvisorDashboard = async (req, res) => {
  try {
    const slots = await Slot.find({ advisor: req.user._id })
      .sort({ date: 1, startTime: 1 });

    const bookings = await Booking.find({ advisor: req.user._id, status: 'active' })
      .populate('student', 'name email')
      .populate('slot')
      .sort({ createdAt: -1 });

    const profile = await AdvisorProfile.findOne({ user: req.user._id });

    const stats = {
      totalSlots: slots.length,
      availableSlots: slots.filter(s => s.status === 'available').length,
      bookedSlots: slots.filter(s => s.status === 'booked').length,
      totalBookings: bookings.length,
      isAccepting: profile ? profile.isAccepting : false
    };

    res.json({ stats, slots, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// STUDENT dashboard data
const getStudentDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user._id })
      .populate('advisor', 'name email')
      .populate('slot')
      .sort({ createdAt: -1 });

    const activeBookings = bookings.filter(b => b.status === 'active');
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

    res.json({ activeBookings, cancelledBookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAdvisorDashboard, getStudentDashboard };