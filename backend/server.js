const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:3000" } });

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Routes
const farmRoutes = require('./routes/farmRoutes');
const proxyRoutes = require('./routes/proxyRoutes');
const captchaRoutes = require('./routes/captchaRoutes');
const adspowerRoutes = require('./routes/adspowerRoutes');
const mailRoutes = require('./routes/mailRoutes');
const shopRoutes = require('./routes/shopRoutes');
const { authRouter } = require('./routes/authRoutes');
const subscriptionRouter = require('./routes/subscriptionRoutes');
const paymentRouter = require('./routes/paymentRoutes');

app.use('/api', farmRoutes);
app.use('/api/proxy', proxyRoutes);
app.use('/api/captcha', captchaRoutes);
app.use('/api/adspower', adspowerRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/auth', authRouter);
app.use('/api/subscription', subscriptionRouter);
app.use('/api/payment', paymentRouter);

// Swagger
const setupSwagger = require('./swagger');
setupSwagger(app);

// WebSocket
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`✅ Backend on http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});

// Start auto-proxy rotation
// const autoProxyRotation = require('./services/autoProxyRotation');
// autoProxyRotation.start(30);
