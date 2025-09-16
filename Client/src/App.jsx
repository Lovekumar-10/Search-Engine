
import React, { useState, useRef, useEffect, useCallback } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./ColorTheme/theme";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import { BrowserRouter,Navigate, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Home from "./pages/Home";
import AiMode from "./pages/AiMode"
import AllResults from "./pages/AllResults";
import ImageResults from "./pages/ImageResults";
import VideoResults from "./pages/VideoResults";
import NewsResults from "./pages/NewsResults";
import AboutUs from "./pages/AboutUs";


import TabBar from "./components/TabBar";
import Navbar from "./components/Navbar";


// Settings pages like history , dowloads etc
import SettingsLayout from "./Layouts/SettingsLayout";
import DownloadsPage from "./pages/Settings/DownloadsPage";

import HistoryPage from "./pages/Settings/HistoryPage";
import LanguagePage from "./pages/Settings/LanguagePage";
import AppearancePage from "./pages/Settings/AppearancePage";
import ProfilePage from "./pages/Settings/ProfilePage";



export default function App() {

  const [darkMode, setDarkMode] = useState(
  localStorage.getItem("darkMode") === "true" //  read saved value
);


  const [tabs, setTabs] = useState([{ title: "New Tab", content: "Home" }]);
  const [activeTab, setActiveTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const openedWindowsRef = useRef([]); // Stores references to opened windows
  const navigate = useNavigate();
  const location = useLocation();
  //  Ref for the print area
  const printRef = useRef(null);

//  User state
const [user, setUser] = useState(null);

//  Step 1: Check localStorage for access token on mount
useEffect(() => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    fetch('http://localhost:5000/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) setUser(data.user);
        else {
          setUser(null);
          localStorage.removeItem("accessToken");
        }
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("accessToken");
      });
  } else {
    // fallback: try refresh token (optional)
    fetch('http://localhost:5000/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          localStorage.setItem("accessToken", data.accessToken);
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }
}, []);




useEffect(() => {
  const hash = window.location.hash;
  if (hash.includes("access=")) {
    const token = hash.split("access=")[1];
    localStorage.setItem("accessToken", token);
    window.history.replaceState(null, null, window.location.pathname);
  }
}, []);



  // for opening new tabs , related to handleTabClose

  useEffect(() => {
    const currentContent = tabs[activeTab]?.content;
    if (!currentContent) return;
    // If current path is neither homepage nor search result paths, skip redirect
    if (
      location.pathname !== "/" &&
      !location.pathname.startsWith("/search")
    ) {
      // This lets routes like /settings remain unaffected
      return;
    }
    if (currentContent === "Home") {
      if (location.pathname !== "/") {
        navigate("/");
      }
    } else if (currentContent.startsWith("Results for:")) {
      const query = currentContent.replace("Results for: ", "");
      if (
        location.pathname === "/search" ||
        !location.pathname.startsWith("/search")
      ) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  }, [activeTab, tabs, navigate, location.pathname]);
  //  This function will only print the area inside printRef
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: tabs[activeTab]?.title || "Search Results"
  });
  // Keyboard shortcut handler for Ctrl+P / Cmd+P
  const handleKeyDown = useCallback(
    (event) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey;
      if (ctrlOrCmd && event.key.toLowerCase() === "p") {
        event.preventDefault(); // stop default browser print
        handlePrint(); //use our section-only print
      }
    },
    [handlePrint]
  );
  // Add/remove keyboard listener
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
  const handleNewTab = () => {
    setTabs([...tabs, { title: "New Tab", content: "Home" }]);
    setActiveTab(tabs.length);
    navigate("/");   // redirect new tab to homepage
  };
  // Open / close window
  const handleNewWindow = () => {
    window.open(window.location.href, "_blank", "noopener,noreferrer");
  };
  const handleTabClose = (index) => {
    const updatedTabs = tabs.filter((_, i) => i !== index);
    setTabs(updatedTabs);
    if (activeTab === index) {
      
      setActiveTab(index > 0 ? index - 1 : 0);
    } else if (activeTab > index) {
   
      setActiveTab(activeTab - 1);
    }
    
  };
  const handleSearch = (query) => {
    if (tabs[activeTab]?.content === "Home") {
      // Replace the HOME tab, do not add new
      const updatedTabs = [...tabs];
      updatedTabs[activeTab] = { title: query, content: `Results for: ${query}` };
      setTabs(updatedTabs);
    } else {
      // For other tabs, update their content on search as before
      const updatedTabs = [...tabs];
      updatedTabs[activeTab] = { title: query, content: `Results for: ${query}` };
      setTabs(updatedTabs);
    }
  };
  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onTabClose={handleTabClose}
        onNewTab={handleNewTab}
      />
      <Navbar
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onNewTab={handleNewTab}
        onNewWindow={handleNewWindow}
        onPrint={handlePrint} 
        user={user}              
        isLoggedIn={!!user}
        onLogout={() => {
        localStorage.removeItem("accessToken");
          setUser(null);
        }}
      />

      <div ref={printRef}>
        <Routes key={location.pathname + location.search} >




         {/* page setup for settings */}
        <Route path="/settings" element={<SettingsLayout />}>
    
          <Route element={<ProfilePage />} />

          {/* History & Downloads are now inside Settings */}
          <Route path="history" element={<HistoryPage />} />
          <Route path="downloads" element={<DownloadsPage />} />

          {/* Other setting pages */}
          <Route path="appearance" element={<AppearancePage />} />
          <Route path="language" element={<LanguagePage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>



         
          {/* Homepage (search bar only) */}
          <Route path="/" element={<Home onSearch={handleSearch} />} />
          {/* Search Results */}
          <Route path="/AIMode" element={<AiMode />} />
          <Route path="/search" element={<AllResults />} />
          <Route path="/search/images" element={<ImageResults />} />
          <Route path="/search/videos" element={<VideoResults />} />
          <Route path="/search/news" element={<NewsResults />} />

          <Route path="/about" element={<AboutUs/>}/>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

