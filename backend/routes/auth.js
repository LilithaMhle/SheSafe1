// routes/auth.js
// Handles: Register, Login, Logout, Session check
//
// These endpoints are called by the Ionic/Angular frontend:
//   POST /api/register  ← signup.page.ts  onSignUp()
//   POST /api/login     ← login.page.ts   onLogin()
//   POST /api/logout    ← (header/menu logout button)
//   GET  /api/me        ← app.component.ts (session check on load)

const express   = require('express');
const router    = express.Router();
const bcrypt    = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db        = require('../config/db');

// ── POST /api/register ─────────────────────────────────────────────
// Called by signup.page.ts when user submits the sign up form
// Expects: { firstName, lastName, email, password }
router.post('/register', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
      [firstName, lastName, email, hash]
    );

    // Store session
    req.session.userId    = result.insertId;
    req.session.firstName = firstName;
    req.session.lastName  = lastName;
    req.session.email     = email;

    res.status(201).json({
      message:   'Account created successfully',
      firstName: firstName,
      lastName:  lastName,
      email:     email,
    });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── POST /api/login ────────────────────────────────────────────────
// Called by login.page.ts when user submits the login form
// Expects: { email, password }
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {

  const { email, password } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user  = rows[0];
console.log('DB password:', user.password);
console.log('Entered password:', password);
const match = await bcrypt.compare(password, user.password);
console.log('Match:', match);

    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Store session
    req.session.userId    = user.id;
    req.session.firstName = user.first_name;
    req.session.lastName  = user.last_name;
    req.session.email     = user.email;

    res.json({
      message:   'Login successful',
      firstName: user.first_name,
      lastName:  user.last_name,
      email:     user.email,
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── POST /api/reset-password ───────────────────────────────────────
// Called by login.page.ts onResetPassword()
// Expects: { email, newPassword }
// Finds the user by email and updates their hashed password
router.post('/reset-password', [
  body('email').isEmail().normalizeEmail(),
  body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { email, newPassword } = req.body;

  try {
    // Check the user exists
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'No account found with that email address' });
    }

    // Hash the new password and update
    const hash = await bcrypt.hash(newPassword, 10);
const [result] = await db.execute(
  'UPDATE users SET password = ? WHERE email = ?',
  [hash, email]
);

console.log('Rows updated:', result.affectedRows);
console.log('Email used for reset:', email);
console.log('New hash:', hash);

res.json({ message: 'Password reset successfully' });

  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── POST /api/logout ───────────────────────────────────────────────
// Destroys the session and logs the user out
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

// ── GET /api/me ────────────────────────────────────────────────────
// Returns the currently logged-in user from the session
// Frontend calls this on app startup to restore session state
router.get('/me', (req, res) => {
  if (req.session.userId) {
    return res.json({
      logged_in: true,
      firstName: req.session.firstName,
      lastName:  req.session.lastName,
      email:     req.session.email,
    });
  }
  res.json({ logged_in: false });
});

module.exports = router;