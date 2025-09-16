import { NavLink, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

function SearchTabs() {
  const location = useLocation();
  const { t } = useTranslation(); 
  const q = new URLSearchParams(location.search).get("q") || "";

  const tabs = [
    { label:t("searchTab.labelName1"), path: "/AIMode" },
    { label:t("searchTab.labelName2"), path: "/search" },
    { label:t("searchTab.labelName3"), path: "/search/images" },
    { label:t("searchTab.labelName4"), path: "/search/videos" },
    { label:t("searchTab.labelName5"), path: "/search/news" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
          gap: { xs: 1.2, sm: 2, md: 4, lg: 4 }, // responsive gap
        borderBottom: "1px solid #ddd",
        px: 2,
        mb: 0.2,
      }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={`${tab.path}?q=${encodeURIComponent(q)}`}
          end={tab.path === "/search"}
          style={({ isActive }) => ({
            textDecoration: "none",
            color: isActive ? "#1a73e8" : "#5f6368",
            fontWeight: isActive ? "bold" : "normal",
            borderBottom: isActive ? "3px solid #1a73e8" : "3px solid transparent",
            padding: "12px 8px",
            transition: "all 0.2s ease-in-out",
          })}
        >
          {tab.label}
        </NavLink>
      ))}
    </Box>
  );
}

export default SearchTabs;



