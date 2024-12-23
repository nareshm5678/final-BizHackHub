const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  completedTasks: {
    type: [String],
    default: []
  },
  achievements: {
    type: [{
      title: String,
      description: String,
      badge: String,
      dateEarned: Date
    }],
    default: []
  },
  profilePic: {
    type: String,
    required: false
  },
  college: {
    type: String,
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
