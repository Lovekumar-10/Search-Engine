

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

export default function SettingNav() {
   const { t } = useTranslation();  
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const pages = [
  { label:  t("settings.history"), path: "/settings/history" },
  { label: t("settings.downloads"), path: "/settings/downloads" },
  { label: t("settings.appearance"), path: "/settings/appearance" },
  { label: t("settings.language"), path: "/settings/language" },
  { label: t("settings.profile"), path: "/settings/profile" },
];

  const drawer = (
  
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {t("settings.title")}
      </Typography>
      <List>
        {pages.map((page) => (
          <ListItem key={page.path} disablePadding>
            <ListItemButton
              component={NavLink}
              to={page.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: "30px",
                mx: 1,
                my: 0.5,
                "&.active": {
                  bgcolor: "#ff6c6c",
                  color: "#fff",
                },
                "&:hover": {
                  bgcolor: "rgba(255, 108, 108, 0.12)",
                  transition: "0.2s",
                },
              }}
            >
              <ListItemText primary={page.label} sx={{ textAlign: "center" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow:3 ,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: { xs: 40, sm: 40, md: 40 },
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { md: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", textAlign: "left" }}
          >
            {t("settings.title")}
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {pages.map((page) => (
              <NavLink
                key={page.path}
                to={page.path}
                end={page.path === "/settings/profile"}
                style={{ textDecoration: "none" }}
              >
                {({ isActive }) => (
                  <Box
                    sx={{
                      px: 2,
                      py: 0.7,
                      borderRadius: "30px",
                      color: isActive ? "#fff" : "text.primary",
                      bgcolor: isActive ? "#ff6c6c" : "transparent",
                      fontWeight: isActive ? 600 : 400,
                      transition: "0.3s",
                      "&:hover": {
                        bgcolor: isActive
                          ? "#ff6c6c"
                          : "rgba(255, 108, 108, 0.12)",
                      },
                    }}
                  >
                    {page.label}
                  </Box>
                )}
              </NavLink>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 240,
            bgcolor: "background.paper",
            color: "text.primary",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
