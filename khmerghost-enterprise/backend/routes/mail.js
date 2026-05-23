const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const router = express.Router();

// Get mail stats
router.get('/stats', async (req, res) => {
  const totalEmails = await db.get('SELECT COUNT(*) as c FROM mailboxes');
  const activeDomains = await db.get('SELECT COUNT(*) as c FROM mail_domains WHERE status="active"');
  const todayProduction = await db.get(`SELECT COUNT(*) as c FROM mailboxes WHERE DATE(created_at) = DATE('now')`);
  res.json({ totalEmails: totalEmails.c || 0, activeDomains: activeDomains.c || 0, todayProduction: todayProduction.c || 0 });
});

// Get domains
router.get('/domains', async (req, res) => {
  const domains = await db.all(`SELECT d.*, COUNT(m.id) as mailbox_count FROM mail_domains d LEFT JOIN mailboxes m ON d.domain = m.domain GROUP BY d.id`);
  res.json(domains);
});

// Add domain
router.post('/domain', async (req, res) => {
  const { domain } = req.body;
  await db.run('INSERT INTO mail_domains(domain, status) VALUES(?, "active")', [domain]);
  res.json({ success: true, domain });
});

// Start production
router.post('/produce', async (req, res) => {
  const { count, domain, prefix } = req.body;
  const mailboxes = [];
  for(let i = 0; i < (count || 100); i++) {
    const username = `${prefix || 'user'}${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const email = `${username}@${domain}`;
    const password = crypto.randomBytes(8).toString('hex');
    await db.run('INSERT INTO mailboxes(email, domain, username, password) VALUES(?, ?, ?, ?)', [email, domain, username, password]);
    mailboxes.push({ email, password });
    await new Promise(r => setTimeout(r, 50));
  }
  res.json({ produced: mailboxes.length, sample: mailboxes[0] });
});

// Get mailboxes
router.get('/mailboxes', async (req, res) => {
  const mailboxes = await db.all('SELECT * FROM mailboxes ORDER BY created_at DESC');
  res.json(mailboxes);
});

// Export mailboxes
router.get('/export/:type', async (req, res) => {
  const { type } = req.params;
  let mailboxes;
  if(type === 'active') {
    mailboxes = await db.all('SELECT email, password, domain FROM mailboxes WHERE status="active"');
  } else {
    mailboxes = await db.all('SELECT email, password, domain FROM mailboxes');
  }
  const csv = ['email,password,domain', ...mailboxes.map(m => `${m.email},${m.password},${m.domain}`)].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=emails_${type}_${Date.now()}.csv`);
  res.send(csv);
});

// Sell email
router.post('/sell', async (req, res) => {
  const { emailId, price, customerEmail } = req.body;
  await db.run('UPDATE mailboxes SET status="sold", sold_to=?, sold_price=? WHERE id=?', [customerEmail, price, emailId]);
  res.json({ success: true });
});

module.exports = router;
