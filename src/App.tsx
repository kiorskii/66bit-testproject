import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screens/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import Employees from './screens/Employees';
import Card from './screens/Card';
import { ThemeProvider } from './contexts/ThemeContext';
import Main from './screens/Main';
import AddEmployee from './screens/AddEmployee';

function App() {
  return (
    <ThemeProvider>
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/:id"
          element={
            <ProtectedRoute>
              <Card />
            </ProtectedRoute>
          }
        />
                  <Route path="/add-employee" element={<AddEmployee />} /> {/* новый маршрут */}

        <Route path="*" element={<Main />} />
      </Routes>
    </Router>
  </AuthProvider>
</ThemeProvider>
  );
}

export default App;
