import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Writing from './pages/Writing';
import EnterScreen from './components/EnterScreen';

const AppContent = () => {
  const [hasEntered, setHasEntered] = React.useState(false);
  const [showShockwave, setShowShockwave] = React.useState(true);

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
    <div className="relative min-h-screen dark:bg-[#121826] bg-gray-50 selection:bg-blue-500 selection:text-white">
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <EnterScreen key="enter-screen" onEnter={() => setHasEntered(true)} />
        ) : (
          <>
            {/* Arrival Warp Shockwave & Atmospheric Dissolve (Portalized & Auto-unmounted) */}
            {showShockwave && typeof document !== 'undefined' && createPortal(
              <motion.div
                initial={{ opacity: 0.85, scale: 0.6 }}
                animate={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 1.0, ease: "easeOut" }}
                onAnimationComplete={() => setShowShockwave(false)}
                className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.35)_0%,rgba(168,85,247,0.18)_40%,transparent_70%)]"
              />,
              document.body
            )}

            <motion.div
              key="main-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full"
            >

            {/* Smooth Floating Navbar with Staggered Entrance */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <Navbar toggleTheme={toggleTheme} isDark={isDark} />
            </motion.div>

            {/* Main Page Routes with Staggered Fluid Fade-in */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/writing" element={<Writing />} />
              </Routes>
            </motion.div>
          </motion.div>
        </>
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
