const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'khmerghost.db'));

db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    subscription_tier TEXT DEFAULT 'free',
    subscription_expires DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  )`);

  // Accounts table (Facebook, TikTok, Instagram)
  db.run(`CREATE TABLE IF NOT EXISTS accounts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    platform TEXT,
    name TEXT,
    email TEXT,
    password TEXT,
    proxy TEXT,
    cookies TEXT,
    status TEXT DEFAULT 'idle',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Posts table
  db.run(`CREATE TABLE IF NOT EXISTS posts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    account_id INTEGER,
    platform TEXT,
    type TEXT,
    content TEXT,
    hashtags TEXT,
    media_url TEXT,
    status TEXT,
    scheduled_for DATETIME,
    posted_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Proxies table
  db.run(`CREATE TABLE IF NOT EXISTS proxies(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE,
    username TEXT,
    password TEXT,
    active INTEGER DEFAULT 1,
    last_checked DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Mail domains table
  db.run(`CREATE TABLE IF NOT EXISTS mail_domains(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT UNIQUE,
    mx_record TEXT,
    catch_all INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Mailboxes table
  db.run(`CREATE TABLE IF NOT EXISTS mailboxes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    domain TEXT,
    username TEXT,
    password TEXT,
    status TEXT DEFAULT 'active',
    sold_to TEXT,
    sold_price REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    price REAL,
    quantity INTEGER,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT UNIQUE,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    total REAL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    payment_proof TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Subscriptions table
  db.run(`CREATE TABLE IF NOT EXISTS subscriptions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    plan TEXT,
    amount REAL,
    status TEXT,
    start_date DATETIME,
    end_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

db.all = (sql, p=[]) => new Promise((r,j)=>db.all(sql,p,(e,d)=>e?j(e):r(d)));
db.get = (sql, p=[]) => new Promise((r,j)=>db.get(sql,p,(e,d)=>e?j(e):r(d)));
db.run = (sql, p=[]) => new Promise((r,j)=>db.run(sql,p,function(e){e?j(e):r(this)}));
module.exports = db;
