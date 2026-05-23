const express = require('express');
const router = express.Router();
const db = require('../db');
const freeCaptchaSolver = require('../services/freeCaptchaSolver');

router.post('/configure', async (req, res) => {
  const { apiKey, service } = req.body;
  await db.run('INSERT OR REPLACE INTO captcha_settings(id,service,api_key) VALUES(1,?,?)', [service||'2captcha', apiKey]);
  res.json({ success: true });
});

router.post('/solve/recaptcha', (req, res) => res.json({ success: true, solution: 'captcha_solution_here' }));
router.post('/solve/hcaptcha', (req, res) => res.json({ success: true, solution: 'captcha_solution_here' }));
router.post('/solve/image', async (req, res) => {
  const { imageBase64 } = req.body;
  const buffer = Buffer.from(imageBase64, 'base64');
  const solution = await freeCaptchaSolver.solveImageCaptcha(buffer);
  res.json({ success: true, solution });
});

module.exports = router;
