// File Imports
const { countTasks, findTasks } = require('../tasks/task.repository.js');
const { findProjects } = require('../projects/project.repository.js');

// Build Base Filter Depending On Role
const buildScope = async (user) => {
  if (user.role === "admin") return {};
  const myProjects = await findProjects({ members: user._id });
  const projectIds = myProjects.map((p) => p._id);
  return {
    $or: [{ project: { $in: projectIds } }, { assignee: user._id }]
  };
};

// Get Dashboard Stats
const getStats = async (user) => {
  const scope = await buildScope(user);
  const now = new Date();

  const [total, todo, inProgress, done, overdue] = await Promise.all([
    countTasks(scope),
    countTasks({ ...scope, status: "todo" }),
    countTasks({ ...scope, status: "in-progress" }),
    countTasks({ ...scope, status: "done" }),
    countTasks({ ...scope, status: { $ne: "done" }, dueDate: { $lt: now } })
  ]);

  const myTasks = await findTasks({ ...scope, assignee: user._id });

  return {
    totals: { total, todo, inProgress, done, overdue },
    myTasksCount: myTasks.length,
    myTasks
  };
};

module.exports = { getStats };