import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { sendVisitorEntryAlert } from '../utils/securityTelemetry';

const EnterScreen = ({ onEnter }) => {
  // --- Boot Sequence State ---
  const [phase, setPhase] = useState('boot');
  const [visibleBootLines, setVisibleBootLines] = useState(0);

  // --- Portal Access & Dramatic Page Tear State ---
  const [portalState, setPortalState] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isTorn, setIsTorn] = useState(false);

  // --- Hero Name Progressive Animation State ---
  const line1Target = "DIKSHIT";
  const line2Target = "GHIMIRE";
  const [revealed1, setRevealed1] = useState(0);
  const [revealed2, setRevealed2] = useState(0);

  // --- Mouse & 3D Tilt State ---
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);

  // 3D Card Tilt Physics
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 200, damping: 22 });
  const springY = useSpring(tiltY, { stiffness: 200, damping: 22 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["3.5deg", "-3.5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-3.5deg", "3.5deg"]);

  // --- 1. BOOT SEQUENCE TIMERS ---
  const bootLines = [
    "> INITIALIZING...",
    "> LOADING PORTFOLIO...",
    "> LOADING PROJECTS...",
    "> LOADING CREATIVE MODULE..."
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setVisibleBootLines(1), 150);
    const t2 = setTimeout(() => setVisibleBootLines(2), 420);
    const t3 = setTimeout(() => setVisibleBootLines(3), 700);
    const t4 = setTimeout(() => setVisibleBootLines(4), 980);
    const tEnd = setTimeout(() => {
      setPhase('main');
    }, 1450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tEnd);
    };
  }, []);

  // --- 2. HERO NAME PROGRESSIVE LETTER REVEAL ---
  useEffect(() => {
    if (phase !== 'main') return;

    let index1 = 0;
    const interval1 = setInterval(() => {
      index1++;
      setRevealed1(index1);
      if (index1 >= line1Target.length) {
        clearInterval(interval1);

        setTimeout(() => {
          let index2 = 0;
          const interval2 = setInterval(() => {
            index2++;
            setRevealed2(index2);
            if (index2 >= line2Target.length) {
              clearInterval(interval2);
            }
          }, 65);
        }, 120);
      }
    }, 65);

    return () => clearInterval(interval1);
  }, [phase]);

  // --- 3. AMBIENT BACKGROUND GLOW (GSAP) ---
  useEffect(() => {
    if (phase !== 'main') return;
    const ctx = gsap.context(() => {
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          x: 35,
          y: -25,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          x: -45,
          y: 30,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5
        });
      }
      if (orb3Ref.current) {
        gsap.to(orb3Ref.current, {
          scale: 1.2,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1
        });
      }
    });

    return () => ctx.revert();
  }, [phase]);

  // --- 4. LIGHTWEIGHT PARTICLE CANVAS ---
  useEffect(() => {
    if (phase !== 'main') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const particles = Array.from({ length: 35 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.8,
      alpha: Math.random() * 0.5 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const dx = p.x - mousePos.x;
        const dy = p.y - mousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110 && dist > 0) {
          const force = (110 - dist) / 110;
          p.x += (dx / dist) * force * 1.2;
          p.y += (dy / dist) * force * 1.2;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = dist < 120 ? 'rgba(56, 189, 248, 0.85)' : `rgba(168, 85, 247, ${p.alpha})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationId);
    };
  }, [phase, mousePos.x, mousePos.y]);

  // --- 5. MOUSE MOVE FOR SUBTLE TILT & LIGHT FOLLOWER ---
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const xPct = mouseX / rect.width - 0.5;
      const yPct = mouseY / rect.height - 0.5;
      tiltX.set(xPct);
      tiltY.set(yPct);
    }
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  // --- 6. DRAMATIC REALISTIC PAGE TEAR & SILENT TELEMETRY ---
  const handleInitiateClick = () => {
    if (portalState !== 'idle' || isTorn) return;
    setIsTorn(true);
    setPortalState('accessing');

    // 1. Dispatch silent telemetry email alert to dixitghi69@gmail.com
    sendVisitorEntryAlert({ visitorName: "Portfolio Visitor" });

    // 2. Play synthesized realistic paper rip sound effect
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const bufferSize = audioCtx.sampleRate * 0.45; // 450ms
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Friction noise of tearing paper fibers
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }
      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(450, audioCtx.currentTime + 0.4);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      whiteNoise.start();
    } catch {
      // Audio playback fails silently if user has not interacted
    }

    // 3. Fast progression
    let currentPct = 0;
    const progressInterval = setInterval(() => {
      currentPct += 25;
      if (currentPct >= 100) {
        currentPct = 100;
        clearInterval(progressInterval);
        setPortalState('granted');
      }
      setProgress(currentPct);
    }, 70);

    // 4. Reveal portfolio as the two halves fly apart
    setTimeout(() => {
      onEnter();
    }, 850);
  };

  // Jagged Paper Tear Clip-Paths down x: 50%
  const tornLeftClip = "polygon(0% 0%, 50% 0%, 52.2% 5%, 47.8% 11%, 52.6% 17%, 47.2% 23%, 52.8% 30%, 47.6% 37%, 52.4% 44%, 47.4% 51%, 52.6% 58%, 47.2% 65%, 52.8% 72%, 47.6% 79%, 52.4% 86%, 48% 93%, 50% 100%, 0% 100%)";
  const tornRightClip = "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 48% 93%, 52.4% 86%, 47.6% 79%, 52.8% 72%, 47.2% 65%, 52.6% 58%, 47.4% 51%, 52.4% 44%, 47.6% 37%, 52.8% 30%, 47.2% 23%, 52.6% 17%, 47.8% 11%, 52.2% 5%)";

  // Reusable Main Scene Component that gets split into left and right halves
  const renderPageContent = () => (
    <div className="absolute inset-0 flex flex-col justify-between overflow-hidden bg-[#02050e]">
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[2]" />

      {/* Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <div ref={orb1Ref} className="absolute top-1/4 left-1/4 w-[460px] h-[460px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div ref={orb2Ref} className="absolute bottom-1/4 right-1/4 w-[540px] h-[540px] bg-purple-600/20 rounded-full blur-[140px] mix-blend-screen" />
        <div ref={orb3Ref} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[170px] mix-blend-screen" />
      </div>

      {/* Dynamic Cursor Light */}
      <div
        className="pointer-events-none absolute w-[420px] h-[420px] rounded-full bg-cyan-500/10 blur-[130px] mix-blend-screen transition-transform duration-75 ease-out z-[2]"
        style={{ transform: `translate(${mousePos.x - 210}px, ${mousePos.y - 210}px)` }}
      />

      {/* Perspective Grid */}
      <div 
        className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_65%_65%_at_50%_50%,#000_15%,transparent_100%)] z-[2]"
        style={{
          perspective: '1000px',
          transform: `perspective(1000px) rotateX(${(mousePos.y / (typeof window !== 'undefined' ? window.innerHeight : 800) - 0.5) * 4}deg)`
        }}
      />

      {/* Top-Left Corner Detail */}
      <div className="relative z-20 p-6 md:p-8 pointer-events-none">
        <div className="font-mono text-[10px] md:text-[11px] text-gray-400/35 tracking-widest leading-relaxed">
          <div>DG // PORTFOLIO SYSTEM</div>
          <div>v1.0.26</div>
        </div>
      </div>

      {/* Center Glass Card */}
      <div className="relative z-30 flex items-center justify-center my-auto px-4">
        {phase === 'main' && (
          <motion.div
            ref={cardRef}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } }}
            className="flex flex-col items-center p-8 sm:p-12 md:p-14 backdrop-blur-xl bg-white/[0.03] rounded-[2.5rem] border border-white/10 shadow-[0_0_60px_rgba(6,182,212,0.12),0_0_80px_rgba(168,85,247,0.12)] max-w-xl w-[92%] sm:w-auto text-center"
          >
            {/* SYSTEM ONLINE BADGE WITH BLINKING DOT */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-7"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>SYSTEM ONLINE</span>
            </motion.div>

            {/* HERO NAME: TWO LINES WITH PROGRESSIVE LETTER REVEAL */}
            <div className="mb-4 flex flex-col items-center justify-center min-h-[90px] sm:min-h-[120px]">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[0.14em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 uppercase drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                {line1Target.slice(0, revealed1)}
                {revealed1 < line1Target.length && (
                  <span className="inline-block w-1 h-8 sm:h-12 bg-cyan-400 animate-pulse align-middle ml-1" />
                )}
              </h1>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[0.14em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 uppercase drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                {line2Target.slice(0, revealed2)}
                {revealed1 >= line1Target.length && revealed2 < line2Target.length && (
                  <span className="inline-block w-1 h-8 sm:h-12 bg-purple-400 animate-pulse align-middle ml-1" />
                )}
              </h1>
            </div>

            {/* SUBTITLE */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-gray-400 text-xs sm:text-sm tracking-[0.35em] uppercase mb-9 font-light"
            >
              FULL-STACK DEVELOPER & WRITER
            </motion.p>

            {/* PORTAL BUTTON WITH 3 CONCENTRIC BLINKING RINGS */}
            <div className="w-full max-w-sm flex flex-col items-center">
              {portalState === 'idle' && (
                <div className="relative flex items-center justify-center w-full sm:w-auto">
                  {/* Staggered Blinking Beacon Shockwave Rings (3 concentric rings) */}
                  <div 
                    className="absolute -inset-2 rounded-full border-2 border-cyan-400/60 pointer-events-none" 
                    style={{ animation: 'ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '0s' }}
                  />
                  <div 
                    className="absolute -inset-3 rounded-full border-2 border-sky-400/50 pointer-events-none" 
                    style={{ animation: 'ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '0.8s' }}
                  />
                  <div 
                    className="absolute -inset-4 rounded-full border-2 border-purple-500/50 pointer-events-none" 
                    style={{ animation: 'ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '1.6s' }}
                  />

                  {/* Pulsing Breathing Outer Aura */}
                  <div className="absolute -inset-5 rounded-full border border-cyan-400/20 animate-pulse pointer-events-none" />
                  <div className="absolute inset-0 rounded-full bg-cyan-400/25 blur-xl animate-pulse pointer-events-none" />

                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(6, 182, 212, 0.6)" }}
                    whileTap={{ scale: 0.96 }}
                    onMouseEnter={() => setIsBtnHovered(true)}
                    onMouseLeave={() => setIsBtnHovered(false)}
                    onClick={handleInitiateClick}
                    className="group relative w-full sm:w-auto px-10 py-4 text-xs sm:text-sm tracking-[0.25em] text-white uppercase overflow-hidden rounded-full border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 via-blue-600/25 to-purple-600/20 transition-all duration-300 focus:outline-none"
                  >
                    <span className="relative z-10 font-semibold drop-shadow-md flex items-center justify-center gap-2">
                      <span>
                        {isBtnHovered ? "ACCESS PORTFOLIO" : "INITIATE SEQUENCE"}
                      </span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                        →
                      </span>
                    </span>

                    {/* Light sweep animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                    {/* Glowing ring */}
                    <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-30 group-hover:opacity-70 blur-sm transition-opacity duration-300 -z-10" />
                  </motion.button>
                </div>
              )}

              {/* ACCESSING / GRANTED TERMINAL SEQUENCE */}
              {portalState !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full font-mono text-xs tracking-wider space-y-2 bg-black/40 border border-cyan-500/30 rounded-2xl p-4 shadow-[0_0_25px_rgba(6,182,212,0.2)]"
                >
                  <div className="flex items-center justify-between text-cyan-400 text-[11px]">
                    <span>TEARING REALITY SEAM...</span>
                    <span className="text-purple-400">{progress}%</span>
                  </div>

                  <div className="text-gray-300 text-[11px] text-left">
                    {portalState === 'accessing' ? "RIPPING PAGE OPEN..." : "ACCESS GRANTED"}
                  </div>

                  {portalState === 'granted' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-emerald-400 font-bold text-center pt-1 tracking-widest text-[12px] drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    >
                      ACCESS GRANTED
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom-Right Corner Detail */}
      <div className="relative z-20 p-6 md:p-8 flex justify-end pointer-events-none">
        <div className="font-mono text-[10px] md:text-[11px] text-gray-400/35 tracking-widest leading-relaxed text-right">
          <div>STATUS: ONLINE</div>
          <div>LOCATION: NEPAL</div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[100] bg-[#02050e] text-gray-100 overflow-hidden select-none"
    >
      {/* ----------------- PHASE 1: BLACK SCREEN BOOT SEQUENCE ----------------- */}
      <AnimatePresence>
        {phase === 'boot' && (
          <motion.div
            key="boot-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
            className="fixed inset-0 z-[120] bg-black flex items-center justify-center p-6"
          >
            <div className="w-full max-w-md font-mono text-sm tracking-wider text-cyan-400 space-y-2.5">
              {bootLines.slice(0, visibleBootLines).map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                    {line}
                  </span>
                </motion.div>
              ))}
              <div className="w-2.5 h-4 bg-cyan-400 animate-pulse inline-block align-middle ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------- UNDERLYING DIMENSIONAL PORTAL BEHIND THE TORN SEAM ----------------- */}
      {isTorn && (
        <div className="fixed inset-0 z-[5] flex items-center justify-center pointer-events-none bg-black">
          {/* Dimensional light eruption */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full bg-[radial-gradient(ellipse_at_center,#ffffff_0%,#38bdf8_25%,#6366f1_55%,#030712_85%)]"
          />
          {/* Intense vertical blinding rift core */}
          <motion.div
            initial={{ scaleY: 0, width: "4px" }}
            animate={{ scaleY: 1, width: "24px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute top-0 bottom-0 bg-white shadow-[0_0_50px_#fff,0_0_100px_#38bdf8]"
          />
          {/* Flying ripped paper fiber flecks drifting away from the rip */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, idx) => (
              <motion.div
                key={idx}
                initial={{
                  x: "50vw",
                  y: `${(idx / 30) * 100}vh`,
                  scale: 1,
                  opacity: 1
                }}
                animate={{
                  x: idx % 2 === 0 ? "15vw" : "85vw",
                  y: `${(idx / 30) * 100 + (Math.random() * 40 - 20)}vh`,
                  rotate: Math.random() * 360,
                  scale: Math.random() * 1.5 + 0.5,
                  opacity: 0
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute w-2 h-3 bg-white/90 shadow-[0_0_8px_#fff] rounded-sm"
              />
            ))}
          </div>
        </div>
      )}

      {/* ----------------- NORMAL INTACT STATE (BEFORE TEARING) ----------------- */}
      {!isTorn && renderPageContent()}

      {/* ----------------- PHYSICAL PAGE TORN IN HALF (DURING TEARING) ----------------- */}
      {isTorn && (
        <>
          {/* LEFT HALF OF THE PAGE (PHYSICALLY CLIPPED AND PEELING LEFT) */}
          <motion.div
            initial={{ x: 0, rotateY: 0, rotateZ: 0, y: 0 }}
            animate={{
              x: "-120%",
              rotateY: -35,
              rotateZ: -6,
              y: 35,
              opacity: 0.2
            }}
            transition={{ duration: 0.88, ease: [0.16, 1, 0.3, 1] }}
            style={{
              clipPath: tornLeftClip,
              transformOrigin: "left center"
            }}
            className="fixed inset-0 z-20 pointer-events-none drop-shadow-[-20px_0_35px_rgba(0,0,0,0.9)]"
          >
            {renderPageContent()}
            {/* Exposed White Ripped Paper Fibers along Left Tear Edge */}
            <div 
              style={{ clipPath: tornLeftClip }} 
              className="absolute inset-0 border-r-[5px] border-white filter drop-shadow-[0_0_8px_#fff]" 
            />
          </motion.div>

          {/* RIGHT HALF OF THE PAGE (PHYSICALLY CLIPPED AND PEELING RIGHT) */}
          <motion.div
            initial={{ x: 0, rotateY: 0, rotateZ: 0, y: 0 }}
            animate={{
              x: "120%",
              rotateY: 35,
              rotateZ: 6,
              y: -35,
              opacity: 0.2
            }}
            transition={{ duration: 0.88, ease: [0.16, 1, 0.3, 1] }}
            style={{
              clipPath: tornRightClip,
              transformOrigin: "right center"
            }}
            className="fixed inset-0 z-20 pointer-events-none drop-shadow-[20px_0_35px_rgba(0,0,0,0.9)]"
          >
            {renderPageContent()}
            {/* Exposed White Ripped Paper Fibers along Right Tear Edge */}
            <div 
              style={{ clipPath: tornRightClip }} 
              className="absolute inset-0 border-l-[5px] border-white filter drop-shadow-[0_0_8px_#fff]" 
            />
          </motion.div>

          {/* RIPPING RIP SEAM CUTTING DOWN THE MIDDLE WITH PAPER PARTICLES */}
          <motion.svg
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="fixed inset-0 w-full h-full pointer-events-none z-30"
          >
            <path
              d="M 50% 0% L 52.2% 5% L 47.8% 11% L 52.6% 17% L 47.2% 23% L 52.8% 30% L 47.6% 37% L 52.4% 44% L 47.4% 51% L 52.6% 58% L 47.2% 65% L 52.8% 72% L 47.6% 79% L 52.4% 86% L 48% 93% L 50% 100%"
              stroke="#ffffff"
              strokeWidth="5"
              fill="none"
              filter="drop-shadow(0 0 15px #38bdf8)"
            />
          </motion.svg>
        </>
      )}
    </div>
  );
};

export default EnterScreen;
