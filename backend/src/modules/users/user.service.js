// File Imports
const {
  listUsers,
  findUserById,
  deleteUserById
} = require('./user.repository.js');
const ApiError = require('../../utils/ApiError.js');

// Prevent Password Leaks
const sanitizeUser = (userDoc) => {
  if (!userDoc) return userDoc;
  const obj = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete obj.password;
  return obj;
};

// Get All Users (Admin Only)
const getAllUsers = async () => {
  return await listUsers();
};

// Get Single User By ID
const getUserById = async (id) => {
  const user = await findUserById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return sanitizeUser(user);
};

// Delete User (Admin Only)
const removeUser = async (id, currentUserId) => {
  if (String(id) === String(currentUserId)) {
    throw new ApiError(400, 'You cannot delete your own account');
  }
  const user = await deleteUserById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return sanitizeUser(user);
};

module.exports = { getAllUsers, getUserById, removeUser, sanitizeUser };
