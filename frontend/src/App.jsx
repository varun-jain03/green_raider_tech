// Dependencies
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

// File imports
import AuthPage from "./features/auth/components/AuthPage";
import DashboardPage from "./features/dashboard/components/DashboardPage";
import ProjectsPage from "./features/projects/components/ProjectsPage";
import TasksPage from "./features/tasks/components/TasksPage";
import AppShell from "./widgets/layout/AppShell";

function PrivateRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppShell />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="tasks" element={<TasksPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
