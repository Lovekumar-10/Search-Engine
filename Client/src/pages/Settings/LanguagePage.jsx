// import React from "react";
// import {
//   Grid,
//   Card,
//   CardActionArea,
//   CardContent,
//   Typography,
// } from "@mui/material";
// import { useTranslation } from "react-i18next";

// const languages = [
//   { code: "en", label: "English", flag: "🇬🇧" },
//   { code: "hi", label: "हिंदी", flag: "🇮🇳" },
//   { code: "fr", label: "Français", flag: "🇫🇷" },
//   { code: "es", label: "Español", flag: "🇪🇸" },
//   { code: "ur", label: "اردو", flag: "🇵🇰" },
// ];

// export default function LanguagePage() {
//   const { i18n } = useTranslation();

//   const changeLanguage = (lng) => {
//     i18n.changeLanguage(lng);
//     localStorage.setItem("appLanguage", lng); // save preference
//   };

//   return (
//     <Grid
//       container
//       spacing={2}
//       justifyContent="center"
//       alignItems="center"
//       sx={{ mt: 4 }}
//     >
//       {languages.map((lang) => (
//         <Grid item xs={12} sm={6} md={4} key={lang.code}>
//           <Card
//             sx={{
//               border:
//                 i18n.language === lang.code
//                   ? "2px solid #1976d2"
//                   : "1px solid #ccc",
//             }}
//           >
//             <CardActionArea onClick={() => changeLanguage(lang.code)}>
//               <CardContent sx={{ textAlign: "center" }}>
//                 <Typography variant="h3">{lang.flag}</Typography>
//                 <Typography variant="h6">{lang.label}</Typography>
//               </CardContent>
//             </CardActionArea>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );
// }





import React from "react";
import {
  Card,
  CardActionArea,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "ur", label: "اردو", flag: "🇵🇰" },
  { code: "tr", label: "Türkçe", flag: "TR" },
];

export default function LanguagePage() {
  const { i18n } = useTranslation();
  const theme = useTheme();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("appLanguage", lng); // save preference
  };

  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        gap: 2,
        justifyContent: "center",
        flexWrap: "wrap",
        
      }}
    >
      {languages.map((lang) => (
        <Card
          key={lang.code}
          sx={{
            width: 140,
            height: 160,
            border: `2px solid ${
              i18n.language === lang.code
                ? theme.palette.primary.main // active lang → accent
                : theme.palette.divider      // inactive → divider
            }`,
            bgcolor: theme.palette.background.paper, //  theme background
            color: theme.palette.text.primary,       //  theme text
          }}
        >
          <CardActionArea
            onClick={() => changeLanguage(lang.code)}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h3">{lang.flag}</Typography>
            <Typography variant="h6">{lang.label}</Typography>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
