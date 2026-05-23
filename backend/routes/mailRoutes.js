const express = require('express');
const router = express.Router();
const db = require('../db');
const mailFactory = require('../services/mailFactory');
const crypto = require('crypto');

router.get('/stats', async (req, res) => {
  const totalEmails = await db.get('SELECT COUNT(*) as c FROM mailboxes');
  const activeDomains = await db.get('SELECT COUNT(*) as c FROM mail_domains WHERE status="active"');
  const todayProduction = await db.get(`SELECT COUNT(*) as c FROM mailboxes WHERE DATE(created_at/1000, 'unixepoch') = DATE('now')`);
  const monthlyRevenue = await db.get(`SELECT SUM(total) as s FROM orders WHERE strftime('%Y-%m', created_at/1000, 'unixepoch') = strftime('%Y-%m', 'now')`);
  res.json({ totalEmails: totalEmails.c || 0, activeDomains: activeDomains.c || 0, todayProduction: todayProduction.c || 0, monthlyRevenue: monthlyRevenue.s || 0 });
});

router.get('/domains', async (req, res) => {
  const domains = await db.all(`SELECT d.*, COUNT(m.id) as mailbox_count FROM mail_domains d LEFT JOIN mailboxes m ON d.domain = m.domain GROUP BY d.id`);
  res.json(domains);
});

router.post('/domain', async (req, res) => {
  const { domain } = req.body;
  const available = await mailFactory.checkDomainAvailability(domain);
  if(!available) return res.status(400).json({ error: 'Domain not available' });
  await mailFactory.registerDomain(domain);
  await mailFactory.configureDomainMX(domain, `mx.${domain}`);
  res.json({ success: true, domain });
});

router.post('/produce', async (req, res) => {
  const { count, domain, prefix } = req.body;
  const mailboxes = await mailFactory.createBulkMailboxes(domain, count || 100, prefix || 'user');
  res.json({ produced: mailboxes.length, sample: mailboxes[0] });
});

router.get('/mailboxes', async (req, res) => {
  const mailboxes = await db.all('SELECT * FROM mailboxes ORDER BY created_at DESC');
  res.json(mailboxes);
});

router.get('/export/:type', async (req, res) => {
  const { type } = req.params;
  let mailboxes;
  if(type === 'active') mailboxes = await db.all('SELECT email, password, domain FROM mailboxes WHERE status="active"');
  else if(type === 'domain') mailboxes = await db.all('SELECT email, password, domain FROM mailboxes WHERE domain IN (SELECT domain FROM mail_domains WHERE status="active")');
  else mailboxes = await db.all('SELECT email, password, domain FROM mailboxes');
  const csv = ['email,password,domain', ...mailboxes.map(m => `${m.email},${m.password},${m.domain}`)].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=emails_${type}_${Date.now()}.csv`);
  res.send(csv);
});

router.post('/sell', async (req, res) => {
  const { emailId, price, customerEmail } = req.body;
  const mailbox = await db.get('SELECT * FROM mailboxes WHERE id = ?', [emailId]);
  if(!mailbox) return res.status(404).json({ error: 'Email not found' });
  await db.run(`UPDATE mailboxes SET status='sold', sold_to=?, sold_at=?, sold_price=? WHERE id=?`, [customerEmail, Date.now(), price, emailId]);
  res.json({ success: true, email: mailbox.email, price });
});

module.exports = router;
