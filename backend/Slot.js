const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
    advisorId: String,
    date: String,
    time: String,
    status: String
});

const Slot = mongoose.model("Slot", slotSchema);

module.exports = Slot;