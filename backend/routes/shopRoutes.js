const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');

router.get('/products', async (req, res) => {
  const products = await db.all('SELECT * FROM products WHERE quantity > 0');
  res.json(products);
});

router.get('/mail-products', async (req, res) => {
  const products = await db.all('SELECT * FROM products WHERE type IN ("gmail","outlook","custom","bulk","domain_package")');
  res.json(products);
});

router.post('/order', async (req, res) => {
  const { customerEmail, productId, quantity, paymentMethod } = req.body;
  const product = await db.get('SELECT * FROM products WHERE id = ?', [productId]);
  if(!product || product.quantity < quantity) return res.status(400).json({ error: 'Insufficient stock' });
  const total = product.price * quantity;
  const orderId = crypto.randomBytes(8).toString('hex');
  await db.run(`INSERT INTO orders(order_id,customer_email,product_id,quantity,total,payment_method,status) VALUES(?,?,?,?,?,?,'pending')`, [orderId, customerEmail, productId, quantity, total, paymentMethod]);
  res.json({ orderId, total, product: product.name, paymentAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4' });
});

router.post('/order/confirm', async (req, res) => {
  const { orderId, paymentProof } = req.body;
  await db.run(`UPDATE orders SET status='paid', payment_proof=?, paid_at=? WHERE order_id=?`, [paymentProof, Date.now(), orderId]);
  res.json({ success: true });
});

router.get('/order/:orderId', async (req, res) => {
  const order = await db.get(`SELECT o.*, p.name as product_name FROM orders o JOIN products p ON o.product_id = p.id WHERE o.order_id = ?`, [req.params.orderId]);
  res.json(order);
});

router.get('/export/:orderId', async (req, res) => {
  const order = await db.get('SELECT * FROM orders WHERE order_id = ?', [req.params.orderId]);
  if(!order || !order.delivery_data) return res.status(404).json({ error: 'No delivery data' });
  const emails = JSON.parse(order.delivery_data);
  const csv = ['email,password,domain', ...emails.map(e => `${e.email},${e.password},${e.domain}`)].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=emails_${order.order_id}.csv`);
  res.send(csv);
});

module.exports = router;
