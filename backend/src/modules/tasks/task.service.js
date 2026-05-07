// Dependencies
const mongoose = require('mongoose');

// File Imports
const {
  createTask,
  findTaskById,
  findTasks,
  updateTaskById,
  deleteTaskById
} = require('./task.repository.js');
const { findProjectById } = require('../projects/project.repository.js');
const { findUserById } = require('../users/user.repository.js');
const ApiError = require('../../utils/ApiError.js');

const assertValidId = (id, label = "id") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${label}`);
  }
};

// Check User Has Access To Project
const userHasProjectAccess = (project, user) => {
  if (user.role === "admin") return true;
  return project.members.some((m) => String(m._id || m) === String(user._id));
};

// Create Task (Admin Only)
const addTask = async (data, currentUser) => {
  assertValidId(data.project, "project id");

  const project = await findProjectById(data.project);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (data.assignee) {
    assertValidId(data.assignee, "assignee id");
    const assignee = await findUserById(data.assignee);
    if (!assignee) {
      throw new ApiError(404, "Assignee user not found");
    }
    const isMember = project.members.some((m) => String(m) === String(data.assignee));
    if (!isMember) {
      throw new ApiError(400, "Assignee must be a member of the project");
    }
  }

  const payload = {
    title: data.title,
    description: data.description || "",
    status: data.status || "todo",
    priority: data.priority || "medium",
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    assignee: data.assignee || null,
    project: data.project,
    createdBy: currentUser._id
  };

  return await createTask(payload);
};

// List Tasks With RBAC And Filters
const listTasks = async (query, currentUser) => {
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.project) {
    assertValidId(query.project, "project id");
    filter.project = query.project;
  }
  if (query.assignee) {
    assertValidId(query.assignee, "assignee id");
    filter.assignee = query.assignee;
  }
  if (query.overdue === "true") {
    filter.dueDate = { $lt: new Date() };
    filter.status = filter.status || { $ne: "done" };
  }

  // Members only see tasks in projects they belong to OR tasks assigned to them
  if (currentUser.role !== "admin") {
    const { findProjects } = require('../projects/project.repository.js');
  
    const myProjects = await findProjects({
      members: currentUser._id
    });
  
    const projectIds = myProjects.map((project) => project._id);
  
    filter.project = { $in: projectIds };
  }

  return await findTasks(filter);
};

// Get Single Task With RBAC
const getTask = async (id, currentUser) => {
  assertValidId(id, "task id");
  const task = await findTaskById(id);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (currentUser.role !== "admin") {
    const project = await findProjectById(task.project._id);
    const allowed =
      userHasProjectAccess(project, currentUser) ||
      (task.assignee && String(task.assignee._id) === String(currentUser._id));
    if (!allowed) {
      throw new ApiError(403, "You do not have access to this task");
    }
  }

  return task;
};

// Update Task - Admin Full, Member Only Status On Own Tasks
const editTask = async (id, updates, currentUser) => {
  assertValidId(id, "task id");
  const task = await findTaskById(id, false);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (currentUser.role === "admin") {
    const allowed = {};
    ["title", "description", "status", "priority"].forEach((k) => {
      if (updates[k] !== undefined) allowed[k] = updates[k];
    });
    if (updates.dueDate !== undefined) {
      allowed.dueDate = updates.dueDate ? new Date(updates.dueDate) : null;
    }
    if (updates.assignee !== undefined) {
      if (updates.assignee) {
        assertValidId(updates.assignee, "assignee id");
        const project = await findProjectById(task.project);
        const isMember = project.members.some((m) => String(m) === String(updates.assignee));
        if (!isMember) {
          throw new ApiError(400, "Assignee must be a member of the project");
        }
        allowed.assignee = updates.assignee;
      } else {
        allowed.assignee = null;
      }
    }
    return await updateTaskById(id, allowed);
  }

  // Member: only status update on own task
  if (!task.assignee || String(task.assignee) !== String(currentUser._id)) {
    throw new ApiError(403, "Members can only update status of tasks assigned to them");
  }
  const updateKeys = Object.keys(updates);
  const nonAllowed = updateKeys.filter((k) => k !== "status");
  if (nonAllowed.length > 0) {
    throw new ApiError(403, "Members can only update the status field");
  }
  if (!updates.status) {
    throw new ApiError(400, "Status is required");
  }
  return await updateTaskById(id, { status: updates.status });
};

// Delete Task (Admin Only)
const removeTask = async (id) => {
  assertValidId(id, "task id");
  const deleted = await deleteTaskById(id);
  if (!deleted) {
    throw new ApiError(404, "Task not found");
  }
  return deleted;
};

module.exports = { addTask, listTasks, getTask, editTask, removeTask };