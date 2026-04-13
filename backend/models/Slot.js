import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
    advisorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: String,
    startTime: String,
    endTime: String,
    status: { type: String, default: "available" },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
});

export default mongoose.model("Slot", slotSchema);