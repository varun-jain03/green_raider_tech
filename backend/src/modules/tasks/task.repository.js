// File Imports
const Task = require('./task.model.js');

// Populate Setup Shared Across Queries
const populateFields = (query) => {
  return query
    .populate("assignee", "name email role")
    .populate("createdBy", "name email role")
    .populate("project", "name");
};

// Create Task
const createTask = async (payload) => {
  const task = new Task(payload);
  await task.save();
  return await populateFields(Task.findById(task._id));
};

// Find Task By ID
const findTaskById = async (id, populate = true) => {
  const query = Task.findById(id);
  return populate ? await populateFields(query) : await query;
};

// Find Tasks With Filter
const findTasks = async (filter = {}) => {
  return await populateFields(Task.find(filter)).sort({ createdAt: -1 });
};

// Update Task
const updateTaskById = async (id, updates) => {
  const query = Task.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  return await populateFields(query);
};

// Delete Task
const deleteTaskById = async (id) => {
  return await Task.findByIdAndDelete(id);
};

// Count Tasks For Stats
const countTasks = async (filter = {}) => {
  return await Task.countDocuments(filter);
};

module.exports = {
  createTask,
  findTaskById,
  findTasks,
  updateTaskById,
  deleteTaskById,
  countTasks
};