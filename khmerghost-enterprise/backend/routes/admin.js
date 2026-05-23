const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  const users = await db.all('SELECT id, email, full_name, subscription_tier, created_at, last_login FROM users');
  res.json(users);
});

// Get system stats
router.get('/stats', async (req, res) => {
  const totalUsers = await db.get('SELECT COUNT(*) as c FROM users');
  const totalAccounts = await db.get('SELECT COUNT(*) as c FROM accounts');
  const totalOrders = await db.get('SELECT COUNT(*) as c FROM orders');
  const totalRevenue = await db.get('SELECT SUM(total) as s FROM orders WHERE status="paid"');
  res.json({
    totalUsers: totalUsers.c || 0,
    totalAccounts: totalAccounts.c || 0,
    totalOrders: totalOrders.c || 0,
    totalRevenue: totalRevenue.s || 0
  });
});

module.exports = router;
