const AdvisorProfile = require('../../models/AdvisorProfile');

const recommendAdvisors = async (req, res) => {
  try {
    const { interests } = req.query;

    if (!interests) {
      return res.status(400).json({ message: "Interests required" });
    }

    const interestArray = interests.split(',').map(i => i.toLowerCase());

    const advisors = await AdvisorProfile.find({
      expertiseTags: { $in: interestArray },
      isAccepting: true
    }).populate('user', 'name email');

    res.json(advisors);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { recommendAdvisors };