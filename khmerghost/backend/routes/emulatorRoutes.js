// emulatorRoutes.js — Android Emulator API Routes
const express = require('express');
const router = express.Router();
const emulatorService = require('../services/emulatorService');

// GET /api/emulator/status
router.get('/status', async (req, res) => {
  const status = await emulatorService.getStatus();
  res.json(status);
});

// POST /api/emulator/connect
router.post('/connect', async (req, res) => {
  const result = await emulatorService.connect();
  res.json(result);
});

// POST /api/emulator/screenshot
router.post('/screenshot', async (req, res) => {
  const result = await emulatorService.takeScreenshot();
  res.json(result);
});

// POST /api/emulator/tap
router.post('/tap', async (req, res) => {
  const { x = 360, y = 640 } = req.body;
  const result = await emulatorService.tap(x, y);
  res.json(result);
});

// POST /api/emulator/swipe
router.post('/swipe', async (req, res) => {
  const { x1 = 360, y1 = 900, x2 = 360, y2 = 200, duration = 300 } = req.body;
  const result = await emulatorService.swipe(x1, y1, x2, y2, duration);
  res.json(result);
});

// POST /api/emulator/type
router.post('/type', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });
  const result = await emulatorService.typeText(text);
  res.json(result);
});

// POST /api/emulator/facebook/start
router.post('/facebook/start', async (req, res) => {
  const result = await emulatorService.startFacebook();
  res.json(result);
});

// POST /api/emulator/facebook/login
router.post('/facebook/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const result = await emulatorService.loginFacebook(email, password);
  res.json(result);
});

// POST /api/emulator/facebook/clear
router.post('/facebook/clear', async (req, res) => {
  const result = await emulatorService.clearFacebook();
  res.json(result);
});

// POST /api/emulator/scroll
router.post('/scroll', async (req, res) => {
  const result = await emulatorService.scroll();
  res.json(result);
});

// POST /api/emulator/install
router.post('/install', async (req, res) => {
  const { apkPath } = req.body;
  if (!apkPath) return res.status(400).json({ error: 'apkPath required' });
  const result = await emulatorService.installApk(apkPath);
  res.json(result);
});

// POST /api/emulator/key — press hardware key
router.post('/key', async (req, res) => {
  const { key } = req.body;
  if (!key) return res.status(400).json({ error: 'key required' });
  await emulatorService.adb(`shell input keyevent ${key}`);
  res.json({ success: true, key });
});

// POST /api/emulator/locale — set locale
router.post('/locale', async (req, res) => {
  const result = await emulatorService.setKhmerLocale();
  res.json({ success: result });
});

// POST /api/emulator/reboot
router.post('/reboot', async (req, res) => {
  await emulatorService.adb('reboot');
  res.json({ success: true });
});

// GET /api/emulator/info
router.get('/info', async (req, res) => {
  const status = await emulatorService.getStatus();
  res.json({ success: true, info: status });
});

module.exports = router;
