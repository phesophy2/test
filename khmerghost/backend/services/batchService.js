const facebookService = require('./facebookService');
const perf = require('../config/performance');
let shouldStop = false;

// Process a batch of account creations
async function processQueue(batchId, config, db, io) {
  const total = config.quantity;
  let completed = 0;
  let failed = 0;
  shouldStop = false;

  for (let i = 0; i < total; i++) {
    if (shouldStop) {
      io.to(`batch:${batchId}`).emit('registration-progress', {
        timestamp: new Date().toISOString(),
        message: `⏹️ Batch stopped by user. ${completed}/${total} completed.`,
        completed: true,
        success: false
      });
      break;
    }

    // Notify start of this account creation
    io.to(`batch:${batchId}`).emit('registration-progress', {
      timestamp: new Date().toISOString(),
      message: `🔄 Creating account ${i + 1} of ${total}...`,
      completed: false,
      success: false
    });

    try {
      const result = await facebookService.createAccount({
        proxyMode: config.proxyMode,
        otpMode: config.otpMode,
        tempMail: config.tempMail
      });

      if (result.success) {
        completed++;
        io.to(`batch:${batchId}`).emit('registration-progress', {
          timestamp: new Date().toISOString(),
          message: `✅ Account ${i + 1} created: ${result.account.email}`,
          otpCode: result.account.otpCode || null,
          completed: false,
          success: true,
          account: result.account
        });
        // Global event for UI dashboards
        io.emit('account-created', result.account);
      } else {
        failed++;
        io.to(`batch:${batchId}`).emit('registration-progress', {
          timestamp: new Date().toISOString(),
          message: `❌ Account ${i + 1} failed: ${result.error}`,
          completed: false,
          success: false
        });
        io.emit('account-failed', { error: result.error });
      }
    } catch (err) {
      failed++;
      io.to(`batch:${batchId}`).emit('registration-progress', {
        timestamp: new Date().toISOString(),
        message: `❌ Error: ${err.message}`,
        completed: false,
        success: false
      });
    }

    // Respect configured delay between accounts
    await new Promise(resolve => setTimeout(resolve, config.delay || perf.BATCH_DELAY_MS));
  }

  // Final batch completion event
  io.to(`batch:${batchId}`).emit('batch-completed', {
    total,
    completed,
    failed,
    timestamp: new Date().toISOString()
  });

  return { total, completed, failed };
}

function stopCurrentBatch() {
  shouldStop = true;
}

module.exports = { processQueue, stopCurrentBatch };