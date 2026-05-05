const Review = require('../models/Review');
const Booking = require('../models/Booking');

// SUBMIT a review
const submitReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { bookingId } = req.params;

    // Verify the booking belongs to this student and is active/completed
    const booking = await Booking.findOne({
      _id: bookingId,
      student: req.user._id
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Check if already reviewed
    const existing = await Review.findOne({ booking: bookingId });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this booking' });

    const review = await Review.create({
      student: req.user._id,
      advisor: booking.advisor,
      booking: bookingId,
      rating,
      comment
    });

    res.status(201).json({ message: 'Review submitted', review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all reviews for an advisor
const getAdvisorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ advisor: req.params.advisorId })
      .populate('student', 'name')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

    res.json({ reviews, avgRating, total: reviews.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitReview, getAdvisorReviews };