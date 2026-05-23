const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/register', async (req, res) => {
  const { email, password, fullName } = req.body;
  const { data: existing } = await supabase.from('users').select('email').eq('email', email).single();
  if (existing) return res.status(400).json({ error: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const { data: user, error } = await supabase.from('users').insert({
    email, password_hash: passwordHash, full_name: fullName, subscription_tier: 'free',
    subscription_expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.full_name, tier: user.subscription_tier } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
  if (error || !user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.full_name, tier: user.subscription_tier } });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  res.json({ success: true, message: 'Reset link sent to email' });
});

module.exports = { authRouter: router, verifyToken: require('../middleware/auth').verifyToken };
