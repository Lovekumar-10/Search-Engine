

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
  CardActionArea,
  CardContent,
  CardMedia,
} from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useEffect, useState, useRef } from "react";
import { fetchVideos } from "../api/api"; // backend helper

function VideoResults() {
  const { t } = useTranslation();
  const query = new URLSearchParams(useLocation().search).get("q") || "";
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("videos");
  const cache = useRef({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchResults = async (newPage = 1) => {
    if (!query) return;

    // Check cache
    const cachedData = cache.current?.[query]?.[selectedTab];
    if (cachedData && newPage <= cachedData.page) {
      setVideos(cachedData.results.slice(0, newPage * 10));
      setPage(newPage);
      setHasMore(cachedData.hasMore);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchVideos(query, newPage, 10);
      const items = data.results || [];

      setVideos((prev) => {
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
      console.error("Error fetching videos:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setVideos([]);
    setPage(1);
    setHasMore(true);
    fetchResults(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {/* Showing <b>{videos.length}</b> videos for <b>{query}</b> */}
           <Trans
              i18nKey="ResultShowing.title3"
              values={{ count: videos.length, query }}
              components={{ b: <b /> }}
            />
      </Typography>

      <Box
        sx={{
          overflowY: "auto",
          flex: 1,
          pr: { xs: 0, sm: 0 },
          maxHeight: { xs: "80vh", sm: "80vh" },
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { width: 0, height: 0 },
        }}
      >
        {videos.map((video) => (
          <Card
            key={video.id.videoId}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              mb: 2,
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "background.paper",
              boxShadow: 1,
              maxWidth: 720,
              width: "100%",
            }}
          >
            <CardActionArea
              component="a"
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener"
              sx={{
                display: "flex",
                alignItems: "stretch",
                width: "100%",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <CardMedia
                component="img"
                image={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                sx={{
                  width: { xs: "100%", sm: 180 },
                  height: { xs: 180, sm: 100 },
                  objectFit: "cover",
                  flexShrink: 0,
                  borderRadius: { xs: 0, sm: 1 },
                  margin: { xs: 0, sm: 1.5 },
                }}
              />

              <CardContent
                sx={{
                  flex: 1,
                  paddingLeft: { xs: 2, sm: 1 },
                  paddingTop: { xs: 1.5, sm: 1.5 },
                  paddingBottom: { xs: 1.5, sm: 1.5 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <YouTubeIcon sx={{ color: "#FF0000", fontSize: "1rem", mr: 0.5 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      YouTube &nbsp; • &nbsp; {video.snippet.channelTitle}
                    </Typography>
                  </Box>

                  <Typography
                    variant="subtitle1"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      lineHeight: 1.3,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      color: "primary.main",
                      cursor: "pointer",
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                  >
                    {video.snippet.title}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, mb: 1, fontSize: { xs: "0.7rem", sm: "0.85rem" } }}
                  >
                    {new Date(video.snippet.publishedAt).toDateString()}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      fontSize: { xs: "0.8rem", sm: "1rem" },
                    }}
                  >
                    {video.snippet.description || ""}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}

        {!videos.length && !loading && (
          <Typography color="gray" textAlign="center">
             {t("ResultShowing.subtitle3")}
          </Typography>
        )}

        {hasMore && !loading && (
          <Box sx={{ textAlign: "center", my: 5 }}>
            <Button variant="contained" onClick={() => fetchResults(page + 1)}>
              {t("ResultShowing.btn3")}
            </Button>
          </Box>
        )}

        {loading && (
          <Typography sx={{ textAlign: "center", my: 2 }}>
            {t("ResultShowing.loading3")}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default VideoResults;
