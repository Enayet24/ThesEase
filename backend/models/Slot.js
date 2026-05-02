const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  advisor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  date: { 
    type: Date, 
    required: true 
  },

  startTime: { 
    type: String, 
    required: true 
  },

  endTime: { 
    type: String, 
    required: true 
  },

  status: { 
    type: String, 
    enum: ['available', 'booked'], 
    default: 'available' 
  },

  // 🔥 NEW: link slot to booking (optional but useful)
  booking: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    default: null 
  }

}, { timestamps: true });

// 🔥 Index for faster filtering
slotSchema.index({ advisor: 1, date: 1 });

module.exports = mongoose.model('Slot', slotSchema);