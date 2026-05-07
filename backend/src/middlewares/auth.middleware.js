// Dependencies
const jwt = require('jsonwebtoken');

// File Imports
const ApiError = require('../utils/ApiError.js');
const asyncHandler = require('../utils/asyncHandler.js');
const { findUserById } = require('../modules/users/user.repository.js');

// Verify JWT And Attach User To Request
const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Access token is missing or malformed");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Access token not provided");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await findUserById(decoded.userId);
  if (!user) {
    throw new ApiError(401, "User not found for this token");
  }

  req.user = {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  };

  next();
});

module.exports = { verifyJWT };