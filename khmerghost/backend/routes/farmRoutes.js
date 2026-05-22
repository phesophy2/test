const express = require('express');
const router = express.Router();
const { processQueue, stopCurrentBatch } = require('../services/batchService');
const facebookService = require('../services/facebookService');
const optimizedCreator = require('../services/optimizedCreator');

let isBatchRunning = false;
let currentBatch = null;

// GET /api/farm/accounts
router.get('/accounts', (req, res) => {
  const { db } = req.app.locals;
  
  db.all(`SELECT * FROM accounts ORDER BY created_at DESC`, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    
    const accounts = rows.map(row => ({
      id: row.id,
      email: row.email || '',
      password: row.password || '',
      first_name: row.first_name || 'Khmer',
      last_name: row.last_name || 'User',
      status: row.status === 'registered' ? 'verified' : 
              row.status?.includes('pending') ? 'pending' : 
              row.status || 'pending',
      otp_code: row.otp_code || null,
      created_at: row.created_at
    }));
    
    res.json({ success: true, accounts });
  });
});

// GET /api/farm/stats
router.get('/stats', (req, res) => {
  const { db } = req.app.locals;
  
  db.get(`SELECT COUNT(*) as total FROM accounts`, (err, totalRow) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.get(`SELECT COUNT(*) as active FROM accounts WHERE status = 'verified' OR status = 'registered'`, (err, activeRow) => {
      db.get(`SELECT COUNT(*) as pending FROM accounts WHERE status = 'pending' OR status = 'pending_verification'`, (err, pendingRow) => {
        db.get(`SELECT COUNT(*) as banned FROM accounts WHERE status = 'banned'`, (err, bannedRow) => {
          res.json({
            total: totalRow?.total || 0,
            active: activeRow?.active || 0,
            pending: pendingRow?.pending || 0,
            banned: bannedRow?.banned || 0
          });
        });
      });
    });
  });
});

// GET /api/farm/status
router.get('/status', (req, res) => {
  res.json({
    batch_running: isBatchRunning,
    current_batch: currentBatch,
    timestamp: new Date().toISOString()
  });
});

// POST /api/farm/batch
router.post('/batch', async (req, res) => {
  const { quantity, count, delay, proxyMode, otpMode, tempMail, warmupDays } = req.body;
  
  if (isBatchRunning) {
    return res.status(400).json({ success: false, error: 'Batch already running' });
  }
  
  const batchId = `batch_${Date.now()}`;
  const config = {
    quantity: quantity || count || 10,
    delay: delay || 5000,
    proxyMode: proxyMode || 'random',
    otpMode: otpMode === 'auto' ? 'auto' : (otpMode || 'auto'),
    tempMail: tempMail !== false,
    warmupDays: warmupDays || 0
  };
  
  isBatchRunning = true;
  currentBatch = { id: batchId, config, startedAt: new Date().toISOString() };
  
  // Run batch asynchronously
  processQueue(batchId, config, req.app.locals.db, req.app.locals.io).finally(() => {
    isBatchRunning = false;
    currentBatch = null;
  });
  
  res.json({ success: true, batchId, config });
});

// POST /api/farm/batch/stop
router.post('/batch/stop', (req, res) => {
  if (!isBatchRunning) {
    return res.status(400).json({ success: false, error: 'No batch running' });
  }
  
  stopCurrentBatch();
  isBatchRunning = false;
  res.json({ success: true, message: 'Batch stop requested' });
});

// POST /api/farm/single (legacy creator)
router.post('/single', async (req, res) => {
  const { proxyMode, otpMode, tempMail } = req.body;
  
  const result = await facebookService.createAccount({
    proxyMode: proxyMode || 'random',
    otpMode: otpMode === 'auto' ? 'auto' : (otpMode || 'auto'),
    tempMail: tempMail !== false
  });
  
  res.json(result);
});

// POST /api/farm/create-optimized (new high‑success creator)
router.post('/create-optimized', async (req, res) => {
  try {
    const result = await optimizedCreator.createAccount();
    res.json(result);
  } catch (e) {
    console.error('OptimizedCreator error:', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/farm/test-login
router.post('/test-login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required' });
  }
  
  const result = await facebookService.testLogin(email, password);
  res.json(result);
});

module.exports = router;
