// import axios from "axios";

// const API_BASE = "http://localhost:5000/api/search";

// // Fetch general search results (Google Custom Search All / Web)
// export const fetchAllResults = async (query, page = 1, pageSize = 10) => {
//   // type=all to specify web results in Google API backend call
//   const params = { q: query, type: "all", page, pageSize };
//   const res = await axios.get(`${API_BASE}/google`, { params });
//   return res.data;
// };

// // Fetch image search results (Google Custom Search Images)
// export const fetchImages = async (query, page = 1, pageSize = 10) => {
//   // type=images for image results
//   const params = { q: query, type: "images", page, pageSize };
//   const res = await axios.get(`${API_BASE}/google`, { params });
//   return res.data;
// };

// // Fetch video results (YouTube)
// export const fetchVideos = async (query, page = 1, pageSize = 10) => {
//   const params = { q: query, page, pageSize };
//   const res = await axios.get(`${API_BASE}/videos`, { params });
//   return res.data;
// };

// // Fetch news results (NewsAPI)
// export const fetchNews = async (query, page = 1, pageSize = 10) => {
//   const params = { q: query, page, pageSize };
//   const res = await axios.get(`${API_BASE}/news`, { params });
//   return res.data;
// };


// // Fetch results WITH AI summary
// export const fetchResultsWithSummary = async (query, page = 1, pageSize = 10) => {
//   const params = { q: query, page, pageSize };
//   const res = await axios.get(`${API_BASE}/with-summary`, { params });
//   return res.data; // yeh backend se aayega { results: [...], aiSummary: "..." }
// };
















import axios from "axios";

const API_BASE = "http://localhost:5000/api/search";

// Fetch general search results (Google Custom Search All / Web)
export const fetchAllResults = async (query, page = 1, pageSize = 10) => {
  // type=all to specify web results in Google API backend call
  const params = { q: query, type: "all", page, pageSize };
  const res = await axios.get(`${API_BASE}/google`, { params });
  return res.data;
};

// Fetch image search results (Google Custom Search Images)
export const fetchImages = async (query, page = 1, pageSize = 10) => {
  // type=images for image results
  const params = { q: query, type: "images", page, pageSize };
  const res = await axios.get(`${API_BASE}/google`, { params });
  return res.data;
};

// Fetch video results (YouTube)
export const fetchVideos = async (query, page = 1, pageSize = 10) => {
  const params = { q: query, page, pageSize };
  const res = await axios.get(`${API_BASE}/videos`, { params });
  return res.data;
};

// Fetch news results (NewsAPI)
export const fetchNews = async (query, page = 1, pageSize = 10) => {
  const params = { q: query, page, pageSize };
  const res = await axios.get(`${API_BASE}/news`, { params });
  return res.data;
};

// Fetch results WITH AI summary (first page)
export const fetchResultsWithSummary = async (query, page = 1, pageSize = 10) => {
  const params = { q: query, page, pageSize };
  const res = await axios.get(`${API_BASE}`, { params }); // ✅ call `/api/search`
  return res.data; // backend se aayega { results: [...], aiSummary: "..." }
};
