import React, { useState } from 'react';

const EnterScreen = ({ onEnter }) => {
  const [isFading, setIsFading] = useState(false);

  const handleEnter = () => {
    setIsFading(true);
    // Wait for fade out animation before unmounting
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] transition-opacity duration-700 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl text-white font-light tracking-[0.2em] mb-4 text-center px-4">
          DIKSHIT GHIMIRE
        </h1>
        
        <div className="w-16 h-[1px] bg-blue-500/50 mb-12"></div>

        <button 
          onClick={handleEnter}
          className="group relative px-8 py-3 text-sm tracking-widest text-gray-300 uppercase overflow-hidden rounded border border-gray-800 hover:border-blue-500/50 hover:text-white transition-all duration-300 focus:outline-none"
        >
          <span className="relative z-10">Click to Enter</span>
          <div className="absolute inset-0 bg-blue-600/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
        </button>
      </div>
    </div>
  );
};

export default EnterScreen;
