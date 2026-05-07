// File Imports
const ApiError = require('../utils/ApiError.js');

// Global Error Handler Middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert non-ApiError errors (like Mongoose errors) to ApiError
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new ApiError(409, `Duplicate value for ${field}`);
  }

  // Handle Mongoose Cast Error (invalid ObjectId)
  if (err.name === 'CastError') {
    error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid access token');
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Access token expired');
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  };

  return res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
