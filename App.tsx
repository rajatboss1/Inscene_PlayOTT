
import React, { useState, useEffect, useRef } from 'react';
import Logo from './components/Logo.tsx';
import ChatPanel from './components/ChatPanel.tsx';

/**
 * Utility to optimize images and fix CORS/Caching issues via Weserv proxy.
 */
const getSmartImageUrl = (url: string, v: string = '1', w: number = 800, h: number = 800) => {
  if (!url) return '';
  const cacheBuster = `${v}_${Date.now()}`;
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${w}&h=${h}&fit=cover&output=jpg&t=${cacheBuster}`;
};

/**
 * PLIVETV - PREMIUM VERTICAL OTT
 */
const HEART_BEATS_DATA = {
  id: 'heart-beats',
  title: 'Heart Beats',
  tagline: 'Your choices define your rhythm.',
  thumbnail: getSmartImageUrl("https://lh3.googleusercontent.com/d/11oMmLSZFpeZsoGxw2uV_bPEWJB4-fvDx", "thumb_v2", 1000, 1000),
  avatars: {
    Priyank: getSmartImageUrl("https://github.com/rajatboss1/plivetv/releases/download/Video/PriyankDP.jpg", "priyank_fix_v5", 400, 400),
    Arzoo: getSmartImageUrl("https://github.com/rajatboss1/plivetv/releases/download/Video/ArzooDP.jpg", "arzoo_fix_v5", 400, 400)
  },
  episodes: [
    { 
      id: 1, 
      label: "Episode 01",
      url: "https://github.com/rajatboss1/plivetv/releases/download/Video/Heart.Beats.Episode.2.mp4",
      triggers: [
        { char: 'Priyank', label: '⚡ Back Priyank up', hook: "Did you see that? I think she's onto us. What should I say to her?" },
        { char: 'Arzoo', label: '🤫 Ask Arzoo the truth', hook: "I have a feeling something is about to go wrong... do you trust him?" }
      ]
    },
    { 
      id: 2, 
      label: "Episode 02",
      url: "https://github.com/rajatboss1/plivetv/releases/download/Video/Heart.Beats.Episode.1.mp4",
      triggers: [
        { char: 'Priyank', label: '🎬 Decide Priyank\'s move', hook: "The way he looked at her just now... I don't know if I can handle this. What's my next move?" },
        { char: 'Arzoo', label: '💓 Tell Arzoo how you feel', hook: "I've been holding back so much. Do you think he even realizes what he's doing?" }
      ]
    },
    { 
      id: 3, 
      label: "Episode 03",
      url: "https://github.com/rajatboss1/plivetv/releases/download/Video/Heart.Beats.Episode.3.mp4",
      triggers: [
        { char: 'Priyank', label: '⚡ Help Priyank choose', hook: "It's getting intense. Who do you think is hiding the bigger secret here?" },
        { char: 'Arzoo', label: '🤫 Question Arzoo', hook: "The mystery is deepening. Can we really trust anyone in this room?" }
      ]
    },
    { 
      id: 4, 
      label: "Episode 04",
      url: "https://github.com/rajatboss1/plivetv/releases/download/Video/Heart.Beats.Episode.4.mp4",
      triggers: [
        { char: 'Priyank', label: '🎬 End the story', hook: "This is it. The moment of truth. What would you do in my place?" },
        { char: 'Arzoo', label: '💓 Comfort Arzoo', hook: "It's all coming to an end. Was any of it even real?" }
      ]
    }
  ]
};

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ReelItem: React.FC<{ 
  episode: typeof HEART_BEATS_DATA.episodes[0], 
  isActive: boolean,
  isMuted: boolean,
  toggleMute: () => void,
  onEnterStory: (char: 'Priyank' | 'Arzoo', hook: string) => void
}> = ({ episode, isActive, isMuted, toggleMute, onEnterStory }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [showPlayIcon, setShowPlayIcon] = useState<'play' | 'pause' | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.warn("Autoplay blocked, waiting for interaction");
        });
      }
    } else {
      video.pause();
    }
  }, [isActive]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      setCurrentTime(cur);
      setDuration(dur);
      setProgress((cur / dur) * 100 || 0);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        triggerIcon('play');
      } else {
        videoRef.current.pause();
        triggerIcon('pause');
      }
    }
  };

  const triggerIcon = (type: 'play' | 'pause') => {
    setShowPlayIcon(type);
    setTimeout(() => setShowPlayIcon(null), 800);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (videoRef.current) {
      const newTime = (newProgress / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(newProgress);
    }
  };

  return (
    <div className="reel-item bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={episode.url}
        className="w-full h-full object-cover cursor-pointer"
        loop
        playsInline
        muted={isMuted}
        onClick={togglePlay}
        onLoadStart={() => setLoading(true)}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onCanPlay={() => setLoading(false)}
        onTimeUpdate={handleTimeUpdate}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-12 h-12 border-2 border-white/5 border-t-white/80 rounded-full animate-spin" />
        </div>
      )}

      {showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
           <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center animate-ping-once">
              {showPlayIcon === 'play' ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-white ml-1"><path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653z" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-white"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75zm7.5 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>
              )}
           </div>
        </div>
      )}

      {/* Reverted persona buttons back to 'perfect' smaller size */}
      <div className="absolute bottom-32 left-0 right-0 p-6 md:p-8 flex flex-col gap-5 md:gap-6 pointer-events-none z-[60]">
        <div className="flex items-center gap-3">
          <div className="h-[2px] w-8 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
          <span className="text-xs md:text-sm font-black tracking-[0.3em] text-white/90 uppercase drop-shadow-lg">{episode.label}</span>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3 pointer-events-auto">
          {episode.triggers.map((trigger, idx) => (
            <button 
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                onEnterStory(trigger.char as 'Priyank' | 'Arzoo', trigger.hook);
              }}
              className={`group flex items-center gap-3 px-3 py-2 md:px-4 md:py-2.5 rounded-full backdrop-blur-[30px] border active:scale-95 transition-all shadow-2xl animate-slide-up hover:brightness-125`}
              style={{ 
                animationDelay: `${idx * 150}ms`,
                backgroundColor: trigger.char === 'Priyank' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(168, 85, 247, 0.4)',
                borderColor: trigger.char === 'Priyank' ? 'rgba(59, 130, 246, 0.6)' : 'rgba(168, 85, 247, 0.6)',
                boxShadow: trigger.char === 'Priyank' ? '0 10px 40px -10px rgba(59, 130, 246, 0.7)' : '0 10px 40px -10px rgba(168, 85, 247, 0.7)'
              }}
            >
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border-2 border-white/40 flex items-center justify-center text-[10px] font-black ${trigger.char === 'Priyank' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                {!imgErrors[trigger.char] ? (
                  <img 
                    src={HEART_BEATS_DATA.avatars[trigger.char as 'Priyank' | 'Arzoo']} 
                    alt={trigger.char} 
                    className="w-full h-full object-cover"
                    onError={() => setImgErrors(prev => ({...prev, [trigger.char]: true}))}
                  />
                ) : (
                  <span className="text-white">{trigger.char[0]}</span>
                )}
              </div>
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] text-white drop-shadow-md">
                {trigger.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute right-4 md:right-6 bottom-64 md:bottom-56 flex flex-col gap-4 items-center z-[70]">
        <button 
          onClick={(e) => { e.stopPropagation(); toggleMute(); }} 
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center active:scale-90 transition-all pointer-events-auto"
        >
          {isMuted ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.535 7.465a.75.75 0 0 1 1.06 0L22.12 10l-2.525 2.525a.75.75 0 1 1-1.06-1.06L20 10l-1.465-1.465a.75.75 0 0 1 0-1.06Z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06 4.25 4.25 0 0 1 0 6.01.75.75 0 0 0 1.06 1.06 5.75 5.75 0 0 0 0-8.13ZM21.03 5.97a.75.75 0 0 0-1.06 1.06 8.5 8.5 0 0 1 0 12.02.75.75 0 1 0 1.06 1.06 10 10 0 0 0 0-14.14Z" /></svg>
          )}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[80] bg-gradient-to-t from-black/95 to-transparent pt-12 px-6 pb-6 group/seekbar pointer-events-none">
        <div className="flex justify-between items-center mb-2 px-1">
           <div className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10">
             <span className="text-[10px] font-black tracking-widest text-white/90 tabular-nums">
               {formatTime(currentTime)} <span className="text-white/30 mx-1">/</span> {formatTime(duration)}
             </span>
           </div>
        </div>
        <div className="relative h-2.5 w-full flex items-center transition-all cursor-pointer pointer-events-auto">
           <input 
             type="range"
             min="0"
             max="100"
             step="0.1"
             value={progress}
             onChange={handleSeek}
             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
           />
           <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden transition-all group-hover/seekbar:h-2">
              <div 
                className="h-full bg-blue-500 transition-all duration-75 ease-linear shadow-[0_0_15px_#3b82f6]" 
                style={{ width: `${progress}%` }} 
              />
           </div>
        </div>
      </div>

      <style>{`
        @keyframes pingOnce {
          0% { transform: scale(0.5); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping-once {
          animation: pingOnce 0.6s cubic-bezier(0, 0, 0.2, 1) forwards;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 24px;
          width: 24px;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'feed'>('home');
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [chatData, setChatData] = useState<{char: 'Priyank' | 'Arzoo', hook: string} | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view === 'feed') {
      document.body.style.overflow = 'hidden';
      
      const observerOptions = {
        root: null,
        threshold: 0.7 
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setActiveIdx(index);
          }
        });
      }, observerOptions);

      const timeoutId = setTimeout(() => {
        const items = document.querySelectorAll('.reel-item-wrapper');
        items.forEach((item) => observer.observe(item));
      }, 150);

      return () => {
        clearTimeout(timeoutId);
        observer.disconnect();
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [view]);

  return (
    <div className="flex flex-col min-h-[100dvh] h-[100dvh] text-white font-sans selection:bg-blue-400/30 overflow-hidden">
      
      <header className={`fixed top-0 left-0 right-0 z-[1000] px-6 md:px-10 py-6 md:py-8 flex justify-between items-center transition-all duration-700 ${view === 'feed' ? 'bg-gradient-to-b from-black/80 to-transparent' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3 md:gap-4 cursor-pointer group active:scale-95 transition-transform" onClick={() => { setView('home'); setChatData(null); }}>
          <Logo size={36} isPulsing={view === 'home'} />
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black italic tracking-tighter uppercase leading-none">plive<span className="text-blue-400">tv</span></span>
          </div>
        </div>
        
        {view === 'feed' && (
          <button 
            onClick={() => { setView('home'); setChatData(null); }}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center active:scale-90 transition-all hover:bg-white/20 group shadow-2xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </header>

      {view === 'home' && (
        <main className="flex-1 flex flex-col items-center justify-center p-6 pt-28 md:pt-36 animate-slide-up relative min-h-[100dvh]">
          <div className="w-full max-w-lg">
             <div 
               className="relative group cursor-pointer aspect-square rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
               onClick={() => setView('feed')}
             >
                <img src={HEART_BEATS_DATA.thumbnail} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="Heart Beats" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-2xl border border-white/30 flex items-center justify-center shadow-2xl animate-pulse-slow">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 md:w-12 md:h-12 ml-1 text-white"><path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653z" /></svg>
                   </div>
                </div>
                <div className="absolute bottom-8 md:bottom-12 left-8 md:left-12 right-8 md:right-12 flex flex-col items-start pointer-events-none group-hover:opacity-0 transition-opacity">
                   <div className="flex items-center gap-2 mb-3">
                     <div className="h-1 w-8 bg-purple-500 rounded-full" />
                     <span className="text-[10px] md:text-[11px] font-black tracking-widest text-white/70 uppercase">Interactive</span>
                   </div>
                   <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none mb-3">{HEART_BEATS_DATA.title}</h2>
                   <p className="text-white/40 text-[10px] md:text-[11px] font-bold tracking-[0.5em] uppercase">{HEART_BEATS_DATA.tagline}</p>
                </div>
             </div>
          </div>
        </main>
      )}

      {view === 'feed' && (
        <div 
          ref={feedRef}
          className="reel-snap-container fixed inset-0 z-[500] hide-scrollbar"
        >
          {HEART_BEATS_DATA.episodes.map((ep, index) => (
            <div key={ep.id} data-index={index} className="reel-item-wrapper reel-item">
              <ReelItem 
                episode={ep} 
                isActive={activeIdx === index} 
                isMuted={isMuted} 
                toggleMute={() => setIsMuted(!isMuted)} 
                onEnterStory={(char, hook) => setChatData({char, hook})}
              />
            </div>
          ))}
        </div>
      )}

      {chatData && (
        <ChatPanel 
          character={chatData.char} 
          episodeLabel={HEART_BEATS_DATA.episodes[activeIdx].label}
          initialHook={chatData.hook}
          avatar={HEART_BEATS_DATA.avatars[chatData.char]}
          onClose={() => setChatData(null)}
        />
      )}
    </div>
  );
};

export default App;
