// File Imports
const asyncHandler = require('../../utils/asyncHandler.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const { getAllUsers, getUserById, removeUser } = require('./user.service.js');

// GET /api/users
const listAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsers();
  return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

// GET /api/users/me
const getMe = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user._id);
  return res.status(200).json(new ApiResponse(200, user, "Current user fetched"));
});

// GET /api/users/:id
const getUser = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

// DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await removeUser(req.params.id, req.user._id);
  return res.status(200).json(new ApiResponse(200, user, "User deleted successfully"));
});

module.exports = { listAllUsers, getMe, getUser, deleteUser };
