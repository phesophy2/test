const express = require('express');
const router = express.Router();
const mailService = require('../services/mailService');

// Generate temporary email (Mail.tm)
router.post('/generate', async (req, res) => {
  try {
    const provider = req.body.provider || 'mail.tm';
    let result;
    
    if (provider === 'mail.tm') {
      result = await mailService.generateMailTm();
    } else if (provider === 'guerrilla') {
      result = await mailService.generateGuerrillaMail();
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid provider. Use "mail.tm" or "guerrilla"' 
      });
    }
    
    res.json(result);
  } catch (error) {
    console.error(`❌ Mail generation route error: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check inbox
router.get('/inbox', async (req, res) => {
  try {
    const { token, provider } = req.query;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        error: 'Token is required' 
      });
    }
    
    const result = await mailService.getInbox(token, provider || 'mail.tm');
    res.json(result);
  } catch (error) {
    console.error(`❌ Inbox check route error: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get OTP from message
router.get('/otp/:messageId', async (req, res) => {
  try {
    const { token, provider } = req.query;
    const { messageId } = req.params;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        error: 'Token is required' 
      });
    }
    
    const result = await mailService.getOTP(token, messageId, provider || 'mail.tm');
    res.json(result);
  } catch (error) {
    console.error(`❌ OTP extraction route error: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mock mail stock data
const stockData = {
  hotmail: { price: 0.005, stock: 3494, duration: '1-3 Hours', status: 'In Stock' },
  outlook: { price: 0.005, stock: 288, duration: '1-3 Hours', status: 'In Stock' },
  hotmail_trusted: { price: 0.015, stock: 7917, duration: '6-12 months', status: 'In Stock' },
  outlook_trusted: { price: 0.015, stock: 9999, duration: '6-12 months', status: 'In Stock' },
  gmail: { price: 0.055, stock: 0, duration: '15 minutes', status: 'Out of Stock' }
};

// GET /stock
router.get('/stock', (req, res) => {
  const stock = Object.entries(stockData).map(([type, data]) => ({
    type,
    price: data.price,
    stock: data.stock,
    duration: data.duration,
    status: data.status
  }));
  console.log('📧 Mail stock requested, returning', stock.length, 'items');
  res.json({ success: true, stock });
});

module.exports = router;
