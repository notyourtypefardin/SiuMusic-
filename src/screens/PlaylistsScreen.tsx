import React, { useState, useRef } from 'react';
import {
  Plus,
  Play,
  Pause,
  Shuffle,
  Trash2,
  ChevronLeft,
  Music2,
  Clock,
  Heart,
  PlusCircle,
  X,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { Playlist, Song } from '../types/music';
import {
  formatTime,
  CODE4_SPRING,
  SCROLL_CONTAINER_VARIANTS,
  SCROLL_ITEM_VARIANTS,
} from '../utils/audioMath';
import { LiquidGlassCard, LiquidGlassButton } from '../components/LiquidGlass';
import { GlassButton } from '../components/ui/glass-button';
import { haptics } from '../utils/haptics';

export const PlaylistsScreen: React.FC = () => {
  const {
    playlists,
    songs,
    currentSong,
    isPlaying,
    playSong,
    togglePlayPause,
    createPlaylist,
    deletePlaylist,
    removeSongFromPlaylist,
    addSongToPlaylist,
    activePlaylistDetail,
    setActivePlaylistDetail,
    setIsCreatePlaylistOpen,
    primePlaylistSongIds,
    playPrimePlaylist,
    removeSongFromPrimePlaylist,
    setIsPrimeSongPickerOpen,
    isPrimePlaybackActive,
  } = useMusic();

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedGradient, setSelectedGradient] = useState<[string, string]>(['#CBD5E1', '#0F172A']);
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const GRADIENTS: [string, string][] = [
    ['#CBD5E1', '#0F172A'],
    ['#E2E8F0', '#1E293B'],
    ['#94A3B8', '#020617'],
    ['#FFFFFF', '#334155'],
    ['#64748B', '#000000'],
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    haptics.stateChange();
    createPlaylist(newTitle.trim(), newDesc.trim() || 'Custom Liquid Glass playlist', selectedGradient);
    setNewTitle('');
    setNewDesc('');
    setIsCreating(false);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const top = scrollContainerRef.current.scrollTop;
      if (top % 160 < 10) {
        haptics.scrollSnap();
      }
    }
  };

  // If a playlist is actively selected, show detail view
  if (activePlaylistDetail) {
    const isPrimePlaylist = activePlaylistDetail.id === 'prime-playlist';
    const effectiveSongIds = isPrimePlaylist ? primePlaylistSongIds : activePlaylistDetail.songIds;
    const playlistSongs = effectiveSongIds
      .map((id) => songs.find((s) => s.id === id))
      .filter((s): s is Song => Boolean(s));

    const totalSeconds = playlistSongs.reduce((acc, s) => acc + s.duration, 0);
    const availableToAdd = songs.filter((s) => !effectiveSongIds.includes(s.id));

    return (
      <motion.div
        key="playlist-detail-view"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={CODE4_SPRING}
        className="flex-1 overflow-y-auto smooth-scroll-container no-scrollbar pb-36 px-4 pt-3 space-y-4 select-none"
      >
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              haptics.selection();
              setActivePlaylistDetail(null);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-2xl liquid-glass-card active:scale-95 transition-all cursor-pointer border border-white/15"
            aria-label="Back to playlists list"
          >
            <ChevronLeft size={16} />
            <span>All Playlists</span>
          </button>

          {!activePlaylistDetail.isSystem && (
            <button
              onClick={() => {
                haptics.error();
                deletePlaylist(activePlaylistDetail.id);
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-3 py-1.5 rounded-2xl liquid-glass-card active:scale-95 transition-all border border-rose-500/20 cursor-pointer"
              aria-label="Delete this playlist"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          )}
        </div>

        {/* Playlist Header Card */}
        <LiquidGlassCard
          className="p-5 border border-white/15"
          glowColor="rgba(255, 255, 255, 0.15)"
          isInteractive={false}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div
              className="w-24 h-24 rounded-2xl shadow-xl flex items-center justify-center shrink-0 border border-white/20"
              style={{
                background: `linear-gradient(135deg, ${activePlaylistDetail.coverGradient[0]}, ${activePlaylistDetail.coverGradient[1]})`,
              }}
            >
              {isPrimePlaylist ? (
                <Zap size={38} className="fill-white text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
              ) : activePlaylistDetail.id === 'pl-favs' ? (
                <Heart size={36} className="fill-white text-white drop-shadow-md" />
              ) : (
                <Music2 size={36} className="text-white opacity-90 drop-shadow-md" />
              )}
            </div>

            <div className="space-y-1 flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">
                {isPrimePlaylist
                  ? 'Prime Mode VIP Playlist'
                  : activePlaylistDetail.isSystem
                  ? 'Smart System Playlist'
                  : 'Obsidian Collection'}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {activePlaylistDetail.title}
              </h1>
              <p className="text-xs text-slate-400 line-clamp-2">
                {activePlaylistDetail.description}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-slate-400 font-mono">
                <span>{playlistSongs.length} tracks</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatTime(totalSeconds)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons: Play All / Shuffle All / Add Song */}
          <div className="flex items-center gap-2 pt-4 flex-wrap">
            <LiquidGlassButton
              variant="primary"
              onClick={() => {
                haptics.buttonPress();
                if (isPrimePlaylist) {
                  playPrimePlaylist();
                } else if (playlistSongs.length > 0) {
                  playSong(playlistSongs[0], playlistSongs);
                }
              }}
              disabled={playlistSongs.length === 0}
              aria-label="Play all tracks"
            >
              <Play size={15} className="fill-slate-900" />
              <span>{isPrimePlaylist ? 'Play Prime' : 'Play All'}</span>
            </LiquidGlassButton>

            <LiquidGlassButton
              onClick={() => {
                haptics.buttonPress();
                if (playlistSongs.length > 0) {
                  const shuffled = [...playlistSongs].sort(() => Math.random() - 0.5);
                  playSong(shuffled[0], shuffled, isPrimePlaylist);
                }
              }}
              disabled={playlistSongs.length === 0}
              aria-label="Shuffle all tracks"
            >
              <Shuffle size={14} />
              <span>Shuffle</span>
            </LiquidGlassButton>

            {isPrimePlaylist ? (
              <LiquidGlassButton
                onClick={() => {
                  haptics.selection();
                  setIsPrimeSongPickerOpen(true);
                }}
                aria-label="Manage songs in Prime Playlist"
              >
                <PlusCircle size={14} />
                <span>Select Songs</span>
              </LiquidGlassButton>
            ) : !activePlaylistDetail.isSystem && (
              <LiquidGlassButton
                onClick={() => {
                  haptics.selection();
                  setIsAddSongOpen(true);
                }}
                aria-label="Add songs to this playlist"
              >
                <PlusCircle size={14} />
                <span>Add Songs</span>
              </LiquidGlassButton>
            )}
          </div>
        </LiquidGlassCard>

        {/* Add Song Bottom Sheet */}
        <AnimatePresence>
          {isAddSongOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={CODE4_SPRING}
              className="p-4 rounded-2xl liquid-glass-sheet space-y-3 relative border border-white/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Add Tracks to Playlist</span>
                <button
                  onClick={() => setIsAddSongOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="max-h-52 overflow-y-auto no-scrollbar space-y-1.5">
                {availableToAdd.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-3">All songs are already added.</p>
                ) : (
                  availableToAdd.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        haptics.stateChange();
                        addSongToPlaylist(activePlaylistDetail.id, s.id);
                      }}
                      className="flex items-center justify-between p-2 rounded-xl liquid-glass-card hover:bg-white/10 cursor-pointer transition-all border border-white/10"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={s.coverUrl} alt={s.title} className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/15" />
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-white truncate block">{s.title}</span>
                          <span className="text-[10px] text-slate-400 truncate block font-medium">{s.artist}</span>
                        </div>
                      </div>
                      <Plus size={16} className="text-slate-300 shrink-0" />
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Songs List with Staggered Scroll Animation */}
        <div className="space-y-1.5 pt-1">
          {playlistSongs.length === 0 ? (
            <div className="p-8 text-center rounded-2xl liquid-glass-card border border-white/10 space-y-2">
              <Music2 size={30} className="mx-auto text-slate-400" />
              <p className="text-sm font-semibold text-white">Playlist is empty</p>
              <p className="text-xs text-slate-400 font-mono">
                Tap "Add Songs" above or heart any track across the app to add it.
              </p>
            </div>
          ) : (
            <motion.div
              variants={SCROLL_CONTAINER_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-20px' }}
              className="space-y-1.5"
            >
              {playlistSongs.map((song: Song, index: number) => {
                const isThisPlaying = currentSong?.id === song.id && isPlaying;
                return (
                  <motion.div key={song.id} variants={SCROLL_ITEM_VARIANTS}>
                    <LiquidGlassCard
                      onClick={() => {
                        if (currentSong?.id === song.id) {
                          togglePlayPause();
                        } else {
                          playSong(song, playlistSongs);
                        }
                      }}
                      className={`flex items-center justify-between p-2.5 min-h-[58px] border ${
                        currentSong?.id === song.id
                          ? 'border-white/50 ring-1 ring-white/30 bg-white/15 shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                          : 'border-white/10'
                      }`}
                      aria-label={`Play ${song.title}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-5 text-center text-xs font-mono text-slate-400">
                          {index + 1}
                        </span>
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-10 h-10 rounded-xl object-cover shadow-sm ring-1 ring-white/15"
                        />
                        <div className="min-w-0 pr-1">
                          <span className="text-xs font-semibold text-white truncate block">
                            {song.title}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate block font-medium">
                            {song.artist} <span className="text-slate-500">·</span> {song.album}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {isPrimePlaylist ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              haptics.stateChange();
                              removeSongFromPrimePlaylist(song.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            aria-label="Remove from Prime Playlist"
                            title="Remove from Prime Playlist"
                          >
                            <Trash2 size={14} />
                          </button>
                        ) : !activePlaylistDetail.isSystem && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              haptics.stateChange();
                              removeSongFromPlaylist(activePlaylistDetail.id, song.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            aria-label="Remove from playlist"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                        <span className="text-xs font-mono text-slate-400">
                          {formatTime(song.duration)}
                        </span>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isThisPlaying) {
                              togglePlayPause();
                            } else {
                              playSong(song, playlistSongs, isPrimePlaylist);
                            }
                          }}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                        >
                          {isThisPlaying ? (
                            <Pause size={14} className="fill-white text-white" />
                          ) : (
                            <Play size={14} className="fill-white text-white translate-x-0.5" />
                          )}
                        </div>
                      </div>
                    </LiquidGlassCard>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto smooth-scroll-container no-scrollbar pb-36 px-4 pt-3 space-y-4 select-none"
    >
      {/* Title & Create Trigger */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={CODE4_SPRING}
        className="flex items-center justify-between pt-1"
      >
        <div>
          <h1 className="text-sf-display-34 text-white tracking-tight">Playlists</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {playlists.length} glass collections
          </p>
        </div>

        <button
          onClick={() => {
            haptics.selection();
            setIsCreatePlaylistOpen(true);
          }}
          className="px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
          aria-label="Create new playlist"
        >
          <Plus size={14} className="stroke-[3]" />
          <span>Create Playlist</span>
        </button>
      </motion.div>

      {/* Create Playlist Drawer */}
      <AnimatePresence>
        {isCreating && (
          <motion.form
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={CODE4_SPRING}
            onSubmit={handleCreate}
            className="p-4 rounded-2xl liquid-glass-surface space-y-3 relative border border-white/25 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Create Liquid Playlist</h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Playlist Name</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Midnight Drive or Ambient Study"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Description (Optional)</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="e.g. Mellow evening synthwave"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Cover Gradient</label>
              <div className="flex items-center gap-2">
                {GRADIENTS.map((grad, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setSelectedGradient(grad)}
                    className={`w-7 h-7 rounded-xl transition-transform cursor-pointer border ${
                      selectedGradient[0] === grad[0]
                        ? 'ring-2 ring-white scale-110 border-white'
                        : 'border-white/20 opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <LiquidGlassButton variant="primary" type="submit" className="py-1.5 px-4 font-bold">
                Save Playlist
              </LiquidGlassButton>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Featured Dedicated Prime Mode Playlist Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={CODE4_SPRING}
      >
        <LiquidGlassCard
          onClick={() => {
            haptics.selection();
            setActivePlaylistDetail({
              id: 'prime-playlist',
              title: 'Prime Mode Playlist',
              description: 'Dedicated 1-tap playback playlist for lightning bottom dock',
              coverGradient: ['#FFFFFF', '#0B0F17'],
              songIds: primePlaylistSongIds,
              createdAt: new Date().toISOString(),
              isSystem: true,
            });
          }}
          className="p-4 sm:p-5 group border border-white/30 bg-gradient-to-r from-white/12 via-white/[0.04] to-transparent relative overflow-hidden"
          glowColor="rgba(255, 255, 255, 0.22)"
          aria-label="Open Prime Mode Playlist"
        >
          {/* Specular top edge highlight */}
          <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center shrink-0 border border-white/40 bg-gradient-to-b from-white/35 via-white/15 to-black/85 group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <Zap size={26} className="fill-white text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                {isPrimePlaybackActive && isPlaying && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white animate-pulse border-2 border-black" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-widest text-white px-2 py-0.5 rounded-full bg-white/20 border border-white/30">
                    Prime Mode
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">1-Tap Dock</span>
                </div>
                <h3 className="text-base font-black text-white tracking-tight truncate block mt-1">
                  Prime Mode Playlist
                </h3>
                <p className="text-xs text-slate-300 truncate mt-0.5 font-medium">
                  {primePlaylistSongIds.length} {primePlaylistSongIds.length === 1 ? 'song' : 'songs'} curated for instant playback
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  haptics.selection();
                  setIsPrimeSongPickerOpen(true);
                }}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white active:scale-95 transition-all cursor-pointer"
                title="Manage Songs in Prime Playlist"
              >
                Manage
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playPrimePlaylist();
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-lg active:scale-95 ${
                  isPrimePlaybackActive && isPlaying
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                    : 'bg-white text-black border-white/80 hover:scale-105'
                }`}
                title="Play Prime Playlist Now"
                aria-label="Play Prime Playlist"
              >
                {isPrimePlaybackActive && isPlaying ? (
                  <Pause size={16} className="fill-black" />
                ) : (
                  <Play size={16} className="fill-black translate-x-0.5" />
                )}
              </button>
            </div>
          </div>
        </LiquidGlassCard>
      </motion.div>

      {/* Playlists Grid with Progressive Scroll Reveals */}
      <motion.div
        variants={SCROLL_CONTAINER_VARIANTS}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20px' }}
        className="space-y-2.5"
      >
        {playlists.map((playlist: Playlist) => {
          return (
            <motion.div key={playlist.id} variants={SCROLL_ITEM_VARIANTS}>
              <LiquidGlassCard
                onClick={() => {
                  haptics.selection();
                  setActivePlaylistDetail(playlist);
                }}
                className="p-4 group border border-white/10"
                glowColor="rgba(255, 255, 255, 0.12)"
                aria-label={`Open playlist ${playlist.title}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-13 h-13 rounded-2xl shadow-lg flex items-center justify-center shrink-0 border border-white/20 group-hover:scale-105 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${playlist.coverGradient[0]}, ${playlist.coverGradient[1]})`,
                      }}
                    >
                      {playlist.id === 'pl-favs' ? (
                        <Heart size={22} className="fill-white text-white drop-shadow-md" />
                      ) : (
                        <Music2 size={22} className="text-white drop-shadow-md" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                        {playlist.isSystem ? 'Smart' : 'Collection'}
                      </span>
                      <h3 className="text-sm font-bold text-white truncate block mt-0.5">
                        {playlist.title}
                      </h3>
                      <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
                        {playlist.songIds.length} {playlist.songIds.length === 1 ? 'song' : 'songs'}
                      </p>
                    </div>
                  </div>

                  <div className="w-9 h-9 rounded-full liquid-glass-pill flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-transform shrink-0">
                    <Play size={14} className="fill-white translate-x-0.5" />
                  </div>
                </div>
              </LiquidGlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
