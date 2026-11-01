import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, GripVertical, Trash2, Play, Pause, Music } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { haptics } from '../utils/haptics';
import { CODE4_SPRING } from '../utils/audioMath';

export const QueueModal: React.FC = () => {
  const {
    isQueueOpen,
    setIsQueueOpen,
    currentSong,
    playbackQueue,
    isPlaying,
    playSong,
    togglePlayPause,
    clearUpcomingQueue,
    reorderQueue,
  } = useMusic();

  if (!isQueueOpen) return null;

  const currentIdx = currentSong ? playbackQueue.findIndex((s) => s.id === currentSong.id) : 0;
  const activePosition = currentIdx >= 0 ? currentIdx + 1 : 1;

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newQueue = [...playbackQueue];
    const temp = newQueue[index];
    newQueue[index] = newQueue[index - 1];
    newQueue[index - 1] = temp;
    reorderQueue(newQueue);
  };

  const handleMoveDown = (index: number) => {
    if (index >= playbackQueue.length - 1) return;
    const newQueue = [...playbackQueue];
    const temp = newQueue[index];
    newQueue[index] = newQueue[index + 1];
    newQueue[index + 1] = temp;
    reorderQueue(newQueue);
  };

  const handleRemoveTrack = (index: number) => {
    haptics.selection();
    const newQueue = playbackQueue.filter((_, i) => i !== index);
    reorderQueue(newQueue);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={CODE4_SPRING}
        className="absolute inset-0 z-40 bg-[#050505]/95 backdrop-blur-3xl flex flex-col overflow-hidden select-none"
      >
        {/* Specular ambient top glow */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-4 border-b border-white/10">
          <button
            onClick={() => {
              haptics.selection();
              setIsQueueOpen(false);
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
            aria-label="Close Queue"
          >
            <ChevronDown size={20} />
          </button>

          <div className="text-center">
            <h2 className="text-base font-bold text-white tracking-tight">Queue</h2>
            <span className="text-xs text-slate-400 font-medium">
              Now Playing • {activePosition}/{playbackQueue.length || 1}
            </span>
          </div>

          <button
            onClick={() => {
              haptics.selection();
              clearUpcomingQueue();
            }}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white active:scale-95 transition-all cursor-pointer"
            title="Clear Queue"
            aria-label="Clear Queue"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4">
          {/* Currently Playing Card */}
          {currentSong && (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                Currently Playing
              </span>
              <div className="relative p-3 rounded-2xl bg-gradient-to-r from-white/15 via-white/10 to-transparent border border-white/30 shadow-[0_4px_20px_rgba(255,255,255,0.08)] flex items-center gap-3.5">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/25">
                  <img
                    src={currentSong.coverUrl}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayPause();
                    }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center text-white"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5 fill-current" />}
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate tracking-tight">
                    {currentSong.title}
                  </h4>
                  <p className="text-xs text-slate-300 truncate mt-0.5 font-medium">
                    {currentSong.artist}
                  </p>
                </div>

                {/* Live Silver Equalizer Bars */}
                <div className="flex items-end gap-1 h-5 px-2">
                  <motion.div
                    animate={isPlaying ? { height: ['30%', '90%', '40%', '80%'] } : { height: '30%' }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                    className="w-1 bg-white rounded-full"
                  />
                  <motion.div
                    animate={isPlaying ? { height: ['70%', '30%', '100%', '50%'] } : { height: '60%' }}
                    transition={{ repeat: Infinity, duration: 0.65, ease: 'easeInOut' }}
                    className="w-1 bg-slate-300 rounded-full"
                  />
                  <motion.div
                    animate={isPlaying ? { height: ['40%', '100%', '60%', '20%'] } : { height: '40%' }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
                    className="w-1 bg-white rounded-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Up Next List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Up Next ({Math.max(0, playbackQueue.length - 1)})
              </span>
              <span className="text-[10px] text-slate-500">
                Tap track to play
              </span>
            </div>

            <div className="space-y-1.5">
              {playbackQueue.map((song, index) => {
                const isCurrent = currentSong?.id === song.id;

                return (
                  <motion.div
                    key={`${song.id}-${index}`}
                    layout
                    transition={CODE4_SPRING}
                    onClick={() => playSong(song)}
                    className={`group relative flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-white/10 border border-white/20'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] border border-white/5'
                    }`}
                  >
                    <span className="text-xs font-mono font-medium text-slate-500 w-5 text-center shrink-0">
                      {index + 1}
                    </span>

                    <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-white/10 relative">
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                      {isCurrent && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Music size={14} className="text-white animate-pulse" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5
                        className={`text-xs font-semibold truncate ${
                          isCurrent ? 'text-white' : 'text-slate-200'
                        }`}
                      >
                        {song.title}
                      </h5>
                      <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                        {song.artist}
                      </span>
                    </div>

                    {/* Reorder and Delete Actions */}
                    <div className="flex items-center gap-1">
                      <div className="flex flex-col gap-0.5 opacity-60 group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveUp(index);
                          }}
                          disabled={index === 0}
                          className="text-[10px] text-slate-400 hover:text-white disabled:opacity-20 px-1"
                          title="Move up"
                        >
                          ▲
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveDown(index);
                          }}
                          disabled={index === playbackQueue.length - 1}
                          className="text-[10px] text-slate-400 hover:text-white disabled:opacity-20 px-1"
                          title="Move down"
                        >
                          ▼
                        </button>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTrack(index);
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 opacity-50 group-hover:opacity-100 transition-opacity"
                        title="Remove track"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="text-slate-600 px-1">
                        <GripVertical size={16} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Clear Queue Button */}
        <div className="p-4 border-t border-white/10 bg-[#050505]/80 backdrop-blur-xl">
          <button
            onClick={() => {
              haptics.impact();
              clearUpcomingQueue();
            }}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-white/10 via-white/15 to-white/10 hover:from-white/20 hover:to-white/20 border border-white/25 text-white text-xs font-bold tracking-wide uppercase shadow-lg active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Trash2 size={15} />
            <span>Clear Queue</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
