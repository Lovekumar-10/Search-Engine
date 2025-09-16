


import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import AddIcon from "@mui/icons-material/Add";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RepeatIcon from '@mui/icons-material/Repeat';
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";

const ChatInput = ({
  inputValue,
  setInputValue,
  handleSend,
  handleKeyDown,
  isListening,
  toggleMic,
  isSpeaking,
  handleFileUpload,
  usage,
  timeUntilReset, 
}) => {
  const theme = useTheme();
  const { t } = useTranslation(); 

  const [fileAnchorEl, setFileAnchorEl] = useState(null);
  const [fileType, setFileType] = useState(null);

  // State and anchor for wallet usage popover
  const [usageAnchorEl, setUsageAnchorEl] = useState(null);
  const [showUsageCard, setShowUsageCard] = useState(false);

  const fileInputRef = useRef(null);


  // File menu handlers
  const openFileMenu = (event) => {
    setFileAnchorEl(event.currentTarget);
  };

  const closeFileMenu = () => setFileAnchorEl(null);

  // Wallet usage popover toggle on same button click
  const toggleUsageCard = (event) => {
    if (showUsageCard && usageAnchorEl === event.currentTarget) {
      setShowUsageCard(false);
      setUsageAnchorEl(null);
    } else {
      setUsageAnchorEl(event.currentTarget);
      setShowUsageCard(true);
    }
  };

  const onFileOptionClick = (type) => {
    closeFileMenu();
    setFileType(type);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const onFileSelected = (e) => {
    const file = e.target.files[0];
    if (file && handleFileUpload) {
      handleFileUpload(file, fileType);
      setInputValue("");
    }
  };

  const isFileMenuOpen = Boolean(fileAnchorEl);
  const isUsageCardOpen = showUsageCard && Boolean(usageAnchorEl);

  return (
    <Box sx={{ width: "100%", maxWidth: 850, mx: "auto" }}>
      <Paper
        component="form"
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          border: "3px solid #b8bbbeff",
          p: 1,
          bgcolor: theme.palette.background.paper,
          // boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          minWidth: 200,
          maxWidth: "100%",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              width: "100%",
              maxHeight: 160,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <InputBase
              multiline
              minRows={1}
              maxRows={7}
              placeholder={t("AIMode.chatinput.text")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              inputProps={{ style: { resize: "none" } }}
              sx={{
                width: "100%",
                fontSize: 14,
                lineHeight: 1.4,
                padding: "0 8px",
                borderRadius: 1,
                bgcolor: theme.palette.background.paper,
                boxSizing: "border-box",
                "& textarea": {
                  maxHeight: "160px",
                  overflow: "auto",
                  scrollbarWidth: "thin",
                  scrollbarColor: `${theme.palette.grey[400]} transparent`,
                  "&::-webkit-scrollbar": {
                    width: 6,
                    height: 6,
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: theme.palette.grey[400],
                    borderRadius: 3,
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: theme.palette.grey[500],
                  },
                },
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            mt: 0.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
            {t("AIMode.text")}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="small"
              onClick={toggleUsageCard}
              sx={{ mr: 1 }}
              aria-label="View usage"
              title="View usage"
            >
              <AccountBalanceWalletIcon />
            </IconButton>

            <IconButton
              size="small"
              onClick={openFileMenu}
              sx={{ mr: 1 }}
              aria-label="Add file"
              title="Add file"
            >
              <AddIcon  />
            </IconButton>

            {isListening ? (
              <IconButton
                onClick={toggleMic}
                sx={{
                  bgcolor: isSpeaking ? "success.main" : "error.main",
                  color: "white",
                  borderRadius: "50%",
                  transition: "0.3s",
                  animation: isSpeaking ? "pulse 1.5s infinite" : "none",
                  "&:hover": {
                    bgcolor: isSpeaking ? "success.dark" : "error.dark",
                  },
                }}
                title={isSpeaking ? "Speaking..." : "Listening..."}
              >
                <KeyboardVoiceIcon fontSize="small" />
              </IconButton>
            ) : inputValue.trim() ? (
              <IconButton
                color="primary"
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
                onClick={handleSend}
                aria-label="send"
                title="Send"
              >
                <SendIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={toggleMic}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
                title="Activate voice"
              >
                <KeyboardVoiceIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </Paper>

      <Popover
        open={isFileMenuOpen}
        anchorEl={fileAnchorEl}
        onClose={closeFileMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <List dense sx={{ p: 1, minWidth: 160 }}>
          <ListItem button onClick={() => onFileOptionClick("Other")}>
            <ListItemIcon>
              <RepeatIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("AIMode.Listtext1")} />
          </ListItem>
          <ListItem button onClick={() => onFileOptionClick("Image")}>
            <ListItemIcon>
              <ImageIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("AIMode.Listtext2")} />
          </ListItem>
          <ListItem button onClick={() => onFileOptionClick("PDF")}>
            <ListItemIcon>
              <PictureAsPdfIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("AIMode.Listtext3")} />
          </ListItem>
        </List>
      </Popover>

      <Popover
        open={isUsageCardOpen}
        anchorEl={usageAnchorEl}
        onClose={() => {
          setShowUsageCard(false);
          setUsageAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
        
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: "0 6px 12px rgba(0,0,0,0.12)",
            width: 320,
            color: (theme) => theme.palette.text.primary,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
             {t("AIMode.Summary.title")}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
           {t("AIMode.Summary.details1")} <strong>{usage?.requestsUsedToday || 0} / {usage?.dailyRequestLimit || 0}</strong>
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {t("AIMode.Summary.details2")} <strong>{usage?.tokensUsedToday || 0} / {usage?.dailyTokenLimit || 0}</strong>
          </Typography>
          <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  color: timeUntilReset === "Available now!" ? "#479e5cff" : "#ff8f8fff",
                  fontWeight: 500,
                }}
              >
                {/* {timeUntilReset === "Available now!"
                  ? ` ${timeUntilReset}`
                  : `Resets in: ${timeUntilReset || "Loading..."}`} */}

                  {timeUntilReset === "Available now!" ? (
                      <Trans i18nKey="AIMode.reset.available" />
                    ) : (
                      <Trans
                        i18nKey="AIMode.reset.time"
                        values={{ time: timeUntilReset || t("AIMode.common.loading") }}
                      />
                  )}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              size="small"
              title="Upgrade plan"
              sx={{
                bgcolor: (theme) => theme.palette.primary.main,
                color: "#fff",
                "&:hover": { bgcolor: (theme) => theme.palette.primary.dark },
                borderRadius: 2,
                px: 1.5,
                py: 0.75,
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              <RepeatIcon />
            </IconButton>
          </Box>
        </Paper>
      </Popover>

      <input
        type="file"
        accept={
          fileType === "Image"
            ? "image/*"
            : fileType === "PDF"
            ? "application/pdf"
            : "*"
        }
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={onFileSelected}
      />

      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 152, 255, 0.7);}
            70% { box-shadow: 0 0 0 10px rgba(0, 152, 255, 0);}
            100% { box-shadow: 0 0 0 0 rgba(0, 152, 255, 0);}
          }
        `}
      </style>
    </Box>
  );
};

export default ChatInput;
