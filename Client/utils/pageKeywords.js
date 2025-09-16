

export const pageKeywords = {
  all: [], // default page
  images: ["image", "images", "pic", "photo", "photos", "picture", "pictures"],
  videos: ["video", "videos", "youtube", "clip", "movie", "reel"],
  news: ["news", "headlines", "article", "articles", "breaking"]
};

// Function to detect page based on query
export const detectPageFromQuery = (query) => {
  const lower = query.toLowerCase();

  for (const [page, keywords] of Object.entries(pageKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return page;
    }
  }
  return "all"; // fallback
};
