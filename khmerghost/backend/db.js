const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'khmerghost.db');
const db = new sqlite3.Database(dbPath);

// Initialize tables
db.serialize(() => {
  // Accounts table
  db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      uid TEXT UNIQUE,
      password TEXT,
      twofa TEXT,
      email TEXT,
      emailPass TEXT,
      file TEXT,
      primary_check INTEGER DEFAULT 0,
      birthday TEXT,
      e_crea TEXT,
      cookie TEXT,
      any_co TEXT,
      note TEXT,
      proxy TEXT,
      state TEXT DEFAULT 'idle'
    )
  `);

  // Settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  // Posts table
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      account_id INTEGER,
      hashtags TEXT,
      status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Promisify db methods
db.all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

db.get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

// Preserve original run method
const _run = db.run.bind(db);
// Async wrapper for run
db.runAsync = (sql, params = []) => new Promise((resolve, reject) => {
  _run(sql, params, function(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

// Export both original and async helpers
module.exports = db;
