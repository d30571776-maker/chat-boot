const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const jwt = require('jsonwebtoken');

const User = {
  1: { id: 1, email: 'test@example.com', name: 'Test User', provider: 'local' }
};

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  return done(null, { 
    id: profile.id, 
    email: profile.emails[0].value, 
    name: profile.displayName,
    provider: 'google',
    accessToken: accessToken,
    refreshToken: refreshToken
  });
}));

passport.use(new MicrosoftStrategy({
  clientID: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  callbackURL: '/api/auth/microsoft/callback'
}, (accessToken, refreshToken, profile, done) => {
  return done(null, { 
    id: profile.id, 
    email: profile.emails[0].value, 
    name: profile.displayName,
    provider: 'microsoft',
    accessToken: accessToken,
    refreshToken: refreshToken
  });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
