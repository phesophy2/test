const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');

dotenv.config();

// ========== CREATE DATA DIRECTORY ==========
const dataDir = path.join(__dirname, 'data');
const screenshotsDir = path.join(dataDir, 'screenshots');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

// ========== DATABASE SETUP ==========
const dbPath = path.join(dataDir, 'khmerghost.db');
const db = new sqlite3.Database(dbPath);

// Migration: Create accounts table with all columns
const runMigrations = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      first_name TEXT DEFAULT 'Khmer',
      last_name TEXT DEFAULT 'User',
      status TEXT DEFAULT 'pending',
      otp_code TEXT,
      cookies TEXT,
      device_profile TEXT,
      city TEXT,
      screenshot_path TEXT,
      fingerprint TEXT,
      proxy TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Table creation error:', err.message);
    } else {
      console.log('✅ Accounts table ready (with all columns)');
    }
  });
};

runMigrations();

// ========== EXPRESS APP ==========
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make db and io available to routes
app.locals.db = db;
app.locals.io = io;

// ========== ROUTES ==========
const farmRoutes = require('./routes/farmRoutes');
const mailRoutes = require('./routes/mailRoutes');
const systemRoutes = require('./routes/systemRoutes');

app.use('/api/farm', farmRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/system', systemRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ========== SOCKET.IO ==========
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  socket.on('join-batch', (batchId) => {
    socket.join(`batch:${batchId}`);
    console.log(`Socket ${socket.id} joined batch:${batchId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(`🚀 KhmerGhost Backend running on port ${PORT}`);
  console.log(`📁 Database: ${dbPath}`);
  console.log(`📸 Screenshots: ${screenshotsDir}`);
  console.log(`🔌 WebSocket ready`);
});
