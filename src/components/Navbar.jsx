import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';

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
    <nav className="sticky top-0 z-50 dark:bg-[#121826] bg-white border-b dark:border-gray-800 border-gray-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Logo Name */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-lg md:text-xl font-bold text-blue-500 hover:text-blue-400 transition-colors">
              Dikshit Ghimire
            </Link>
          </div>
          
          {/* Middle: Links (Hidden on mobile) */}
          <div className="hidden lg:flex flex-1 justify-center space-x-4 items-center">
            {isHome && (
              <>
                <button onClick={() => scrollToSection('about')} className="px-4 py-1 text-sm border border-gray-600 rounded hover:border-blue-500 hover:text-blue-500 text-gray-300 transition-colors">About</button>
                <button onClick={() => scrollToSection('education')} className="px-4 py-1 text-sm border border-gray-600 rounded hover:border-blue-500 hover:text-blue-500 text-gray-300 transition-colors">Education</button>
                <button onClick={() => scrollToSection('projects')} className="px-4 py-1 text-sm border border-gray-600 rounded hover:border-blue-500 hover:text-blue-500 text-gray-300 transition-colors">Projects</button>
                <button onClick={() => scrollToSection('contact')} className="px-4 py-1 text-sm border border-gray-600 rounded hover:border-blue-500 hover:text-blue-500 text-gray-300 transition-colors">Contact</button>
              </>
            )}
          </div>

          {/* Right: Developer / Writer Toggle & Theme Toggle */}
          <div className="flex-shrink-0 flex items-center justify-end space-x-2 md:space-x-4">
            
            <button
              onClick={toggleTheme}
              className="p-1.5 md:p-2 rounded-full dark:bg-gray-800 bg-gray-100 dark:text-gray-200 text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} className="md:w-[18px] md:h-[18px]" /> : <Moon size={16} className="md:w-[18px] md:h-[18px]" />}
            </button>

            <div className="flex items-center space-x-1.5 md:space-x-2">
              <span className={`text-xs md:text-sm ${isHome ? 'dark:text-gray-200 text-gray-800 font-medium' : 'text-gray-500'}`}>Developer</span>
              
              <button 
                onClick={handleToggle}
                className="relative inline-flex items-center h-5 w-9 md:h-6 md:w-11 rounded-full transition-colors dark:bg-gray-600 bg-gray-300 focus:outline-none"
              >
                <span className={`inline-block w-3 h-3 md:w-4 md:h-4 transform bg-white rounded-full transition-transform ${!isHome ? 'translate-x-5 md:translate-x-6' : 'translate-x-1'}`} />
              </button>
              
              <span className={`text-xs md:text-sm ${!isHome ? 'dark:text-gray-200 text-gray-800 font-medium' : 'text-gray-500'}`}>Writing</span>
            </div>

            {/* Mobile menu button */}
            {isHome && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden ml-2 p-1 text-gray-500 hover:text-blue-500 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && isHome && (
          <div className="lg:hidden border-t dark:border-gray-800 border-gray-200 py-4 px-2 space-y-2">
            <button onClick={() => scrollToSection('about')} className="block w-full text-left px-4 py-2 text-sm dark:text-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">About</button>
            <button onClick={() => scrollToSection('education')} className="block w-full text-left px-4 py-2 text-sm dark:text-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Education</button>
            <button onClick={() => scrollToSection('projects')} className="block w-full text-left px-4 py-2 text-sm dark:text-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Projects</button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-4 py-2 text-sm dark:text-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Contact</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
