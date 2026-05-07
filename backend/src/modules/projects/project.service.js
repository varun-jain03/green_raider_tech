// Dependencies
const mongoose = require('mongoose');

// File Imports
const {
  createProject,
  findProjectById,
  findProjects,
  updateProjectById,
  deleteProjectById
} = require('./project.repository.js');
const { findUserById } = require('../users/user.repository.js');
const ApiError = require('../../utils/ApiError.js');

// Validate ObjectId
const assertValidId = (id, label = "id") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${label}`);
  }
};

// Create A New Project (Admin Only)
const addProject = async (data, currentUser) => {
  const memberIds = Array.isArray(data.members) ? data.members : [];

  // Validate each member id and existence
  for (const mid of memberIds) {
    assertValidId(mid, "member id");
    const u = await findUserById(mid);
    if (!u) {
      throw new ApiError(404, `Member with id ${mid} not found`);
    }
  }

  return await createProject({
    name: data.name,
    description: data.description || "",
    createdBy: currentUser._id,
    members: memberIds
  });
};

// List Projects - RBAC Aware
const listProjects = async (currentUser) => {
  if (currentUser.role === "admin") {
    return await findProjects({});
  }
  return await findProjects({ members: currentUser._id });
};

// Get Single Project By ID With RBAC Check
const getProject = async (id, currentUser) => {
  assertValidId(id, "project id");
  const project = await findProjectById(id, true);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  if (currentUser.role !== "admin") {
    const isMember = project.members.some((m) => String(m._id) === String(currentUser._id));
    if (!isMember) {
      throw new ApiError(403, "You do not have access to this project");
    }
  }
  return project;
};

// Update Project (Admin Only)
const editProject = async (id, updates) => {
  assertValidId(id, "project id");
  const existing = await findProjectById(id);
  if (!existing) {
    throw new ApiError(404, "Project not found");
  }

  const allowed = {};
  if (typeof updates.name === "string") allowed.name = updates.name;
  if (typeof updates.description === "string") allowed.description = updates.description;

  const updated = await updateProjectById(id, allowed);
  return updated;
};

// Delete Project (Admin Only)
const removeProject = async (id) => {
  assertValidId(id, "project id");
  const deleted = await deleteProjectById(id);
  if (!deleted) {
    throw new ApiError(404, "Project not found");
  }
  return deleted;
};

// Add Member To Project (Admin Only)
const addMember = async (projectId, userId) => {
  assertValidId(projectId, "project id");
  assertValidId(userId, "user id");

  const project = await findProjectById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (project.members.some((m) => String(m) === String(userId))) {
    throw new ApiError(409, "User is already a member of this project");
  }

  project.members.push(userId);
  await project.save();
  return await findProjectById(projectId, true);
};

// Remove Member From Project (Admin Only)
const removeMember = async (projectId, userId) => {
  assertValidId(projectId, "project id");
  assertValidId(userId, "user id");

  const project = await findProjectById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const before = project.members.length;
  project.members = project.members.filter((m) => String(m) !== String(userId));
  if (project.members.length === before) {
    throw new ApiError(404, "User is not a member of this project");
  }
  await project.save();
  return await findProjectById(projectId, true);
};

module.exports = {
  addProject,
  listProjects,
  getProject,
  editProject,
  removeProject,
  addMember,
  removeMember
};
