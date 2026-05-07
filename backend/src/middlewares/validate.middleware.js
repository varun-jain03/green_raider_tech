// Dependencies
const { validationResult } = require('express-validator');

// File Imports
const ApiError = require('../utils/ApiError.js');

// Runs express-validator Chains And Throws ApiError On Failure
const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      await validation.run(req);
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const formatted = errors
      .array()
      .map((e) => ({ field: e.path, message: e.msg }));
    return next(new ApiError(400, 'Validation failed', formatted));
  };
};

module.exports = validate;
