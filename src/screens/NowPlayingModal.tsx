import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
  Sliders,
  Mic2,
  Music,
  Cast,
  Compass,
  ListMusic,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { formatTime, calculateRemainingTime, CODE4_SPRING } from '../utils/audioMath';
import { WaveformVisualizer } from '../components/WaveformVisualizer';
import { LiquidGlassArtworkFrame } from '../components/LiquidGlass';
import { GlassButton } from '../components/ui/glass-button';
import { LiquidButton } from '../components/ui/liquid-glass-button';
import { haptics } from '../utils/haptics';
import { getTrackAmbientColors } from '../utils/ambientColor';

export const NowPlayingModal: React.FC = () => {
  const {
    currentSong,
    playbackQueue,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isNowPlayingOpen,
    setIsNowPlayingOpen,
    setIsEqualizerOpen,
    setIsQueueOpen,
    setIsBluetoothModalOpen,
    activeLyricsTab,
    setActiveLyricsTab,
    audioOutput,
    setAudioOutput,
    togglePlayPause,
    nextSong,
    previousSong,
    seekTo,
    setVolume,
    toggleMute,
    toggleFavorite,
    toggleShuffle,
    cycleRepeat,
    settings,
  } = useMusic();

  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLyricRef = useRef<HTMLDivElement | null>(null);
  const [showOutputSelector, setShowOutputSelector] = useState(false);

  const springConfig = CODE4_SPRING;

  // Extract restrained ambient color palette from current track's artwork
  const ambientColors = useMemo(() => {
    return getTrackAmbientColors(currentSong?.dominantColor, currentSong?.secondaryColor, currentSong?.id);
  }, [currentSong?.id, currentSong?.dominantColor, currentSong?.secondaryColor]);

  // Auto-scroll lyrics
  useEffect(() => {
    if (activeLyricsTab && activeLyricRef.current && lyricsContainerRef.current) {
      activeLyricRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTime, activeLyricsTab]);

  if (!isNowPlayingOpen || !currentSong) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="now-playing-fullscreen"
        initial={{ y: '100%', opacity: 0.9 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0.9 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.04, bottom: 0.65 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 450) {
            haptics.selection();
            setIsNowPlayingOpen(false);
          }
        }}
        transition={springConfig}
        className="absolute inset-0 z-50 flex flex-col justify-between bg-[#040508] overflow-hidden select-none touch-none"
        role="dialog"
        aria-label="Now Playing View"
      >
        {/* Specular Top Rim */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none z-30" />

        {/* Dynamic Drag-To-Dismiss Handle Pill */}
        <div className="w-full flex justify-center pt-2.5 pb-1 relative z-30 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1.5 rounded-full bg-white/40 hover:bg-white/70 transition-colors shadow-sm" />
        </div>

        {/* Music-Responsive Ambient Listening Mode: Restrained artwork-driven aura smoothly crossfading */}
        <div
          className={`absolute -top-24 -left-16 w-[480px] h-[480px] rounded-full blur-[105px] pointer-events-none transition-all duration-700 ${
            isPlaying ? 'opacity-55 scale-110' : 'opacity-25 scale-100'
          }`}
          style={{
            background: `radial-gradient(circle, ${ambientColors.ambientPrimary} 0%, ${ambientColors.ambientSecondary} 45%, transparent 75%)`,
          }}
        />
        <div
          className={`absolute top-1/4 -right-20 w-[440px] h-[440px] rounded-full blur-[105px] pointer-events-none transition-all duration-700 ${
            isPlaying ? 'opacity-50 scale-110' : 'opacity-20 scale-100'
          }`}
          style={{
            background: `radial-gradient(circle, ${ambientColors.glowRgba} 0%, rgba(203,213,225,0.06) 50%, transparent 80%)`,
          }}
        />

        {/* Top Navigation Bar with Dismiss Button & View Switcher */}
        <div className="relative z-10 px-5 pt-1 pb-2 flex items-center justify-between">
          <GlassButton
            size="icon"
            onClick={() => {
              haptics.selection();
              setIsNowPlayingOpen(false);
            }}
            aria-label="Minimize player"
          >
            <ChevronDown size={20} />
          </GlassButton>

          {/* View Switcher: Track vs Lyrics */}
          <div className="flex items-center gap-1 p-1 rounded-full backdrop-blur-2xl bg-black/40 border border-white/25 shadow-lg">
            <button
              onClick={() => {
                haptics.selection();
                setActiveLyricsTab(false);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                !activeLyricsTab
                  ? 'bg-gradient-to-b from-white/35 via-white/20 to-white/10 text-white shadow-md border border-white/40'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Music size={13} />
              <span>Track</span>
            </button>
            <button
              onClick={() => {
                haptics.selection();
                setActiveLyricsTab(true);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeLyricsTab
                  ? 'bg-gradient-to-b from-white/35 via-white/20 to-white/10 text-white shadow-md border border-white/40'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Mic2 size={13} />
              <span>Lyrics</span>
            </button>
          </div>

          {/* Equalizer Shortcut */}
          <GlassButton
            size="icon"
            onClick={() => {
              haptics.selection();
              setIsEqualizerOpen(true);
            }}
            aria-label="Open Equalizer"
          >
            <Sliders size={18} />
          </GlassButton>
        </div>

        {/* Center Content: Large Album Art OR Live Synchronized Lyrics */}
        <div className="relative flex-1 px-5 flex flex-col items-center justify-center min-h-0 z-10 my-auto">
          {!activeLyricsTab ? (
            <motion.div
              layout
              transition={springConfig}
              className="w-full max-w-[340px] flex flex-col items-center justify-center"
            >
              {/* Gyroscopic Parallax Active indicator badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 text-[11px] text-white font-medium mb-2.5 shadow-md">
                <Compass size={13} className="text-slate-200 animate-spin" style={{ animationDuration: '10s' }} />
                <span className="font-mono">Gyroscopic 3D Motion</span>
              </div>

              <div className="w-full aspect-square flex items-center justify-center">
                <LiquidGlassArtworkFrame
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-full h-full"
                  dominantColor={currentSong.dominantColor}
                  isPlaying={isPlaying}
                />
              </div>
            </motion.div>
          ) : (
            <div
              ref={lyricsContainerRef}
              className="w-full h-full max-h-[380px] overflow-y-auto no-scrollbar py-8 px-2 space-y-5 text-center"
            >
              {currentSong.lyrics.map((line, idx) => {
                const isCurrentLine =
                  currentTime >= line.time &&
                  (idx === currentSong.lyrics.length - 1 || currentTime < currentSong.lyrics[idx + 1].time);

                return (
                  <motion.div
                    key={idx}
                    ref={isCurrentLine ? activeLyricRef : null}
                    onClick={() => {
                      haptics.selection();
                      seekTo(line.time);
                    }}
                    animate={{
                      scale: isCurrentLine ? 1.05 : 0.96,
                      opacity: isCurrentLine ? 1 : 0.45,
                    }}
                    transition={{ duration: 0.22 }}
                    className={`cursor-pointer transition-colors ${
                      isCurrentLine
                        ? 'text-white font-bold text-lg text-shadow-md'
                        : 'text-white/50 text-sm font-medium hover:text-white/70'
                    }`}
                  >
                    {line.text}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Liquid Glass Tray: Titles, Scrubber, Controls (~32px corner radius) */}
        <div className="relative z-10 px-6 pt-4 pb-8 liquid-glass-sheet rounded-t-[32px] space-y-4 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
          {/* Track Meta & Favorite + Waveform */}
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-3">
              <h2
                className="text-sf-display-34 text-white font-bold truncate tracking-tight"
                style={{ fontSize: '34px', lineHeight: '40px', letterSpacing: '-0.022em' }}
              >
                {currentSong.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <p
                  className="text-sf-body-17 text-white/75 truncate"
                  style={{ fontSize: '17px', lineHeight: '22px' }}
                >
                  {currentSong.artist} · {currentSong.album}
                </p>
                <div className="shrink-0 hidden xs:block">
                  <WaveformVisualizer
                    isPlaying={isPlaying}
                    color="#CBD5E1"
                    bars={12}
                    height={18}
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => {
                haptics.stateChange();
                toggleFavorite(currentSong.id);
              }}
              className={`p-3 rounded-full liquid-glass-surface transition-transform cursor-pointer ${
                currentSong.isFavorite
                  ? 'text-white bg-white/20 border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                  : 'text-white/60 hover:text-white'
              }`}
              aria-label={currentSong.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                size={22}
                className={currentSong.isFavorite ? 'fill-white' : ''}
              />
            </motion.button>
          </div>

          {/* Interactive Progress Scrubber Slider with Haptics */}
          <div className="space-y-1.5 pt-1">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={(e) => {
                haptics.seek();
                seekTo(Number(e.target.value));
              }}
              className="w-full h-1.5 rounded-lg bg-white/20 accent-white cursor-pointer"
              aria-label="Seek track position"
            />

            <div className="flex items-center justify-between text-xs font-mono text-white/50">
              <span>{formatTime(currentTime)}</span>
              <span>{calculateRemainingTime(currentTime, duration)}</span>
            </div>
          </div>

          {/* Master Transport Controls */}
          <div className="flex items-center justify-between pt-1">
            {/* Shuffle */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              transition={CODE4_SPRING}
              onClick={() => {
                haptics.selection();
                toggleShuffle();
              }}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isShuffle
                  ? 'bg-white/25 text-white border border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              }`}
              aria-label="Toggle shuffle"
            >
              <Shuffle size={18} />
            </motion.button>

            {/* Previous */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.88 }}
              transition={CODE4_SPRING}
              onClick={() => {
                haptics.selection();
                previousSong();
              }}
              className="w-12 h-12 rounded-full backdrop-blur-xl bg-white/[0.08] border border-white/20 text-white hover:text-white/90 transition-all flex items-center justify-center shadow-md cursor-pointer"
              aria-label="Previous song"
            >
              <SkipBack size={22} className="fill-current" />
            </motion.button>

            {/* Master Play/Pause Liquid Glass Orb */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              transition={CODE4_SPRING}
              onClick={() => {
                haptics.stateChange();
                togglePlayPause();
              }}
              className="relative w-18 h-18 rounded-full bg-gradient-to-b from-white via-slate-100 to-slate-200 text-slate-950 shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_2px_2px_rgba(255,255,255,0.9)] flex items-center justify-center transition-all cursor-pointer font-bold overflow-hidden border border-white/70"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <span className="absolute inset-x-2 top-0 h-[2px] bg-white/90 pointer-events-none rounded-full" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/40 pointer-events-none" />
              {isPlaying ? (
                <Pause size={30} className="fill-current relative z-10" />
              ) : (
                <Play size={30} className="translate-x-0.5 fill-current relative z-10" />
              )}
            </motion.button>

            {/* Next */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.88 }}
              transition={CODE4_SPRING}
              onClick={() => {
                haptics.selection();
                nextSong();
              }}
              className="w-12 h-12 rounded-full backdrop-blur-xl bg-white/[0.08] border border-white/20 text-white hover:text-white/90 transition-all flex items-center justify-center shadow-md cursor-pointer"
              aria-label="Next song"
            >
              <SkipForward size={22} className="fill-current" />
            </motion.button>

            {/* Repeat */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              transition={CODE4_SPRING}
              onClick={() => {
                haptics.selection();
                cycleRepeat();
              }}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                repeatMode !== 'off'
                  ? 'bg-white/25 text-white border border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              }`}
              aria-label="Cycle repeat mode"
            >
              {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
            </motion.button>
          </div>

          {/* Secondary Action Toolbar: Heart, Bluetooth/AirPlay, Equalizer, Queue */}
          <div className="flex items-center justify-around pt-2 px-2 border-t border-white/10">
            <button
              onClick={() => {
                haptics.impact();
                toggleFavorite(currentSong.id);
              }}
              className="p-2 text-white/70 hover:text-white transition-colors"
              title="Favorite"
            >
              <Heart size={18} className={currentSong.isFavorite ? 'fill-white text-white' : ''} />
            </button>

            <button
              onClick={() => {
                haptics.selection();
                setIsBluetoothModalOpen(true);
              }}
              className="p-2 text-white/70 hover:text-white transition-colors"
              title="Bluetooth Connected"
            >
              <Cast size={18} />
            </button>

            <button
              onClick={() => {
                haptics.selection();
                setIsEqualizerOpen(true);
              }}
              className="p-2 text-white/70 hover:text-white transition-colors"
              title="Equalizer"
            >
              <Sliders size={18} />
            </button>

            <button
              onClick={() => {
                haptics.selection();
                setIsQueueOpen(true);
              }}
              className="p-2 text-white/70 hover:text-white transition-colors"
              title="Up Next Queue"
            >
              <ListMusic size={18} />
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => {
                haptics.selection();
                toggleMute();
              }}
              className="text-white/60 hover:text-white cursor-pointer active:scale-90 transition-transform"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                haptics.seek();
                setVolume(Number(e.target.value));
              }}
              className="w-full h-1.5 rounded-lg bg-white/20 accent-white/80 cursor-pointer"
              aria-label="Volume slider"
            />
          </div>

          {/* Up Next Expandable Drawer matching Reference Image */}
          <div
            onClick={() => {
              haptics.selection();
              setIsQueueOpen(true);
            }}
            className="pt-2"
          >
            <div className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-between cursor-pointer transition-all">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/15">
                  <img
                    src={
                      playbackQueue.find((s) => s.id !== currentSong.id)?.coverUrl ||
                      currentSong.coverUrl
                    }
                    alt="Up Next"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Up Next
                    </span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[10px] text-slate-400">
                      {playbackQueue.length} tracks
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-white truncate">
                    {playbackQueue.find((s) => s.id !== currentSong.id)?.title || 'Queue Empty'}
                  </h5>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
                <ChevronDown size={15} className="rotate-180" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
