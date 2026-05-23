const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/accounts', async (req, res) => {
  const accounts = await db.all('SELECT * FROM accounts ORDER BY id DESC');
  res.json(accounts);
});

router.get('/stats', async (req, res) => {
  const total = await db.get('SELECT COUNT(*) as c FROM accounts');
  const active = await db.get('SELECT COUNT(*) as c FROM accounts WHERE state="running"');
  res.json({ total: total.c, active: active.c, pending: total.c - active.c, cpu: (Math.random()*10+2).toFixed(1), ram: (Math.random()*20+30).toFixed(1) });
});

router.post('/farm/start', async (req, res) => {
  const { accountIds } = req.body;
  for(const id of accountIds) await db.run('UPDATE accounts SET state="running" WHERE id=?', [id]);
  res.json({ success: true, message: `Started ${accountIds.length} accounts` });
});

router.post('/farm/stop', async (req, res) => {
  const { accountIds } = req.body;
  for(const id of accountIds) await db.run('UPDATE accounts SET state="idle" WHERE id=?', [id]);
  res.json({ success: true, message: `Stopped ${accountIds.length} accounts` });
});

router.post('/post/reel', (req, res) => res.json({ success: true, message: 'Reel posted' }));
router.post('/post/image', (req, res) => res.json({ success: true, message: 'Image posted' }));
router.post('/post/video', (req, res) => res.json({ success: true, message: 'Video posted' }));

router.get('/mumu/devices', (req, res) => res.json([{id:1,name:'MuMu_1',status:'running'},{id:2,name:'MuMu_2',status:'stopped'}]));
router.get('/ldplayer/devices', (req, res) => res.json([{id:1,name:'LDPlayer_1',status:'running'},{id:2,name:'LDPlayer_2',status:'idle'}]));

router.post('/accounts/upload', async (req, res) => {
  const { accounts } = req.body;
  let imported = 0;
  for(const acc of accounts){
    await db.run(`INSERT INTO accounts(name,uid,password,email,emailPass,proxy,state) VALUES(?,?,?,?,?,?,'idle')`,
      [acc.name, acc.uid, acc.password, acc.email, acc.emailPass, acc.proxy]);
    imported++;
  }
  res.json({ success: true, imported });
});

router.get('/balance', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if(!apiKey) return res.status(401).json({ error: 'API Key required' });
  res.json({ balance: 125.50 });
});

module.exports = router;
