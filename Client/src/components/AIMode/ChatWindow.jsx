
// ChatWindow.jsx
import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";

import { SyncLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import StopIcon from "@mui/icons-material/Stop";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";

// File icon selector
const getFileIcon = (type) => {
  if (type?.startsWith("image/")) return <ImageIcon sx={{ color: "#4caf50" }} />;
  if (type === "application/pdf") return <PictureAsPdfIcon sx={{ color: "#f44336" }} />;
  return <DescriptionIcon sx={{ color: "#1976d2" }} />;
};

// Fixed Code block with recursive text extractor
const CodeBlock = ({  className, children, copiedMessageId, id, onCopy  }) => {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const language = className?.replace("language-", "").replace("hljs", "").trim() || "text";

  // Recursive text extraction (fixes [object Object])
  const extractText = (child) => {
    if (typeof child === "string") return child;
    if (Array.isArray(child)) return child.map(extractText).join("");
    if (child?.props?.children) return extractText(child.props.children);
    return "";
  };

  const codeText = extractText(children);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <Box
      sx={{
        my: 2,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: theme.shadows[1],
        bgcolor: theme.palette.mode === "dark" ? "#2d2d2d" : "#f5f5f5",
        fontFamily: "'Source Code Pro', monospace",
        fontSize: 14,
      }}
    >
      <Box
        sx={{
          bgcolor: theme.palette.mode === "dark" ? "#1f1f1f" : "#e0e0e0",
          px: 2,
          py: 0.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
          {language.toUpperCase()}
        </Typography>
        <IconButton
          size="small"
          onClick={handleCopy}
          sx={{
            color: copied ? theme.palette.success.main : theme.palette.text.secondary,
          }}
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
        </IconButton>
      </Box>
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 2,
          overflowX: "auto",
          whiteSpace: "pre",
          fontFamily: "'Source Code Pro', monospace",
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        <code className={className}>{children}</code>
      </Box>
    </Box>
  );
};

// Main ChatWindow
const ChatWindow = ({
  messages,
  copiedMessageId,
  speakingMessageId,
  handleCopy,
  handleSpeak,
  isTyping,
  timeUntilReset,
  isLoading,
  partialResponse,
}) => {
  const theme = useTheme();
  const bottomRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, partialResponse]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        bgcolor: theme.palette.background.default,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        p: 2,
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {/* Render all messages */}
      {messages.map(({ id, text, sender, file }) => (
        <Box
          key={id}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: sender === "user" ? "flex-end" : "flex-start",
            mb: 1,
          }}
        >
          {sender === "ai" ? (
            <Paper
              elevation={3}
              sx={{
                p: 3,
                maxWidth: "85%",
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderRadius: 2,
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeKatex, rehypeHighlight]}
                components={{
                  code: ({ inline, className, children, ...props }) =>
                    inline ? (
                      <Box
                        component="code"
                        sx={{
                          backgroundColor: theme.palette.action.selected,
                          borderRadius: 1,
                          px: 0.5,
                          fontSize: "0.9em",
                          fontFamily: "Source Code Pro, monospace",
                        }}
                        {...props}
                      >
                        {children}
                      </Box>
                    ) : (
                      <CodeBlock className={className} id={id}  copiedMessageId={copiedMessageId} onCopy={handleCopy} >{children}</CodeBlock>
                    ),
                }}
              >
                {text}
              </ReactMarkdown>

              <Box sx={{ display: "flex", gap: 1, mt: 1, justifyContent: "flex-end" }}>
                <IconButton size="small" onClick={() => handleCopy(id, text)}>
                  {copiedMessageId === id ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
                <IconButton size="small" onClick={() => handleSpeak(id, text)}>
                  {speakingMessageId === id ? <StopIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                </IconButton>
              </Box>
            </Paper>
          ) : (
            <Paper
              elevation={2}
              sx={{
                p: 2,
                maxWidth: "75%",
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderRadius: 2,
                fontSize: 14,
                whiteSpace: "pre-wrap",
              }}
            >
              {text && <Typography variant="body1">{text}</Typography>}
              {file && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "rgba(255,255,255,0.1)",
                    }}
                  >
                    {getFileIcon(file.type)}
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {file.name}
                    </Typography>
                  </Box>
                  {file.type.startsWith("image/") && (
                    <img
                      src={file.url}
                      alt={file.name}
                      style={{
                        width: "50%",
                        maxHeight: 200,
                        objectFit: "contain",
                        borderRadius: 8,
                      }}
                    />
                  )}
                  <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      <IconButton size="small">
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </a>
                    <a href={file.url} download={file.name}>
                      <IconButton size="small">
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </a>
                  </Box>
                </Box>
              )}
            </Paper>
          )}
        </Box>
      ))}

      {/* Show partial response */}
      {partialResponse && (
        <Box sx={{ color: "gray", fontStyle: "italic", mb: 1 }}>{partialResponse}</Box>
      )}

      {/* Typing / Loading indicators */}
      {isTyping && (
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <SyncLoader size={6} color="#3a75fff8" />
        </Box>
      )}
      {/* {isLoading && (
        <Box sx={{ fontSize: "0.9rem", color: theme.palette.text.secondary }}>
          Loading results...
        </Box>
      )} */}

      {/* Reset timer */}
      {timeUntilReset > 0 && (
        <Box sx={{ fontSize: "0.8rem", color: "red" }}>
          Resetting in {timeUntilReset}s
        </Box>
      )}

      <div ref={bottomRef} />
    </Box>
  );
};

export default ChatWindow;
