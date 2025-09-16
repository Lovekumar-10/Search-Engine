const UserAIUsage = require('../models/UserAIUsage');

async function checkUserLimits(userId) {
  let usage = await UserAIUsage.findOne({ userId });

  if (!usage) {
    usage = await UserAIUsage.create({ userId });
  }

  const now = new Date();
  if (now.toDateString() !== usage.lastReset.toDateString()) {
    usage.tokensUsedToday = 0;
    usage.requestsUsedToday = 0;
    usage.lastReset = now;
    await usage.save();
  }

  if (usage.requestsUsedToday >= usage.dailyRequestLimit)
    throw new Error('Daily request limit reached');
  if (usage.tokensUsedToday >= usage.dailyTokenLimit)
    throw new Error('Daily token limit reached');

  return usage;
}

module.exports = { checkUserLimits };
