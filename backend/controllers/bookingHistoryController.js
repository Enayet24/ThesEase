const Booking = require('../models/Booking');

const getBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user._id })
      .populate('advisor', 'name email')
      .populate('slot')
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBookingHistory };
