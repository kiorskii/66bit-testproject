import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Employees from './screens/Employees';
import Card from './screens/Card';
import { ThemeProvider } from './contexts/ThemeContext';
import Main from './screens/Main';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/employee/:id" element={<Card />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
