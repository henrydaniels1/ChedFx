import './App.css';
import FxHome from './components/FxComponents/FxHome';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainBot from './components/TradingBots/MainBot'; // Import Bot component

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
