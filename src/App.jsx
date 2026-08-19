import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Writing from './pages/Writing';
import EnterScreen from './components/EnterScreen';

const AppContent = () => {
  const [hasEntered, setHasEntered] = React.useState(false);
  const location = useLocation();

  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
    }
    return true; // Default to dark mode
  });

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <>
      {!hasEntered && <EnterScreen onEnter={() => setHasEntered(true)} />}
      
      <div className={`min-h-screen dark:bg-[#121826] bg-gray-50 transition-colors duration-300 ${!hasEntered ? 'hidden' : 'block'}`}>
        <Navbar toggleTheme={toggleTheme} isDark={isDark} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/writing" element={<Writing />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
