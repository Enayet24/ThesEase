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

// BOOK a slot (student)
const bookSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.status === 'booked') return res.status(400).json({ message: 'Slot is already booked' });

    // Double booking prevention — check if student already has a booking with this advisor
    const existingBooking = await Booking.findOne({
      student: req.user._id,
      advisor: slot.advisor,
      status: 'active'
    });
    if (existingBooking) return res.status(400).json({ message: 'You already have an active booking with this advisor' });

    // Mark slot as booked
    slot.status = 'booked';
    await slot.save();

    // Create booking record
    const booking = await Booking.create({
      student: req.user._id,
      slot: slot._id,
      advisor: slot.advisor,
      status: 'active'
    });

    // Notify advisor
    await Notification.create({
      recipient: slot.advisor,
      message: `A student has booked your slot on ${new Date(slot.date).toDateString()} at ${slot.startTime}`,
      type: 'booking_confirmed'
    });

    // Notify student
    await Notification.create({
      recipient: req.user._id,
      message: `Your booking has been confirmed for ${new Date(slot.date).toDateString()} at ${slot.startTime}`,
      type: 'booking_confirmed'
    });

    res.status(201).json({ message: 'Slot booked successfully', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CANCEL a booking (student)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      student: req.user._id,
      status: 'active'
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Free up the slot
    const slot = await Slot.findById(booking.slot);
    if (slot) {
      slot.status = 'available';
      await slot.save();

      // Notify about vacancy
      await Notification.create({
        recipient: booking.advisor,
        message: `A student cancelled their booking for ${new Date(slot.date).toDateString()} at ${slot.startTime}`,
        type: 'booking_cancelled'
      });
    }

    booking.status = 'cancelled';
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