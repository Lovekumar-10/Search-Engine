

import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography, Link, useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();
  const { t } = useTranslation(); 

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper, // dynamic background
        color: theme.palette.text.primary,       // dynamic text color
        py: 3,
         mb:10,
         borderTop:"2px solid #56a8ffff"
      }}
    >
      {/* Top Row */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
           {t("footer.title")}
        </Typography>
      </Box>

      {/* Bottom Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="#privacy"
          underline="hover"
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": { color: theme.palette.primary.main },
          }}
        >
          {t("footer.link1")}
        </Link>
        <Link
          href="#feedback"
          underline="hover"
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": { color: theme.palette.primary.main },
          }}
        >
           {t("footer.link2")}
        </Link>
        <Link
          href="#help"
          underline="hover"
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": { color: theme.palette.primary.main },
          }}
        >
         {t("footer.link3")}
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
