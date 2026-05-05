const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
  cancellationReason: { type: String, default: null },
  cancelledAt: { type: Date, default: null },
}, { timestamps: true });

// Prevent duplicate bookings: one student per slot
bookingSchema.index({ student: 1, slot: 1 }, { unique: true });

// Fast lookup: student's active bookings with an advisor
bookingSchema.index({ student: 1, advisor: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);