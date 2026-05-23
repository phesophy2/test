const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all accounts
router.get('/accounts', async (req, res) => {
  const accounts = await db.all('SELECT * FROM accounts ORDER BY id DESC');
  res.json(accounts);
});

// Add account
router.post('/accounts', async (req, res) => {
  const { user_id, platform, name, email, password, proxy } = req.body;
  const result = await db.run(`INSERT INTO accounts(user_id, platform, name, email, password, proxy, status)
    VALUES(?, ?, ?, ?, ?, ?, 'idle')`, [user_id, platform, name, email, password, proxy]);
  res.json({ success: true, id: result.lastID });
});

// Update account
router.put('/accounts/:id', async (req, res) => {
  const { name, email, password, proxy, status } = req.body;
  await db.run(`UPDATE accounts SET name=?, email=?, password=?, proxy=?, status=? WHERE id=?`,
    [name, email, password, proxy, status, req.params.id]);
  res.json({ success: true });
});

// Delete account
router.delete('/accounts/:id', async (req, res) => {
  await db.run('DELETE FROM accounts WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// Start farming
router.post('/start', async (req, res) => {
  const { accountIds } = req.body;
  for(const id of accountIds) {
    await db.run('UPDATE accounts SET status = "running" WHERE id = ?', [id]);
  }
  res.json({ success: true, message: `Started ${accountIds.length} accounts` });
});

// Stop farming
router.post('/stop', async (req, res) => {
  const { accountIds } = req.body;
  for(const id of accountIds) {
    await db.run('UPDATE accounts SET status = "idle" WHERE id = ?', [id]);
  }
  res.json({ success: true, message: `Stopped ${accountIds.length} accounts` });
});

// Get stats
router.get('/stats', async (req, res) => {
  const total = await db.get('SELECT COUNT(*) as c FROM accounts');
  const active = await db.get('SELECT COUNT(*) as c FROM accounts WHERE status = "running"');
  res.json({ total: total.c, active: active.c, cpu: (Math.random()*10+2).toFixed(1), ram: (Math.random()*20+30).toFixed(1) });
});

module.exports = router;
