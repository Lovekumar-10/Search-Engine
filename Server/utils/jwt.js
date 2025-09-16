// // utils/jwt.js
// const jwt = require('jsonwebtoken');

// const ACCESS_EXPIRES_IN = '15m';
// const REFRESH_EXPIRES_IN = '30d';

// function signAccessToken(user) {
//   return jwt.sign(
//     { sub: user._id.toString(), email: user.email, name: user.name },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: ACCESS_EXPIRES_IN }
//   );
// }

// function signRefreshToken(user) {
//   return jwt.sign(
//     { sub: user._id.toString(), tokenVersion: user.tokenVersion || 0 },
//     process.env.REFRESH_TOKEN_SECRET,
//     { expiresIn: REFRESH_EXPIRES_IN }
//   );
// }

// function verifyAccess(token) {
//   return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
// }

// function verifyRefresh(token) {
//   return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
// }

// module.exports = {
//   signAccessToken,
//   signRefreshToken,
//   verifyAccess,
//   verifyRefresh,
//   ACCESS_EXPIRES_IN,
//   REFRESH_EXPIRES_IN
// };


// utils/jwt.js
const jwt = require("jsonwebtoken");

// ⏱ Token lifetimes
const ACCESS_EXPIRES_IN = "15m"; // short-lived
const REFRESH_EXPIRES_IN = "30d"; // long-lived

// 🔑 Create Access Token
function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, name: user.name },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
}

// 🔑 Create Refresh Token
function signRefreshToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), tokenVersion: user.tokenVersion || 0 },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN }
  );
}

// ✅ Verify Access Token (returns payload or null)
function verifyAccess(token) {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    return null;
  }
}

// ✅ Verify Refresh Token (returns payload or null)
function verifyRefresh(token) {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccess,
  verifyRefresh,
  ACCESS_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
};
