import Slot from "../models/Slot.js";


// ==============================
// 1. CREATE SLOT (ADVISOR)
// ==============================
export const createSlot = async (req, res) => {
  try {
    const { time } = req.body;

    const slot = await Slot.create({
      time,
      advisor: req.user._id,
      status: "available",
    });

    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ==============================
// 2. GET AVAILABLE SLOTS
// ==============================
export const getAvailableSlots = async (req, res) => {
  try {
    const slots = await Slot.find({ status: "available" })
      .populate("advisor", "email");

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ==============================
// 3. BOOK SLOT (STUDENT)
// ==============================
export const bookSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.status === "booked") {
      return res.status(400).json({ message: "Slot already booked" });
    }

    slot.status = "booked";
    slot.student = req.user._id;

    await slot.save();

    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};