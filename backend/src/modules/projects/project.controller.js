// File Imports
const asyncHandler = require('../../utils/asyncHandler.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const {
  addProject,
  listProjects,
  getProject,
  editProject,
  removeProject,
  addMember,
  removeMember
} = require('./project.service.js');

// POST /api/projects:- create projects
const createProjectHandler = asyncHandler(async (req, res) => {
  const project = await addProject(req.body, req.user);
  return res
    .status(201)
    .json(new ApiResponse(201, project, 'Project created successfully'));
});

// GET /api/projects:- list all the projects
const listProjectsHandler = asyncHandler(async (req, res) => {
  const projects = await listProjects(req.user);
  return res
    .status(200)
    .json(new ApiResponse(200, projects, 'Projects fetched successfully...'));
});

// GET /api/projects/:id:- get a single project by the project id
const getProjectHandler = asyncHandler(async (req, res) => {
  const project = await getProject(req.params.id, req.user);
  return res
    .status(200)
    .json(new ApiResponse(200, project, 'Project fetched successfully..'));
});

// PATCH /api/projects/:id:- updating the details of the specific project
const updateProjectHandler = asyncHandler(async (req, res) => {
  const project = await editProject(req.params.id, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, project, 'Project updated successfully'));
});

// DELETE /api/projects/:id:- deleting the project by the project id
const deleteProjectHandler = asyncHandler(async (req, res) => {
  await removeProject(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Project deleted successfully'));
});

// POST /api/projects/:id/members:- adding a new member to the project
const addMemberHandler = asyncHandler(async (req, res) => {
  const project = await addMember(req.params.id, req.body.userId);
  return res
    .status(200)
    .json(new ApiResponse(200, project, 'Member added successfully'));
});

// DELETE /api/projects/:id/members/:userId:- removing the member from the project
const removeMemberHandler = asyncHandler(async (req, res) => {
  const project = await removeMember(req.params.id, req.params.userId);
  return res
    .status(200)
    .json(new ApiResponse(200, project, 'Member removed successfully'));
});

module.exports = {
  createProjectHandler,
  listProjectsHandler,
  getProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
  addMemberHandler,
  removeMemberHandler
};
