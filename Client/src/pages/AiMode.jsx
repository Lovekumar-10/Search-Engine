



import React, { useState, useEffect, useRef } from "react";
import { Container, Box, useTheme } from "@mui/material";
import SearchTabs from "../components/SearchTabs";
import ChatWindow from "../components/AIMode/ChatWindow";
import ChatInput from "../components/AIMode/ChatInput";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { franc } from "franc-min";

const AiMode = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const location = useLocation();

  // this is typing indicater 
  const [isTyping, setIsTyping] = useState(false);
  const [usage, setUsage] = useState(null);

  const sendSoundRef = useRef(null);
  const receiveSoundRef = useRef(null);
  const bottomRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const silenceTimer = useRef(null);

  // const [messages, setMessages] = useState([{ id: 1, text: "Welcome! Ask me anything.", sender: "ai" }]);
    const [messages, setMessages] = useState(() => {
    if (location.state?.query && location.state?.summary) {
      return [
        { id: 1, text: location.state.query, sender: "user" },
        { id: 2, text: location.state.summary, sender: "ai" }
      ];
    }
    return [{ id: 1, text: t("AIMode.WelcomeNote"), sender: "ai" }];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [partialResponse, setPartialResponse] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);

  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState("");

  



    // Daily limit uses timer
  useEffect(() => {
  if (!usage?.nextResetTime) return;

  const interval = setInterval(() => {
    const now = new Date();
    const resetTime = new Date(usage.nextResetTime);
    const diff = resetTime - now; // milliseconds

    if (diff <= 0) {
      setTimeUntilReset("Available now!");
      clearInterval(interval);
      return;
    }

    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`);
  }, 1000);

  return () => clearInterval(interval);
}, [usage?.nextResetTime]);



  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, partialResponse]);

  const handleFileUpload = (file, fileType) => {
    const fileURL = URL.createObjectURL(file);
    const fileMessage = {
      id: Date.now(),
      sender: "user",
      file: {
        name: file.name,
        type: file.type,
        url: fileURL,
        fileTypeLabel: fileType,
      },
    };
    setMessages((prev) => [...prev, fileMessage]);
  };

  const playSound = (ref) => {
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    }
  };


  
const handleSend = async () => {
  if (!inputValue.trim()) return;

  const userMessage = {
    id: Date.now(),
    text: inputValue.trim(),
    sender: "user",
  };
  setIsTyping(true);
  setMessages((prev) => [...prev, userMessage]);
  setInputValue("");
  playSound(sendSoundRef);

  setIsLoading(true);
  setPartialResponse("");

  try {
    const token = localStorage.getItem("accessToken");

    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}), 
      },
      credentials: "include", // refresh cookie also travels
      body: JSON.stringify({
        messages: [{ role: "user", content: userMessage.text }],
      }),
    });

    const newToken = response.headers.get("x-access-token");
    if (newToken) {
      localStorage.setItem("accessToken", newToken);
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    setUsage(data.usage);

    const aiReply = {
      id: Date.now() + 1,
      text: data.reply,
      sender: "ai",
      source: data.source,
    };
    setMessages((prev) => [...prev, aiReply]);
    setIsTyping(false);
  } catch (error) {
    console.error("Chat error:", error);
    const errorReply = {
      id: Date.now() + 1,
      text: t("AIMode.Error.Message"),
      sender: "ai",
    };
    setMessages((prev) => [...prev, errorReply]);
  }

  setIsLoading(false);
  setIsTyping(false);
  setPartialResponse("");
  playSound(receiveSoundRef);
};

  const playBeep = (type) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(type === "start" ? 800 : 400, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 3000);
  };


const handleSpeak = (id, text) => {
  if (speakingMessageId === id) {
    synthRef.current.cancel();
    setSpeakingMessageId(null);
    return;
  }

  synthRef.current.cancel();

  //  Map franc language codes → speechSynthesis language codes
  const langMap = {
    eng: "en-US", // English
    hin: "hi-IN", // Hindi
    urd: "ur-PK", // Urdu
    fra: "fr-FR", // French
    spa: "es-ES", // Spanish
    tur: "tr-TR", // Turkish
  };

  // Detect language with franc
  let langKey = franc(text); // e.g. "eng", "fra", "hin", etc.

  if (!langMap[langKey]) {
    langKey = "eng"; // fallback if detection not supported
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langMap[langKey] || "en-US";

  const voices = synthRef.current.getVoices();

  // pick first available voice for the detected language
  const preferredVoice = voices.find((v) =>
    v.lang.toLowerCase().startsWith(utterance.lang.toLowerCase())
  );

  if (preferredVoice) utterance.voice = preferredVoice;

  utterance.onend = () => setSpeakingMessageId(null);
  setSpeakingMessageId(id);
  synthRef.current.speak(utterance);
};







  useEffect(() => {
    let lastTranscript = "";
    const interval = setInterval(() => {
      if (transcript && transcript !== lastTranscript) setIsSpeaking(true);
      else setIsSpeaking(false);
      lastTranscript = transcript;
    }, 300);
    return () => clearInterval(interval);
  }, [transcript]);

useEffect(() => {
  if (isListening) {
    // clear previous timer
    if (silenceTimer.current) clearTimeout(silenceTimer.current);

    // start new timer: 5s after last activity
    silenceTimer.current = setTimeout(() => handleStop(), 5000);

    // UI updates
    if (!transcript && !isSpeaking) {
      setInputValue(t("status.listening"));
    } else if (transcript) {
      setInputValue(transcript);
    }
  }
}, [transcript, isListening, isSpeaking]);


  const handleStart = () => {
    resetTranscript();
    setIsListening(true);
    playBeep("start");
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    setInputValue("Listening...");
  };



const handleStop = () => {
  setIsListening(false);
  playBeep("stop");
  SpeechRecognition.stopListening();
  if (silenceTimer.current) clearTimeout(silenceTimer.current);
  if (inputValue === t("status.listening")) {
    setInputValue("");
  }
};






  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMic = () => {
    if (isListening) handleStop();
    else handleStart();
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.default,
        overflow: "hidden",
      }}
    >
      <audio ref={sendSoundRef} src="/sounds/popsounds.mp3" preload="auto" />
      <audio ref={receiveSoundRef} src="/sounds/poptone.mp3" preload="auto" />

      <SearchTabs query={""} selectedTab="ai" onTabChange={() => {}} />

      <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2 }}>
        <ChatWindow
          messages={messages}
          copiedMessageId={copiedMessageId}
          speakingMessageId={speakingMessageId}
          handleCopy={handleCopy}
          handleSpeak={handleSpeak}
          bottomRef={bottomRef}
          isLoading={isLoading}
          partialResponse={partialResponse}
          isTyping={isTyping}
     

        />
      </Box>

      <Box sx={{ pb: 2, borderRadius: 2 }}>
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSend={handleSend}
          handleKeyDown={handleKeyDown}
          isListening={isListening}
          isSpeaking={isSpeaking}
          toggleMic={toggleMic}
          handleFileUpload={handleFileUpload}
          usage={usage} 
          timeUntilReset={timeUntilReset}
        />
      </Box>
    </Container>
  );
};

export default AiMode;

