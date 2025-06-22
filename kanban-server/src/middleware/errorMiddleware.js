const logger = require('../utils/logger'); // adjust path as needed

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, err); // Log the error with stack trace
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
