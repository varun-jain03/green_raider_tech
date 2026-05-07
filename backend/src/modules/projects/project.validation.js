// Dependencies
const { body } = require('express-validator');

const createProjectRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Project name is required')
    .isLength({ min: 2, max: 120 }).withMessage('Name must be 2-120 chars'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .isLength({ max: 2000 }).withMessage('Description max 2000 chars'),
  body('members')
    .optional()
    .isArray().withMessage('Members must be an array of user ids')
];

const updateProjectRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 120 }).withMessage('Name must be 2-120 chars'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .isLength({ max: 2000 }).withMessage('Description max 2000 chars')
];

const addMemberRules = [
  body('userId')
    .trim()
    .notEmpty().withMessage('userId is required')
    .isMongoId().withMessage('userId must be a valid Mongo ID')
];

module.exports = { createProjectRules, updateProjectRules, addMemberRules };