// Dependencies
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// File Imports
const { findUserByEmail, createUser } = require('./auth.repository.js');
const ApiError = require('../../utils/ApiError.js');

// Prevent Password Leaks In Any Response
const sanitizeUser = (userDoc) => {
  if (!userDoc) return userDoc;
  const obj = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete obj.password;
  return obj;
};

// Generate JWT Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" }
  );
};

// Register New User
const registerUser = async (data) => {
  const existingUser = await findUserByEmail(data.email);
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  const registeredUser = await createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || "member"
  });

  return sanitizeUser(registeredUser);
};

// Login Existing User
const loginUser = async (data) => {
  const existingUser = await findUserByEmail(data.email);
  if (!existingUser) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(data.password, existingUser.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(existingUser);

  return {
    user: sanitizeUser(existingUser),
    accessToken
  };
};

module.exports = { registerUser, loginUser };