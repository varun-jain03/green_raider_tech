// Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// File Imports
const authRoutes = require('./modules/auth/auth.route.js');
const userRoutes = require('./modules/users/user.route.js');
const projectRoutes = require('./modules/projects/project.route.js');
const taskRoutes = require('./modules/tasks/task.route.js');
const dashboardRoutes = require('./modules/dashboard/dashboard.route.js');
const errorHandler = require('./middlewares/error.middleware.js');
const ApiError = require('./utils/ApiError.js');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Team Task Manager API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 Handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;