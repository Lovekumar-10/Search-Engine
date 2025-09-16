

import React, { useState, useEffect } from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  Button,
  Paper,
  Divider,
  Box,
  IconButton,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

export default function HistoryPage() {
  const { t } = useTranslation(); 
  const [selected, setSelected] = useState([]);
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("searchHistory")) || [];
  });
  const [search, setSearch] = useState("");

  // keep localStorage updated whenever history changes
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }, [history]);

  // Toggle one
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Remove selected
  const removeSelected = () => {
    setHistory((prev) => prev.filter((item) => !selected.includes(item.id)));
    setSelected([]);
  };

  // Cancel selection
  const cancelSelection = () => setSelected([]);

  // Remove single
  const removeSingle = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    setSelected((prev) => prev.filter((i) => i !== id));
  };

  // Clear ALL history
  const clearAll = () => {
    setHistory([]);
    setSelected([]);
    localStorage.removeItem("searchHistory");
  };

  //  Safe hostname extraction
  const getHostname = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return ""; // not a valid URL, just return empty
    }
  };

  // Filtered history based on search
  const filteredHistory = history.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      getHostname(item.url).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{   marginTop:0, minHeight: "100vh", color: "text.primary"}}>
      <Box
        sx={{
          px: { xs: 0, sm: 3 },
          pt:0,
          maxWidth: 800,
          mx: "auto",
          marginTop:0,
          
        }}
      >
        {/* Sticky Header */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            // zIndex: 1,
            mb: 2,
          }}
        >
          {selected.length > 0 ? (
            <Paper
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1">
                {selected.length} {t("historypage.subtitle")}
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  sx={{ mr: 1, textTransform: "none" }}
                  onClick={removeSelected}
                >
                  {t("historypage.btn1")}
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  sx={{ textTransform: "none" }}
                  onClick={cancelSelection}
                >
                   {t("historypage.btn2")}
                </Button>
              </Box>
            </Paper>
          ) : (
            <Paper sx={{ p: 1.2, borderRadius: 2 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  fullWidth
                  placeholder={t("historypage.textfield")}
                  variant="outlined"
                  size="small"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)} //  auto search
                  sx={{
                    
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "50px", 
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Paper>
          )}
        </Box>

        {/* History Items */}
        <Paper sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
          <Box
            sx={{
            maxHeight: { xs: '60vh', sm: '70vh', md: '58vh', },
              overflowY: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <List>
              {filteredHistory.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    sx={{
                      px: 1,
                      py: 0.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      "&:hover": { bgcolor: "background.searchBox" },
                    }}
                  >
                    {/* Left side: checkbox + favicon + text */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Checkbox
                          checked={selected.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          sx={{ color: "text.secondary" }}
                        />
                      </ListItemIcon>

                      {item.favicon && (
                        <img
                          src={item.favicon}
                          alt="favicon"
                          style={{
                            width: 20,
                            height: 20,
                            marginRight: 8,
                            borderRadius: 4,
                          }}
                        />
                      )}

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          component="a"
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            textDecoration: "none",
                            color: "text.primary",
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {getHostname(item.url)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Right side: time + delete */}
                    <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          mr: 1.5,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.date} • {item.time}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeSingle(item.id)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                  <Divider sx={{ bgcolor: "divider" }} />
                </React.Fragment>
              ))}

              {filteredHistory.length === 0 && (
                <Typography
                  variant="body2"
                  sx={{ p: 2, textAlign: "center", color: "text.secondary" }}
                >
                 {t("historypage.empty.title")}
                </Typography>
              )}
            </List>
          </Box>
        </Paper>

        {/*  Clear All button at the bottom */}
        {history.length > 0 && (
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={clearAll}
              sx={{ textTransform: "none" }}
            >
             {t("historypage.bottombtn")}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
