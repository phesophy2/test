const express = require('express');
const router = express.Router();
const db = require('../db');
const freeProxyScraper = require('../services/freeProxyScraper');

router.get('/list', async (req, res) => {
  const proxies = await db.all('SELECT * FROM proxies WHERE active=1');
  res.json(proxies);
});

router.post('/add', async (req, res) => {
  const { url, username, password } = req.body;
  let proxyUrl = url;
  if(username && password) proxyUrl = `http://${username}:${password}@${url}`;
  await db.run('INSERT INTO proxies(url,username,password,active) VALUES(?,?,?,1)', [proxyUrl, username, password]);
  res.json({ success: true });
});

router.post('/test', async (req, res) => {
  const { url } = req.body;
  const result = await freeProxyScraper.testProxy(url);
  res.json(result);
});

router.get('/free', async (req, res) => {
  const proxies = await freeProxyScraper.getWorkingProxies(30);
  res.json(proxies);
});

router.post('/auto-import', async (req, res) => {
  const proxies = await freeProxyScraper.getWorkingProxies(50);
  let imported = 0;
  for(const p of proxies) {
    await db.run('INSERT OR IGNORE INTO proxies(url,active) VALUES(?,1)', [p.url]);
    imported++;
  }
  res.json({ imported, total: proxies.length });
});

module.exports = router;
