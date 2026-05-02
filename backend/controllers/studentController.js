const AdvisorProfile = require('../models/AdvisorProfile');
const Slot = require('../models/Slot');
const Booking = require('../models/Booking');

// GET all advisors with optional search & filter (IMPROVED)
const browseAdvisors = async (req, res) => {
  try {
    const { search, department, isAccepting, expertise } = req.query;

    let filter = {};

    if (department) filter.department = department;
    if (isAccepting !== undefined)
      filter.isAccepting = isAccepting === 'true';

    // 🔥 IMPROVED expertise search (regex instead of exact match)
    if (expertise) {
      filter.expertiseTags = { $regex: expertise, $options: 'i' };
    }

    let profiles = await AdvisorProfile.find(filter)
      .populate('user', 'name email');

    // 🔍 Search by advisor name
    if (search) {
      profiles = profiles.filter((p) =>
        p.user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET single advisor profile + slots (IMPROVED)
const getAdvisorDetails = async (req, res) => {
  try {
    const profile = await AdvisorProfile.findOne({ user: req.params.advisorId })
      .populate('user', 'name email');

    if (!profile)
      return res.status(404).json({ message: 'Advisor not found' });

    const slots = await Slot.find({
      advisor: req.params.advisorId,
      date: { $gte: new Date() },
    }).sort({ date: 1, startTime: 1 });

    res.json({ profile, slots });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔥 NEW FEATURE: FILTER SLOTS BY DATE + STATUS
const getFilteredSlots = async (req, res) => {
  try {
    const { advisorId, date, status } = req.query;

    let filter = {
      advisor: advisorId,
    };

    // 📅 filter by date
    if (date) {
      filter.date = new Date(date);
    }

    // 🔘 filter by status (Available / Booked)
    if (status) {
      filter.status = status.toLowerCase();
    }

    const slots = await Slot.find(filter).sort({
      date: 1,
      startTime: 1,
    });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  browseAdvisors,
  getAdvisorDetails,
  getFilteredSlots, // 👈 added
};