// // src/hooks/useSearch.js
// import { useNavigate, useLocation } from "react-router-dom";

// export function useSearch() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const search = (rawQuery, opts = {}) => {
//     const query = (rawQuery || "").trim();
//     if (!query) return;

//     // stay on current /search tab (e.g. /search/images) or default to /search
//     const currentPath = opts.targetPath ??
//       (location.pathname.startsWith("/search") ? location.pathname : "/search");

//     const url = `${currentPath}?q=${encodeURIComponent(query)}`;

//     // 1) move the app to results
//     navigate(url);

//     // 2) save history
//     const entry = {
//       id: Date.now(),
//       title: query,
//       url,
//       favicon: "https://www.google.com/favicon.ico",
//       time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       date: now.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }), // ✅ add date
//     };
//     const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
//     history.unshift(entry);
//     localStorage.setItem("searchHistory", JSON.stringify(history));
//   };

//   return { search };
// }





// src/hooks/useSearch.js
import { useNavigate, useLocation } from "react-router-dom";

export function useSearch() {
  const navigate = useNavigate();
  const location = useLocation();

  const search = (rawQuery, opts = {}) => {
    const query = (rawQuery || "").trim();
    if (!query) return;

    // stay on current /search tab (e.g. /search/images) or default to /search
    const currentPath =
      opts.targetPath ??
      (location.pathname.startsWith("/search") ? location.pathname : "/search");

    const url = `${currentPath}?q=${encodeURIComponent(query)}`;

    // 1) move the app to results
    navigate(url);

    // 2) save history
    const now = new Date(); // ✅ define now once
    const entry = {
      id: Date.now(),
      title: query,
      url,
      favicon: "https://www.google.com/favicon.ico",
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: now.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }), // ✅ add date
    };

    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    history.unshift(entry);
    localStorage.setItem("searchHistory", JSON.stringify(history));
  };

  return { search };
}
