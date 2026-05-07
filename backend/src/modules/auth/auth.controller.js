// File Imports
const asyncHandler = require('../../utils/asyncHandler.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const { registerUser, loginUser } = require('./auth.service.js');

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, user, 'User registered successfully'));
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  return res.status(200).json(new ApiResponse(200, result, 'Login successful'));
});

module.exports = { register, login };
