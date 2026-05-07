// Dependencies
const { Router } = require('express');

// File Imports
const { listAllUsers, getMe, getUser, deleteUser } = require('./user.controller.js');
const { verifyJWT } = require('../../middlewares/auth.middleware.js');
const { authorizeRoles } = require('../../middlewares/role.middleware.js');

const router = Router();

// All User Routes Require Authentication
router.use(verifyJWT);

router.get('/me', getMe);
router.get('/', authorizeRoles("admin"), listAllUsers);
router.get('/:id', authorizeRoles("admin"), getUser);
router.delete('/:id', authorizeRoles("admin"), deleteUser);

module.exports = router;
