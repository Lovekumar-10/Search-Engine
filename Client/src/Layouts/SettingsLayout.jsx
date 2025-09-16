


import React from "react";
import { Box, Container } from "@mui/material";
import SettingNav from "../components/SettingNav";
import { Outlet } from "react-router-dom";

export default function SettingsLayout() {
  return (
    <Box sx={{ bgcolor: "#1e1e1e", minHeight: "100vh", color: "#fff" }}>
      {/* Only render SettingNav; SettingNav includes AppBar and Toolbar */}
      <SettingNav />
      
      {/* Page content */}
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
