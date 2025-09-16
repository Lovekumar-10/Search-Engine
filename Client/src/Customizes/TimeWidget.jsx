import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TimeWidget({ visible = true }) {

  const [time, setTime] = useState(new Date());

  if (!visible) return null;


  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Format time like "21:33 pm"
  const formattedTime = time
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();

  // Format date like "Fri, Aug 15"
  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div>
      {/* Time */}
   <motion.div
  key={formattedTime}
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
  {formattedTime}
</motion.div>

    </div>
  );
}
