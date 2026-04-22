import './App.css';
import FxHome from './pages/FxHome';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainBot from './pages/MainBot';
import Auth from './pages/Auth';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<FxHome />} />
          <Route path="/bot" element={<MainBot />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
