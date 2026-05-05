const AdvisorProfile = require('../../models/AdvisorProfile');

const searchByExpertise = async (req, res) => {
  try {
    const { expertise } = req.query;

    if (!expertise) {
      return res.status(400).json({ message: "Expertise required" });
    }

    const advisors = await AdvisorProfile.find({
      expertiseTags: { $regex: expertise, $options: 'i' }
    }).populate('user', 'name email');

    res.json(advisors);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchByExpertise };