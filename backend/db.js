const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'khmerghost.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS accounts(
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, uid TEXT UNIQUE, password TEXT,
    twofa TEXT, email TEXT, emailPass TEXT, file TEXT, primary_check INTEGER DEFAULT 0,
    birthday TEXT, e_crea TEXT, cookie TEXT, any_co TEXT, note TEXT, proxy TEXT, state TEXT DEFAULT 'idle'
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS proxies(
    id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT UNIQUE, username TEXT, password TEXT, active INTEGER DEFAULT 1
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS posts(
    id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, account_id INTEGER, hashtags TEXT, status TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS mail_domains (
    id INTEGER PRIMARY KEY AUTOINCREMENT, domain TEXT UNIQUE, mx_record TEXT,
    catch_all INTEGER DEFAULT 0, forward_to TEXT, status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS mailboxes (
    id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, domain TEXT,
    username TEXT, password TEXT, status TEXT DEFAULT 'active',
    sold_to TEXT, sold_at DATETIME, sold_price REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT,
    price REAL, quantity INTEGER, description TEXT, data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT, order_id TEXT UNIQUE,
    customer_email TEXT, product_id INTEGER, quantity INTEGER,
    total REAL, status TEXT DEFAULT 'pending', payment_method TEXT,
    payment_proof TEXT, delivery_data TEXT, paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

db.all = (sql, p=[]) => new Promise((r,j)=>db.all(sql,p,(e,d)=>e?j(e):r(d)));
db.get = (sql, p=[]) => new Promise((r,j)=>db.get(sql,p,(e,d)=>e?j(e):r(d)));
db.run = (sql, p=[]) => new Promise((r,j)=>db.run(sql,p,function(e){e?j(e):r(this)}));
module.exports = db;
