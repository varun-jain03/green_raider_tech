import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import dashboardReducer from '../features/dashboard/store/dashboardSlice';
import projectsReducer from '../features/projects/store/projectsSlice';
import tasksReducer from '../features/tasks/store/tasksSlice';
import usersReducer from '../features/users/store/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    users: usersReducer
  }
});
