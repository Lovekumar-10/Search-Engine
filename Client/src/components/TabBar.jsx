import React from "react";
import { Box, IconButton } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

// Minimal placeholder logo (theme-aware)
const PlaceholderLogo = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        bgcolor: theme.palette.text.primary,
        display: "inline-block",
        mr: 1,
        flexShrink: 0
      }}
    />
  );
};

const Favicon = ({ url }) => {
  const theme = useTheme();
  return (
    <Box
      component="img"
      src={url}
      alt="favicon"
      sx={{
        width: 16,
        height: 16,
        borderRadius: "4px",
        mr: 1,
        flexShrink: 0,
        bgcolor: theme.palette.background.searchBox,
        objectFit: "cover"
      }}
    />
  );
};

const TAB_WIDTH = 152; // fixed tab width

const TabBar = ({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  onNewTab,
  placeholderFaviconUrl
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        background: theme.palette.background.default,
        py: 0.5,
        px: 0.5,
        borderBottom: `1px solid ${theme.palette.divider}`,
        height: 40,
        userSelect: "none",
        minWidth: 0
      }}
    >
      {/* Tabs Row */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          overflowX: "auto",
          gap: 1.2,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          minWidth: 0
        }}
      >
        {tabs.map((tab, idx) => (
          <Box
            key={idx}
            onClick={() => onTabChange(idx)}
            sx={{
              display: "flex",
              alignItems: "center",
              width: TAB_WIDTH,
              px: 1.2,
              py: "7px",
              borderRadius: "15px 15px 0 0",
              background:
                idx === activeTab
                  ? theme.palette.background.paper
                  : "transparent",
              color:
                idx === activeTab
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
              boxShadow:
                idx === activeTab ? "0 1px 7px rgba(0,0,0,0.15)" : "none",
              cursor: "pointer",
              position: "relative",
              fontSize: "1rem",
              fontWeight: 500,
              overflow: "hidden",
              mr: "2px",
              minWidth: 0,
              transition: "background 0.2s",
              ...(idx !== activeTab && {
                "&:hover": {
                  background: theme.palette.background.searchBox,
                  color: theme.palette.text.primary
                }
              })
            }}
          >
            {/* Logo */}
            {tab.favicon ? (
              <Favicon url={tab.favicon} />
            ) : placeholderFaviconUrl ? (
              <Favicon url={placeholderFaviconUrl} />
            ) : (
              <PlaceholderLogo />
            )}

            {/* Title */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1.2,
                pr: 1,
                color:
                  idx === activeTab
                    ? theme.palette.text.primary
                    : theme.palette.text.secondary,
                fontWeight: 500
              }}
              title={tab.title || "New Tab"}
            >
              {tab.title || "New Tab"}
            </Box>

            {/* Close (X) */}
            <IconButton
              size="small"
              title="Close"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(idx);
              }}
              sx={{
                ml: 0.2,
                p: "4px",
                color: theme.palette.icon,
                borderRadius: "11px",
                "&:hover": {
                  background: theme.palette.background.searchBox,
                  color: theme.palette.text.primary
                }
              }}
              aria-label="Close tab"
            >
              <Close fontSize="inherit" style={{ fontSize: "16px" }} />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* Add Tab */}
      <IconButton
        onClick={onNewTab}
         title="Add new tab"
        sx={{
          ml: 1,
          width: 32,
          height: 32,
          borderRadius: "9px",
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          transition: "background 0.13s",
          "&:hover": { background: theme.palette.background.searchBox }
        }}
        aria-label="Add tab"
      >
        <Add fontSize="medium" />
      </IconButton>
    </Box>
  );
};

export default TabBar;
