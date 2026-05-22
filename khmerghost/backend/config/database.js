// database.js — Fast SQLite with WAL mode + timeouts
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../data/khmerghost.db');

class FastDatabase {
  constructor() {
    this.db = null;
    this.isReady = false;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) { reject(err); return; }
        console.log('✅ Database connected');

        // Speed optimizations
        this.db.run('PRAGMA journal_mode = WAL');
        this.db.run('PRAGMA synchronous = NORMAL');
        this.db.run('PRAGMA cache_size = 10000');
        this.db.run('PRAGMA temp_store = MEMORY');
        this.db.run('PRAGMA mmap_size = 268435456');
        this.db.run('PRAGMA busy_timeout = 5000');

        this.isReady = true;
        resolve();
      });
    });
  }

  async get(sql, params = [], timeout = 5000) {
    // Ensure database connection is ready
    if (!this.db) {
      await this.init();
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Query timeout ${timeout}ms`)), timeout);
      this.db.get(sql, params, (err, row) => {
        clearTimeout(timer);
        if (err) reject(err); else resolve(row);
      });
    });
  }

  async all(sql, params = [], timeout = 5000) {
    // Ensure database connection is ready
    if (!this.db) {
      await this.init();
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Query timeout ${timeout}ms`)), timeout);
      this.db.all(sql, params, (err, rows) => {
        clearTimeout(timer);
        if (err) reject(err); else resolve(rows);
      });
    });
  }

  async run(sql, params = [], timeout = 5000) {
    // Ensure database connection is ready
    if (!this.db) {
      await this.init();
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Query timeout ${timeout}ms`)), timeout);
      this.db.run(sql, params, function(err) {
        clearTimeout(timer);
        if (err) reject(err); else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  // Legacy callback-style run (for backward compat)
  runSync(sql, params = []) {
    this.db.run(sql, params);
  }

  close() {
    if (this.db) { this.db.close(); this.isReady = false; }
  }
}

const db = new FastDatabase();
module.exports = db;
