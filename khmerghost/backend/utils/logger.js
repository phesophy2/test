const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class Logger {
  constructor() {
    this.level = LOG_LEVELS[process.env.LOG_LEVEL || 'INFO'];
  }

  formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  debug(message) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.log(this.formatMessage('DEBUG', message));
    }
  }

  info(message) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.log(this.formatMessage('INFO', message));
    }
  }

  warn(message) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn(this.formatMessage('WARN', message));
    }
  }

  error(message) {
    if (this.level <= LOG_LEVELS.ERROR) {
      console.error(this.formatMessage('ERROR', message));
    }
  }
}

module.exports = new Logger();
