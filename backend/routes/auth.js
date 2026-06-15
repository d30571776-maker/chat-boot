const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

require('../config/passport');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign(req.user, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:4200'}/callback?token=${token}`);
  }
);

router.get('/microsoft', passport.authenticate('microsoft', { scope: ['profile', 'email', 'openid'] }));

router.get('/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign(req.user, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:4200'}/callback?token=${token}`);
  }
);

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Logged out' });
  });
});

router.get('/user', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  res.json({ message: 'User registered', user: { email, name } });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const token = jwt.sign({ email, name: 'User' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  res.json({ token, user: { email, name: 'User' } });
});

module.exports = router;
