// routes/auth.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { signAccessToken, signRefreshToken, verifyAccess, verifyRefresh } = require('../utils/jwt');
const { refreshCookieOptions } = require('../utils/cookies');
const User = require('../models/UserSchema');

const router = express.Router();






// 6) Start GitHub OAuth
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
);

// 7) GitHub OAuth callback
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/', session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      // Issue tokens
      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);

      // Store hashed refresh in DB
      const hash = await bcrypt.hash(refreshToken, 12);
      user.refreshTokenHash = hash;
      await user.save();

      // Set HttpOnly cookie for refresh
      res.cookie('refreshToken', refreshToken, refreshCookieOptions());

      // Redirect back to client with access token
      const client = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
      return res.redirect(`${client}/#access=${accessToken}`);
    } catch (e) {
      console.error('GitHub callback error:', e);
      return res.redirect((process.env.CLIENT_ORIGIN || 'http://localhost:5173') + '/login?error=auth_failed');
    }
  }
);





// 1) Start Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// 2) Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      // Issue tokens
      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);

      // Store hashed refresh in DB
      const hash = await bcrypt.hash(refreshToken, 12);
      user.refreshTokenHash = hash;
      await user.save();

      // Set HttpOnly cookie for refresh
      res.cookie('refreshToken', refreshToken, refreshCookieOptions());

      // Redirect back to client with access token in URL fragment (or handle via /auth/me)
      const client = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
      // You can deliver access token via redirect fragment OR let client call /auth/me after redirect.
      return res.redirect(`${client}/#access=${accessToken}`);
    } catch (e) {
      console.error('Callback error:', e);
      return res.redirect((process.env.CLIENT_ORIGIN || 'http://localhost:5173') + '/login?error=auth_failed');
    }
  }
);

// 3) Silent refresh – rotate refresh token, mint fresh access
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ ok: false, error: 'No refresh token' });

    const payload = verifyRefresh(token); // throws if invalid/expired

    const user = await User.findById(payload.sub);
    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({ ok: false, error: 'Invalid refresh state' });
    }

    const ok = await bcrypt.compare(token, user.refreshTokenHash);
    if (!ok) return res.status(401).json({ ok: false, error: 'Refresh mismatch' });

    // Rotate refresh
    const newRefresh = signRefreshToken(user);
    user.refreshTokenHash = await bcrypt.hash(newRefresh, 12);
    await user.save();

    // Set new cookie
    res.cookie('refreshToken', newRefresh, refreshCookieOptions());

    // New access
    const newAccess = signAccessToken(user);
    return res.json({ ok: true, accessToken: newAccess, user: { id: user._id, email: user.email, name: user.name, photo: user.photo } });
  } catch (e) {
    console.error('Refresh error:', e.message);
    return res.status(401).json({ ok: false, error: 'Refresh failed' });
  }
});

// 4) Who am I – requires valid access token
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ ok: false, error: 'No access token' });

    const payload = verifyAccess(token);
    const user = await User.findById(payload.sub).select('_id email name photo');
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });

    return res.json({ ok: true, user });
  } catch (e) {
    return res.status(401).json({ ok: false, error: 'Invalid/expired access token' });
  }
});

// 5) Logout – clear cookie & invalidate refresh
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      // Best effort: find user and clear hash
      try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(payload.sub);
        if (user) {
          user.refreshTokenHash = null;
          await user.save();
        }
      } catch (_) {}
    }
    res.clearCookie('refreshToken', refreshCookieOptions());
    return res.json({ ok: true });
  } catch (e) {
    return res.json({ ok: true });
  }
});

module.exports = router;
