// config/db.js
// MySQL connection pool — shared across all route files

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:             'localhost',
  user:             'root',
  password:         '@Mut1206085',        // ← Put your MySQL root password here
  database:         'shesafe',
  waitForConnections: true,
  connectionLimit:  10,
});

module.exports = pool;
