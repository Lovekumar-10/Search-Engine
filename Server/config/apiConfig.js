

module.exports = {
  GOOGLE: {
    API_KEY: process.env.GOOGLE_API_KEY || "your-google-api-key-here",
    CX: process.env.GOOGLE_CX || "your-google-cx-id-here", // custom search engine id
    BASE_URL: "https://www.googleapis.com/customsearch/v1",
  },

  YOUTUBE: {
    API_KEY: process.env.GOOGLE_API_KEY || "your-youtube-api-key-here",
    BASE_URL: "https://www.googleapis.com/youtube/v3/search",
  },

  NEWS: {
    API_KEY: process.env.NEWS_API_KEY || "your-newsapi-key-here",
    BASE_URL: "https://newsapi.org/v2/everything",
  },

  // General app limits
  LIMITS: {
    RESULTS_PER_PAGE: 10,
    MAX_REQUESTS_PER_USER: 5,
  },
};
