const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Register
router.post('/register', async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    const existing = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if(existing) return res.status(400).json({ error: 'Email already exists' });
    
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db.run(`INSERT INTO users(email, password_hash, full_name, subscription_tier)
      VALUES(?, ?, ?, 'free')`, [email, passwordHash, fullName]);
    
    const token = jwt.sign({ userId: result.lastID, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: result.lastID, email, fullName, tier: 'free' } });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if(!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, user.password_hash);
    if(!valid) return res.status(401).json({ error: 'Invalid credentials' });
    
    await db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
    const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ success: true, token, user: { id: user.id, email, fullName: user.full_name, tier: user.subscription_tier } });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.get('SELECT id, email, full_name, subscription_tier, subscription_expires FROM users WHERE id = ?', [decoded.userId]);
    res.json(user);
  } catch(err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
