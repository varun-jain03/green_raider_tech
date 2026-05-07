// File Imports
const asyncHandler = require('../../utils/asyncHandler.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const { addTask, listTasks, getTask, editTask, removeTask } = require('./task.service.js');

// POST /api/tasks:- create a new task in the project
const createTaskHandler = asyncHandler(async (req, res) => {
  const task = await addTask(req.body, req.user);
  return res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});

// GET /api/tasks:- get all the projects inside the project
const listTasksHandler = asyncHandler(async (req, res) => {
  const tasks = await listTasks(req.query, req.user);
  return res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

// GET /api/tasks/:id:- get a single task using the task id
const getTaskHandler = asyncHandler(async (req, res) => {
  const task = await getTask(req.params.id, req.user);
  return res.status(200).json(new ApiResponse(200, task, "Task fetched successfully"));
});

// PATCH /api/tasks/:id:- editing the task with the task id
const updateTaskHandler = asyncHandler(async (req, res) => {
  const task = await editTask(req.params.id, req.body, req.user);
  return res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});

// DELETE /api/tasks/:id:- deleting the task from the project
const deleteTaskHandler = asyncHandler(async (req, res) => {
  await removeTask(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, "Task deleted successfully"));
});

module.exports = {
  createTaskHandler,
  listTasksHandler,
  getTaskHandler,
  updateTaskHandler,
  deleteTaskHandler
};