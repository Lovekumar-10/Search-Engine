import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/en.json";
import hi from "./locales/hi/hi.json";
import es from "./locales/es/es.json";
import fr from "./locales/fr/fr.json";
import ur from "./locales/ur/ur.json"
import tr from "./locales/tr/tr.json"


// saving user preference in localStorage and loading
const savedLang = localStorage.getItem("appLanguage") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      es: { translation: es },
      fr: { translation: fr },
      ur: { translation: ur },
      tr: { translation: tr },
    },
    lng: savedLang, // load from localStorage
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
