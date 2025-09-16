// middleware/authenticate.js
const { verifyAccess, verifyRefresh, signAccessToken } = require("../utils/jwt");
const User = require("../models/UserSchema");

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const accessToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!accessToken) {
      return res.status(401).json({ ok: false, error: "No access token" });
    }

    //  1. Try access token
    const payload = verifyAccess(accessToken);
    if (payload) {
      req.user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
      };
      return next();
    }

    // 2. Access token invalid/expired → try refresh
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ ok: false, error: "No refresh token" });
    }

    const refreshPayload = verifyRefresh(refreshToken);
    if (!refreshPayload) {
      return res.status(401).json({ ok: false, error: "Invalid refresh token" });
    }

    // Load user
    const user = await User.findById(refreshPayload.sub);
    if (!user) {
      return res.status(401).json({ ok: false, error: "User not found" });
    }

    // Optional: token version check
    if (
      refreshPayload.tokenVersion !== undefined &&
      refreshPayload.tokenVersion !== user.tokenVersion
    ) {
      return res.status(401).json({ ok: false, error: "Stale refresh token" });
    }

    // Issue new access token
    const newAccessToken = signAccessToken(user);
    res.setHeader("x-access-token", newAccessToken);

    // Attach user
    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    return next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
}

module.exports = authenticate;
