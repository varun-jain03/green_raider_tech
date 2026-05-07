// File Imports
const Project = require('./project.model.js');

// Create Project
const createProject = async (payload) => {
  const project = new Project(payload);
  return await project.save();
};

// Find Project By ID (With Optional Population)
const findProjectById = async (id, populate = false) => {
  let query = Project.findById(id);
  if (populate) {
    query = query
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role');
  }
  return await query.exec();
};

// Find Projects - Admin Sees All, Member Sees Where They Are Members
const findProjects = async (filter = {}) => {
  return await Project.find(filter)
    .populate('createdBy', 'name email role')
    .populate('members', 'name email role')
    .sort({ createdAt: -1 });
};

// Update Project
const updateProjectById = async (id, updates) => {
  return await Project.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  })
    .populate('createdBy', 'name email role')
    .populate('members', 'name email role');
};

// Delete Project
const deleteProjectById = async (id) => {
  return await Project.findByIdAndDelete(id);
};

module.exports = {
  createProject,
  findProjectById,
  findProjects,
  updateProjectById,
  deleteProjectById
};
