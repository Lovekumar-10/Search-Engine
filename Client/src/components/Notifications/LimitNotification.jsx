import React, { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useNotification } from "../context/NotificationContext";

export default function LimitNotification({ duration = 4000 }) {
  const { current, clearNotification } = useNotification();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (current?.message) setOpen(true);
  }, [current]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    clearNotification();
  };

  if (!current) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={current.severity} sx={{ width: "100%" }}>
        {current.message}
      </Alert>
    </Snackbar>
  );
}
