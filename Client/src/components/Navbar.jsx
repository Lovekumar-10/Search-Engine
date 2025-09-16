
import React, { useState } from "react";
import {
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Popper,
  ClickAwayListener,
  Avatar
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Search,
  Menu,
  Refresh,
  Brightness4,
  Brightness7
} from "@mui/icons-material";

import ProfileCard from "./ProfileCard";
import MenuBar from "./MenuBar";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useSearch } from "../hooks/useSearch"; 
import { detectPageFromQuery } from "../../utils/pageKeywords";

import { useNavigate } from "react-router-dom";


const Navbar = ({
  onSearch,
  onRefresh,
  refreshing,
  darkMode,
  setDarkMode,
  onNewTab,
  onNewWindow,
  onPrint,
  user,
  isLoggedIn,
  onLogout
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const theme = useTheme();
  
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  const goForward = () => navigate(1);



  const { search } = useSearch(); // use shared search

  const submitSearch = () => {
  if (!query.trim()) return;
 
   onSearch?.(query);      
   search(query);          
 
   // Detect which page to go to
   const page = detectPageFromQuery(query);
   const url =
     page === "all"
       ? `/search?q=${encodeURIComponent(query)}`
       : `/search/${page}?q=${encodeURIComponent(query)}`;
 
   navigate(url);         
  //  setQuery("");           
 };


  const navIconStyle = {
    fontSize: 18,
    color: theme.palette.icon,
    "&:hover": { backgroundColor: theme.palette.background.searchBox },
    "&:active": { backgroundColor: theme.palette.background.searchBox }
  };

const handleProfileClick = (event) => {
  if (profileAnchorEl && profileAnchorEl === event.currentTarget) {
    // if already open, close it
    setProfileAnchorEl(null);
  } else {
    // otherwise open it
    setProfileAnchorEl(event.currentTarget);
  }
};


  const handleMenuClick = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(menuAnchorEl ? null : event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submitSearch();
  };

  const profileOpen = Boolean(profileAnchorEl);
  const menuOpen = Boolean(menuAnchorEl);

  return (
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "5px",
        minHeight: { xs: "40px", sm: "40px" }
      }}
    >
      {/* Left Icons */}
      <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 0.5 }}>
        <IconButton sx={navIconStyle} title="Click to go back" onClick={() => navigate(-1)}>
          <ArrowBack sx={{ fontSize: 20 }} />
        </IconButton>
        <IconButton sx={navIconStyle} title="Click to go forward" onClick={() => navigate(1)}>
          <ArrowForward sx={{ fontSize: 20 }} />
        </IconButton>

        <IconButton sx={navIconStyle} onClick={onRefresh} title="Reload this page">
          <Refresh
            sx={{
              fontSize: 20,
              animation: refreshing ? "spin 1s linear infinite" : "none",
              "@keyframes spin": {
                from: { transform: "rotate(0deg)" },
                to: { transform: "rotate(360deg)" }
              }
            }}
          />
        </IconButton>
      </Box>

      {/* Center Search */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: theme.palette.background.searchBox,
          border:"1px solid #c2c2c271",
          borderRadius: "50px",
          padding: "0 8px",
          width: { xs: "80%", sm: "50%" },
          marginTop: "5px"
        }}
      >
        <IconButton onClick={submitSearch} title="Search">
          <Search />
        </IconButton>
        <InputBase
          placeholder={t("searchBar.placeholder")}
          sx={{ color: theme.palette.text.primary, marginLeft: 1, flex: 1 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </Box>

      {/* Right Icons */}
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {/* Profile Icon */}
        <IconButton
          sx={{
            padding: 0,
            "&:hover": { backgroundColor: "transparent" },
            "&:active": { backgroundColor: "transparent" }
          }}
          onClick={handleProfileClick}
          title="Profile"
        >
          <Avatar
            alt={user?.name || "Guest"}
            src={user?.photo || ""}
            sx={{ width: 28, height: 28 }}
          >
            {!user?.photo && user?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        {/* Profile Popup */}
        <Popper
          open={profileOpen}
          anchorEl={profileAnchorEl}
          placement="bottom-end"
          modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
        >
          <ClickAwayListener 
            onClickAway={(e) => {
                if (profileAnchorEl && !profileAnchorEl.contains(e.target)) {
                 setProfileAnchorEl(null);
                }
             }}
           >
            <div>
              <ProfileCard
                user={user}
                isLoggedIn={isLoggedIn}
                onLogout={onLogout}
              />
            </div>
          </ClickAwayListener>
        </Popper>

        {/* Dark Mode */}
        <IconButton
          onClick={() => {
            const newMode = !darkMode;
            setDarkMode(newMode);
            localStorage.setItem("darkMode", newMode);
          }}
          sx={{ ...navIconStyle, display: { xs: "none", sm: "flex" } }}
          aria-label="toggle dark mode"
          title="Day/Night Mode"
        >
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        {/* Menu */}
        <IconButton
          sx={navIconStyle}
          title="Customize and control Search Engine"
          onClick={handleMenuClick}
        >
          <Menu />
        </IconButton>

        {/* MenuBar Popup */}
        <Popper
          open={menuOpen}
          anchorEl={menuAnchorEl}
          placement="bottom-end"
          modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
        >
          <ClickAwayListener
            onClickAway={(e) => {
              if (menuAnchorEl && !menuAnchorEl.contains(e.target)) {
                closeMenu();
              }
            }}
          >
            <div>
              <MenuBar
                onZoomChange={(value) => console.log("Zoom changed:", value)}
                onNewTab={() => {
                  closeMenu();
                  onNewTab();
                }}
                onNewWindow={() => {
                  closeMenu();
                  onNewWindow();
                }}
                onPrint={() => {
                  closeMenu();
                  onPrint();
                }}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                closeMenu={closeMenu}
              />
            </div>
          </ClickAwayListener>
        </Popper>
      </Box>
    </Toolbar>
  );
};

export default Navbar;
