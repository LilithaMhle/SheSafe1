// routes/products.js
// The Products Database — your Sprint 1 task
//
// Endpoints:
//   GET  /api/products           ← fetch all products (with optional search)
//   GET  /api/products/:id       ← fetch one product's full detail
//
// Query parameters for GET /api/products:
//   ?q=kotex          search by name or brand
//   ?category=Sanitary Pad    filter by type
//   ?sort=safety      sort by safety score (default)
//   ?sort=name        sort alphabetically

const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// ── GET /api/products ──────────────────────────────────────────────
router.get('/', async (req, res) => {
  const { q = '', category = '', sort = 'safety' } = req.query;

  // Choose sort order
  const orderMap = {
    safety: 'safety_score DESC',
    name:   'name ASC',
  };
  const order = orderMap[sort] || 'safety_score DESC';

  // Build query dynamically based on filters
  let sql    = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (q) {
    sql += ' AND (name LIKE ? OR brand LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  sql += ` ORDER BY ${order}`;

  try {
    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Products fetch error:', err);
    res.status(500).json({ error: 'Could not load products' });
  }
});

// ── GET /api/products/:id ──────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Product detail error:', err);
    res.status(500).json({ error: 'Could not load product' });
  }
});

module.exports = router;
