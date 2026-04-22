import './App.css';
import FxHome from './pages/FxHome';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainBot from './pages/MainBot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FxHome />} />
        <Route path="/bot" element={<MainBot />} /> {/* Add the Bot route */}
      </Routes>
    </Router>
  );
}

export default App;
