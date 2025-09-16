// utils/cookies.js
function refreshCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,          // true in prod (HTTPS)
    sameSite: isProd ? 'None' : 'Lax',
    domain: process.env.COOKIE_DOMAIN || 'localhost',
    path: '/auth/refresh',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };
}

module.exports = { refreshCookieOptions };
