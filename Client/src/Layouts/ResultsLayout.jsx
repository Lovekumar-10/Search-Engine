// src/components/ResultsLayout.jsx
import React from "react";
import { Container, Box, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import SearchTabs from "../components/SearchTabs";

export default function ResultsLayout({
  query,
  // selectedTab,
  // onTabChange,  
  // onTabChange,  
  count = 0,
  typeLabel = "results",
  hasMore,
  loading,
  onLoadMore,
  children,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 2,
        py: 2,
        minHeight: { md: "80vh" },
        bgcolor: theme.palette.background.default,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SearchTabs />

      <Typography variant={isMobile ? "body1" : "h6"} sx={{ my: 2, color: theme.palette.text.secondary }}>
        Showing <b>{count}</b> {typeLabel} for <b>{query}</b>
      </Typography>

      <Box
        sx={{
          overflowY: "auto",
          flex: 1,
          pr: { xs: 0, sm: 2 },
          maxHeight: { xs: "60vh", sm: "70vh" },
          "&::-webkit-scrollbar": { width: 8 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.divider,
            borderRadius: 2,
          },
          scrollbarWidth: "thin",
        }}
      >
        {children}

        {count === 0 && !loading && (
          <Typography color="gray" textAlign="center">
            No {typeLabel} found.
          </Typography>
        )}

        {hasMore && !loading && count > 0 && (
          <Box sx={{ textAlign: "center", my: 2 }}>
            <Button variant="contained" onClick={onLoadMore}>
              Load More
            </Button>
          </Box>
        )}

        {loading && (
          <Typography sx={{ textAlign: "center", my: 2 }}>Loading...</Typography>
        )}
      </Box>
    </Container>
  );
}
