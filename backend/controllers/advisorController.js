const AdvisorProfile = require('../models/AdvisorProfile');
const Routine = require('../models/Routine');
const User = require('../models/User');

// GET advisor profile
const getAdvisorProfile = async (req, res) => {
  try {
    const profile = await AdvisorProfile.findOne({ user: req.params.userId })
      .populate('user', 'name email');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CREATE or UPDATE advisor profile
const upsertAdvisorProfile = async (req, res) => {
  try {
    const { department, bio, expertiseTags } = req.body;

    const profile = await AdvisorProfile.findOneAndUpdate(
      { user: req.user._id },
      { department, bio, expertiseTags },
      { new: true, upsert: true }
    );
    res.json({ message: 'Profile saved successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// TOGGLE accepting/not accepting status
const toggleAcceptingStatus = async (req, res) => {
  try {
    const profile = await AdvisorProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    profile.isAccepting = !profile.isAccepting;
    await profile.save();

    res.json({ 
      message: `Status updated to ${profile.isAccepting ? 'Accepting' : 'Not Accepting'}`,
      isAccepting: profile.isAccepting 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all routines for logged-in advisor
const getRoutines = async (req, res) => {
  try {
    const routines = await Routine.find({ advisor: req.user._id });
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ADD a routine entry
const addRoutine = async (req, res) => {
  try {
    const { dayOfWeek, startTime, endTime } = req.body;

    const routine = await Routine.create({
      advisor: req.user._id,
      dayOfWeek,
      startTime,
      endTime
    });
    res.status(201).json({ message: 'Routine added', routine });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE a routine entry
const updateRoutine = async (req, res) => {
  try {
    const routine = await Routine.findOne({ 
      _id: req.params.routineId, 
      advisor: req.user._id 
    });
    if (!routine) return res.status(404).json({ message: 'Routine not found' });

    const { dayOfWeek, startTime, endTime, isActive } = req.body;
    if (dayOfWeek) routine.dayOfWeek = dayOfWeek;
    if (startTime) routine.startTime = startTime;
    if (endTime) routine.endTime = endTime;
    if (isActive !== undefined) routine.isActive = isActive;

    await routine.save();
    res.json({ message: 'Routine updated', routine });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a routine entry
const deleteRoutine = async (req, res) => {
  try {
    const routine = await Routine.findOneAndDelete({ 
      _id: req.params.routineId, 
      advisor: req.user._id 
    });
    if (!routine) return res.status(404).json({ message: 'Routine not found' });
    res.json({ message: 'Routine deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAdvisorProfile,
  upsertAdvisorProfile,
  toggleAcceptingStatus,
  getRoutines,
  addRoutine,
  updateRoutine,
  deleteRoutine
};