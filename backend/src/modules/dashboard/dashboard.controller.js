// File Imports
const asyncHandler = require('../../utils/asyncHandler.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const { getStats } = require('./dashboard.service.js');

// GET /api/dashboard/stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const data = await getStats(req.user);
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Dashboard stats fetched'));
});

module.exports = { getDashboardStats };
