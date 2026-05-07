// Dependencies
const { Router } = require('express');

// File Imports
const { register, login } = require('./auth.controller.js');
const { registerRules, loginRules } = require('./auth.validation.js');
const validate = require('../../middlewares/validate.middleware.js');

const router = Router();

router.post('/register', validate(registerRules), register);
router.post('/login', validate(loginRules), login);

module.exports = router;
