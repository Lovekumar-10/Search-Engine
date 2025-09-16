import { useLocation } from "react-router-dom";
import SearchTabs from "../components/SearchTabs";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import {
  Box,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  Button,
  Card,
  CardContent,
  Link,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { fetchNews } from "../api/api";

function NewsResults() {
  const { t } = useTranslation();
  const query = new URLSearchParams(useLocation().search).get("q") || "";
  const [newsList, setNewsList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("news");
  const cache = useRef({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchResults = async (newPage = 1) => {
    if (!query) return;

    const cachedData = cache.current?.[query]?.[selectedTab];
    if (cachedData && newPage <= cachedData.page) {
      setNewsList(cachedData.results.slice(0, newPage * 10));
      setPage(newPage);
      setHasMore(cachedData.hasMore);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchNews(query, newPage, 10);
      const items = data.results || [];

      setNewsList((prev) => {
        const combined = newPage === 1 ? items : [...prev, ...items];
        cache.current = {
          ...cache.current,
          [query]: {
            ...(cache.current?.[query] || {}),
            [selectedTab]: {
              results: combined,
              page: newPage,
              hasMore: newPage < 5 && items.length === 10,
            },
          },
        };
        return combined;
      });

      setPage(newPage);
      setHasMore(newPage < 5 && items.length === 10);
    } catch (err) {
      console.error("Error fetching news:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNewsList([]);
    setPage(1);
    setHasMore(true);
    fetchResults(1);
  }, [query, selectedTab]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
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
        {/* Showing <b>{newsList.length}</b> news for <b>{query}</b> */}
         <Trans
            i18nKey="ResultShowing.title4"
            values={{ count: newsList.length, query }}
            components={{ b: <b /> }}
          />
      </Typography>

      <Box
        sx={{
          overflowY: "auto",
          flex: 1,
          pr: { xs: 0, sm: 0 },
          maxHeight: { xs: "80vh", sm: "80vh" },
          "&::-webkit-scrollbar": { width: 8 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.divider,
            borderRadius: 2,
          },
          scrollbarWidth: "thin",
        }}
      >
        {newsList.map((news, idx) => (
          <Card
            key={idx}
            sx={{
              mb: 2,
              borderRadius: 2,
              overflow: "hidden",
              // Responsive width with padding to maintain spacing on small screens
              width: "100%",
              maxWidth: "100%",
            }}
          >
            <CardContent
              sx={{
                padding: 2,
                "&:last-child": { paddingBottom: 2 },
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: isMobile ? "0.65rem" : "0.75rem" }}
              >
                {new Date(news.publishedAt).toLocaleDateString()} • {news.source?.name || ""}
              </Typography>

              <Link
                href={news.url}
                target="_blank"
                rel="noopener"
                underline="hover"
                variant={isMobile ? "subtitle2" : "h6"}
                sx={{
                  fontWeight: 600,
                  display: "block",
                  mt: 0.5,
                  fontSize: isMobile ? "1rem" : "1.25rem",
                  lineHeight: 1.2,
                }}
              >
                {news.title}
              </Link>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  lineHeight: 1.4,
                }}
              >
                {news.description}
              </Typography>
            </CardContent>
          </Card>
        ))}

        {!newsList.length && !loading && (
          <Typography color="gray" textAlign="center">
            {t("ResultShowing.subtitle4")}
          </Typography>
        )}

        {hasMore && !loading && (
          <Box sx={{ textAlign: "center", my: 2 }}>
            <Button variant="contained" onClick={() => fetchResults(page + 1)}>
              {t("ResultShowing.btn4")}
            </Button>
          </Box>
        )}

        {loading && (
          <Typography sx={{ textAlign: "center", my: 2 }}>
            {t("ResultShowing.loading4")}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default NewsResults;
