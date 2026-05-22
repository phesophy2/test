const express = require('express');
const router = express.Router();
const phoneService = require('../services/phoneService');

// GET /api/phone/numbers — ទាញយក free numbers
router.get('/numbers', async (req, res) => {
  try {
    const { country = 'US' } = req.query;
    const result = await phoneService.getFreeNumbers(country);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/phone/messages — ទាញយក messages
router.get('/messages', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL required' });
    }
    
    const result = await phoneService.getMessages(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/phone/otp — រង់ចាំ OTP
router.get('/otp', async (req, res) => {
  try {
    const { url, timeout = 120 } = req.query;
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL required' });
    }
    
    const result = await phoneService.getOTP(url, parseInt(timeout) * 1000);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Legacy route for compatibility
router.post('/generate', async (req, res) => {
  try {
    const numbers = await phoneService.getFreeNumbers('US');
    if (numbers.success && numbers.numbers.length > 0) {
      res.json({
        success: true,
        phone: numbers.numbers[0].number,
        url: numbers.numbers[0].url,
        provider: numbers.numbers[0].provider
      });
    } else {
      res.json({ success: false, error: 'No numbers available' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
