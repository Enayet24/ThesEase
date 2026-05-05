const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// CREATE a slot
const createSlot = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;

    // Check for duplicate slot
    const existing = await Slot.findOne({
      advisor: req.user._id,
      date,
      startTime
    });
    if (existing) return res.status(400).json({ message: 'A slot already exists at this time' });

    const slot = await Slot.create({
      advisor: req.user._id,
      date,
      startTime,
      endTime,
      status: 'available'
    });
    res.status(201).json({ message: 'Slot created successfully', slot });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all slots for logged-in advisor
const getAdvisorSlots = async (req, res) => {
  try {
    const slots = await Slot.find({ advisor: req.user._id })
      .sort({ date: 1, startTime: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE slot (date/time)
const updateSlot = async (req, res) => {
  try {
    const slot = await Slot.findOne({ _id: req.params.slotId, advisor: req.user._id });
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.status === 'booked') return res.status(400).json({ message: 'Cannot edit a booked slot' });

    const { date, startTime, endTime } = req.body;
    if (date) slot.date = date;
    if (startTime) slot.startTime = startTime;
    if (endTime) slot.endTime = endTime;

    await slot.save();
    res.json({ message: 'Slot updated', slot });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE slot
const deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findOne({ _id: req.params.slotId, advisor: req.user._id });
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.status === 'booked') return res.status(400).json({ message: 'Cannot delete a booked slot' });

    await slot.deleteOne();
    res.json({ message: 'Slot deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// BOOK a slot (student) — with atomic double-booking prevention
const bookSlot = async (req, res) => {
  try {
    // 1. Atomically claim the slot (prevents race conditions)
    const slot = await Slot.findOneAndUpdate(
      { _id: req.params.slotId, status: 'available' },
      { status: 'booked' },
      { new: true }
    );

    if (!slot) {
      return res.status(400).json({ message: 'This slot is no longer available. It may have been booked by another student.' });
    }

    // 2. Check if student already has an active booking with this advisor
    const existingAdvisorBooking = await Booking.findOne({
      student: req.user._id,
      advisor: slot.advisor,
      status: 'active'
    });

    if (existingAdvisorBooking) {
      // Revert the slot back to available
      await Slot.findByIdAndUpdate(slot._id, { status: 'available' });
      return res.status(400).json({ message: 'You already have an active booking with this advisor. Cancel it first to book a new slot.' });
    }

    // 3. Check same-timeslot conflict (student has a booking at overlapping time with ANY advisor)
    const conflictBooking = await Booking.findOne({
      student: req.user._id,
      status: 'active'
    }).populate('slot');

    if (conflictBooking && conflictBooking.slot) {
      const existingSlot = conflictBooking.slot;
      const sameDate = new Date(existingSlot.date).toDateString() === new Date(slot.date).toDateString();

      if (sameDate && existingSlot.startTime === slot.startTime) {
        // Revert the slot
        await Slot.findByIdAndUpdate(slot._id, { status: 'available' });
        return res.status(400).json({
          message: `You already have a booking at ${slot.startTime} on this date with another advisor.`
        });
      }
    }

    // 4. Create booking record
    const booking = await Booking.create({
      student: req.user._id,
      slot: slot._id,
      advisor: slot.advisor,
      status: 'active'
    });

    // 5. Link slot to booking
    slot.booking = booking._id;
    await slot.save();

    // 6. Notify advisor
    await Notification.create({
      recipient: slot.advisor,
      message: `A student has booked your slot on ${new Date(slot.date).toDateString()} at ${slot.startTime}`,
      type: 'booking_confirmed'
    });

    // 7. Notify student
    await Notification.create({
      recipient: req.user._id,
      message: `Your booking has been confirmed for ${new Date(slot.date).toDateString()} at ${slot.startTime}`,
      type: 'booking_confirmed'
    });

    res.status(201).json({ message: 'Slot booked successfully!', booking });
  } catch (err) {
    // Handle Mongoose duplicate key error (student+slot unique index)
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already booked this slot.' });
    }
    res.status(500).json({ message: err.message });
  }
};

// CANCEL a booking (student) — with reason + notifications
const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body || {};

    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      student: req.user._id,
      status: 'active'
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found or already cancelled' });

    // Free up the slot
    const slot = await Slot.findById(booking.slot);
    if (slot) {
      slot.status = 'available';
      slot.booking = null;
      await slot.save();

      // Notify advisor about cancellation
      await Notification.create({
        recipient: booking.advisor,
        message: `A student cancelled their booking for ${new Date(slot.date).toDateString()} at ${slot.startTime}${reason ? `. Reason: ${reason}` : ''}`,
        type: 'booking_cancelled'
      });
    }

    // Notify student with confirmation
    await Notification.create({
      recipient: req.user._id,
      message: `Your booking has been cancelled successfully.`,
      type: 'booking_cancelled'
    });

    // Update booking
    booking.status = 'cancelled';
    booking.cancellationReason = reason || null;
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createSlot,
  getAdvisorSlots,
  updateSlot,
  deleteSlot,
  bookSlot,
  cancelBooking
};