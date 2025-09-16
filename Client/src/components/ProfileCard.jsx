


// src/components/ProfileCard.js
import React from "react";
import {
  Paper,
  Box,
  Typography,
  Divider,
  Avatar,
  Button,
  Stack,
} from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTranslation } from "react-i18next";

const GoogleSvgIcon = () => (
  <img
    src="https://www.svgrepo.com/show/380993/google-logo-search-new.svg"
    alt="Google"
    style={{ width: 20, height: 20 }}
  />
);

const ProfileCard = ({ isLoggedIn, user, onLogout }) => {
  const { t } = useTranslation();  


  return (
    <Paper
      elevation={4}
      sx={{
        width: 260,
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Top user info */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        {/* Avatar with green tick */}
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Avatar
            // alt={user?.name || "Guest"}
            alt={user?.name || t("profileCard.name")}
            src={user?.photo || ""}   // user's Google photo
            sx={{ width: 48, height: 48 }}
          >
          {!user?.photo && user?.name?.charAt(0).toUpperCase()} {/* show first letter if no photo */}
          </Avatar>

          {isLoggedIn && (
            <CheckCircleIcon
              sx={{
                position: "absolute",
                top: -2,
                right: -2,
                color: "green",
                bgcolor: "white",
                borderRadius: "50%",
                fontSize: 16,
                border: "1px solid white",
              }}
            />
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
           
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            {user?.name || t("profileCard.name")}
          </Typography>
          <Typography variant="body2" color="text.secondary"    sx={{ fontSize:"10px"}} >
            {/* {user?.email || "Not signed in"} */}
            {user?.email || t("profileCard.SignIn")}
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Show different actions depending on login state */}
      <Box sx={{ p: 2 }}>
        {isLoggedIn ? (
          <Stack spacing={1.5}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
               {t("profileCard.manage")}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{ textTransform: "none", fontWeight: 500 }}
              onClick={onLogout}
            >
              {t("profileCard.SignOut")}
            </Button>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {/* Google Button */}
            <Button
              variant="contained"
              fullWidth
              startIcon={<GoogleSvgIcon />}
              sx={{
                backgroundColor: "#fff",
                color: "#3c4043",
                fontWeight: 500,
                textTransform: "none",
                border: "1px solid #dadce0",
                "&:hover": {
                  backgroundColor: "#f7f7f7",
                },
              }}
              onClick={() => {
                // Redirect to backend Google login route
                window.location.href = "http://localhost:5000/auth/google";
              }}
            >
             {t("profileCard.LoginWith1")}
            </Button>

            {/* Github Button */}
            <Button
              variant="contained"
              fullWidth
              startIcon={<GitHubIcon />}
              sx={{
                backgroundColor: "#ffffff",
                color: "#3c4043",
                fontWeight: 500,
                textTransform: "none",
                border: "1px solid #dadce0",
                "&:hover": {
                  backgroundColor: "#f7f7f7",
                },
              }}
              onClick={() => {
                // Redirect to backend GitHub login route
                window.location.href = "http://localhost:5000/auth/github";
              }}
            >
               {t("profileCard.LoginWith2")}
            </Button>

          </Stack>
        )}
      </Box>
    </Paper>
  );
};

export default ProfileCard;
