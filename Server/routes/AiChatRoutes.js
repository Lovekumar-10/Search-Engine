

const express = require("express");
const OpenAI = require("openai");
const UserAIUsage = require("../models/UserAIUsage");
const User = require("../models/UserSchema");
const { checkUserLimits } = require("../helpers/aiUsageHelper");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// GitHub Models Client
const client = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: process.env.GITHUB_API_KEY,
});

// Chat endpoint (protected)
router.post("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: "User not found" });

    const { messages } = req.body;

    // Check user limits
    const usage = await checkUserLimits(user._id);

    // Call OpenAI
    const response = await client.chat.completions.create({
      model: "openai/gpt-4o",
      messages,
    });

    // Update usage
    const tokensUsed = response.usage?.total_tokens || 0;
    usage.tokensUsedToday += tokensUsed;
    usage.requestsUsedToday += 1;
    await usage.save();

    // Calculate next reset
    const nextReset = new Date(usage.lastReset);
    nextReset.setDate(nextReset.getDate() + 1);
    nextReset.setHours(0, 0, 0, 0);

    // Respond
    res.json({
      reply: response.choices[0].message.content,
      source: "OpenAI GPT-4o API",
      usage: {
        tokensUsedToday: usage.tokensUsedToday,
        requestsUsedToday: usage.requestsUsedToday,
        dailyTokenLimit: usage.dailyTokenLimit,
        dailyRequestLimit: usage.dailyRequestLimit,
        nextResetTime: nextReset.toISOString(),
      },
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Usage endpoint (protected)
router.get("/usage", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    let usage = await UserAIUsage.findOne({ userId });

    if (!usage) {
      return res.json({
        tokensUsedToday: 0,
        requestsUsedToday: 0,
        dailyTokenLimit: 5000,
        dailyRequestLimit: 50,
        nextResetTime: new Date().toISOString(),
      });
    }

    const nextReset = new Date(usage.lastReset);
    nextReset.setDate(nextReset.getDate() + 1);
    nextReset.setHours(0, 0, 0, 0);

    res.json({
      tokensUsedToday: usage.tokensUsedToday,
      requestsUsedToday: usage.requestsUsedToday,
      dailyTokenLimit: usage.dailyTokenLimit,
      dailyRequestLimit: usage.dailyRequestLimit,
      nextResetTime: nextReset.toISOString(),
    });
  } catch (err) {
    console.error("Usage fetch error:", err);
    res.status(500).json({ error: "Failed to fetch usage" });
  }
});

module.exports = router;