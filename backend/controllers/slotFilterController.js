const Slot = require('../models/Slot');

const filterSlots = async (req, res) => {
  try {
    const { advisorId, date, status } = req.query;

    let filter = {};

    if (advisorId) filter.advisor = advisorId;

    if (date) {
      const selectedDate = new Date(date);
      filter.date = {
        $gte: new Date(selectedDate.setHours(0, 0, 0)),
        $lte: new Date(selectedDate.setHours(23, 59, 59))
      };
    }

    if (status) {
      filter.status = status.toLowerCase();
    }

    const slots = await Slot.find(filter)
      .sort({ date: 1, startTime: 1 });

    res.json(slots);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { filterSlots };