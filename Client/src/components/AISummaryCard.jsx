


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import "highlight.js/styles/github.css"; // or any theme


import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  ThumbUpAltOutlined as LikeIcon,
  ThumbDownAltOutlined as DislikeIcon,
  Translate as TranslateIcon,
  VolumeUp as ListenIcon,
  Pause as PauseIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const AISummaryCard = ({ query, summary }) => {
  const [expanded, setExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleExpandClick = () => setExpanded(true);

  const handleDeepDive = () => {
    navigate("/AIMode", { state: { query, summary } });
  };

  const handleTranslate = () => console.log("Translate clicked");

  // Listen / Pause logic
  const handleListen = () => {
    if (!summary) return;

    if (isSpeaking) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.lang = "en-IN";

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.cancel(); // clear old speech
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // 📋 Copy logic (auto reset after 5 sec)
  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // 🧹 Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <Card
      sx={{
        maxwidth: { xs: 16, sm: 24 },
        margin: "20px auto",
        boxShadow: 3,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <CardContent sx={{ padding: "16px 24px" }}>
        {/* Header */}
        <Typography variant="h6" component="div" fontWeight="bold" color="primary">
          {t("AISummary.overview.title")}
        </Typography>

        {/* Translate + Listen buttons */}
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button
            size="small"
            startIcon={<TranslateIcon />}
            onClick={handleTranslate}
            sx={{ textTransform: "none" }}
          >
             {t("AISummary.Btn1")}
          </Button>

          {/* Animated Listen / Pause button */}
          <Button
            size="small"
            onClick={handleListen}
            sx={{ textTransform: "none" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isSpeaking ? (
                <motion.div
                  key="pause"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <PauseIcon fontSize="small" />  {t("AISummary.Pause.Btn")}
                </motion.div>
              ) : (
                <motion.div
                  key="listen"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <ListenIcon fontSize="small" /> {t("AISummary.Listen.Btn")}
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </Box>

        {/* Summary Text */}
        <Box
          sx={{
            position: "relative",
            maxHeight: expanded ? "none" : "70px",
            overflow: "hidden",
            mt: 1,
          }}
        >
          <Box sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeHighlight, rehypeKatex]}
    components={{
      code({ inline, className, children }) {
        return inline ? (
          <Box component="code" sx={{ background: "#eee", px: 0.5, borderRadius: 1 }}>
            {children}
          </Box>
        ) : (
          <pre className={className} style={{ overflowX: "auto", padding: "8px", background: "#f5f5f5", borderRadius: "6px" }}>
            <code>{children}</code>
          </pre>
        );
      },
    }}
  >
    {summary}
  </ReactMarkdown>
</Box>


          {!expanded && (
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "30px",
                background: `linear-gradient(to top, ${theme.palette.background.paper}, rgba(255,255,255,0))`,
              }}
            />
          )}
        </Box>

        {/* Show More button */}
        {!expanded && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <Button
              size="small"
              variant="outlined"
              endIcon={<ExpandMoreIcon />}
              onClick={handleExpandClick}
              sx={{ borderRadius: "20px", px: 2 }}
            >
              {t("AISummary.Btn2")}
            </Button>
          </Box>
        )}

        {/* Footer when expanded */}
        {expanded && (
          <Box sx={{ mt: 2 }}>
            {/* Deep Dive button */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Button
                variant="outlined"
                size="medium"
                onClick={handleDeepDive}
                sx={{
                  borderRadius: "30px",
                  px: 4,
                  py: 1.2,
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                {t("AISummary.Btn3")}
              </Button>
            </Box>

            {/* Disclaimer + Right icons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                  lineHeight: 1.2,
                }}
              >
                {t("AISummary.bottom.text")}
              </Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={handleCopy}
                  sx={{ p: { xs: 0.5, sm: 1 }, color: theme.palette.text.secondary }}
                >
                  {copied ? (
                    <CheckIcon sx={{ fontSize: { xs: "16px", sm: "20px" } }} />
                  ) : (
                    <CopyIcon sx={{ fontSize: { xs: "16px", sm: "20px" } }} />
                  )}
                </IconButton>
                <IconButton sx={{ p: { xs: 0.5, sm: 1 }, color: theme.palette.text.secondary }}>
                  <LikeIcon sx={{ fontSize: { xs: "16px", sm: "20px" } }} />
                </IconButton>
                <IconButton sx={{ p: { xs: 0.5, sm: 1 }, color: theme.palette.text.secondary }}>
                  <DislikeIcon sx={{ fontSize: { xs: "16px", sm: "20px" } }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AISummaryCard;