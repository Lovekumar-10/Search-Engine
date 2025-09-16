import { createTheme } from "@mui/material/styles";

// Light (Day) Theme Colors
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#FFFFFF",    // Page background
      paper: "#FFFFFF",      // Navbar, active tab background
      searchBox: "#f1f3f437"   // Search box & hover bg
    },
    text: {
      primary: "#202124",    // Main text
      secondary: "#5F6368"   // Less prominent text
    },
    divider: "#E0E0E0",      // TabBar line
    primary: {
      main: "#1A73E8"        // Accent buttons
    },
    icon: "#5F6368"        // Icon color
  }
});

// Dark (Night) Theme Colors
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#202124",
      paper: "#383b43",      // Navbar, active tab background
      searchBox: "#30313439"   // Search box & hover bg
    },
    text: {
      primary: "#E8EAED",
      secondary: "#9AA0A6"
    },
    divider: "#3C4043",
    primary: {
      main: "#8AB4F8"
    },
    icon: "#BDC1C6"
  }
});
