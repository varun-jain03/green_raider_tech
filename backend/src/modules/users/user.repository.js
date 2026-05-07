// File Imports
const User = require('./user.model.js');

// Find User By Email
const findUserByEmail = async (email) => {
  return await User.findOne({ email: email.toLowerCase() });
};

// Find User By ID
const findUserById = async (id) => {
  return await User.findById(id);
};

// List All Users (Excluding Password)
const listUsers = async (filter = {}) => {
  return await User.find(filter).select("-password").sort({ createdAt: -1 });
};

// Create A New User Document (Unsaved)
const createUser = async (payload) => {
  const user = new User(payload);
  return await user.save();
};

// Save Any User Doc (Useful For Updates)
const saveUser = async (userDoc) => {
  return await userDoc.save();
};

// Delete User
const deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  findUserByEmail,
  findUserById,
  listUsers,
  createUser,
  saveUser,
  deleteUserById
};
