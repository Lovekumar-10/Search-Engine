import React from "react";
import { MenuItem, Select, Box } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "ur", label: "Urdu" }
  ];

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", px: 1 }}>
      <LanguageIcon fontSize="small" sx={{ mr: 1 }} />
      <Select
        value={i18n.language}
        onChange={handleLanguageChange}
        variant="standard"
        disableUnderline
        sx={{ fontSize: "0.85rem", minWidth: 120 }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default LanguageSelector;
