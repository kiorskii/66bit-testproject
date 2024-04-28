import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './screens/Main';
import Card from './screens/Card';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/employee/:id" element={<Card />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
