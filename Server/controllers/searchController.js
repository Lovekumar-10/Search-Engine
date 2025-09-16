
// backend/controllers/searchController.js

const {
  fetchGoogleSearch,
  fetchYoutubeVideos,
  fetchNews,
} = require("../services/apiService");
const { LIMITS } = require("../config/apiConfig");

// --------------------- GOOGLE SEARCH (ALL + IMAGES) ---------------------
const searchGoogle = async (req, res) => {
  try {
    const { q, page = 1, type = "all" } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: "Missing query param: q" });
    }

    const data = await fetchGoogleSearch(q, parseInt(page), type);

    return res.json({
      success: true,
      type,
      page: parseInt(page),
      limit: LIMITS.RESULTS_PER_PAGE,
      results: data.items || [],
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --------------------- YOUTUBE SEARCH ---------------------
const searchVideos = async (req, res) => {
  try {
    const { q, page = 1, pageToken = "" } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: "Missing query param: q" });
    }

    const data = await fetchYoutubeVideos(q, pageToken, parseInt(page));

    return res.json({
      success: true,
      type: "videos",
      page: parseInt(page),
      limit: LIMITS.RESULTS_PER_PAGE,
      nextPageToken: data.nextPageToken || null,
      results: data.items || [],
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --------------------- NEWS SEARCH ---------------------
const searchNews = async (req, res) => {
  try {
    const { q, page = 1 } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: "Missing query param: q" });
    }

    const data = await fetchNews(q, parseInt(page));

    return res.json({
      success: true,
      type: "news",
      page: parseInt(page),
      limit: LIMITS.RESULTS_PER_PAGE,
      results: data.articles || [],
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  searchGoogle,   // handles both all + images
  searchVideos,
  searchNews,
};


