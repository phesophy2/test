const express = require('express');
const router = express.Router();
const telegramService = require('../services/telegramService');
const logger = require('../utils/logger');

// Send message
router.post('/send', async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const result = await telegramService.sendMessage(chatId, message);
    res.json(result);
  } catch (error) {
    logger.error(`Bot send route error: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Handle command
router.post('/command', async (req, res) => {
  try {
    const { command, params } = req.body;
    const result = await telegramService.handleCommand(command, params);
    res.json(result);
  } catch (error) {
    logger.error(`Bot command route error: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
