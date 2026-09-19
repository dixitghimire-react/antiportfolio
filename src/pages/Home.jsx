import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
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

const themeStyles = {
  blue: {
    border: 'dark:border-blue-500/40 border-blue-500/30',
    glow: 'bg-blue-500/10 group-hover:bg-blue-500/25',
    badge: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    dot: 'bg-blue-400',
    titleHover: 'group-hover:text-blue-400',
    subtitle: 'text-blue-500 dark:text-blue-400',
    primaryBtn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]',
    codeBtn: 'dark:border-gray-700 border-gray-300 hover:border-blue-500 dark:text-gray-200 text-gray-800 hover:text-blue-400',
    bullet: 'text-blue-400',
    tag: 'text-blue-400 border dark:border-blue-500/20 border-blue-500/10'
  },
  cyan: {
    border: 'dark:border-cyan-500/40 border-cyan-500/30',
    glow: 'bg-cyan-500/10 group-hover:bg-cyan-500/25',
    badge: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    dot: 'bg-cyan-400',
    titleHover: 'group-hover:text-cyan-400',
    subtitle: 'text-cyan-500 dark:text-cyan-400',
    primaryBtn: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]',
    codeBtn: 'dark:border-cyan-700/60 border-cyan-300 hover:border-cyan-400 dark:text-gray-200 text-gray-800 hover:text-cyan-400',
    bullet: 'text-cyan-400',
    tag: 'text-cyan-400 border dark:border-cyan-500/20 border-cyan-500/10'
  },
  amber: {
    border: 'dark:border-amber-500/40 border-amber-500/30',
    glow: 'bg-amber-500/10 group-hover:bg-amber-500/25',
    badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    dot: 'bg-amber-400',
    titleHover: 'group-hover:text-amber-400',
    subtitle: 'text-amber-500 dark:text-amber-400',
    primaryBtn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]',
    codeBtn: 'dark:border-amber-700/60 border-amber-300 hover:border-amber-400 dark:text-gray-200 text-gray-800 hover:text-amber-400',
    bullet: 'text-amber-400',
    tag: 'text-amber-400 border dark:border-amber-500/20 border-amber-500/10'
  },
  emerald: {
    border: 'dark:border-emerald-500/40 border-emerald-500/30',
    glow: 'bg-emerald-500/10 group-hover:bg-emerald-500/25',
    badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    dot: 'bg-emerald-400',
    titleHover: 'group-hover:text-emerald-400',
    subtitle: 'text-emerald-500 dark:text-emerald-400',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]',
    codeBtn: 'dark:border-emerald-700/60 border-emerald-300 hover:border-emerald-400 dark:text-gray-200 text-gray-800 hover:text-emerald-400',
    bullet: 'text-emerald-400',
    tag: 'text-emerald-400 border dark:border-emerald-500/20 border-emerald-500/10'
  }
};

const Home = () => {
  const heroRef = useRef(null);

  // Contact form submission state
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [toastMessage, setToastMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("https://formsubmit.co/ajax/dixitghi69@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
          _subject: `New message from ${formState.name} via Antiportfolio!`,
          _captcha: "false",
          _template: "table",
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success !== "false") {
        setSubmitStatus('success');
        setToastMessage("Your message has been sent successfully! Dikshit will get back to you shortly.");
        setFormState({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
        setToastMessage(data.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setSubmitStatus('error');
      setToastMessage("Something went wrong while sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-dismiss success toast after 6 seconds
  useEffect(() => {
    if (submitStatus === 'success') {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

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

  const featuredProjects = [
    {
      badge: "Flagship Web App",
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
      githubUrl: "https://github.com/dixitghimire-react/nepal",
      accentColor: "blue"
    },
    {
      badge: "Flagship Academic Portal",
      title: "EcoStudy",
      subtitle: "Economics Study Portal & Learning Desk",
      description: "A comprehensive academic study portal for Economics learners and educators built with ASP.NET Core MVC, .NET 8 LTS, Entity Framework Core, and SQL Server, featuring role-based portals and syllabus management.",
      highlights: [
        "Architected role-based portals for Teachers and Students with Identity authentication, CSRF anti-forgery, and seeded administrative credentials.",
        "Implemented full chapter and syllabus CRUD workflows with duplicate detection, categorized by Microeconomics, Macroeconomics, and Money & Banking.",
        "Engineered a study notes repository supporting multi-format uploads (.pdf, .docx, .pptx up to 25 MB) and a categorized high-yield exam question bank.",
        "Delivered a zero-flicker dark/light mode engine, responsive off-canvas mobile navigation, and branded economics-themed error pages."
      ],
      tags: [".NET 8", "ASP.NET Core MVC", "C#", "EF Core 8", "SQL Server", "Bootstrap 5", "Identity Auth"],
      docsUrl: "https://github.com/dixitghimire-react/ecostudy#readme",
      githubUrl: "https://github.com/dixitghimire-react/ecostudy",
      accentColor: "blue"
    },
    {
      badge: "Flagship Desktop AI",
      title: "J.A.R.V.I.S.",
      subtitle: "Windows Desktop AI Voice Assistant & Automation",
      description: "A modular, offline-first Windows desktop voice assistant inspired by Tony Stark's J.A.R.V.I.S. featuring wake word detection, dual-mode NLP routing, native OS automation, and an Iron Man HUD interface.",
      highlights: [
        "Designed an Iron Man HUD with PySide6 (Qt) featuring an animated reactive arc reactor orb visualizer responsive to assistant states.",
        "Engineered an offline-first intent engine powered by rule-based regex parsing, with seamless optional OpenAI fallback for complex conversational requests.",
        "Implemented thread-safe background wake word detection ('Wake up Jarvis') and low-latency offline Text-to-Speech using pyttsx3.",
        "Enforced zero arbitrary execution via strict security whitelisting, Windows Known Folders resolution, and two-step verbal confirmations for critical operations."
      ],
      tags: ["Python 3.11+", "PySide6 (Qt)", "Speech Recognition", "pyttsx3 (Offline TTS)", "OpenAI API", "Windows Automation", "Regex NLP"],
      docsUrl: "https://github.com/dixitghimire-react/jarvis#readme",
      githubUrl: "https://github.com/dixitghimire-react/jarvis",
      accentColor: "cyan"
    },
    {
      badge: "Flagship Computer Vision & VFX",
      title: "Mystic Hand (Dr. Strange VFX)",
      subtitle: "Real-Time Hand Tracking & Procedural Magic VFX",
      description: "A real-time computer vision desktop application inspired by Doctor Strange's mystic arts, transforming webcam input into interactive superhero magic using MediaPipe Tasks, OpenCV, and procedural sacred geometry.",
      highlights: [
        "Engineered dual-hand 21-landmark tracking with EMA jitter reduction, palm kinematics, and real-time gesture state machines.",
        "Rendered procedural sacred geometry shields with counter-rotating runic rings, dynamic nested hexagrams, and velocity reactivity.",
        "Created multi-hand synergies including the Doctor Strange Sling Ring portal and dynamic Arcane Lightning Tether.",
        "Built a multi-stage downsampled Gaussian bloom pipeline and physics particle engine maintaining 30–60 FPS on CPU."
      ],
      tags: ["Python 3.11+", "OpenCV", "MediaPipe Tasks", "NumPy", "Pygame", "Computer Vision", "Procedural VFX"],
      docsUrl: "https://github.com/dixitghimire-react/dr.strange#readme",
      githubUrl: "https://github.com/dixitghimire-react/dr.strange",
      accentColor: "blue"
    }
  ];

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
    { name: 'Python', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'OpenCV', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg' },
    { name: 'PHP', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
    { name: '.NET', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
    { name: 'Blazor', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blazor/blazor-original.svg' },
    { name: 'MySQL', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' }
  ];

  return (
    <div className="flex flex-col items-center dark:bg-[#121826] bg-gray-50 w-full dark:text-gray-200 text-gray-800 selection:bg-blue-500 selection:text-white">
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
          
          {/* Featured Projects with Interactive 3D Tilt Cards */}
          <div className="space-y-12 mb-14">
            {featuredProjects.map((project) => {
              const style = themeStyles[project.accentColor] || themeStyles.blue;
              return (
                <TiltCard 
                  key={project.title}
                  className={`rounded-2xl dark:bg-[#121826] bg-gray-50 border-2 ${style.border} p-6 md:p-8 shadow-2xl relative overflow-hidden group transition-colors duration-300`}
                >
                  {/* Ambient decorative glow */}
                  <div className={`absolute -top-24 -right-24 w-64 h-64 ${style.glow} rounded-full blur-3xl pointer-events-none transition-all duration-500`} />
                  
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                    <div>
                      <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${style.badge} border text-xs font-semibold uppercase tracking-wider mb-3`}>
                        <span className={`w-2 h-2 rounded-full ${style.dot} animate-ping`} />
                        {project.badge}
                      </div>
                      <h3 className={`text-2xl md:text-3xl font-extrabold dark:text-white text-gray-900 ${style.titleHover} transition-colors`}>
                        {project.title}
                      </h3>
                      <p className={`${style.subtitle} font-medium text-sm md:text-base mt-1`}>
                        {project.subtitle}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      {project.liveUrl && (
                        <motion.a 
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-5 py-2.5 ${style.primaryBtn} text-sm font-semibold rounded-lg transition-all`}
                        >
                          <FaExternalLinkAlt size={13} />
                          <span>Live Preview</span>
                        </motion.a>
                      )}
                      {project.docsUrl && (
                        <motion.a 
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          href={project.docsUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-5 py-2.5 ${style.primaryBtn} text-sm font-semibold rounded-lg transition-all`}
                        >
                          <FaExternalLinkAlt size={13} />
                          <span>Quickstart & Docs</span>
                        </motion.a>
                      )}
                      <motion.a 
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-5 py-2.5 dark:bg-[#1a2333] bg-white border ${style.codeBtn} text-sm font-semibold rounded-lg transition-all`}
                      >
                        <FaGithub size={16} />
                        <span>Source Code</span>
                      </motion.a>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="dark:text-gray-300 text-gray-700 text-sm md:text-base leading-relaxed mb-6 font-normal">
                    {project.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {project.highlights.map((item, idx) => (
                      <motion.div 
                        key={idx}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-start gap-2.5 p-3 rounded-lg dark:bg-[#1a2333]/70 bg-white/80 border dark:border-gray-800 border-gray-200 text-xs md:text-sm dark:text-gray-300 text-gray-700"
                      >
                        <span className={`${style.bullet} font-bold mt-0.5`}>✦</span>
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t dark:border-gray-800/80 border-gray-200">
                    {project.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className={`px-3 py-1 text-xs font-medium rounded-md dark:bg-[#1a2333] bg-gray-200/70 ${style.tag}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              );
            })}
          </div>

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
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-emerald-500 hover:text-emerald-400 text-xs font-semibold gap-1.5 transition-colors duration-200"
                    >
                      <FaExternalLinkAlt size={12} />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Technical Proficiency Section */}
      <section id="skills" className="w-full py-12 md:py-16 dark:bg-[#121826] bg-gray-50 border-t dark:border-gray-800 border-gray-200 flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2">
              TECHNICAL PROFICIENCY
            </h2>
            <div className="w-full border-b border-gray-200 dark:border-gray-800 mb-6" />
            <div className="space-y-3.5 text-sm sm:text-base leading-relaxed">
              <p className="dark:text-gray-300 text-gray-700">
                <strong className="font-bold dark:text-white text-gray-900 mr-2">Languages:</strong>
                JavaScript, TypeScript, Python, Java, PHP, C# / .NET, HTML5/CSS3, SQL
              </p>
              <p className="dark:text-gray-300 text-gray-700">
                <strong className="font-bold dark:text-white text-gray-900 mr-2">Technologies:</strong>
                React, Next.js, ASP.NET Core, Blazor, Node, Express, Entity Framework Core, Supabase, Firebase, AWS (EC2, S3, IAM, Elastic Beanstalk), Docker, Kubernetes, Git, Github Actions, Mapbox, Leaflet GIS, Tailwind CSS, Framer Motion, GSAP, PySide6 (Qt), Speech Recognition, SQL Server, MySQL, PostgreSQL, MongoDB, Vite, RESTful APIs, GraphQL.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. Contact Section / Footer */}
      <footer id="contact" className="w-full pt-16 pb-12 dark:bg-[#1a2333] bg-white flex flex-col items-center px-4 border-t dark:border-gray-800 border-gray-200">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-center dark:text-white text-gray-900"
        >
          Let's Connect
        </motion.h2>
        
        {/* Contact Form with AJAX submission */}
        <motion.form 
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onSubmit={handleContactSubmit}
          className="w-full max-w-md dark:bg-[#1a2333] bg-white p-8 rounded-xl shadow-xl border dark:border-gray-800 border-gray-200 mb-12 relative z-10"
        >
          <div className="mb-4">
            <label htmlFor="name" className="block dark:text-gray-400 text-gray-600 text-sm font-bold mb-2">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              value={formState.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 dark:bg-[#121826] bg-gray-50 dark:text-white text-gray-900 border dark:border-gray-700 border-gray-300 rounded focus:outline-none focus:border-blue-500 transition-colors" 
              placeholder="Your Name" 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block dark:text-gray-400 text-gray-600 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              value={formState.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 dark:bg-[#121826] bg-gray-50 dark:text-white text-gray-900 border dark:border-gray-700 border-gray-300 rounded focus:outline-none focus:border-blue-500 transition-colors" 
              placeholder="your.email@example.com" 
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block dark:text-gray-400 text-gray-600 text-sm font-bold mb-2">Message</label>
            <textarea 
              id="message" 
              name="message" 
              rows="4" 
              required 
              value={formState.message}
              onChange={handleInputChange}
              className="w-full px-3 py-2 dark:bg-[#121826] bg-gray-50 dark:text-white text-gray-900 border dark:border-gray-700 border-gray-300 rounded focus:outline-none focus:border-blue-500 transition-colors resize-none" 
              placeholder="Your message here..."
            />
          </div>
          
          {/* Inline Feedback Banner */}
          <AnimatePresence>
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs md:text-sm flex items-center gap-2"
              >
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                <span>Message sent successfully! I will get back to you soon.</span>
              </motion.div>
            )}
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs md:text-sm flex items-center gap-2"
              >
                <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button 
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            type="submit" 
            disabled={isSubmitting}
            className={`w-full ${
              submitStatus === 'success'
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
            } text-white font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Sending Message...</span>
              </>
            ) : submitStatus === 'success' ? (
              <>
                <CheckCircle2 size={18} />
                <span>Message Sent Successfully!</span>
              </>
            ) : (
              <span>Send Message</span>
            )}
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
        
        <p className="text-gray-500 text-xs text-center">
          © {new Date().getFullYear()} Dikshit Ghimire. All rights reserved.
        </p>
      </footer>

      {/* Floating Success / Error Notification Toast */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className={`fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-start gap-3.5 ${
                submitStatus === 'success'
                  ? 'dark:bg-[#121826]/95 bg-white/95 dark:border-emerald-500/40 border-emerald-500/30 shadow-[0_10px_35px_rgba(16,185,129,0.25)]'
                  : 'dark:bg-[#121826]/95 bg-white/95 dark:border-rose-500/40 border-rose-500/30 shadow-[0_10px_35px_rgba(244,63,94,0.25)]'
              }`}
            >
              <div className={`p-2 rounded-xl ${
                submitStatus === 'success' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
              } flex-shrink-0`}>
                {submitStatus === 'success' ? <CheckCircle2 size={22} className="text-emerald-400" /> : <AlertCircle size={22} className="text-rose-400" />}
              </div>
              
              <div className="flex-1 pr-1">
                <h4 className="font-bold text-sm dark:text-white text-gray-900">
                  {submitStatus === 'success' ? 'Message Sent Successfully! 🚀' : 'Submission Failed'}
                </h4>
                <p className="text-xs dark:text-gray-300 text-gray-600 mt-1 leading-relaxed">
                  {toastMessage}
                </p>
              </div>

              <button
                onClick={() => setSubmitStatus(null)}
                className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-500/10 cursor-pointer"
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Home;
