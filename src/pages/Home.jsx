import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

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

const Home = () => {
  const audioRef = React.useRef(null);

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.volume = 1.0;
        audioRef.current.play().catch(error => {
          console.log("Autoplay prevented by browser. User interaction needed:", error);
        });
      }
    };

    // Attempt to play immediately (will likely fail on first load)
    playAudio();

    // Listen for any interaction to start the music
    window.addEventListener('click', playAudio, { once: true });
    window.addEventListener('scroll', playAudio, { once: true });
    window.addEventListener('keydown', playAudio, { once: true });

    return () => {
      window.removeEventListener('click', playAudio);
      window.removeEventListener('scroll', playAudio);
      window.removeEventListener('keydown', playAudio);
    };
  }, []);

  const projects = [
    {
      title: "Tic Tac Toe",
      description: "Tic Tac Toe is a two-player game with sleek UI and smooth animations.",
      link: "https://github.com/dixitghimire-react/tic-tac-toe"
    },
    {
      title: "Flappy Bird",
      description: "Flappy Bird is a fun project I tried out during my initial days of Software Engineering. It is a clone of our favourite game Flappy Bird.",
      link: "https://github.com/dixitghimire-react/flappy-bird"
    },
    {
      title: "To-Do List",
      description: "Smart task manager with local storage and dark mode.",
      link: "https://github.com/dixitghimire-react/to-do-list"
    }
  ];

  const techStack = [
    { name: 'HTML', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'JavaScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'Java', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'React.js', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Next.js', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'Python', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' }
  ];

  return (
    <div className="flex flex-col items-center dark:bg-[#121826] bg-gray-50 min-h-screen dark:text-gray-200 text-gray-800">
      {/* Background Audio */}
      <audio ref={audioRef} src="/developer-theme.mp3" loop />
      
      {/* 1. Hero Section */}
      <section id="hero" className="w-full min-h-[60vh] flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 h-12 md:h-16 flex items-center justify-center">
          <Typewriter text="Full-Stack Developer" speed={120} />
        </h1>
        
        <p className="max-w-2xl text-base md:text-lg dark:text-gray-400 text-gray-600 mb-8 leading-relaxed">
          I craft digital experiences with clean code and innovative solutions. <br className="hidden md:block"/>
          Passionate about creating new applications to make a difference.
        </p>
        
        <button 
          onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 dark:text-white text-gray-900 font-medium rounded transition-colors shadow-[0_0_15px_rgba(37,99,235,0.5)]"
        >
          View My Work
        </button>
      </section>

      {/* 2. About Section */}
      <section id="about" className="w-full py-20 dark:bg-[#1a2333] bg-white border-y dark:border-gray-800 border-gray-200 flex justify-center px-4">
        <div className="max-w-5xl w-full flex flex-col md:flex-row items-center md:items-start gap-12">
          
          {/* Profile Image */}
          <div className="w-64 h-64 flex-shrink-0 rounded-full border-2 border-blue-500/30 overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.3)] dark:bg-[#121826] bg-gray-50 flex items-center justify-center relative">
            <img 
              src="/profile.jpg" 
              alt="Profile" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="text-gray-500 absolute" style={{ display: 'none' }}>Profile Image</span>
          </div>

          {/* About Content & Tech Stack */}
          <div className="flex flex-col text-center md:text-left">
            <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-4">About Me</h2>
            <p className="dark:text-gray-400 text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-2xl">
              I'm a Full Stack Developer & Writer. Currently pursuing a Bachelor's degree in BICTE (Bachelor in Information Communication Technology and Education). I am passionate about creating new applications to make a difference.
            </p>

            {/* Core Stack Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {techStack.map((tech) => (
                <div key={tech.name} className="flex items-center px-4 py-2 border dark:border-gray-700 border-gray-300 rounded-full dark:bg-[#121826] bg-gray-50 hover:border-blue-500 transition-colors group cursor-default">
                  <img src={tech.iconUrl} alt={tech.name} className="w-5 h-5 mr-2 object-contain group-hover:scale-110 transition-transform bg-white/10 rounded-sm" />
                  <span className="text-sm text-blue-400 group-hover:text-blue-300">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. Education Section */}
      <section id="education" className="w-full py-20 dark:bg-[#121826] bg-gray-50 flex flex-col items-center px-4">
        <h2 className="text-3xl font-bold mb-12 text-center dark:text-white text-gray-900">Education</h2>
        
        <div className="max-w-4xl w-full space-y-6">
          <div className="p-6 rounded-lg dark:bg-[#1a2333] bg-white border dark:border-gray-800 border-gray-200 hover:border-blue-500 transition-colors shadow-lg">
            <h3 className="text-xl font-bold dark:text-gray-200 text-gray-800 mb-2">Bachelor's in Information Communication Technology and Education (BICTE)</h3>
            <p className="text-blue-400 text-sm font-medium mb-3">2026 - 2030 (Expected)</p>
            <p className="dark:text-gray-400 text-gray-600 text-sm">Currently pursuing a comprehensive degree focusing on modern tech and educational applications.</p>
          </div>
          
          <div className="p-6 rounded-lg dark:bg-[#1a2333] bg-white border dark:border-gray-800 border-gray-200 hover:border-blue-500 transition-colors shadow-lg">
            <h3 className="text-xl font-bold dark:text-gray-200 text-gray-800 mb-2">HIGH SCHOOL</h3>
            <p className="text-blue-400 text-sm font-medium mb-3">Horizon GBS • 2025</p>
            <p className="dark:text-gray-400 text-gray-600 text-sm">Successfully completed with a CGPA of <span className="font-bold dark:text-gray-200 text-gray-800">3.54</span>.</p>
          </div>
        </div>
      </section>

      {/* 4. Projects Section */}
      <section id="projects" className="w-full py-20 dark:bg-[#1a2333] bg-white border-t dark:border-gray-800 border-gray-200 flex flex-col items-center px-4">
        <h2 className="text-3xl font-bold mb-12 text-center dark:text-white text-gray-900">Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
          {projects.map((project, index) => (
            <a 
              key={index} 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block p-6 rounded-lg dark:bg-[#121826] bg-gray-50 border dark:border-gray-800 border-gray-200 hover:border-blue-500 transition-colors shadow-lg flex flex-col h-full"
            >
              <div className="flex-grow">
                <h3 className="text-xl font-bold dark:text-gray-200 text-gray-800 mb-3 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="dark:text-gray-400 text-gray-600 text-sm leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>
              <div className="mt-auto flex items-center text-blue-500 text-sm font-medium">
                <FaGithub size={16} className="mr-2" /> View Repository
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 5. Contact Section / Footer */}
      <section id="contact" className="w-full py-16 dark:bg-[#121826] bg-gray-50 flex flex-col items-center px-4 border-t dark:border-gray-800 border-gray-200">
        <h2 className="text-3xl font-bold mb-8 text-center dark:text-white text-gray-900">Let's Connect</h2>
        
        {/* Contact Form */}
        <form 
          action="https://formsubmit.co/dixitghi69@gmail.com" 
          method="POST"
          className="w-full max-w-md dark:bg-[#1a2333] bg-white p-8 rounded-lg shadow-xl border dark:border-gray-800 border-gray-200 mb-12 relative z-10"
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
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 dark:text-white text-gray-900 font-bold py-2 px-4 rounded transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            Send Message
          </button>
        </form>

        <div className="flex space-x-6 mb-8">
          <a href="mailto:dixitghi69@gmail.com" className="p-3 rounded-full dark:bg-[#1a2333] bg-white border dark:border-gray-800 border-gray-200 hover:border-blue-500 hover:text-blue-400 dark:text-gray-400 text-gray-600 transition-colors">
            <FaEnvelope size={24} />
          </a>
          <a href="https://github.com/dixitghimire-react" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full dark:bg-[#1a2333] bg-white border dark:border-gray-800 border-gray-200 hover:border-blue-500 hover:text-blue-400 dark:text-gray-400 text-gray-600 transition-colors">
            <FaGithub size={24} />
          </a>
          <a href="https://www.linkedin.com/in/dixit-gh-a480913b4/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full dark:bg-[#1a2333] bg-white border dark:border-gray-800 border-gray-200 hover:border-blue-500 hover:text-blue-400 dark:text-gray-400 text-gray-600 transition-colors">
            <FaLinkedin size={24} />
          </a>
        </div>
        
        <p className="text-gray-600 text-xs">
          © {new Date().getFullYear()} Dikshit Ghimire. All rights reserved.
        </p>
      </section>

    </div>
  );
};

export default Home;
