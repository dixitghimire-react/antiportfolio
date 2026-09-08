import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Writing from './pages/Writing';
import EnterScreen from './components/EnterScreen';

const AppContent = () => {
  const [hasEntered, setHasEntered] = React.useState(false);

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
    <div className="relative min-h-screen dark:bg-[#121826] bg-gray-50 overflow-x-hidden selection:bg-blue-500 selection:text-white">
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <EnterScreen key="enter-screen" onEnter={() => setHasEntered(true)} />
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen"
          >
            <Navbar toggleTheme={toggleTheme} isDark={isDark} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/writing" element={<Writing />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
