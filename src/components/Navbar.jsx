import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ toggleTheme, isDark }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const scrollToSection = (id) => {
    if (isHome) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsMobileMenuOpen(false);
    }
  };

  const handleToggle = () => {
    if (isHome) {
      navigate('/writing');
    } else {
      navigate('/');
    }
  };

  return (
    <motion.nav 
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 backdrop-blur-md dark:bg-[#121826]/85 bg-white/85 border-b dark:border-gray-800/80 border-gray-200/80 transition-colors duration-300 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Logo Name */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="group flex items-center gap-2 text-lg md:text-xl font-bold text-blue-500 hover:text-blue-400 transition-colors">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                Dikshit Ghimire
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
              </motion.span>
            </Link>
          </div>
          
          {/* Middle: Links (Hidden on mobile) */}
          <div className="hidden lg:flex flex-1 justify-center space-x-3 items-center">
            {isHome && (
              <>
                {['about', 'education', 'projects', 'contact'].map((section) => (
                  <motion.button 
                    key={section}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection(section)} 
                    className="px-4 py-1.5 text-sm capitalize border border-gray-600/60 dark:border-gray-700/60 rounded-full hover:border-blue-500 hover:text-blue-400 dark:text-gray-300 text-gray-700 transition-colors bg-white/5 backdrop-blur-sm"
                  >
                    {section}
                  </motion.button>
                ))}
              </>
            )}
          </div>

          {/* Right: Developer / Writer Toggle & Theme Toggle */}
          <div className="flex-shrink-0 flex items-center justify-end space-x-2 md:space-x-4">
            
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9, rotate: -20 }}
              onClick={toggleTheme}
              className="p-2 rounded-full dark:bg-gray-800 bg-gray-100 dark:text-gray-200 text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border dark:border-gray-700 border-gray-200"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-blue-500" />}
            </motion.button>

            {/* Mode Switcher with layout spring animation */}
            <div className="flex items-center space-x-1.5 md:space-x-2 px-2 py-1 rounded-full dark:bg-gray-900/60 bg-gray-100 border dark:border-gray-800 border-gray-200">
              <span className={`text-xs md:text-sm font-medium transition-colors ${isHome ? 'text-blue-500 font-semibold' : 'text-gray-400'}`}>
                Dev
              </span>
              
              <button 
                onClick={handleToggle}
                className="relative inline-flex items-center h-5 w-10 md:h-6 md:w-11 rounded-full dark:bg-gray-700 bg-gray-300 focus:outline-none p-0.5 cursor-pointer"
                aria-label="Switch between developer and writing view"
              >
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 600, damping: 35 }}
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-full shadow-md ${!isHome ? 'ml-auto bg-purple-400' : 'mr-auto bg-blue-500'}`}
                />
              </button>
              
              <span className={`text-xs md:text-sm font-medium transition-colors ${!isHome ? 'text-purple-400 font-semibold' : 'text-gray-400'}`}>
                Writing
              </span>
            </div>

            {/* Mobile menu button */}
            {isHome && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden ml-2 p-1.5 text-gray-500 hover:text-blue-500 transition-colors rounded-md"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Menu with AnimatePresence */}
        <AnimatePresence>
          {isMobileMenuOpen && isHome && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden border-t dark:border-gray-800 border-gray-200 py-4 px-2 space-y-2 overflow-hidden"
            >
              {['about', 'education', 'projects', 'contact'].map((section, idx) => (
                <motion.button 
                  key={section}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => scrollToSection(section)} 
                  className="block w-full text-left px-4 py-2 text-sm capitalize dark:text-gray-300 text-gray-700 hover:bg-blue-500/10 hover:text-blue-500 rounded-lg transition-colors"
                >
                  {section}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
