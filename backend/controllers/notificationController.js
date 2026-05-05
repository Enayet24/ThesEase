const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const Notification = require('../models/Notification');

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = 'cancelled';
    await booking.save();

    const slot = await Slot.findById(booking.slot);
    slot.status = 'available';
    slot.booking = null;
    await slot.save();

    await Notification.create({
      recipient: booking.student,
      message: "A slot has become available!",
      type: "slot_vacancy"
    });

    res.json({ message: "Slot reopened and notification sent" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { cancelBooking };