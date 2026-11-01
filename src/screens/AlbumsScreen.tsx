import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disc, Play, Pause, ChevronLeft, Clock, Music } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Song } from '../types/music';
import { haptics } from '../utils/haptics';
import { formatTime, CODE4_SPRING } from '../utils/audioMath';

interface AlbumData {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  songCount: number;
  year: number;
}

const FEATURED_ALBUMS: AlbumData[] = [
  {
    id: 'after-hours',
    title: 'After Hours',
    artist: 'The Weeknd',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    songCount: 18,
    year: 2020,
  },
  {
    id: 'astroworld',
    title: 'ASTROWORLD',
    artist: 'Travis Scott',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    songCount: 17,
    year: 2018,
  },
  {
    id: 'divide',
    title: '÷ (Divide)',
    artist: 'Ed Sheeran',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    songCount: 16,
    year: 2017,
  },
  {
    id: 'hollywoods-bleeding',
    title: "Hollywood's Bleeding",
    artist: 'Post Malone',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    songCount: 17,
    year: 2019,
  },
  {
    id: 'starboy',
    title: 'Starboy',
    artist: 'The Weeknd',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    songCount: 18,
    year: 2016,
  },
  {
    id: 'am',
    title: 'AM',
    artist: 'Arctic Monkeys',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    songCount: 12,
    year: 2013,
  },
];

export const AlbumsScreen: React.FC = () => {
  const { songs, currentSong, isPlaying, playSong, togglePlayPause } = useMusic();
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null);

  // Filter songs for the selected album
  const albumSongs = React.useMemo(() => {
    if (!selectedAlbum) return [];
    const directMatches = songs.filter(
      (s) =>
        s.album.toLowerCase().includes(selectedAlbum.title.toLowerCase()) ||
        selectedAlbum.title.toLowerCase().includes(s.album.toLowerCase())
    );
    if (directMatches.length > 0) return directMatches;
    return songs.slice(0, 5); // Fallback curated selection
  }, [songs, selectedAlbum]);

  const handlePlayAlbum = () => {
    if (albumSongs.length > 0) {
      playSong(albumSongs[0], albumSongs);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative select-none pb-28">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between z-10">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            SiuuMusic Library
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">Albums</h1>
        </div>
        <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
          <Disc size={17} />
        </div>
      </div>

      {/* 2-Column Responsive Albums Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 space-y-4">
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          {FEATURED_ALBUMS.map((album) => {
            const isCurrentAlbum = currentSong?.album.toLowerCase().includes(album.title.toLowerCase());

            return (
              <motion.div
                key={album.id}
                whileTap={{ scale: 0.96 }}
                transition={CODE4_SPRING}
                onClick={() => {
                  haptics.selection();
                  setSelectedAlbum(album);
                }}
                className="group relative flex flex-col rounded-2xl bg-gradient-to-b from-white/10 to-white/[0.03] border border-white/15 hover:border-white/30 overflow-hidden cursor-pointer shadow-lg transition-all"
              >
                {/* Album Cover Art */}
                <div className="relative aspect-square w-full overflow-hidden bg-black/40">
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                  {/* Play overlay button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const match = songs.find((s) =>
                        s.album.toLowerCase().includes(album.title.toLowerCase())
                      ) || songs[0];
                      if (isCurrentAlbum && isPlaying) {
                        togglePlayPause();
                      } else {
                        playSong(match);
                      }
                    }}
                    className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-xl border border-white/60 active:scale-90 transition-transform"
                    aria-label="Play Album"
                  >
                    {isCurrentAlbum && isPlaying ? (
                      <Pause size={15} />
                    ) : (
                      <Play size={15} className="translate-x-0.5 fill-current" />
                    )}
                  </button>
                </div>

                {/* Metadata */}
                <div className="p-3 flex flex-col">
                  <h3 className="text-xs font-bold text-white truncate tracking-tight">
                    {album.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 truncate mt-0.5">
                    {album.artist}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">
                    {album.songCount} songs • {album.year}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Album Detail Drawer */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={CODE4_SPRING}
            className="absolute inset-0 z-30 bg-[#050505]/95 backdrop-blur-3xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/10 pt-10">
              <button
                onClick={() => {
                  haptics.selection();
                  setSelectedAlbum(null);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-full bg-white/10 border border-white/15"
              >
                <ChevronLeft size={16} />
                <span>Albums</span>
              </button>
              <span className="text-xs font-mono text-slate-400">{selectedAlbum.year}</span>
            </div>

            {/* Banner */}
            <div className="p-5 flex items-center gap-4 border-b border-white/10 bg-white/[0.02]">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/20 shadow-2xl">
                <img
                  src={selectedAlbum.coverUrl}
                  alt={selectedAlbum.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-black text-white truncate tracking-tight">
                  {selectedAlbum.title}
                </h2>
                <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
                  {selectedAlbum.artist}
                </p>
                <button
                  onClick={handlePlayAlbum}
                  className="mt-3 px-4 py-2 rounded-full bg-white text-black font-bold text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
                >
                  <Play size={14} className="fill-current" />
                  <span>Play All Tracks</span>
                </button>
              </div>
            </div>

            {/* Track List */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                Album Tracklist
              </span>
              {albumSongs.map((track, i) => {
                const isCurrent = currentSong?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => playSong(track, albumSongs)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-white/15 border border-white/30 text-white'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-slate-500 w-5">{i + 1}</span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{track.title}</h4>
                        <span className="text-[11px] text-slate-400 truncate block">
                          {track.artist}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {formatTime(track.duration)}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
