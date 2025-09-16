// backend/services/apiService.js

const axios = require("axios");
const { GOOGLE, YOUTUBE, NEWS, LIMITS } = require("../config/apiConfig");

// ⚡ Generic helper to check page limits
function validatePage(page) {
  if (page > 5) {
    throw new Error("You can only fetch up to 5 pages per search.");
  }
  return page;
}

// --------------------- GOOGLE CUSTOM SEARCH ---------------------
// used for both "all" and "images"
async function fetchGoogleSearch(query, page = 1, type = "all") {
  validatePage(page);

  const startIndex = (page - 1) * LIMITS.RESULTS_PER_PAGE + 1;

  const params = {
    key: GOOGLE.API_KEY,
    cx: GOOGLE.CX,
    q: query,
    start: startIndex,
    num: LIMITS.RESULTS_PER_PAGE,
  };

  if (type === "images") {
    params.searchType = "image";
  }

  const response = await axios.get(GOOGLE.BASE_URL, { params });
  return response.data;
}

// --------------------- YOUTUBE SEARCH ---------------------
async function fetchYoutubeVideos(query, pageToken = "", page = 1) {
  validatePage(page);

  const params = {
    key: GOOGLE.API_KEY,
    q: query,
    part: "snippet",
    maxResults: LIMITS.RESULTS_PER_PAGE,
    type: "video",
    pageToken,
  };

  const response = await axios.get(YOUTUBE.BASE_URL, { params });
  return response.data;
}

// --------------------- NEWS SEARCH ---------------------
async function fetchNews(query, page = 1) {
  validatePage(page);

  const params = {
    apiKey: NEWS.API_KEY,
    q: query,
    page: page,
    pageSize: LIMITS.RESULTS_PER_PAGE,
  };

  const response = await axios.get(NEWS.BASE_URL, { params });
  return response.data;
}

module.exports = {
  fetchGoogleSearch,
  fetchYoutubeVideos,
  fetchNews,
};
