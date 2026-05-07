// File Imports
const ApiError = require('../utils/ApiError.js');

// Restrict Route Access To Given Roles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, `Access denied. Required role: ${allowedRoles.join(" or ")}`));
    }
    next();
  };
};

module.exports = { authorizeRoles };