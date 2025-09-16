
import React, { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Divider,
  Checkbox,
  useMediaQuery
} from "@mui/material";
import {
  OpenInNew,
  History,
  Download,
  Print,
  ZoomIn,
  ZoomOut,
  Brightness7,
  Brightness4,
  Person,
  Info,
  Settings,
  Translate
} from "@mui/icons-material";
import { Link } from "react-router-dom";

import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

const RedDot = () => (
  <Box
    sx={{
      width: 10,
      height: 10,
      borderRadius: "50%",
      bgcolor: "#ef2323",
      display: "inline-block",
      mr: 1
    }}
  />
);

export default function MenuBar({
  onZoomChange,
  onNewTab,
  darkMode,
  setDarkMode,
  onNewWindow,
  onPrint
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [zoom, setZoom] = useState(100);
  const [desktopView, setDesktopView] = useState(false);
  const { t } = useTranslation();

  const handleZoom = (dir) => {
    setZoom((prev) => {
      let next =
        dir === "+"
          ? Math.min(prev + 10, 300)
          : Math.max(prev - 10, 30);
      onZoomChange && onZoomChange(next);
      return next;
    });
  };

  /** Reusable menu item **/
  const MenuItem = ({ icon, label, shortcut, disabled, onClick, component, to }) => (
    <Box
      component={component || "div"}
      to={to}
      onClick={disabled ? undefined : onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        py: 0.75,
        px: 1.5,
        color: disabled
          ? theme.palette.text.disabled
          : theme.palette.text.primary,
        opacity: disabled ? 0.5 : 1,
        fontSize: "0.85rem",
        cursor: disabled ? "default" : "pointer",
        borderRadius: 1,
        textDecoration: "none", 
        transition: "background-color 0.15s ease",
        "&:hover": {
          backgroundColor: !disabled
            ? theme.palette.action.hover
            : "transparent"
        }
      }}
    >
      <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>{label}</Box>
      {!isMobile && shortcut && (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.75rem"
          }}
        >
          {shortcut}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        width: 245,
        bgcolor: theme.palette.background.paper,
        borderRadius: 3,
        boxShadow: 2,
        mx: "auto",
        mt: 2,
        pb: 1.5,
        border: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
        fontSize: "0.8rem",
        overflow: "hidden",
        zIndex: 3
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          fontWeight: 600,
          py: 1,
          letterSpacing: 1,
          fontSize: "1rem"
        }}
      >
        Connect
      </Typography>
      <Divider />

      <MenuItem
        icon={<OpenInNew fontSize="small" />}
        label={t("menu.newTab")}
        shortcut="Ctrl+T"
        onClick={onNewTab}
      />

      <MenuItem
        icon={<OpenInNew fontSize="small" />}
        label={t("menu.newWindow")}
        shortcut="Ctrl+N"
        onClick={onNewWindow}
      />

      <MenuItem
        icon={<OpenInNew fontSize="small" />}
        label={t("menu.newIncognito")}
        shortcut="Ctrl+Shift+N"
      />

      <Divider />
      <MenuItem
        component={Link}
        to="/settings/history"
        icon={<History fontSize="small" />}
        label={t("menu.history")}
        shortcut="Ctrl+H"
      />
      <MenuItem
        component={Link}
        to="/settings/downloads"
        icon={<Download fontSize="small" />}
        label={t("menu.downloads")}
        shortcut="Ctrl+J"
      />

      {/* PRINT BUTTON HOOKED TO react-to-print */}
      <MenuItem
        icon={<Print fontSize="small" />}
        label={t("menu.print")}
        shortcut="Ctrl+Shift+P"
        onClick={onPrint}
      />

      <Divider />
      {isMobile ? (
        <MenuItem
          icon={
            <Checkbox
              checked={desktopView}
              onChange={(e) => setDesktopView(e.target.checked)}
              size="small"
            />
          }
          label="Desktop view"
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            py: 0.5,
            px: 1.5
          }}
        >
          <ZoomOut
            sx={{
              mr: 1,
              color: theme.palette.text.secondary,
              fontSize: "1rem"
            }}
          />
          <Typography sx={{ flex: 1, fontSize: "0.8rem" }}>
            {t("menu.zoom")}
          </Typography>
          <IconButton
            size="small"
            onClick={() => handleZoom("-")}
            disabled={zoom <= 30}
            sx={{
              color: theme.palette.text.primary,
              mx: 0.25,
              "&:hover": { background: theme.palette.background.searchBox }
            }}
          >
            <ZoomOut fontSize="small" />
          </IconButton>
          <Typography
            sx={{
              minWidth: 28,
              textAlign: "center",
              fontSize: "0.75rem"
            }}
          >
            {zoom}%
          </Typography>
          <IconButton
            size="small"
            onClick={() => handleZoom("+")}
            disabled={zoom >= 300}
            sx={{
              color: theme.palette.text.primary,
              mx: 0.25,
              "&:hover": { background: theme.palette.background.searchBox }
            }}
          >
            <ZoomIn fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Divider />
      <MenuItem
        icon={
          darkMode ? (
            <Brightness7 fontSize="small" />
          ) : (
            <Brightness4 fontSize="small" />
          )
        }
        label={t("menu.dayNight")}
        onClick={() => {
        const newMode = !darkMode;
        setDarkMode(newMode); // toggle state
        localStorage.setItem("darkMode", newMode); //  save preference
        }}
      />
      <MenuItem
        component={Link}
        to="/settings/profile"
        icon={<Person fontSize="small" />}
        label={t("menu.profile")}
      />

      <Divider />

      <MenuItem
        component={Link}
        to="/settings/language"
        icon={<Translate fontSize="small" />}
        label={t("menu.language")}
      />
      <MenuItem icon={<RedDot />} label={t("menu.upcoming2")} disabled />

      <Divider />
      <MenuItem
        component={Link}
        to="/about"
        icon={<Info fontSize="small" />}
        label={t("menu.about")}
      />
      <MenuItem
        component={Link}
        to="/settings"
        icon={<Settings fontSize="small" />}
        label={t("menu.settings")}
      /> 
    </Box>
  );
}
