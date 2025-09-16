

// src/pages/ImageResults.jsx
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
} from "@mui/material";
import { useEffect, useState } from "react";

function ImageResults() {
  const { t } = useTranslation();
  const query = new URLSearchParams(useLocation().search).get("q") || "";
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const pageSize = 10;

const fetchImages = async (newPage = 1) => {
  if (!query || !hasMore) return;

  setLoading(true);
  try {
    const params = new URLSearchParams({
      q: query,
      type: "images",
      page: newPage,
      pageSize: pageSize.toString(),
    });

    const res = await fetch(`http://localhost:5000/api/search/google?${params.toString()}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const imageItems = (data.results || []).filter(item => item.link && item.mime);

    setImages(prev => (newPage === 1 ? imageItems : [...prev, ...imageItems]));
    setPage(newPage);

    if (newPage >= 5 || imageItems.length < pageSize) setHasMore(false);
  } catch (err) {
    console.error("Error fetching images:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    setImages([]);
    setPage(1);
    setHasMore(true);
    fetchImages(1);
    // eslint-disable-next-line
  }, [query]);

  const getCols = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3; // desktop
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
      {/* --- Same top tabs as videos --- */}
      <SearchTabs query={query} selectedTab="images" />

      {/* --- Same header text format --- */}
      <Typography
       variant={isMobile ? "body2" : "h6"}
        sx={{
          my: 2,
          color: theme.palette.text.secondary,
          fontSize: { xs: "0.85rem", sm: "1rem" },
        }}
      >
        {/* Showing <b>{images.length}</b> images for <b>{query}</b> */}
        <Trans
        i18nKey="ResultShowing.title2"
        values={{ count: images.length, query }}
        components={{ b: <b /> }}
      />
      </Typography>

      {/* --- Scrollable content just like VideoResults --- */}
      <Box
        sx={{
      overflowY: "auto",
      flex: 1,
      pr: { xs: 0, sm: 0 },
      maxHeight: { xs: "80vh", sm: "80vh" },
      scrollbarWidth: "none", // Hide scrollbar in Firefox
      "&::-webkit-scrollbar": { width: 0, height: 0 }, // Hide scrollbar in WebKit browsers
    }}
      >
        {/* ---- Keep your masonry grid inside ---- */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${getCols()}, 1fr)`,
            gap: 2,
          }}
        >
          {images.map((item, idx) => (
            <Box
              key={idx}
              component="a"
              href={item.link}
              target="_blank"
              rel="noopener"
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                display: "block",
              }}
            >
              <img
                src={item.link}
                alt={item.title || "image"}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  display: "block",
                }}
                loading="lazy"
              />
            </Box>
          ))}
        </Box>

        {/* Empty state */}
        {!images.length && !loading && (
          <Typography color="gray" textAlign="center">
             {t("ResultShowing.subtitle2")}
          </Typography>
        )}

        {/* Load More Button */}
        {hasMore && !loading && images.length > 0 && (
          <Box sx={{ textAlign: "center", my: 5 }}>
            <Button variant="contained" onClick={() => fetchImages(page + 1)}>
              {t("ResultShowing.btn2")}
            </Button>
          </Box>
        )}

        {/* Loading text */}
        {loading && (
          <Typography  sx={{ textAlign: "center", my: 2, fontSize: { xs: "0.75rem", sm: "1rem" } }}>
            {t("ResultShowing.loading2")}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default ImageResults;
































