import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, Zap, Music2, CheckSquare, Square, Trash2 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Song } from '../types/music';
import { formatTime, CODE4_SPRING } from '../utils/audioMath';
import { haptics } from '../utils/haptics';
import { LiquidGlassCard, LiquidGlassButton } from './LiquidGlass';

export const PrimeSongPickerModal: React.FC = () => {
  const {
    songs,
    primePlaylistSongIds,
    isPrimeSongPickerOpen,
    setIsPrimeSongPickerOpen,
    setPrimePlaylistSongs,
    playPrimePlaylist,
  } = useMusic();

  const [selectedIds, setSelectedIds] = useState<string[]>(() => primePlaylistSongIds);
  const [filterQuery, setFilterQuery] = useState('');

  // Keep local selection in sync whenever modal opens
  React.useEffect(() => {
    if (isPrimeSongPickerOpen) {
      setSelectedIds(primePlaylistSongIds);
      setFilterQuery('');
    }
  }, [isPrimeSongPickerOpen, primePlaylistSongIds]);

  const filteredSongs = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.album.toLowerCase().includes(q) ||
        s.genre.toLowerCase().includes(q)
    );
  }, [songs, filterQuery]);

  if (!isPrimeSongPickerOpen) return null;

  const toggleSelect = (id: string) => {
    haptics.selection();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    haptics.impact();
    const visibleIds = filteredSongs.map((s) => s.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleClearAll = () => {
    haptics.error();
    setSelectedIds([]);
  };

  const handleSaveAndClose = (startPlaybackAfter = false) => {
    haptics.impact();
    // Deduplicate
    const finalIds = Array.from(new Set(selectedIds));
    setPrimePlaylistSongs(finalIds);
    setIsPrimeSongPickerOpen(false);

    if (startPlaybackAfter && finalIds.length > 0) {
      setTimeout(() => {
        playPrimePlaylist();
      }, 150);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#030406]/90 backdrop-blur-2xl flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 select-none"
      >
        <motion.div
          initial={{ y: 50, scale: 0.96 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 50, scale: 0.96 }}
          transition={CODE4_SPRING}
          className="w-full max-w-lg h-[90vh] sm:h-[82vh] bg-gradient-to-b from-[#111317] via-[#090b0e] to-[#040507] rounded-t-[32px] sm:rounded-[32px] border border-white/20 shadow-2xl flex flex-col overflow-hidden relative"
        >
          {/* Specular top rim sheen */}
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />

          {/* Modal Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,255,255,0.25)]">
                  <Zap size={18} className="fill-white text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    Prime Mode Playlist
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/20">
                      VIP
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Select songs for instant 1-tap playback from the lightning dock
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  haptics.selection();
                  setIsPrimeSongPickerOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search and Quick Filters */}
            <div className="mt-3.5 space-y-2.5">
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filter songs by title, artist, album..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all"
                />
                {filterQuery && (
                  <button
                    onClick={() => setFilterQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status & Quick Action Bar */}
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>
                    <strong className="text-white">{selectedIds.length}</strong> selected
                  </span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-[11px] font-semibold text-white flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                  >
                    <CheckSquare size={12} />
                    <span>Select All</span>
                  </button>
                  {selectedIds.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/25 text-[11px] font-semibold text-rose-300 flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                    >
                      <Trash2 size={12} />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Songs List */}
          <div className="flex-1 overflow-y-auto smooth-scroll-container no-scrollbar p-3 sm:p-4 space-y-1.5">
            {filteredSongs.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center p-4">
                <Music2 size={32} className="text-slate-500 mb-2" />
                <p className="text-xs text-slate-300 font-semibold">No songs matched your search</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Try searching for a different keyword</p>
              </div>
            ) : (
              filteredSongs.map((song: Song) => {
                const isSelected = selectedIds.includes(song.id);
                return (
                  <motion.div
                    key={song.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSelect(song.id)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-white/15 border-white/35 shadow-[0_0_15px_rgba(255,255,255,0.08)]'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      {/* Checkbox indicator */}
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                          isSelected
                            ? 'bg-white text-black border-white shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                            : 'border-white/30 bg-white/5'
                        }`}
                      >
                        {isSelected && <Check size={13} className="stroke-[3]" />}
                      </div>

                      {/* Song thumbnail */}
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-sm border border-white/15"
                      />

                      {/* Title & Artist */}
                      <div className="min-w-0">
                        <span className={`text-xs font-semibold truncate block ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {song.title}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate block mt-0.5 font-medium">
                          {song.artist} <span className="text-slate-600">·</span> {song.album}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-mono text-slate-400">
                        {formatTime(song.duration)}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="p-3.5 sm:p-4 border-t border-white/10 bg-[#06080b]/90 backdrop-blur-xl shrink-0 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                haptics.selection();
                setIsPrimeSongPickerOpen(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSaveAndClose(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-white active:scale-95 transition-all cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => handleSaveAndClose(true)}
                className="px-4 py-2 rounded-xl bg-white text-black text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.3)] active:scale-95 transition-all cursor-pointer"
              >
                <Zap size={14} className="fill-black text-black" />
                <span>Save & Play</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
