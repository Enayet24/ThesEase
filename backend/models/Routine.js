const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
  advisor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  dayOfWeek: { 
    type: String, 
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 
    required: true 
  },
  startTime: { type: String, required: true }, // e.g. "10:00"
  endTime: { type: String, required: true },   // e.g. "12:00"
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Routine', routineSchema);