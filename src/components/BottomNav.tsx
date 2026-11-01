import React, { useState } from 'react';
import { Home, Disc3, ListMusic, Zap, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { ScreenTab } from '../types/music';
import { haptics } from '../utils/haptics';
import { CODE4_SPRING } from '../utils/audioMath';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    settings,
    isPlaying,
    togglePlayPause,
    setIsNowPlayingOpen,
    playPrimePlaylist,
    isPrimePlaybackActive,
  } = useMusic();
  const [dropletRipples, setDropletRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleTabClick = (id: ScreenTab, e: React.MouseEvent<HTMLButtonElement>) => {
    haptics.selection();
    setActiveTab(id);

    if (settings.liquidGlass.dropletRippleEnabled) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = { id: Date.now(), x, y };
      setDropletRipples((prev) => [...prev.slice(-3), ripple]);
      setTimeout(() => {
        setDropletRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 500);
    }
  };

  return (
    <motion.nav
      initial={{ y: 35, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={CODE4_SPRING}
      className="px-4 pb-3 pt-1 w-full select-none"
      role="navigation"
      aria-label="Main Navigation"
    >
      {/* Floating Liquid Glass Dock */}
      <div className="relative flex items-center justify-around py-1.5 px-2 rounded-[28px] liquid-nav-glass overflow-visible shadow-[0_4px_16px_rgba(0,0,0,0.4)] border border-white/20">
        {/* Specular top sheen line */}
        <div className="absolute inset-x-5 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/55 to-transparent pointer-events-none" />

        {/* Tab: Home */}
        <button
          onClick={(e) => handleTabClick('home', e)}
          className={`relative min-h-[44px] min-w-[50px] flex flex-col items-center justify-center py-1 px-2.5 rounded-[18px] transition-colors cursor-pointer z-10 ${
            activeTab === 'home' ? 'text-white' : 'text-white/50 hover:text-white/80'
          }`}
          aria-label="Home"
        >
          {activeTab === 'home' && (
            <motion.div
              layoutId="activeNavIndicator"
              className="absolute inset-0 rounded-[18px] bg-white/10 border border-white/20 pointer-events-none"
              transition={CODE4_SPRING}
            />
          )}
          <Home size={19} />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Home</span>
        </button>

        {/* Tab: Library */}
        <button
          onClick={(e) => handleTabClick('library', e)}
          className={`relative min-h-[44px] min-w-[50px] flex flex-col items-center justify-center py-1 px-2.5 rounded-[18px] transition-colors cursor-pointer z-10 ${
            activeTab === 'library' ? 'text-white' : 'text-white/50 hover:text-white/80'
          }`}
          aria-label="Library"
        >
          {activeTab === 'library' && (
            <motion.div
              layoutId="activeNavIndicator"
              className="absolute inset-0 rounded-[18px] bg-white/10 border border-white/20 pointer-events-none"
              transition={CODE4_SPRING}
            />
          )}
          <Disc3 size={19} />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Library</span>
        </button>

        {/* Central Raised Glossy Silver Play Orb (Matching Reference Design) */}
        <div className="relative -top-3 z-20">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            onDoubleClick={() => {
              setIsNowPlayingOpen(true);
            }}
            className="w-13 h-13 rounded-full bg-gradient-to-b from-white via-slate-100 to-slate-200 text-black flex items-center justify-center shadow-[0_4px_20px_rgba(255,255,255,0.4)] border border-white/80 cursor-pointer active:scale-95 transition-transform"
            aria-label="Play / Pause"
            title="Double-tap to open Now Playing"
          >
            {isPlaying ? (
              <Pause size={20} className="fill-current text-black" />
            ) : (
              <Play size={20} className="translate-x-0.5 fill-current text-black" />
            )}
          </motion.button>
        </div>

        {/* Tab: Playlists */}
        <button
          onClick={(e) => handleTabClick('playlists', e)}
          className={`relative min-h-[44px] min-w-[50px] flex flex-col items-center justify-center py-1 px-2.5 rounded-[18px] transition-colors cursor-pointer z-10 ${
            activeTab === 'playlists' ? 'text-white' : 'text-white/50 hover:text-white/80'
          }`}
          aria-label="Playlists"
        >
          {activeTab === 'playlists' && (
            <motion.div
              layoutId="activeNavIndicator"
              className="absolute inset-0 rounded-[18px] bg-white/10 border border-white/20 pointer-events-none"
              transition={CODE4_SPRING}
            />
          )}
          <ListMusic size={19} />
          <span className="text-[10px] font-medium tracking-tight mt-0.5">Playlists</span>
        </button>

        {/* Tab: Prime Mode (Lightning Bolt Instant Playback) */}
        <button
          onClick={(e) => {
            haptics.impact();
            playPrimePlaylist();
            if (settings.liquidGlass.dropletRippleEnabled) {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const ripple = { id: Date.now(), x, y };
              setDropletRipples((prev) => [...prev.slice(-3), ripple]);
              setTimeout(() => {
                setDropletRipples((prev) => prev.filter((r) => r.id !== ripple.id));
              }, 500);
            }
          }}
          className={`relative min-h-[44px] min-w-[50px] flex flex-col items-center justify-center py-1 px-2.5 rounded-[18px] transition-all cursor-pointer z-10 ${
            isPrimePlaybackActive && isPlaying
              ? 'text-white'
              : 'text-white/60 hover:text-white'
          }`}
          aria-label="Prime Mode Instant Playback"
          title="Instant Prime Playlist Playback"
        >
          {isPrimePlaybackActive && isPlaying && (
            <motion.div
              layoutId="primeNavGlow"
              className="absolute inset-0 rounded-[18px] bg-white/15 border border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.35)] pointer-events-none"
              transition={CODE4_SPRING}
            />
          )}
          <Zap
            size={19}
            className={`transition-all duration-300 ${
              isPrimePlaybackActive && isPlaying
                ? 'fill-white text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] scale-110'
                : 'text-white/70'
            }`}
          />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Prime</span>
        </button>
      </div>
    </motion.nav>
  );
};
