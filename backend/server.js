// server.js
// SheSafe Backend — Sprint 1
// Node.js + Express server
//
// The Ionic/Angular frontend runs on http://localhost:8100
// This backend runs on http://localhost:3000
// CORS is enabled so both can talk to each other

const express = require('express');
const session = require('express-session');
const cors    = require('cors');
const path    = require('path');

const app = express();

// ── CORS ───────────────────────────────────────────────────────────
// Allows the Ionic frontend (port 8100) to call this backend (port 3000)
app.use(cors({
  origin:      ['http://localhost:4200', 'http://localhost:8100'],   // Ionic dev server default port
  credentials: true,                      // Required for sessions to work
}));

// ── Body Parsers ───────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Session ────────────────────────────────────────────────────────
app.use(session({
  secret:            'shesafe_sprint1_2025',
  resave:            false,
  saveUninitialized: false,
  cookie: {
    maxAge:   1000 * 60 * 60 * 24,  // 24 hours
    sameSite: 'lax',
  },
}));

// ── API Routes ─────────────────────────────────────────────────────
app.use('/api',          require('./routes/auth'));      // register, login, logout, me
app.use('/api/products', require('./routes/products'));  // product database

// ── Health check ───────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'SheSafe backend is running', sprint: 1 });
});

// ── Start server ───────────────────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => {
  console.log('\n✅  SheSafe Backend is running!');
  console.log(`   API URL  → http://localhost:${PORT}`);
 console.log(`   Frontend → http://localhost:4200 or http://localhost:8100  (run: ionic serve)`);
  console.log('\n   Available endpoints:');
  console.log('   POST /api/register');
  console.log('   POST /api/login');
  console.log('   POST /api/logout');
  console.log('   GET  /api/me');
  console.log('   GET  /api/products');
  console.log('   GET  /api/products/:id\n');
});
