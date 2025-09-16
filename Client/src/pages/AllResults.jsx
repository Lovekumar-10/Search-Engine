














import { useEffect, useState, useRef } from "react";
import Skeleton from '@mui/material/Skeleton';


import { Container, Box, Typography, Link, Button, useTheme, useMediaQuery } from "@mui/material";
import { fetchAllResults, fetchResultsWithSummary } from "../api/api";
import { useLocation } from "react-router-dom";
import SearchTabs from "../components/SearchTabs"; 
import AISummaryCard from "../components/AISummaryCard";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";

function AllResults() {
  const location = useLocation();
  const { t } = useTranslation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [aiSummary, setAiSummary] = useState(""); 

  const [aiSummaryLoading, setAiSummaryLoading] = useState(false); // NEW


  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const cache = useRef({});
  

  const [selectedTab, setSelectedTab] = useState("all");


const fetchResults = async (pageNumber = 1) => {
  if (!query) return;

  // Check cache first
  const cachedData = cache.current?.[query];
  if (cachedData && pageNumber <= cachedData.page) {
    setResults(cachedData.results.slice(0, pageNumber * 10));
    setPage(pageNumber);
    setHasMore(cachedData.hasMore);
    setAiSummary(cachedData.aiSummary || "");
    return;
  }

  setLoading(true);

  try {
    let data;
    const items = [];

    // Fetch search results first (all pages)
    if (pageNumber === 1) {
      // For first page, fetch results WITHOUT waiting for AI summary
      const res = await fetchAllResults(query, pageNumber, 10);
      data = res;
      items.push(...(res.results || []));

      // Start AI summary fetch in parallel
      setAiSummaryLoading(true);
      fetchResultsWithSummary(query, pageNumber, 10)
        .then((summaryData) => {
          setAiSummary(summaryData.aiSummary || ""); // update AI summary
          // also cache AI summary
          cache.current[query] = {
            ...(cache.current[query] || {}),
            aiSummary: summaryData.aiSummary || "",
          };
        })
        .catch(() => {
          setAiSummary(""); // reset on error
        })
        .finally(() => {
          setAiSummaryLoading(false); // stop skeleton
        });
    } else {
      // Subsequent pages → only fetch results
      const res = await fetchAllResults(query, pageNumber, 10);
      data = res;
      items.push(...(res.results || []));
    }

    // Merge new results with previous ones
    setResults((prev) => {
      const existingLinks = new Set(prev.map((item) => item.link));
      const newItems = items.filter((item) => !existingLinks.has(item.link));
      const combined = pageNumber === 1 ? items : [...prev, ...newItems];

      // Save in cache
      cache.current[query] = {
        results: combined,
        page: pageNumber,
        hasMore: pageNumber < 5 && items.length === 10,
        aiSummary: cache.current[query]?.aiSummary || "",
      };

      return combined;
    });

    setPage(pageNumber);
    setHasMore(pageNumber < 5 && items.length === 10);
  } catch (error) {
    console.error("❌ Error fetching results:", error);
    setHasMore(false);
    setAiSummary("");
    setAiSummaryLoading(false);
  } finally {
    setLoading(false);
  }
};


// --- Cleanup EventSource when query changes or component unmounts ---
  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
    fetchResults(1);
  }, [query]);

  const handleTabChange = (tabValue) => {
    setSelectedTab(tabValue);
    // Optionally, navigate or update URL here to reflect changed tab
  };

  return (
<Container
  maxWidth="md"
  sx={{
    mt: { xs: 0, md: 2 },          
    py: { xs: 0, md: 2 },
    minHeight: { md: "80vh" },
    bgcolor: theme.palette.background.default,
    borderRadius: 3,
    display: "flex",
    flexDirection: "column",
  }}
>
  <SearchTabs query={query} selectedTab={selectedTab} onTabChange={handleTabChange} />

  <Typography
    variant={isMobile ? "body2" : "h6"}
    sx={{
      my: 2,
      color: theme.palette.text.secondary,
      fontSize: { xs: "0.85rem", sm: "1rem" },
    }}
  >
    {/* Showing <b>{results.length}</b> results for <b>{query}</b> */}
     <Trans
        i18nKey="ResultShowing.title1"
        values={{ count: results.length, query }}
        components={{ b: <b /> }}
      />
  </Typography>

  <Box
    sx={{
      overflowY: "auto",
      flex: 1,
      pr: { xs: 0, sm: 0 },
      maxHeight: { xs: "80vh", sm: "70vh" },
      scrollbarWidth: "none", // Hide scrollbar in Firefox
      "&::-webkit-scrollbar": { width: 0, height: 0 }, // Hide scrollbar in WebKit browsers
    }}
  >
  
{aiSummaryLoading ? (
  <Box sx={{ mb: 2 }}>
    <Skeleton variant="rectangular" width="100%" height={80} animation="wave" />
    <Skeleton width="90%" />
    <Skeleton width="60%" />
  </Box>
) : (
  aiSummary && <AISummaryCard query={query} summary={aiSummary} />
)}


    {results.map((res, idx) => (
      <Box
        key={res.link || idx}
        sx={{
          display: "flex",
          gap: { xs: 1, sm: 2 },
          alignItems: "flex-start",
          mb: { xs: 2, sm: 3 },
          p: { xs: 1, sm: 2 },
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          backgroundColor: theme.palette.background.paper,
        }}
      >
   
        <Box
          component="img"
          src={`https://www.google.com/s2/favicons?sz=32&domain_url=${res.link}`}
          alt="favicon"
          sx={{
            width: { xs: 16, sm: 24 },
            borderRadius: 1.3,
            height: { xs: 16, sm: 24 },
            flexShrink: 0,
            mt: "4px",
          }}
          loading="lazy"
        />
        <Box sx={{ flex: 1 }}>
          <Link
            href={res.link}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              fontWeight: 600,
              color: "#2a6cf9f2",
              fontSize: { xs: "0.85rem", sm: "1rem" },
              mb: 0.5,
              display: "block",
              wordBreak: "break-word",
            }}
          >
            {res.title || res.displayLink}
          </Link>

          <Typography
            variant="body2"
            color={theme.palette.text.secondary}
            sx={{
              lineHeight: 1.4,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            {res.snippet}
          </Typography>

          <Typography
            variant="caption"
            color={theme.palette.text.secondary}
            sx={{
              mt: 0.25,
              fontSize: { xs: "0.6rem", sm: "0.75rem" },
            }}
          >
            {res.displayLink}
          </Typography>
        </Box>
      </Box>
    ))}
    

    {!results.length && !loading && (
      <Typography
        color={theme.palette.text.secondary}
        textAlign="center"
        sx={{ fontSize: { xs: "0.75rem", sm: "1rem" } }}
      >
        {t("ResultShowing.subtitle1")}
      </Typography>
    )}

    {hasMore && !loading && results.length > 0 && (
      <Box sx={{ textAlign: "center", my: 5,}}>
        <Button variant="contained" onClick={() => fetchResults(page + 1)}>
           {t("ResultShowing.btn1")}
        </Button>
      </Box>
    )}

    {loading && (
      <Typography
        sx={{ textAlign: "center", my: 2, fontSize: { xs: "0.75rem", sm: "1rem" } }}
      >
         {t("ResultShowing.loading1")}
      </Typography>
    )}
  </Box>
</Container>

  );
}

export default AllResults;



















