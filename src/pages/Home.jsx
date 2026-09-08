import React, { useState, useEffect, useRef } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';

const Typewriter = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  // "Full-Stack " is 11 characters
  const firstPart = displayedText.substring(0, 11);
  const secondPart = displayedText.substring(11);

  return (
    <>
      <span className="text-gray-300">{firstPart}</span>
      <span className="text-[#c19d67]">{secondPart}</span>
      <span className="animate-pulse border-r-4 border-[#c19d67] ml-1 inline-block h-8 md:h-12 align-baseline translate-y-2"></span>
    </>
  );
};

// 3D Interactive Tilt Card Component
const TiltCard = ({ children, className = '' }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const audioRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.volume = 1.0;
        audioRef.current.play().catch(error => {
          console.log("Autoplay prevented by browser. User interaction needed:", error);
        });
      }
    };

    playAudio();

    window.addEventListener('click', playAudio, { once: true });
    window.addEventListener('scroll', playAudio, { once: true });
    window.addEventListener('keydown', playAudio, { once: true });

    return () => {
      window.removeEventListener('click', playAudio);
      window.removeEventListener('scroll', playAudio);
      window.removeEventListener('keydown', playAudio);
    };
  }, []);

  // GSAP ambient glow animation for the hero section
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".hero-ambient-glow", {
        scale: 1.2,
        opacity: 0.25,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const featuredProject = {
    title: "Nepal Yatra",
    subtitle: "Himalayan Travel Guide & Itinerary Planner",
    description: "Built an interactive Himalayan travel guide & itinerary planner using Next.js 15 (App Router), React 19, and TypeScript, serving structured guides for 19+ Nepalese destinations.",
    highlights: [
      "Integrated dynamic Leaflet GIS maps with custom category-coded div-markers, animated radar pulses, and coordinate-based viewport panning.",
      "Developed a multi-day itinerary planner and real-time budget calculator, supporting customizable traveler counts, travel tiers, and print/PDF export features.",
      "Implemented a global wishlist drawer using React Context and LocalStorage, providing offline persistence and automatic trip duration calculations.",
      "Crafted responsive, high-performance UI components using Tailwind CSS, Framer Motion, and GSAP, achieving fluid animations and modern glassmorphic styling."
    ],
    tags: ["Next.js 15", "React 19", "TypeScript", "Leaflet GIS", "Tailwind CSS", "Framer Motion", "GSAP"],
    liveUrl: "https://nepal-yatra-peach.vercel.app",
    githubUrl: "https://github.com/dixitghimire-react/nepal"
  };

  const otherProjects = [
    {
      title: "Tic Tac Toe",
      description: "Tic Tac Toe is a two-player game with sleek UI and smooth animations.",
      tags: ["React", "JavaScript", "CSS3"],
      link: "https://github.com/dixitghimire-react/tic-tac-toe"
    },
    {
      title: "Flappy Bird",
      description: "Flappy Bird is a fun project I tried out during my initial days of Software Engineering. It is a clone of our favourite game Flappy Bird.",
      tags: ["JavaScript", "HTML5 Canvas", "Game Dev"],
      link: "https://github.com/dixitghimire-react/flappy-bird"
    },
    {
      title: "To-Do List",
      description: "Smart task manager with local storage and dark mode.",
      tags: ["React", "LocalStorage", "Tailwind CSS"],
      link: "https://github.com/dixitghimire-react/to-do-list"
    }
  ];

  const techStack = [
    { name: 'HTML', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'JavaScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'TypeScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'React.js', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Next.js', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'Tailwind CSS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'Java', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'Python', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' }
  ];

  return (
    <div className="flex flex-col items-center dark:bg-[#121826] bg-gray-50 min-h-screen dark:text-gray-200 text-gray-800 selection:bg-blue-500 selection:text-white">
      {/* Background Audio */}
      <audio ref={audioRef} src="/developer-theme.mp3" loop />
      
      {/* 1. Hero Section */}
      <section 
        ref={heroRef}
        id="hero" 
        className="relative w-full min-h-[70vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden"
      >
        {/* Ambient atmospheric backdrop */}
        <div className="hero-ambient-glow absolute w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[140px] pointer-events-none -top-20 -left-20" />
        <div className="hero-ambient-glow absolute w-[450px] h-[450px] bg-purple-500/15 rounded-full blur-[130px] pointer-events-none -bottom-20 -right-20" />

        {/* Hero badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Available For Opportunities
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl md:text-6xl font-bold mb-6 h-12 md:h-16 flex items-center justify-center drop-shadow-sm"
        >
          <Typewriter text="Full-Stack Developer" speed={120} />
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl text-base md:text-lg dark:text-gray-400 text-gray-600 mb-8 leading-relaxed"
        >
          I craft digital experiences with clean code and innovative solutions. <br className="hidden md:block"/>
          Passionate about creating new applications to make a difference.
        </motion.p>
        
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(37,99,235,0.6)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2"
        >
          <span>View My Work</span>
          <span className="text-sm">↓</span>
        </motion.button>
      </section>

      {/* 2. About Section */}
      <section id="about" className="w-full py-20 dark:bg-[#1a2333] bg-white border-y dark:border-gray-800 border-gray-200 flex justify-center px-4 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl w-full flex flex-col md:flex-row items-center md:items-start gap-12"
        >
          {/* Profile Image with float & subtle hover */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="w-64 h-64 flex-shrink-0 rounded-full border-2 border-blue-500/40 p-1.5 shadow-[0_0_35px_rgba(59,130,246,0.3)] dark:bg-[#121826] bg-gray-50 flex items-center justify-center relative group"
          >
            <div className="w-full h-full rounded-full overflow-hidden relative">
              <img 
                src="/profile.jpg" 
                alt="Profile" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="text-gray-500 absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>Profile Image</span>
            </div>
          </motion.div>

          {/* About Content & Tech Stack */}
          <div className="flex flex-col text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-900 mb-4">About Me</h2>
            <p className="dark:text-gray-400 text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-2xl">
              I'm a Full Stack Developer & Writer. Currently pursuing a Bachelor's degree in BICTE (Bachelor in Information Communication Technology and Education). I am passionate about creating new applications to make a difference.
            </p>

            {/* Core Stack Buttons with Framer Motion micro-springs */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {techStack.map((tech, idx) => (
                <motion.div 
                  key={tech.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  className="flex items-center px-4 py-2 border dark:border-gray-700/80 border-gray-300 rounded-full dark:bg-[#121826] bg-gray-50 hover:border-blue-500 transition-colors group cursor-default shadow-sm"
                >
                  <img src={tech.iconUrl} alt={tech.name} className="w-5 h-5 mr-2 object-contain group-hover:scale-110 transition-transform bg-white/10 rounded-sm" />
                  <span className="text-sm font-medium text-blue-400 group-hover:text-blue-300">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Education Section */}
      <section id="education" className="w-full py-20 dark:bg-[#121826] bg-gray-50 flex flex-col items-center px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-12 text-center dark:text-white text-gray-900"
        >
          Education
        </motion.h2>
        
        <div className="max-w-4xl w-full space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-xl dark:bg-[#1a2333] bg-white border dark:border-gray-800 border-gray-200 hover:border-blue-500 transition-colors shadow-lg"
          >
            <h3 className="text-xl font-bold dark:text-gray-200 text-gray-800 mb-2">Bachelor's in Information Communication Technology and Education (BICTE)</h3>
            <p className="text-blue-400 text-sm font-medium mb-3">2026 - 2030 (Expected)</p>
            <p className="dark:text-gray-400 text-gray-600 text-sm leading-relaxed">Currently pursuing a comprehensive degree focusing on modern tech and educational applications.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="p-6 rounded-xl dark:bg-[#1a2333] bg-white border dark:border-gray-800 border-gray-200 hover:border-blue-500 transition-colors shadow-lg"
          >
            <h3 className="text-xl font-bold dark:text-gray-200 text-gray-800 mb-2">HIGH SCHOOL</h3>
            <p className="text-blue-400 text-sm font-medium mb-3">Horizon GBS • 2025</p>
            <p className="dark:text-gray-400 text-gray-600 text-sm leading-relaxed">Successfully completed with a CGPA of <span className="font-bold dark:text-gray-200 text-gray-800">3.54</span>.</p>
          </motion.div>
        </div>
      </section>

      {/* 4. Projects Section */}
      <section id="projects" className="w-full py-20 dark:bg-[#1a2333] bg-white border-t dark:border-gray-800 border-gray-200 flex flex-col items-center px-4">
        <div className="max-w-6xl w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-gray-900 mb-3">Featured Projects</h2>
            <p className="dark:text-gray-400 text-gray-600 text-sm md:text-base max-w-xl mx-auto">
              A curated collection of web applications, interactive tools, and experimental projects I've built.
            </p>
          </motion.div>
          
          {/* Main Featured Project: Nepal Yatra with Interactive 3D Tilt Card */}
          <TiltCard className="mb-14 rounded-2xl dark:bg-[#121826] bg-gray-50 border-2 dark:border-blue-500/40 border-blue-500/30 p-6 md:p-8 shadow-2xl relative overflow-hidden group transition-colors duration-300">
            {/* Ambient decorative glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/25 transition-all duration-500" />
            
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  Flagship Project
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold dark:text-white text-gray-900 group-hover:text-blue-400 transition-colors">
                  {featuredProject.title}
                </h3>
                <p className="text-blue-500 dark:text-blue-400 font-medium text-sm md:text-base mt-1">
                  {featuredProject.subtitle}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <motion.a 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href={featuredProject.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all"
                >
                  <FaExternalLinkAlt size={13} />
                  <span>Live Preview</span>
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href={featuredProject.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 dark:bg-[#1a2333] bg-white border dark:border-gray-700 border-gray-300 hover:border-blue-500 dark:text-gray-200 text-gray-800 hover:text-blue-400 text-sm font-semibold rounded-lg transition-all"
                >
                  <FaGithub size={16} />
                  <span>Source Code</span>
                </motion.a>
              </div>
            </div>

            {/* Description */}
            <p className="dark:text-gray-300 text-gray-700 text-sm md:text-base leading-relaxed mb-6 font-normal">
              {featuredProject.description}
            </p>

            {/* Highlights Bullet List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {featuredProject.highlights.map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-start gap-2.5 p-3 rounded-lg dark:bg-[#1a2333]/70 bg-white/80 border dark:border-gray-800 border-gray-200 text-xs md:text-sm dark:text-gray-300 text-gray-700"
                >
                  <span className="text-blue-400 font-bold mt-0.5">✦</span>
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2 pt-2 border-t dark:border-gray-800/80 border-gray-200">
              {featuredProject.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-3 py-1 text-xs font-medium rounded-md dark:bg-[#1a2333] bg-gray-200/70 text-blue-400 border dark:border-blue-500/20 border-blue-500/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </TiltCard>

          {/* Other Projects Grid */}
          <div className="mb-4">
            <h3 className="text-xl font-bold dark:text-gray-200 text-gray-800 mb-6">More Projects</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group p-6 rounded-xl dark:bg-[#121826] bg-gray-50 border dark:border-gray-800 border-gray-200 hover:border-blue-500 transition-colors shadow-lg flex flex-col justify-between h-full"
              >
                <div>
                  <h4 className="text-lg font-bold dark:text-gray-200 text-gray-800 mb-2 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h4>
                  <p className="dark:text-gray-400 text-gray-600 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2.5 py-0.5 text-xs rounded dark:bg-[#1a2333] bg-gray-200/60 dark:text-gray-400 text-gray-600 border dark:border-gray-700/50 border-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t dark:border-gray-800/80 border-gray-200 flex items-center justify-between">
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-500 hover:text-blue-400 text-xs font-semibold gap-1.5 transition-colors group-hover:translate-x-1 duration-200"
                  >
                    <FaGithub size={14} />
                    <span>View Repository</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact Section / Footer */}
      <section id="contact" className="w-full py-16 dark:bg-[#121826] bg-gray-50 flex flex-col items-center px-4 border-t dark:border-gray-800 border-gray-200">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-center dark:text-white text-gray-900"
        >
          Let's Connect
        </motion.h2>
        
        {/* Contact Form with Framer Motion entrance */}
        <motion.form 
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          action="https://formsubmit.co/dixitghi69@gmail.com" 
          method="POST"
          className="w-full max-w-md dark:bg-[#1a2333] bg-white p-8 rounded-xl shadow-xl border dark:border-gray-800 border-gray-200 mb-12 relative z-10"
        >
          <div className="mb-4">
            <label htmlFor="name" className="block dark:text-gray-400 text-gray-600 text-sm font-bold mb-2">Name</label>
            <input type="text" id="name" name="name" required className="w-full px-3 py-2 dark:bg-[#121826] bg-gray-50 dark:text-white text-gray-900 border dark:border-gray-700 border-gray-300 rounded focus:outline-none focus:border-blue-500 transition-colors" placeholder="Your Name" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block dark:text-gray-400 text-gray-600 text-sm font-bold mb-2">Email</label>
            <input type="email" id="email" name="email" required className="w-full px-3 py-2 dark:bg-[#121826] bg-gray-50 dark:text-white text-gray-900 border dark:border-gray-700 border-gray-300 rounded focus:outline-none focus:border-blue-500 transition-colors" placeholder="your.email@example.com" />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block dark:text-gray-400 text-gray-600 text-sm font-bold mb-2">Message</label>
            <textarea id="message" name="message" rows="4" required className="w-full px-3 py-2 dark:bg-[#121826] bg-gray-50 dark:text-white text-gray-900 border dark:border-gray-700 border-gray-300 rounded focus:outline-none focus:border-blue-500 transition-colors resize-none" placeholder="Your message here..."></textarea>
          </div>
          
          {/* FormSubmit Configuration */}
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_subject" value="New message from your Antiportfolio!" />
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-lg transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            Send Message
          </motion.button>
        </motion.form>

        <div className="flex space-x-6 mb-8">
          {[
            { href: "mailto:dixitghi69@gmail.com", icon: FaEnvelope, label: "Email" },
            { href: "https://github.com/dixitghimire-react", icon: FaGithub, label: "GitHub", target: "_blank" },
            { href: "https://www.linkedin.com/in/dixit-gh-a480913b4/", icon: FaLinkedin, label: "LinkedIn", target: "_blank" }
          ].map((social, idx) => (
            <motion.a 
              key={idx}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              href={social.href} 
              target={social.target} 
              rel={social.target ? "noopener noreferrer" : undefined} 
              className="p-3 rounded-full dark:bg-[#1a2333] bg-white border dark:border-gray-800 border-gray-200 hover:border-blue-500 hover:text-blue-400 dark:text-gray-400 text-gray-600 transition-colors shadow-sm"
              aria-label={social.label}
            >
              <social.icon size={22} />
            </motion.a>
          ))}
        </div>
        
        <p className="text-gray-500 text-xs">
          © {new Date().getFullYear()} Dikshit Ghimire. All rights reserved.
        </p>
      </section>
    </div>
  );
};

export default Home;
