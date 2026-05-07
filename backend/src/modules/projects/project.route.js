// Dependencies
const { Router } = require('express');

// File Imports
const {
  createProjectHandler,
  listProjectsHandler,
  getProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
  addMemberHandler,
  removeMemberHandler
} = require('./project.controller.js');
const {
  createProjectRules,
  updateProjectRules,
  addMemberRules
} = require('./project.validation.js');
const validate = require('../../middlewares/validate.middleware.js');
const { verifyJWT } = require('../../middlewares/auth.middleware.js');
const { authorizeRoles } = require('../../middlewares/role.middleware.js');

const router = Router();

// All Project Routes Require Auth
router.use(verifyJWT);

router.get('/', listProjectsHandler);                                                                 // list all the projects
router.get('/:id', getProjectHandler);                                                                // get a single project by id

// Admin-Only Endpoints
router.post('/', authorizeRoles("admin"), validate(createProjectRules), createProjectHandler);        // create a new project
router.patch('/:id', authorizeRoles("admin"), validate(updateProjectRules), updateProjectHandler);    // editing the project details
router.delete('/:id', authorizeRoles("admin"), deleteProjectHandler);                                 // deleting the proejct

router.post('/:id/members', authorizeRoles("admin"), validate(addMemberRules), addMemberHandler);     // aadding the new member to the project
router.delete('/:id/members/:userId', authorizeRoles("admin"), removeMemberHandler);                  // removing the member from the project

module.exports = router;