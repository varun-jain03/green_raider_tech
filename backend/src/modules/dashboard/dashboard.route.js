// Dependencies
const { Router } = require('express');

// File Imports
const { getDashboardStats } = require('./dashboard.controller.js');
const { verifyJWT } = require('../../middlewares/auth.middleware.js');

const router = Router();

router.use(verifyJWT);

router.get('/stats', getDashboardStats);

module.exports = router;