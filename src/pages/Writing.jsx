import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X, BookOpen } from 'lucide-react';

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
  const [activePoem, setActivePoem] = useState(null);
  const audioRef = React.useRef(null);

  useEffect(() => {
    // Attempt to play music when component mounts
    if (audioRef.current) {
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
  }, []);

  const poems = [
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

  return (
    <div 
      className="min-h-screen py-16 px-4 flex flex-col items-center select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      <audio ref={audioRef} src="/priya-phool.mp3" loop />


      <div className="text-center mb-10 mt-8">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 font-mono tracking-wide h-20 md:h-32 flex items-center justify-center">
          <Typewriter text="Poetry Writer" speed={120} />
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 italic font-serif">
          Some feelings are better written than spoken.
        </p>
      </div>

      <div className="w-full max-w-4xl px-4 mb-16">
        <div className="p-8 md:p-10 rounded-2xl bg-white dark:bg-dark-800 shadow-xl dark:shadow-none hover-neon-card transition-all duration-500 text-center border border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            About My Writing
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed">
            I write about the emotions we often struggle to express: love, dreams, memories, heartbreak, and the words left unsaid. Each poem is a small piece of my imagination and experience, written to turn feelings into words and moments into stories.
          </p>
        </div>
      </div>

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
          <article 
            key={index} 
            className="p-8 rounded-2xl bg-white dark:bg-dark-800 shadow-xl dark:shadow-none hover-neon-card transition-all duration-500 flex flex-col justify-between h-full"
          >
            <div>
              <h2 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
                {poem.title}
              </h2>
              <div className="h-32 overflow-hidden relative mb-6">
                 <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-dark-800 to-transparent z-10" />
                 <pre className="font-serif text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap leading-relaxed text-center">
                  {poem.content}
                 </pre>
              </div>
            </div>
            
            <button 
              onClick={() => setActivePoem(poem)}
              className="mt-auto flex items-center justify-center w-full py-3 rounded-lg bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors text-gray-800 dark:text-gray-200 group"
            >
              <BookOpen className="mr-2 group-hover:scale-110 transition-transform" size={18} />
              Read Poetry
            </button>
          </article>
        ))}
      </div>

      {/* Poetry Modal */}
      {activePoem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div 
            className="bg-white dark:bg-dark-900 w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActivePoem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all"
            >
              <X size={24} />
            </button>
            
            {/* Image or Title Side */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
              {activePoem.image ? (
                <>
                  <img 
                    src={activePoem.image} 
                    alt={activePoem.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                     <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif italic">
                      {activePoem.title}
                     </h2>
                  </div>
                </>
              ) : (
                <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-purple-900 to-black flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-dark-700">
                  <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-center font-serif italic">
                    {activePoem.title}
                  </h2>
                </div>
              )}
            </div>
            
            {/* Content Side */}
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-[90vh] custom-scrollbar bg-white/50 dark:bg-dark-900/50 backdrop-blur-md">
              <div className="flex justify-center h-full items-center min-h-[50vh]">
                <pre className="font-serif text-lg md:text-xl text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed max-w-prose text-center">
                  {activePoem.content}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Writing;

