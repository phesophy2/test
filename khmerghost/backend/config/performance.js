// config/performance.js — Centralized performance tunables
module.exports = {
  // Batch processing
  MAX_CONCURRENT_ACCOUNTS: 5, // number of accounts processed in parallel
  BATCH_DELAY_MS: 30000, // delay between batches to avoid rate limiting

  // OTP handling
  OTP_POLL_TIMEOUT_MS: 60000, // max wait for OTP
  OTP_POLL_INTERVAL_MS: 5000, // interval between OTP checks

  // Playwright launch options (can be overridden via env vars)
  PLAYWRIGHT_HEADLESS: true,
  PLAYWRIGHT_ARGS: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-blink-features=AutomationControlled'
  ],

  // Database pragmas (already set in config/database.js)
  DB_PRAGMAS: {
    journal_mode: 'WAL',
    synchronous: 'NORMAL',
    cache_size: 10000,
    temp_store: 'MEMORY',
    mmap_size: 268435456,
    busy_timeout: 5000
  }
};
