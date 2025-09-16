import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function WeatherWidget({ visible = true }) {

  const [weather, setWeather] = useState({
    temp: "--",
    condition: "",
    code: null
  });


   const [time, setTime] = useState(new Date());

   if (!visible) return null;

  
    useEffect(() => {
      const interval = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(interval);
    }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true"
        );
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setWeather({
          temp: Math.round(data.current_weather.temperature),
          condition: `Windspeed ${data.current_weather.windspeed} km/h`,
          code: data.current_weather.weathercode
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchWeather();
    const timer = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

   // Format date like "Fri, Aug 15"
  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <Box
      sx={{
        backgroundColor: "transprent",
        minWidth: "150px",
        textAlign:"end",

      
      
      }}
    >
      {/* Animated Icon */}

   
        <motion.div
        key={formattedDate}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          fontSize: "clamp(1.5rem, 5vw, 3rem)", 
          // min 1.5rem, max 3rem, adjust automatically by screen width
          color: "#ffffff",
          letterSpacing: "2px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
         <Typography variant="h6">{formattedDate}</Typography>
      </motion.div>
    <motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  style={{
    fontSize:
      window.innerWidth < 600
        ? "1.5rem" // phone
        : window.innerWidth < 900
        ? "2rem"   // tablet
        : "3rem",  // laptop/desktop
    color: "#ffffff",
    letterSpacing: "2px",
    fontFamily: "Poppins, sans-serif",
  }}
>
  <Typography
    variant="h6"
   
  >
    {weather.temp}°C New Delhi
  </Typography>
</motion.div>


       
    </Box>
  );
}
