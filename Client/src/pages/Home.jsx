
import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, InputBase, IconButton, Button, Paper } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import TimeWidget from "../Customizes/TimeWidget";
import DateWeatherWidget from "../Customizes/DateWeatherWidget";
import TuneIcon from '@mui/icons-material/Tune';
import { Switch, FormControlLabel, Divider } from "@mui/material";
import { useSearch } from "../hooks/useSearch"; 
import { detectPageFromQuery } from "../../utils/pageKeywords";


import { useNavigate } from "react-router-dom";


// Voice search import 
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";

const Home = ({ onSearch }) => {

    // ============ Background/Settings Logic ==============
  const [bgImage, setBgImage] = useState(""); 
  const [customBg, setCustomBg] = useState(false);
  const [sponsoredBg, setSponsoredBg] = useState(false);

  const theme = useTheme();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const { search } = useSearch();   //  shared search


  const navigate = useNavigate();

  const submitSearch = () => {
  if (!query.trim()) return;

  onSearch?.(query);      // call parent if needed
  search(query);          // save history

  // Detect which page to go to
  const page = detectPageFromQuery(query); // use the function
  const url = page === "all"
      ? `/search?q=${encodeURIComponent(query)}`
      : `/search/${page}?q=${encodeURIComponent(query)}`;
      console.log("Navigating to:", url);

  navigate(url);          // redirect user
  setQuery("");           // clear input
};


  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem("widgets");
    return saved
      ? JSON.parse(saved)
      : { showTimeDate: true, showWeather: true };
  });

  // Voice search hooks & refs
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const silenceTimer = useRef(null);
  const [showSettings, setShowSettings] = useState(false);

  // Beep function
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

  // Detect speaking activity
  useEffect(() => {
    let lastTranscript = "";
    const interval = setInterval(() => {
      if (transcript && transcript !== lastTranscript) {
        setIsSpeaking(true);
      } else {
        setIsSpeaking(false);
      }
      lastTranscript = transcript;
    }, 300);
    return () => clearInterval(interval);
  }, [transcript]);

  // Auto-stop after 5s silence, update query with voice
  useEffect(() => {
   if (isListening) {
    // Always clear old timer
    if (silenceTimer.current) clearTimeout(silenceTimer.current);

    // Start new 5s timer whether transcript exists or not
    silenceTimer.current = setTimeout(() => handleStop(), 5000);

    // Update UI text
    if (!transcript && !isSpeaking) {
      setQuery(t("status.listening"));
    } else if (transcript) {
      setQuery(transcript);
    }
  }
  }, [transcript, isListening, isSpeaking]);

  const handleStart = () => {
    resetTranscript();
    setIsListening(true);
    playBeep("start");
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    setQuery("Listening...");
  };  

  const handleStop = () => {
    setIsListening(false);
    playBeep("stop");
    SpeechRecognition.stopListening();
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    if (query === "Listening...") {
      setQuery("");
    }

  };

  
  const toggleMic = () => {
    if (isListening) handleStop();
    else handleStart();
  };




const greetings = [
  { text: t("greeting.text1"), emojis: ["🌅", "☀️", "☕"] },
  { text: t("greeting.text2"), emojis: ["🌞", "😎", "🍵"] },
  { text: t("greeting.text3"), emojis: ["🌙", "✨", "🌸"] },
  { text: t("greeting.text4"), emojis: ["🌌", "🌠", "🛌"] },
];


const getGreeting = () => {
  const hour = new Date().getHours();
  let greet;

  if (hour >= 5 && hour < 12) greet = greetings[0];        // Morning
  else if (hour >= 12 && hour < 17) greet = greetings[1];  // Afternoon
  else if (hour >= 17 && hour < 21) greet = greetings[2];  // Evening
  else greet = greetings[3];                                // Night

  const emoji = greet.emojis[Math.floor(Math.random() * greet.emojis.length)];
  return `${greet.text} ${emoji}`;
};

const [greeting, setGreeting] = useState(getGreeting());

// Update emoji every 10 seconds
useEffect(() => {
  const interval = setInterval(() => setGreeting(getGreeting()), 10000);
  return () => clearInterval(interval);
}, []);




const toggleSettings = () => setShowSettings(prev => !prev);


const buttonRef = useRef(null);
const popupRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    // if click is outside popup AND not on the button → close
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setShowSettings(false);
    }
  };

  if (showSettings) {
    document.addEventListener("mousedown", handleClickOutside);
  } else {
    document.removeEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showSettings]);




  // Save widget settings
  const saveSettings = (newWidgets) => {
    setWidgets(newWidgets);
    localStorage.setItem("widgets", JSON.stringify(newWidgets));
  };

  // Load sponsored image once per day
  const loadSponsoredImage = () => {
    const STORAGE_KEY = "bgImageData";
    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const now = Date.now();
    if (savedData && now - savedData.timestamp < 24 * 60 * 60 * 1000) {
      setBgImage(savedData.url);
      setSponsoredBg(true);
      setCustomBg(false);
    } else {
      const url = `https://picsum.photos/1920/1080?random=${now}`;
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setBgImage(url);
        setSponsoredBg(true);
        setCustomBg(false);
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ url, timestamp: Date.now() })
        );
      };
    }
  };

  const handleCustomImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result;
        setBgImage(imageUrl);
        setCustomBg(true);
        setSponsoredBg(false);
        localStorage.setItem("customBg", imageUrl);
        localStorage.setItem("hideSponsoredBg", "true");
      };
      reader.readAsDataURL(file);
    }
  };

  const resetBackground = () => {
    setBgImage("");
    setCustomBg(false);
    setSponsoredBg(false);
    loadSponsoredImage();
    localStorage.removeItem("customBg");
  };

  useEffect(() => {
    const savedCustomBg = localStorage.getItem("customBg");
    const hideSponsored = localStorage.getItem("hideSponsoredBg") === "true";

    if (savedCustomBg) {
      setBgImage(savedCustomBg);
      setCustomBg(true);
      setSponsoredBg(false);
    } else if (!hideSponsored) {
      loadSponsoredImage();
    }
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        // backgroundImage: bgImage ? `url(${bgImage})` : "none",
        backgroundImage: bgImage ? `url(${bgImage})` : `linear-gradient(135deg, #e6008aff 0%, #7873f5 100%)`,
        backgroundBlendMode: "overlay",
     
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "background 0.5s ease-in-out, background-image 0.5s ease-in-out",
      }}
    >
      {sponsoredBg && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: " rgba(0, 0, 0, 0.39)",
            pointerEvents: "none",
          }}
        />
      )}

      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        {widgets.showTimeDate && (
          <Box sx={{ position: "absolute", top: 20, left: 20 }}>
            <TimeWidget />
          </Box>
        )}

        {widgets.showWeather && (
          <Box sx={{ position: "absolute", top: 20, right: 20 }}>
            <DateWeatherWidget />
          </Box>
        )}

        {/* Center Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100vh",
            height: "100vh",
            gap: 3,
            color: theme.palette.text.primary,
            px: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h3" sx={{ color: "white" ,   fontSize: { xs: "2rem", md: "3rem" },    textShadow: "0 2px 10px rgba(0, 0, 0, 0.34)",  transition: "all 0.5s ease-in-out",}}>
             {greeting}
          </Typography>

          {/* Search Bar with Mic */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: theme.palette.background.searchBox,
              border:"1px solid #ffffff44",
              borderRadius: "50px",
              padding: "2px 5px",
              width: "70%",
              minWidth: 280,
              boxShadow: `0 1px 4px rgba(0, 0, 0, 0.4)`,
              "@media (max-width:900px)": { width: "500px" },
              "@media (max-width:600px)": { width: "250px" },
            }}
          >
            <IconButton onClick={submitSearch} title="Search">
              <Search sx={{ color: "white" }} />
            </IconButton>
            <InputBase
              placeholder={t("searchInput.placeholder")}
              sx={{ flex: 1, paddingLeft: { xs: "0px", sm: 2 } , color:"#fff"}}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
            />
              <IconButton
              onClick={toggleMic}
              sx={{
                bgcolor: isListening
                  ? isSpeaking
                    ? "success.main"
                    : "error.main"
                  : "primary.main",
                color: "white",
                borderRadius: "50%",
              
                ml:1,
                transition: "0.3s",
                animation: isListening
                  ? isSpeaking
                    ? "flicker 0.3s infinite"
                    : "pulseBounce 1s infinite"
                  : "none",
                "&:hover": {
                  bgcolor: isListening
                    ? isSpeaking
                      ? "success.dark"
                      : "error.dark"
                    : "primary.dark",
                },
              }}
              title={
                isListening
                  ? isSpeaking
                    ? "Speaking..."
                    : "Listening..."
                  : "Activate voice"
              }
            >
              <KeyboardVoiceIcon fontSize="small"  />
            </IconButton>
            {/* Animations keyframes */}
            <style>
              {`
                @keyframes pulseBounce {
                  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,0,0,0.7); }
                  50% { transform: scale(1.1) translateY(-3px); box-shadow: 0 0 15px 15px rgba(255,0,0,0.3); }
                  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,0,0,0); }
                }
                @keyframes flicker {
                  0% { transform: scale(1); box-shadow: 0 0 5px 0 rgba(0,255,0,0.5); }
                  50% { transform: scale(1.05); box-shadow: 0 0 15px 5px rgba(0,255,0,0.7); }
                  100% { transform: scale(1); box-shadow: 0 0 5px 0 rgba(0,255,0,0.5); }
                }
              `}
            </style>
          </Box>
        </Box>

        {/* Customize/Open Settings */}
        <Button
         ref={buttonRef} 
         onClick={toggleSettings}
          variant="contained"
          sx={{
            position: "absolute",
            bottom: "100px",
            left: 20,
            color: "white",
            fontWeight: "bold",
            backgroundColor: theme.palette.background.searchBox,
            border:"1px solid #c2c2c238",
            borderRadius: "20px",
            textTransform: "none",
            zIndex: 2,
            
          }}
        >
          <TuneIcon  sx={{ mr: "3px", fontSize:"12px", color: "white",  }} />
          <Typography sx={{ fontWeight: "500", fontSize:"12px", color: "white",  }}>
            {t("button.customize")}
          </Typography>
        </Button>

        {showSettings && (
          <Paper
            ref={popupRef}
            sx={{
              position: "absolute",
              bottom: "150px",
              left: 20,
              padding: 2,
              width: "240px",
              boxShadow: 3,
              zIndex: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {t("home.widgets")}
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={sponsoredBg}
                  onChange={(e) => {
                    if (e.target.checked) {
                      localStorage.setItem("hideSponsoredBg", "false");
                      resetBackground();
                    } else {
                      setBgImage("");
                      setSponsoredBg(false);
                      localStorage.setItem("hideSponsoredBg", "true");
                    }
                  }}
                />
              }
              label={t("home.imgaes")}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={widgets.showTimeDate}
                  onChange={(e) => {
                    const newWidgets = { ...widgets, showTimeDate: e.target.checked };
                    saveSettings(newWidgets);
                  }}
                />
              }
              label={t("home.TimeDate")}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={widgets.showWeather}
                  onChange={(e) => {
                    const newWidgets = { ...widgets, showWeather: e.target.checked };
                    saveSettings(newWidgets);
                  }}
                />
              }
              label={t("home.weather")}
            />

            <Divider sx={{ my: 1 }} />

            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              {t("home.widgets.bg")}
            </Typography>

            <Button
              variant="outlined"
              component="label"
              sx={{ mt: 1, width: "100%" }}
              disabled={sponsoredBg}
            >
              {t("home.widgets.btn")}
              <input type="file" accept="image/*" hidden onChange={handleCustomImage} />
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Home;
















