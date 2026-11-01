import React, { useState, useMemo, useRef } from 'react';
import {
  Folder,
  FolderOpen,
  Music2,
  Disc,
  User,
  ArrowUpDown,
  Heart,
  Play,
  Pause,
  Upload,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { LibrarySubTab, Song } from '../types/music';
import {
  formatTime,
  CODE4_SPRING,
  SCROLL_CONTAINER_VARIANTS,
  SCROLL_ITEM_VARIANTS,
} from '../utils/audioMath';
import { LiquidGlassCard } from '../components/LiquidGlass';
import { GlassButton } from '../components/ui/glass-button';
import { haptics } from '../utils/haptics';

type SourceFilter = 'all' | 'device' | 'sample';
type SortOption = 'title' | 'artist' | 'duration' | 'year';

export const LibraryScreen: React.FC = () => {
  const {
    songs,
    currentSong,
    isPlaying,
    playSong,
    togglePlayPause,
    toggleFavorite,
    librarySubTab,
    setLibrarySubTab,
    importDeviceFiles,
  } = useMusic();

  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('title');
  const [sortAscending, setSortAscending] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Filter songs by source
  const filteredSongs = useMemo(() => {
    return songs.filter((s) => {
      if (sourceFilter === 'device' && s.isSample) return false;
      if (sourceFilter === 'sample' && !s.isSample) return false;
      return true;
    });
  }, [songs, sourceFilter]);

  // Sort songs
  const sortedSongs = useMemo(() => {
    const list = [...filteredSongs];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortOption === 'title') cmp = a.title.localeCompare(b.title);
      else if (sortOption === 'artist') cmp = a.artist.localeCompare(b.artist);
      else if (sortOption === 'duration') cmp = a.duration - b.duration;
      else if (sortOption === 'year') cmp = a.year - b.year;
      return sortAscending ? cmp : -cmp;
    });
    return list;
  }, [filteredSongs, sortOption, sortAscending]);

  // Unique Albums
  const albums = useMemo(() => {
    const map = new Map<string, { album: string; artist: string; coverUrl: string; count: number; songs: Song[] }>();
    filteredSongs.forEach((song) => {
      const key = `${song.album}-${song.artist}`;
      if (!map.has(key)) {
        map.set(key, {
          album: song.album,
          artist: song.artist,
          coverUrl: song.coverUrl,
          count: 1,
          songs: [song],
        });
      } else {
        const item = map.get(key)!;
        item.count += 1;
        item.songs.push(song);
      }
    });
    return Array.from(map.values());
  }, [filteredSongs]);

  // Unique Artists
  const artists = useMemo(() => {
    const map = new Map<string, { artist: string; coverUrl: string; count: number; songs: Song[] }>();
    filteredSongs.forEach((song) => {
      if (!map.has(song.artist)) {
        map.set(song.artist, {
          artist: song.artist,
          coverUrl: song.coverUrl,
          count: 1,
          songs: [song],
        });
      } else {
        const item = map.get(song.artist)!;
        item.count += 1;
        item.songs.push(song);
      }
    });
    return Array.from(map.values());
  }, [filteredSongs]);

  // Folders
  const folders = useMemo(() => {
    const map = new Map<string, Song[]>();
    filteredSongs.forEach((song) => {
      const path = song.filePath || '/storage/emulated/0/Music/General';
      const folderName = path.substring(0, path.lastIndexOf('/')) || '/storage/emulated/0/Music';
      if (!map.has(folderName)) {
        map.set(folderName, [song]);
      } else {
        map.get(folderName)!.push(song);
      }
    });
    return Array.from(map.entries()).map(([path, list]) => ({
      path,
      count: list.length,
      songs: list,
    }));
  }, [filteredSongs]);

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const count = await importDeviceFiles(e.target.files);
      if (count > 0) haptics.stateChange();
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const top = scrollContainerRef.current.scrollTop;
      if (top % 160 < 10) {
        haptics.scrollSnap();
      }
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto smooth-scroll-container no-scrollbar pb-36 px-4 pt-3 space-y-4 select-none"
    >
      {/* Title & Import Trigger */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={CODE4_SPRING}
        className="flex items-center justify-between pt-1"
      >
        <div>
          <h1 className="text-sf-display-34 text-white tracking-tight">Music Library</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {filteredSongs.length} items <span aria-hidden="true">·</span> Black & Silver Audio Storage
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            multiple
            accept="audio/*,.mp3,.flac,.wav,.ogg,.m4a"
            className="hidden"
          />
          <GlassButton
            size="sm"
            onClick={() => {
              haptics.buttonPress();
              fileInputRef.current?.click();
            }}
            aria-label="Scan Device Audio Files"
            className="h-9 px-3.5 border-white/20"
          >
            <Upload size={14} className="text-slate-200 mr-1.5" />
            <span>Scan Device</span>
          </GlassButton>
        </div>
      </motion.div>

      {/* Sub-Tabs: Tracks / Albums / Artists / Folders */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={CODE4_SPRING}
        className="relative flex items-center gap-1 p-1 rounded-2xl liquid-glass-surface border border-white/10"
      >
        {(
          [
            { id: 'tracks', label: 'Tracks', icon: Music2 },
            { id: 'albums', label: 'Albums', icon: Disc },
            { id: 'artists', label: 'Artists', icon: User },
            { id: 'folders', label: 'Folders', icon: Folder },
          ] as const
        ).map((tab) => {
          const isActive = librarySubTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                haptics.selection();
                setLibrarySubTab(tab.id);
              }}
              className={`relative flex-1 min-h-[38px] flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold transition-colors duration-150 cursor-pointer z-10 ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
              aria-label={tab.label}
              aria-selected={isActive}
            >
              {isActive && (
                <motion.div
                  layoutId="activeLibrarySubTab"
                  className="absolute inset-0 rounded-xl liquid-nav-active-pill"
                  transition={CODE4_SPRING}
                />
              )}
              <div className="relative z-10 flex items-center gap-1.5">
                <Icon size={14} />
                <span>{tab.label}</span>
              </div>
            </button>
          );
        })}
      </motion.div>

      {/* Source Filters & Sort Bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={CODE4_SPRING}
        className="flex items-center justify-between gap-2 pt-0.5"
      >
        {/* Source Segmented Control */}
        <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-xl border border-white/10">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'device', label: 'Device' },
              { id: 'sample', label: 'Sample' },
            ] as const
          ).map((chip) => {
            const isSelected = sourceFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => {
                  haptics.selection();
                  setSourceFilter(chip.id);
                }}
                className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-sm font-bold border-t border-white/20'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label={`Filter by ${chip.label}`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Sort Trigger */}
        <div className="flex items-center gap-1">
          <select
            value={sortOption}
            onChange={(e) => {
              haptics.selection();
              setSortOption(e.target.value as SortOption);
            }}
            className="bg-[#0e1017]/80 text-xs font-mono text-slate-300 border border-white/10 rounded-xl px-2 py-1 outline-none cursor-pointer liquid-glass-card"
            aria-label="Sort tracks by"
          >
            <option value="title" className="bg-[#0C0D12] text-white">Title</option>
            <option value="artist" className="bg-[#0C0D12] text-white">Artist</option>
            <option value="duration" className="bg-[#0C0D12] text-white">Duration</option>
            <option value="year" className="bg-[#0C0D12] text-white">Year</option>
          </select>
          <button
            onClick={() => {
              haptics.selection();
              setSortAscending((prev) => !prev);
            }}
            className="p-1.5 rounded-xl liquid-glass-card text-slate-400 hover:text-white cursor-pointer border border-white/10"
            aria-label="Toggle sort order"
          >
            <ArrowUpDown size={14} />
          </button>
        </div>
      </motion.div>

      {/* Content Area with progressive scroll reveals */}
      <AnimatePresence mode="wait">
        <motion.div
          key={librarySubTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={CODE4_SPRING}
        >
          {/* VIEW: TRACKS */}
          {librarySubTab === 'tracks' && (
            sortedSongs.length === 0 ? (
              <div className="p-8 text-center rounded-2xl liquid-glass-card border border-white/10 space-y-2">
                <FolderOpen size={30} className="mx-auto text-slate-400" />
                <p className="text-sm font-semibold text-white">No tracks found</p>
                <p className="text-xs text-slate-400 font-mono">
                  Switch filters or click Scan Device to import local audio.
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
                {sortedSongs.map((song: Song, index: number) => {
                  const isThisPlaying = currentSong?.id === song.id && isPlaying;
                  return (
                    <motion.div key={song.id} variants={SCROLL_ITEM_VARIANTS}>
                      <LiquidGlassCard
                        onClick={() => {
                          haptics.selection();
                          if (currentSong?.id === song.id) {
                            togglePlayPause();
                          } else {
                            playSong(song, sortedSongs);
                          }
                        }}
                        className={`flex items-center justify-between p-2.5 min-h-[58px] border ${
                          currentSong?.id === song.id
                            ? 'border-white/50 ring-1 ring-white/30 bg-white/15 shadow-[0_4px_16px_rgba(255,255,255,0.15)]'
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              haptics.stateChange();
                              toggleFavorite(song.id);
                            }}
                            className={`p-1.5 transition-colors cursor-pointer ${
                              song.isFavorite ? 'text-white' : 'text-slate-400 hover:text-white'
                            }`}
                            aria-label="Toggle favorite"
                          >
                            <Heart
                              size={15}
                              className={song.isFavorite ? 'fill-white text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}
                            />
                          </button>
                          <span className="text-xs font-mono text-slate-400">
                            {formatTime(song.duration)}
                          </span>
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-white">
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
            )
          )}

          {/* VIEW: ALBUMS */}
          {librarySubTab === 'albums' && (
            <motion.div
              variants={SCROLL_CONTAINER_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-20px' }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {albums.map((album) => (
                <motion.div key={`${album.album}-${album.artist}`} variants={SCROLL_ITEM_VARIANTS}>
                  <LiquidGlassCard
                    onClick={() => {
                      if (album.songs.length > 0) playSong(album.songs[0], album.songs);
                    }}
                    className="p-3 group border border-white/10"
                    aria-label={`Play album ${album.album}`}
                  >
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2 shadow-md ring-1 ring-white/15">
                      <img
                        src={album.coverUrl}
                        alt={album.album}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full liquid-glass-pill flex items-center justify-center text-white border border-white/30">
                          <Play size={16} className="fill-white translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-white truncate">{album.album}</h3>
                    <p className="text-[11px] text-slate-400 truncate font-medium">{album.artist}</p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                      {album.count} {album.count === 1 ? 'track' : 'tracks'}
                    </span>
                  </LiquidGlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* VIEW: ARTISTS */}
          {librarySubTab === 'artists' && (
            <motion.div
              variants={SCROLL_CONTAINER_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-20px' }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {artists.map((artist) => (
                <motion.div key={artist.artist} variants={SCROLL_ITEM_VARIANTS}>
                  <LiquidGlassCard
                    onClick={() => {
                      if (artist.songs.length > 0) playSong(artist.songs[0], artist.songs);
                    }}
                    className="p-4 text-center group border border-white/10"
                    aria-label={`Play artist ${artist.artist}`}
                  >
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2 shadow-lg ring-1 ring-white/20 group-hover:ring-white/40 transition-all">
                      <img
                        src={artist.coverUrl}
                        alt={artist.artist}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-xs font-bold text-white truncate">{artist.artist}</h3>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                      {artist.count} {artist.count === 1 ? 'track' : 'tracks'}
                    </span>
                  </LiquidGlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* VIEW: FOLDERS */}
          {librarySubTab === 'folders' && (
            <motion.div
              variants={SCROLL_CONTAINER_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-20px' }}
              className="space-y-2"
            >
              {folders.map((folder) => (
                <motion.div key={folder.path} variants={SCROLL_ITEM_VARIANTS}>
                  <LiquidGlassCard
                    onClick={() => {
                      if (folder.songs.length > 0) playSong(folder.songs[0], folder.songs);
                    }}
                    className="p-3.5 flex items-center justify-between group border border-white/10"
                    aria-label={`Open folder ${folder.path}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl liquid-glass-surface flex items-center justify-center text-slate-300 border border-white/20">
                        <Folder size={18} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-white truncate block font-mono">
                          {folder.path}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {folder.count} audio files
                        </span>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full liquid-glass-button flex items-center justify-center text-slate-300 group-hover:text-white border border-white/20">
                      <Play size={13} className="fill-white translate-x-0.5" />
                    </div>
                  </LiquidGlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
