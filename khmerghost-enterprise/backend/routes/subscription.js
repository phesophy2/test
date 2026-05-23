const express = require('express');
const db = require('../db');
const router = express.Router();

// Get plans
router.get('/plans', (req, res) => {
  res.json([
    { tier: 'free', name: 'Free', price: 0, features: { accounts: 5, posts_per_day: 10, devices: 1 } },
    { tier: 'basic', name: 'Basic', price: 29, features: { accounts: 50, posts_per_day: 100, devices: 5, ai_content: true } },
    { tier: 'pro', name: 'Pro', price: 99, features: { accounts: 500, posts_per_day: 1000, devices: 20, ai_content: true, bulk_export: true } },
    { tier: 'enterprise', name: 'Enterprise', price: 499, features: { accounts: 5000, posts_per_day: 10000, devices: 100, white_label: true, api_access: true } }
  ]);
});

// Get current subscription
router.get('/current/:userId', async (req, res) => {
  const user = await db.get('SELECT subscription_tier, subscription_expires FROM users WHERE id = ?', [req.params.userId]);
  res.json({ tier: user?.subscription_tier || 'free', expires: user?.subscription_expires });
});

// Upgrade subscription
router.post('/upgrade', async (req, res) => {
  const { userId, tier, amount } = req.body;
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await db.run('UPDATE users SET subscription_tier = ?, subscription_expires = ? WHERE id = ?', [tier, expires, userId]);
  await db.run('INSERT INTO subscriptions(user_id, plan, amount, status, start_date, end_date) VALUES(?, ?, ?, "active", ?, ?)',
    [userId, tier, amount, new Date(), expires]);
  res.json({ success: true, tier, expires });
});

module.exports = router;
