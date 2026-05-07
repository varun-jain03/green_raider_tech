// Dependencies
const { Router } = require('express');

// File Imports
const {
  createTaskHandler,
  listTasksHandler,
  getTaskHandler,
  updateTaskHandler,
  deleteTaskHandler
} = require('./task.controller.js');
const { createTaskRules, updateTaskRules } = require('./task.validation.js');
const validate = require('../../middlewares/validate.middleware.js');
const { verifyJWT } = require('../../middlewares/auth.middleware.js');
const { authorizeRoles } = require('../../middlewares/role.middleware.js');

const router = Router();

router.use(verifyJWT);

router.get('/', listTasksHandler); // get all the task in the project
router.get('/:id', getTaskHandler); // get a single task using the task id

// Admin creates and deletes tasks
router.post(
  '/',
  authorizeRoles('admin'),
  validate(createTaskRules),
  createTaskHandler
); // create a new task in the project
router.delete('/:id', authorizeRoles('admin'), deleteTaskHandler); // deleting the task from the project

// Update: admin full, member status-only (enforced in service)
router.patch('/:id', validate(updateTaskRules), updateTaskHandler); // editing the task with task id

module.exports = router;
