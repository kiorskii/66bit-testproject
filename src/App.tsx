import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Login from "./screens/Login";
import Main from "./screens/Main";
import Employees from "./screens/Employees";
import Card from "./screens/Card";
import AddEmployee from "./screens/AddEmployee";
import ImportEmployees from "./screens/ImportEmployees";
import ChatPage from "./screens/ChatPage";
import TeamFormation from "./screens/TeamFormation";
import Projects from "./screens/Projects";
import ProjectCard from "./screens/ProjectCard";
import Analytics from "./screens/Analytics";
import Settings from "./screens/Settings";

function ProtectedRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Main />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/employee/:id" element={<Card />} />
              <Route path="/add-employee" element={<AddEmployee />} />
              <Route path="/import-employees" element={<ImportEmployees />} />
              <Route path="*" element={<Main />} />
              <Route path="/assistant" element={<ChatPage />} />

              <Route path="/create-project" element={<TeamFormation />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectCard />} />

              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
