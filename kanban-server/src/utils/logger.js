const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/app.log');

// Helper to write log to file
const writeToFile = (log) => {
  fs.appendFileSync(logFile, log + '\n', 'utf8');
};

const logger = {
  info: (message) => {
    const log = `[INFO] ${new Date().toISOString()}: ${message}`;
    console.log(log);
    writeToFile(log);
  },
  warn: (message) => {
    const log = `[WARN] ${new Date().toISOString()}: ${message}`;
    console.warn(log);
    writeToFile(log);
  },
  error: (message, error) => {
    const errInfo = error ? error.stack || error : '';
    const log = `[ERROR] ${new Date().toISOString()}: ${message} ${errInfo}`;
    console.error(log);
    writeToFile(log);
  },
  debug: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      const log = `[DEBUG] ${new Date().toISOString()}: ${message}`;
      console.debug(log);
      writeToFile(log);
    }
  },
};

module.exports = logger;
