import React from 'react';
import { Play, Pause, SkipForward, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { haptics } from '../utils/haptics';
import { CODE4_SPRING } from '../utils/audioMath';
import { getTrackAmbientColors } from '../utils/ambientColor';

export const MiniPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    nextSong,
    toggleFavorite,
    setIsNowPlayingOpen,
    settings,
  } = useMusic();

  const ambientColors = React.useMemo(() => {
    return getTrackAmbientColors(currentSong?.dominantColor, currentSong?.secondaryColor, currentSong?.id);
  }, [currentSong?.id, currentSong?.dominantColor, currentSong?.secondaryColor]);

  if (!currentSong) return null;

  const animationMode = settings.liquidGlass.animationMode || 'snappy';
  const springConfig = CODE4_SPRING;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        key="mini-player-container"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={springConfig}
        className="px-3 pb-2 w-full select-none"
      >
        <div
          onClick={() => {
            haptics.selection();
            setIsNowPlayingOpen(true);
          }}
          className="group relative cursor-pointer overflow-hidden rounded-[24px] liquid-glass-pill transition-all duration-300 active:scale-[0.98] border-t border-white/40 shadow-[0_4px_10px_rgba(0,0,0,0.3),0_14px_34px_-8px_rgba(255,255,255,0.15)]"
          role="button"
          tabIndex={0}
          aria-label={`Open now playing for ${currentSong.title}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsNowPlayingOpen(true);
            }
          }}
        >
          {/* Specular upper rim highlight */}
          <div className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none rounded-full" />

          {/* Ambient subtle silver liquid caustic backlighting */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none transition-all duration-700 group-hover:opacity-45"
            style={{
              background: `radial-gradient(circle at 18% 50%, ${ambientColors.ambientPrimary}, transparent 65%)`,
            }}
          />

          <div className="relative flex items-center justify-between px-3.5 py-2.5 z-10 gap-3">
            {/* Album artwork with smooth change transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSong.id}
                initial={{ opacity: 0.7, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.7, scale: 0.94 }}
                transition={springConfig}
                className="relative shrink-0"
              >
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.album}
                  className={`w-11 h-11 rounded-[14px] object-cover shadow-md transition-all duration-300 ${
                    isPlaying ? 'ring-1 ring-white/70 shadow-[0_0_12px_rgba(255,255,255,0.3)]' : 'ring-1 ring-white/20'
                  }`}
                />
                <div className="absolute inset-0 rounded-[14px] bg-gradient-to-tr from-transparent via-white/10 to-white/35 pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            {/* Track info with SF Pro Typography (17pt title / 13pt metadata) */}
            <div className="flex-1 min-w-0 pr-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSong.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={springConfig}
                >
                  <span className="text-sf-body-17 font-bold text-white truncate block tracking-tight">
                    {currentSong.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sf-caption-13 text-slate-300 truncate block">
                      {currentSong.artist}
                    </span>
                    {isPlaying && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] animate-pulse" />
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Tactical Glass Audio Controls */}
            <div
              className="flex items-center gap-1.5 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Favorite Button */}
              <button
                onClick={() => {
                  haptics.stateChange();
                  toggleFavorite(currentSong.id);
                }}
                className={`p-2 rounded-full transition-transform active:scale-90 cursor-pointer ${
                  currentSong.isFavorite
                    ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label={currentSong.isFavorite ? 'Remove favorite' : 'Add favorite'}
              >
                <Heart
                  size={16}
                  className={currentSong.isFavorite ? 'fill-white text-white' : ''}
                />
              </button>

              {/* Master Play/Pause Liquid Glass Orb */}
              <button
                onClick={() => {
                  haptics.buttonPress();
                  togglePlayPause();
                }}
                className="w-9 h-9 rounded-full bg-white text-slate-900 shadow-[0_2px_10px_rgba(255,255,255,0.4)] flex items-center justify-center active:scale-90 transition-transform cursor-pointer font-bold border border-white/50"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={15} />
                ) : (
                  <Play size={15} className="translate-x-0.5 fill-current" />
                )}
              </button>

              {/* Next Track */}
              <button
                onClick={() => {
                  haptics.selection();
                  nextSong();
                }}
                className="p-2 rounded-full text-slate-300 hover:text-white active:scale-90 transition-transform cursor-pointer"
                aria-label="Next track"
              >
                <SkipForward size={16} />
              </button>
            </div>
          </div>

          {/* Slim Refractive Glass Progress Bar at Bottom */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-slate-400 via-white to-slate-200 shadow-[0_0_8px_rgba(255,255,255,0.7)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
