// Dependencies
const { body } = require('express-validator');

const createTaskRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 2, max: 200 }).withMessage('Title must be 2-200 chars'),
  body('description')
    .optional()
    .isString().isLength({ max: 5000 }),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('dueDate must be a valid ISO date'),
  body('assignee')
    .optional({ nullable: true })
    .isMongoId().withMessage('assignee must be a valid Mongo ID'),
  body('project')
    .trim()
    .notEmpty().withMessage('project is required')
    .isMongoId().withMessage('project must be a valid Mongo ID')
];

const updateTaskRules = [
  body('title').optional().trim().isLength({ min: 2, max: 200 }),
  body('description').optional().isString().isLength({ max: 5000 }),
  body('status').optional().isIn(['todo', 'in-progress', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional({ nullable: true }).isISO8601(),
  body('assignee').optional({ nullable: true }).custom((value) => {
    if (value === null) return true;
    if (typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value)) return true;
    throw new Error('assignee must be a valid Mongo ID or null');
  })
];

module.exports = { createTaskRules, updateTaskRules };