const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/UserSchema');
const GitHubStrategy = require('passport-github2').Strategy;




// GitHub OAuth

passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // GitHub may return multiple emails, pick primary verified
      let email = profile.emails?.find(e => e.primary && e.verified)?.value;
      if (!email) email = profile.emails?.[0]?.value; // fallback
      // Allow null if nothing
      const githubId = profile.id;

      let user = await User.findOne({ githubId });
      if (!user) {
        user = await User.create({
          githubId,
          email: email || null,
          name: profile.displayName || profile.username,
          photo: profile.photos?.[0]?.value,
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));






// google Auth
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          photo: profile.photos?.[0]?.value,
        });
      }

      // NOTE: We don't use server sessions; just pass the user through.
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// No serialize/deserialize needed without sessions.
