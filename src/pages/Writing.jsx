import React, { useState, useEffect, useRef } from 'react';
import { X, BookOpen, Pin, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PinLock from '../components/PinLock';

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

  return (
    <>
      <span>{displayedText}</span>
      <span className="animate-pulse border-r-4 border-purple-400 ml-2 inline-block h-12 md:h-20 align-baseline translate-y-2 md:translate-y-4"></span>
    </>
  );
};

const Writing = () => {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('writing_vault_unlocked') === 'true';
  });
  const [activePoem, setActivePoem] = useState(null);
  const audioRef = React.useRef(null);
  const poemContentRef = useRef(null);

  const handleUnlock = () => {
    sessionStorage.setItem('writing_vault_unlocked', 'true');
    setIsUnlocked(true);
  };

  const handleLock = () => {
    sessionStorage.removeItem('writing_vault_unlocked');
    setIsUnlocked(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    // Attempt to play music only when vault is unlocked
    if (isUnlocked && audioRef.current) {
      audioRef.current.volume = 1.0; // Max volume
      audioRef.current.play().catch(error => {
        console.log("Autoplay prevented by browser. User interaction needed:", error);
      });
    }

    const handleKeyDown = (e) => {
      // Prevent PrintScreen key if possible
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText(''); 
        alert("Screenshots are disabled on this page.");
      }
      // Prevent Ctrl/Cmd + C, X, P, S
      if ((e.ctrlKey || e.metaKey) && ['c', 'x', 'p', 's'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    // Prevent dragging images
    const preventDrag = (e) => e.preventDefault();

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', preventDrag);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', preventDrag);
    };
  }, [isUnlocked]);

  const openPoem = (poem) => {
    setActivePoem(poem);
    if (window.location.hash !== '#poem') {
      window.history.pushState(null, '', window.location.pathname + '#poem');
    }
  };

  const closePoem = () => {
    if (window.location.hash === '#poem') {
      window.history.back();
    } else {
      setActivePoem(null);
    }
  };

  useEffect(() => {
    // Cleanup hash on mount if user reloaded the page with it
    if (window.location.hash === '#poem') {
      window.history.replaceState(null, '', window.location.pathname);
    }

    const handlePopState = () => {
      if (window.location.hash !== '#poem') {
        setActivePoem(null);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Ensure scroll container starts at the top when a poem is opened
  useEffect(() => {
    if (activePoem) {
      if (poemContentRef.current) {
        poemContentRef.current.scrollTop = 0;
      }
      // Also reset on next frame in case of layout animation
      requestAnimationFrame(() => {
        if (poemContentRef.current) {
          poemContentRef.current.scrollTop = 0;
        }
      });
    }
  }, [activePoem]);

  const poems = [
    {
      title: "Everything I Never Told You",
      pinned: true,
      image: "",
      content: `I don't think you ever knew
how much I cared about you.
Maybe you noticed sometimes,
the way I looked at you,
the way I always found some reason
to talk to you.

I was scared.
Scared that if I told you how I felt,
things between us would change.
So I stayed quiet and watched you live your life
while I secretly wished
I had a place in it.
I learned your favorite songs,
remembered the little things
the way you smiled when you were happy,
the way you went quiet when you weren't.

You became a habit
I never meant to keep,
a name in my thoughts,
a face in my dreams,
a story I kept writing
without knowing the ending.
There were days when one small message from you
could make my whole day better,
and nights when I kept checking my phone,
knowing you probably weren't going to text.

You never promised me anything,
yet somehow I kept hoping.
Maybe that was my mistake
building a home inside a heart
that was never mine.
Maybe someday I will stop looking for you
in every song,
stop remembering the little things about you,
and learn how to hear your name
without feeling something inside my chest.

But I don't think I will ever stop loving you.
And no I don't want someone else.
I don't want a different person
just to fill the space you left behind.
I will keep choosing you,
even if you never choose me.
And I don't regret the love I gave you
just because it was never returned.

If one day you wonder
whether someone ever truly loved you
without asking for anything,
without expecting anything,
I hope you remember me
the person who stayed quiet,
who cared from a distance,
who smiled when you were happy,
even when your happiness
had nothing to do with them.

I will carry this love somewhere inside me,
not because I expect anything from you
or wish things were different,
but because some feelings don't disappear
just because they were never returned.
Maybe you never knew how much I loved you,
maybe you never will.
But I did,
and for a while,
loving you was the most beautiful feeling
I had ever known.`
    },
    {
      title: "Let's meet again as stranger",
      image: "/haha.jpg",
      content: `फेरि आऊ तिमी अञ्जान बनी, म फेरि तिम्रो नाम सोध्ने छु,
आँखा जुध्दा त्यो क्षणमा, म फेरि चुपचाप मुस्कुराउने छु। 

पुराना चोटहरू लुकाएर, म नयाँ कुरा सुनाउने छु,
बितेका ती पलहरूलाई, हावासँगै उडाउने छु। 

तिमी अञ्जानझैँ फर्केर आयौ भने, कथा फेरि लेखिनेछ,
हिजोका आँसु बिर्सेर यहाँ, नयाँ बिहान देखिनेछ। 

तिमी “को हौ?” भनी हाँस्दै सोध्यौ भने, म फेरि आल्मलाउने छु,
तर मनभित्रको त्यो पुरानो माया, फेरि चुपचाप फुलाउने छु। 

हिजोको पीडा टाढा राखेर, आजको सपना सजाउने छु,
फेरि आऊ तिमी अञ्जान बनी, म फेरि तिम्रो नाम सोध्ने छु।`
    },
    {
      title: "dreams",
      image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&q=80&w=800",
      content: `I saw you today Well,
in my dreams
But I wish I could see you
Not really in my dreams
I wish I could touch you
Not in that way obviously
I wish I could feel you
Yeah totally in that way obviously
I wish I was there with you
Possible only in my dreams
Sitting together licking each other's ice cream
And I'll see you one day
Definitely not in my dreams
Having fun in a park
With pink and blue themes
And again, I saw you today,
Well, obviously in my dreams`
    },
    {
      title: "प्रेम वा प्रार्थना",
      image: "/sad-holding-hand-boy-girl-image.jpg",
      content: `मेरो प्रार्थना थियौ तिमी,
मेरो हरेक इच्छा चाहना थियौ तिमी,
म त्यति धर्ममा विश्वास नगर्नेको पनि
त्यो ईश्वर अघि सिर झुकाउने एक मात्र बहाना थियो तिमी। 
तिमीसँगै मेरा सारा खुसी गयो,
न त तिमी न त खुसी दुवै रुकेन
गएको दिनदेखि तिमी यो सिर मन्दिरमा कहिल्यै झुकेन।`
    },
    {
      title: "बिपरित प्रेम कथा",
      image: "/haha2.jfif",
      content: `थाहा भएन तिमी के थियौ
ताल थियौ तर खोला जस्तै बगेर गयौ। 
हीरा थियौ तर सिसा जस्तै फुटेर गयौ
सपना थियौ तिमी आँखा खोल्दा हराएर गयौ।
बलेको दियो थियौ अन्धकारमै निभेर गयौ
सत्य थियौ तर एक मीठो झुट बनी हराएर गयौ।
मुटु मेरो फुटाई अर्कैको अँगालोमा बाँधिएर गयौ, 
मेरो मुटुमा थियौ तर पराईको हातमा गयौ।
थाहा भएन तिमी के थियौ
मेरो सबै थियौ तर अन्त्यमा केही नभई गयौ।`
    },
    {
      title: "निस्वार्थ प्रेमको कथा",
      image: "/huhu.jpg",
      content: `मैले लेख्ने कविताको शीर्षक बनिदेऊ,
यो स्वार्थी संसारमा तिमी निस्वार्थ प्रेमको रत्न बनिदेऊ,
मेरो अन्धकारमा उज्यालो छर्ने सपना बनिदेऊ,
हरेक हारपछि उठ्न सिकाउने तिमी नै आधार बनिदेऊ,
सबैले छोड्दा पनि साथ नछोड्ने तिमी विश्वास बनिदेऊ,
यो भीडभाडको संसारमा एक्लोपन हटाउने 
मेरो जीवनको सबैभन्दा सुन्दर कथा बनिदेऊ।`
    },
    {
      title: "अव्यक्त",
      image: "",
      content: `कुरा मनमै रह्यो बोलीमा भन्नै आएन,
तिमीले खोजे जस्तो म कहिले बन्नै आएन ।
यसरी छुट्नुपर्छ भन्ने त सपनामा पनि सोचेथेन्
पहिले नै थाहा हुन्थ्यो भने, तिमीलाई कहिले रोज्नेथेन ।
गयौ तिमी तारासँग, जुन भई बसे म ।
तिमी गएको दिनदेखि यति त आशु खसेन।
आवाज सुन्न तड्पि राछु,
बोलाउने आट छैन, तिम्रो तस्विर नहेरी निदाएको रात छैन ।
रोज्यौ तिम्ले खुशीलाई मेरा सारा खुशी छिनी, 
चुनेउ तिम्ले ज्योतिलाई अन्धकारमा मलाई थुनि। 
हाँसीखुशी रहनु तिमी जहाँकतै भएनि,
छाडेको छैन मैले अझै तिम्ले छाडी गएनी ।।`
    }
  ];

  if (!isUnlocked) {
    return <PinLock onUnlock={handleUnlock} />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen py-12 md:py-16 px-4 flex flex-col items-center select-none relative"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      <audio ref={audioRef} src="/priya-phool.mp3" loop />

      {/* Top Action Bar */}
      <div className="w-full max-w-4xl flex justify-end px-4 mb-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLock}
          className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-800 hover:border-red-500/30 shadow-sm transition-colors duration-200"
          title="Lock Writing Vault"
        >
          <Lock size={13} className="group-hover:rotate-12 transition-transform" />
          <span>Lock Vault</span>
        </motion.button>
      </div>

      <div className="text-center mb-10 mt-2">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 font-mono tracking-wide h-12 md:h-16 flex items-center justify-center">
          <Typewriter text="Poetry Writer" speed={120} />
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 italic font-serif">
          Some feelings are better written than spoken.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full max-w-4xl px-4 mb-16"
      >
        <div className="p-8 md:p-10 rounded-2xl bg-white dark:bg-dark-800 shadow-xl dark:shadow-none hover-neon-card transition-all duration-500 text-center border border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            About My Writing
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed">
            I write about the emotions we often struggle to express: love, dreams, memories, heartbreak, and the words left unsaid. Each poem is a small piece of my imagination and experience, written to turn feelings into words and moments into stories.
          </p>
        </div>
      </motion.div>

      <div className="w-full max-w-4xl px-4 mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
          My Poetry
        </h2>
        <p className="text-lg md:text-xl font-serif italic text-gray-500 dark:text-gray-400">
          "All my poetry is for my imaginary muse."
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {poems.map((poem, index) => (
          <motion.article 
            key={index} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            whileHover={{ y: -6 }}
            className={`p-8 rounded-2xl bg-white dark:bg-dark-800 shadow-xl dark:shadow-none hover-neon-card transition-shadow duration-300 flex flex-col justify-between h-full relative ${
              poem.pinned ? 'border-2 border-pink-500/40 dark:border-purple-500/40 ring-2 ring-pink-500/20 dark:ring-purple-500/20' : ''
            }`}
          >
            {poem.pinned && (
              <div 
                className="absolute top-4 right-4 p-2 rounded-full bg-pink-500/10 dark:bg-purple-500/20 text-pink-500 dark:text-purple-400 border border-pink-500/30 dark:border-purple-500/40 shadow-sm"
                title="Pinned"
              >
                <Pin size={16} className="rotate-45" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 pr-6 pl-6">
                {poem.title}
              </h2>
              <div className="h-32 overflow-hidden relative mb-6">
                 <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-dark-800 to-transparent z-10" />
                 <pre className="font-serif text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap leading-relaxed text-center">
                  {poem.content}
                 </pre>
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openPoem(poem)}
              className="mt-auto flex items-center justify-center w-full py-3 rounded-lg bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors text-gray-800 dark:text-gray-200 group font-medium"
            >
              <BookOpen className="mr-2 group-hover:scale-110 transition-transform" size={18} />
              Read Poetry
            </motion.button>
          </motion.article>
        ))}
      </div>

      {/* Poetry Modal with AnimatePresence */}
      <AnimatePresence>
        {activePoem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={closePoem}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-dark-900 w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closePoem}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
                aria-label="Close poem"
              >
                <X size={22} />
              </motion.button>
              
              {/* Image or Title Side */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                {activePoem.image ? (
                  <>
                    <img 
                      src={activePoem.image} 
                      alt={activePoem.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex flex-col justify-end p-8">
                       {activePoem.pinned && (
                         <div 
                           className="absolute top-4 left-4 p-2 rounded-full bg-black/40 text-pink-400 border border-pink-500/30 backdrop-blur-md shadow-sm"
                           title="Pinned"
                         >
                           <Pin size={16} className="rotate-45" />
                         </div>
                       )}
                       <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif italic">
                        {activePoem.title}
                       </h2>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-purple-900 to-black flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-dark-700 relative">
                    {activePoem.pinned && (
                      <div 
                        className="absolute top-4 left-4 p-2 rounded-full bg-white/10 text-pink-400 border border-pink-500/30 backdrop-blur-md shadow-sm"
                        title="Pinned"
                      >
                        <Pin size={16} className="rotate-45" />
                      </div>
                    )}
                    <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-center font-serif italic">
                      {activePoem.title}
                    </h2>
                  </div>
                )}
              </div>
              
              {/* Content Side */}
              <div 
                ref={poemContentRef}
                className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 pt-14 md:pt-14 overflow-y-auto max-h-[85vh] custom-scrollbar bg-white/70 dark:bg-dark-900/70 backdrop-blur-md flex flex-col items-center justify-start"
              >
                <div className="w-full py-4 md:py-6 flex justify-center">
                  <pre className="font-serif text-base sm:text-lg md:text-xl text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed max-w-prose text-center font-normal">
                    {activePoem.content}
                  </pre>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Writing;

