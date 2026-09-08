import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const EnterScreen = ({ onEnter }) => {
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);

  const titleText = "DIKSHIT GHIMIRE";
  const letters = Array.from(titleText);

  // GSAP ambient physics for background atmospheric orbs
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          x: 40,
          y: -30,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          x: -50,
          y: 35,
          duration: 7.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5
        });
      }
      if (orb3Ref.current) {
        gsap.to(orb3Ref.current, {
          scale: 1.25,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 150
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.08, 
        filter: "blur(16px)",
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } 
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030712] overflow-hidden"
    >
      {/* Dynamic Background Elements with GSAP floating */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          ref={orb1Ref}
          className="absolute top-1/4 left-1/4 w-[420px] h-[420px] bg-blue-600/20 rounded-full blur-[110px] mix-blend-screen"
        />
        <div 
          ref={orb2Ref}
          className="absolute bottom-1/4 right-1/4 w-[520px] h-[520px] bg-purple-600/20 rounded-full blur-[130px] mix-blend-screen"
        />
        <div 
          ref={orb3Ref}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[160px] mix-blend-screen"
        />
        
        {/* Subtle grid lines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
      </div>

      {/* Main Glassmorphic Container with Framer Motion Spring Entrance */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 flex flex-col items-center p-8 md:p-16 backdrop-blur-xl bg-white/[0.03] rounded-[2.5rem] border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)] max-w-xl w-[92%] sm:w-auto"
      >
        {/* High-tech badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          SYSTEM ONLINE
        </motion.div>

        {/* Staggered Letter Reveal Title */}
        <motion.h1 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-[0.15em] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-center uppercase flex flex-wrap justify-center"
        >
          {letters.map((char, index) => (
            <motion.span 
              key={index} 
              variants={letterVariants}
              className={char === " " ? "mr-4" : ""}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-gray-400 text-xs md:text-sm tracking-[0.35em] uppercase mb-10 font-light text-center"
        >
          Full-Stack Developer & Writer
        </motion.p>

        {/* Cyber Button with Spring Physics */}
        <motion.button 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(6, 182, 212, 0.5)" }}
          whileTap={{ scale: 0.96 }}
          onClick={onEnter}
          className="group relative px-10 py-4 text-xs md:text-sm tracking-[0.25em] text-white uppercase overflow-hidden rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-500/15 via-blue-600/20 to-purple-600/15 transition-colors duration-300 focus:outline-none"
        >
          <span className="relative z-10 font-semibold drop-shadow-md flex items-center gap-2">
            <span>Initiate Sequence</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
          
          {/* Light sweep animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          
          {/* Glowing ring */}
          <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-20 group-hover:opacity-60 blur-sm transition-opacity duration-300 -z-10" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default EnterScreen;
