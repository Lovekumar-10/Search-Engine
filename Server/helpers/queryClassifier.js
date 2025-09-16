// helpers/queryClassifier.js
function needsSummary(query) {
  const summaryKeywords = [
  "best", "better", "compare", "comparison", "vs", "versus", "top", "review", "reviews",
  "rating", "rank", "ranking", "cheapest", "affordable", "worth it", "buy", "purchase",
   "difference", "pros", "cons", "advantages", "disadvantages",
  "guide", "overview", "summary", "recommendation", "recommended",
  "what", "who", "when", "where", "why", "how", "which", "do", "is", "are",
  "will", "should", "could"
];

  
  // Agar query me keyword hai to summary generate karo
  if (summaryKeywords.some(kw => query.toLowerCase().includes(kw))) {
    return true;
  }

  // Agar query bahut short hai (1-2 words), summary skip karo
  if (query.split(" ").length < 3) {
    return false;
  }

  return true; // default
}

module.exports = { needsSummary };
