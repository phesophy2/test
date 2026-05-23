const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

router.post('/wing/create', verifyToken, (req, res) => {
  res.json({ success: true, paymentUrl: 'https://pay.wingbank.com.kh/pay', orderId: Date.now().toString() });
});

router.post('/aba/create', verifyToken, (req, res) => {
  res.json({ success: true, paymentUrl: 'https://pay.ababank.com/pay', orderId: Date.now().toString() });
});

router.post('/khqr/generate', verifyToken, (req, res) => {
  res.json({ success: true, qrUrl: 'https://chart.googleapis.com/chart?cht=qr&chl=KHQR_DATA&chs=300x300' });
});

module.exports = router;
