const express = require('express');
const router = express.Router();

// Wing payment
router.post('/wing/create', (req, res) => {
  const { amount, orderId, customerPhone } = req.body;
  res.json({
    success: true,
    paymentUrl: `https://pay.wingbank.com.kh/pay?order=${orderId}&amount=${amount}`,
    orderId,
    amount
  });
});

// ABA payment
router.post('/aba/create', (req, res) => {
  const { amount, orderId, customerEmail } = req.body;
  res.json({
    success: true,
    paymentUrl: `https://pay.ababank.com/pay?order=${orderId}&amount=${amount}`,
    orderId,
    amount
  });
});

// KHQR (Bakong) payment
router.post('/khqr/generate', (req, res) => {
  const { amount, merchantName } = req.body;
  const khqrData = `KHQR|${merchantName}|${amount}|KHR`;
  res.json({
    success: true,
    qrData: khqrData,
    qrUrl: `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(khqrData)}&chs=300x300`
  });
});

// Crypto payment (USDT)
router.post('/crypto/create', (req, res) => {
  const { amount, orderId, network } = req.body;
  res.json({
    success: true,
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4',
    network: network || 'BEP-20',
    amount: amount,
    orderId
  });
});

// Webhook handlers
router.post('/webhook/wing', (req, res) => {
  console.log('Wing webhook:', req.body);
  res.json({ received: true });
});

router.post('/webhook/aba', (req, res) => {
  console.log('ABA webhook:', req.body);
  res.json({ received: true });
});

module.exports = router;
