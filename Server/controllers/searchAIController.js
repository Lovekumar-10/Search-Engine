// backend/controllers/searchController.js
const { fetchGoogleSearch } = require("../services/apiService");
const { needsSummary } = require("../helpers/queryClassifier");
const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://models.github.ai/inference",  // 🔹 add baseURL
  apiKey: process.env.GITHUB_API_KEY,            // 🔹 use GitHub proxy key
});

const searchWithSummary = async (req, res) => {
  try {
    const { q, page = 1 } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Missing query param: q" });

    // Step 1: Normal search
    const data = await fetchGoogleSearch(q, parseInt(page), "all");

    // Step 2: Decide summary
    let summary = null;
    if (needsSummary(q)) {
      const topResults = (data.items || []).slice(0, 5).map(item => item.snippet).join("\n");

      // const prompt = `Summarize the following search results for the query "${q}" in 20-50 sentences:\n${topResults}`;
      const prompt = ` "${q}" , \n${topResults}`;

      const response = await client.chat.completions.create({
        model: "openai/gpt-4o-mini",   // 🔹 GitHub proxy model
        messages: [{ role: "user", content: prompt }],
      });

      summary = response.choices[0].message.content;
    }

    return res.json({
      success: true,
      query: q,
      page: parseInt(page),
      aiSummary: summary || "",
      results: data.items || [],
    });
  } catch (err) {
    console.error("Search with summary error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { searchWithSummary };