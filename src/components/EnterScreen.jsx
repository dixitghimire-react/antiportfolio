import React, { useState, useEffect } from 'react';

const EnterScreen = ({ onEnter }) => {
  const [isFading, setIsFading] = useState(false);
  const [text, setText] = useState('');
  const fullText = "DIKSHIT GHIMIRE";

  // Typewriter effect for the name
  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(intervalId);
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  const handleEnter = () => {
    setIsFading(true);
    // Wait for zoom/fade out animation before unmounting
    setTimeout(() => {
      onEnter();
    }, 1000);
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030712] transition-all duration-1000 ease-in-out ${isFading ? 'opacity-0 scale-110 blur-xl' : 'opacity-100 scale-100 blur-0'}`}
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-1000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }}></div>
        
        {/* Grid lines overlay for a high-tech/cyber feel */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>
      </div>

      {/* Main Glassmorphic Container */}
      <div className="z-10 flex flex-col items-center p-8 md:p-16 backdrop-blur-md bg-white/[0.02] rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Typewriter Title */}
        <h1 className="text-4xl md:text-7xl font-bold tracking-[0.2em] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-center uppercase min-h-[50px] md:min-h-[80px] flex items-center justify-center">
          {text}
          <span className="w-[3px] md:w-[4px] h-8 md:h-14 bg-white/70 ml-3 animate-pulse"></span>
        </h1>
        
        <p className="text-gray-400 text-xs md:text-sm tracking-[0.4em] uppercase mb-12 font-light text-center">
          Portfolio & Experiences
        </p>

        {/* Cyber Button */}
        <button 
          onClick={handleEnter}
          className="group relative px-10 py-4 text-xs md:text-sm tracking-widest text-white uppercase overflow-hidden rounded-full border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-500 focus:outline-none shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]"
        >
          <span className="relative z-10 font-semibold drop-shadow-md">Initiate Sequence</span>
          
          {/* Light sweep animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
          
          {/* Glowing border effect */}
          <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-40 blur transition-opacity duration-500 -z-10"></div>
        </button>
      </div>
    </div>
  );
};

export default EnterScreen;
