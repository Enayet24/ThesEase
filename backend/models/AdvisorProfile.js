const mongoose = require('mongoose');

const advisorProfileSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  department: { 
    type: String, 
    required: true 
  },

  bio: { 
    type: String 
  },

  expertiseTags: [{ 
    type: String,
    trim: true,
    lowercase: true   // 🔥 ensures consistent searching
  }],

  isAccepting: { 
    type: Boolean, 
    default: true 
  }

}, { timestamps: true });

// 🔥 Index for faster search
advisorProfileSchema.index({ expertiseTags: 1 });

module.exports = mongoose.model('AdvisorProfile', advisorProfileSchema);