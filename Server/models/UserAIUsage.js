const mongoose = require('mongoose');

const userAIUsageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Custom daily policy (you can adjust per user)
  dailyTokenLimit: { type: Number, default: 5000 },   // total allowed tokens per day
  dailyRequestLimit: { type: Number, default: 50 },   // total allowed requests per day

  // Counters that will change as user chats
  tokensUsedToday: { type: Number, default: 0 },
  requestsUsedToday: { type: Number, default: 0 },

  // Track last reset to handle daily reset
  lastReset: { type: Date, default: () => new Date() }
}, { timestamps: true });

const UserAIUsage = mongoose.model('UserAIUsage', userAIUsageSchema);

module.exports = UserAIUsage;
