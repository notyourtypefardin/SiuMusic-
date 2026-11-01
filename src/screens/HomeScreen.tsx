import React, { useRef } from 'react';
import {
  Play,
  Pause,
  FolderOpen,
  Sparkles,
  Sliders,
  ListMusic,
  Disc,
  Users,
  Search,
  Bell,
  Heart,
  Clock,
  Crown,
  Settings2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { Song } from '../types/music';
import {
  formatTime,
  CODE4_SPRING,
  SCROLL_CONTAINER_VARIANTS,
  SCROLL_ITEM_VARIANTS,
} from '../utils/audioMath';
import { LiquidGlassCard } from '../components/LiquidGlass';
import { haptics } from '../utils/haptics';

export const HomeScreen: React.FC = () => {
  const {
    songs,
    currentSong,
    isPlaying,
    playSong,
    togglePlayPause,
    setActiveTab,
    setIsEqualizerOpen,
    setIsTintCustomizerOpen,
    setIsPrimeModalOpen,
    setIsNotificationPreviewOpen,
    settings,
    importDeviceFiles,
  } = useMusic();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const count = await importDeviceFiles(e.target.files);
      if (count > 0) haptics.stateChange();
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const top = scrollContainerRef.current.scrollTop;
      if (top % 180 < 12) {
        haptics.scrollSnap();
      }
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto smooth-scroll-container no-scrollbar pb-36 px-4 pt-2 space-y-5 select-none"
    >
      {/* Hidden File Input for Device Audio Import */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Top Header matching Reference: Brand + Search Bar + Notification + Profile */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={CODE4_SPRING}
        className="space-y-3 pt-1"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white via-slate-200 to-slate-400 p-0.5 shadow-md flex items-center justify-center">
              <span className="text-black font-black text-xs">S</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight font-display">
              SiuuMusic
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Settings Gear */}
            <button
              onClick={() => {
                haptics.selection();
                setActiveTab('settings');
              }}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
              title="Settings"
              aria-label="Settings"
            >
              <Settings2 size={16} />
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => {
                haptics.selection();
                setIsNotificationPreviewOpen(true);
              }}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
              title="Notification Shade Preview"
              aria-label="Notification Preview"
            >
              <Bell size={16} />
            </button>

            {/* Profile Avatar "Fardin - Premium" */}
            <button
              onClick={() => {
                haptics.selection();
                setIsPrimeModalOpen(true);
              }}
              className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white/40 shadow-lg active:scale-95 transition-transform cursor-pointer"
              title="Fardin • Premium Profile (Open Prime Mode)"
              aria-label="User Profile"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Fardin"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white" />
            </button>
          </div>
        </div>

        {/* Global Search Input Bar */}
        <div
          onClick={() => {
            haptics.selection();
            setActiveTab('search');
          }}
          className="relative w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 text-slate-400 cursor-pointer transition-all"
        >
          <Search size={16} className="text-slate-400" />
          <span className="text-xs font-medium">Search songs, artists, albums...</span>
        </div>
      </motion.div>

      {/* Featured Welcome Card: "Good Evening Fardin - Let the music take you higher" */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={CODE4_SPRING}
      >
        <div className="relative p-5 rounded-3xl bg-gradient-to-r from-white/15 via-white/[0.08] to-white/[0.03] border border-white/25 overflow-hidden shadow-2xl">
          {/* Specular sheen on top */}
          <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-300">
                {getGreeting()}
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight font-display">
                Fardin
              </h2>
              <p className="text-xs text-slate-400 max-w-[200px] leading-tight pt-0.5">
                Let the music take you higher
              </p>
            </div>

            {/* Glossy White/Silver Circular Play Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (songs.length > 0) {
                  if (isPlaying) {
                    togglePlayPause();
                  } else {
                    playSong(currentSong || songs[0]);
                  }
                }
              }}
              className="w-13 h-13 rounded-full bg-white text-black flex items-center justify-center shadow-[0_4px_25px_rgba(255,255,255,0.45)] border border-white/80 active:scale-95 transition-transform cursor-pointer"
              aria-label="Play Music"
            >
              {isPlaying ? (
                <Pause size={20} className="fill-current text-black" />
              ) : (
                <Play size={20} className="translate-x-0.5 fill-current text-black" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 2 Stat Tiles: Liked Songs (247 songs) & Recently Played (32 songs) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={CODE4_SPRING}
        className="grid grid-cols-2 gap-3"
      >
        <div
          onClick={() => {
            haptics.selection();
            setActiveTab('library');
          }}
          className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center gap-3 cursor-pointer transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/15 shrink-0">
            <Heart size={18} className="fill-current text-white" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">Liked Songs</h4>
            <span className="text-[11px] text-slate-400 font-mono">247 songs</span>
          </div>
        </div>

        <div
          onClick={() => {
            haptics.selection();
            setActiveTab('library');
          }}
          className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center gap-3 cursor-pointer transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/15 shrink-0">
            <Clock size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">Recently Played</h4>
            <span className="text-[11px] text-slate-400 font-mono">32 songs</span>
          </div>
        </div>
      </motion.div>

      {/* 4 Quick Navigation Tiles: Playlists, Albums, Artists, Folders */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={CODE4_SPRING}
        className="grid grid-cols-4 gap-2.5"
      >
        <button
          onClick={() => {
            haptics.selection();
            setActiveTab('playlists');
          }}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-center transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white mb-1.5 border border-white/15">
            <ListMusic size={17} />
          </div>
          <span className="text-[11px] font-semibold text-white tracking-tight">Playlists</span>
        </button>

        <button
          onClick={() => {
            haptics.selection();
            setActiveTab('albums');
          }}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-center transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white mb-1.5 border border-white/15">
            <Disc size={17} />
          </div>
          <span className="text-[11px] font-semibold text-white tracking-tight">Albums</span>
        </button>

        <button
          onClick={() => {
            haptics.selection();
            setActiveTab('artists');
          }}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-center transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white mb-1.5 border border-white/15">
            <Users size={17} />
          </div>
          <span className="text-[11px] font-semibold text-white tracking-tight">Artists</span>
        </button>

        <button
          onClick={() => {
            haptics.selection();
            fileInputRef.current?.click();
          }}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-center transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white mb-1.5 border border-white/15">
            <FolderOpen size={17} />
          </div>
          <span className="text-[11px] font-semibold text-white tracking-tight">Folders</span>
        </button>
      </motion.div>

      {/* Section: Recently Played (Horizontal Scroll matching reference) */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={CODE4_SPRING}
        className="space-y-3"
      >
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-white tracking-tight">Recently Played</h3>
          <button
            onClick={() => {
              haptics.selection();
              setActiveTab('library');
            }}
            className="text-xs text-slate-400 hover:text-white font-medium"
          >
            See all
          </button>
        </div>

        <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-1">
          {songs.slice(0, 5).map((song) => {
            const isCurrent = currentSong?.id === song.id;

            return (
              <div
                key={song.id}
                onClick={() => playSong(song)}
                className="shrink-0 w-32 flex flex-col cursor-pointer group"
              >
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-white/15 group-hover:border-white/40 shadow-lg mb-2">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isCurrent && isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                        <Pause size={14} />
                      </div>
                    </div>
                  )}
                </div>
                <h4 className="text-xs font-bold text-white truncate">{song.album}</h4>
                <span className="text-[11px] text-slate-400 truncate">{song.artist}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Pro Tools Bar: Equalizer & Customizer */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <button
          onClick={() => {
            haptics.selection();
            setIsEqualizerOpen(true);
          }}
          className="flex-1 py-3 px-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 flex items-center justify-center gap-2 text-xs font-bold text-white active:scale-95 transition-all"
        >
          <Sliders size={15} />
          <span>5-Band Equalizer</span>
        </button>

        <button
          onClick={() => {
            haptics.selection();
            setIsTintCustomizerOpen(true);
          }}
          className="flex-1 py-3 px-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 flex items-center justify-center gap-2 text-xs font-bold text-white active:scale-95 transition-all"
        >
          <Sparkles size={15} />
          <span>Liquid Glass FX</span>
        </button>
      </div>
    </div>
  );
};
