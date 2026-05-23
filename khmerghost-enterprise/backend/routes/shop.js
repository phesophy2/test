const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const router = express.Router();

// Get products
router.get('/products', async (req, res) => {
  const products = await db.all('SELECT * FROM products WHERE quantity > 0');
  res.json(products);
});

// Create order
router.post('/order', async (req, res) => {
  const { user_id, product_id, quantity, payment_method } = req.body;
  const product = await db.get('SELECT * FROM products WHERE id = ?', [product_id]);
  if(!product || product.quantity < quantity) {
    return res.status(400).json({ error: 'Insufficient stock' });
  }
  const total = product.price * quantity;
  const orderId = crypto.randomBytes(8).toString('hex');
  await db.run(`INSERT INTO orders(order_id, user_id, product_id, quantity, total, payment_method, status)
    VALUES(?, ?, ?, ?, ?, ?, 'pending')`, [orderId, user_id, product_id, quantity, total, payment_method]);
  res.json({ orderId, total, product: product.name });
});

// Get order status
router.get('/order/:orderId', async (req, res) => {
  const order = await db.get(`SELECT o.*, p.name as product_name FROM orders o JOIN products p ON o.product_id = p.id WHERE o.order_id = ?`, [req.params.orderId]);
  res.json(order);
});

// Confirm payment
router.post('/confirm', async (req, res) => {
  const { orderId, paymentProof } = req.body;
  await db.run('UPDATE orders SET status = "paid", payment_proof = ? WHERE order_id = ?', [paymentProof, orderId]);
  res.json({ success: true });
});

module.exports = router;
