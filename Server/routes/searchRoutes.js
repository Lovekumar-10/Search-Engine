


const express = require("express");
const { searchWithSummary } = require("../controllers/searchAIController");

const {
  searchGoogle,
  searchVideos,
  searchNews,
} = require("../controllers/searchController");

const router = express.Router();


router.get("/", searchWithSummary);

router.get("/google", searchGoogle);

router.get("/videos", searchVideos);

router.get("/news", searchNews);

module.exports = router;
