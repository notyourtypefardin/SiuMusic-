import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Play, ChevronLeft, Music } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { haptics } from '../utils/haptics';
import { formatTime, CODE4_SPRING } from '../utils/audioMath';

interface ArtistData {
  id: string;
  name: string;
  avatarUrl: string;
  albumsCount: number;
  monthlyListeners: string;
}

const FEATURED_ARTISTS: ArtistData[] = [
  {
    id: 'the-weeknd',
    name: 'The Weeknd',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    albumsCount: 12,
    monthlyListeners: '112.4M',
  },
  {
    id: 'travis-scott',
    name: 'Travis Scott',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    albumsCount: 8,
    monthlyListeners: '74.2M',
  },
  {
    id: 'post-malone',
    name: 'Post Malone',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    albumsCount: 10,
    monthlyListeners: '68.9M',
  },
  {
    id: 'arctic-monkeys',
    name: 'Arctic Monkeys',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    albumsCount: 8,
    monthlyListeners: '51.3M',
  },
  {
    id: 'imagine-dragons',
    name: 'Imagine Dragons',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    albumsCount: 7,
    monthlyListeners: '62.7M',
  },
  {
    id: 'billie-eilish',
    name: 'Billie Eilish',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
    albumsCount: 5,
    monthlyListeners: '89.1M',
  },
];

export const ArtistsScreen: React.FC = () => {
  const { songs, currentSong, playSong } = useMusic();
  const [selectedArtist, setSelectedArtist] = useState<ArtistData | null>(null);

  // Filter songs for the selected artist
  const artistSongs = React.useMemo(() => {
    if (!selectedArtist) return [];
    const directMatches = songs.filter(
      (s) =>
        s.artist.toLowerCase().includes(selectedArtist.name.toLowerCase()) ||
        selectedArtist.name.toLowerCase().includes(s.artist.toLowerCase())
    );
    if (directMatches.length > 0) return directMatches;
    return songs.slice(0, 4);
  }, [songs, selectedArtist]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative select-none pb-28">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between z-10">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            SiuuMusic Creators
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">Artists</h1>
        </div>
        <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
          <Users size={17} />
        </div>
      </div>

      {/* 2-Column Responsive Artists Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 space-y-4">
        <div className="grid grid-cols-2 gap-4 pt-2">
          {FEATURED_ARTISTS.map((artist) => (
            <motion.div
              key={artist.id}
              whileTap={{ scale: 0.95 }}
              transition={CODE4_SPRING}
              onClick={() => {
                haptics.selection();
                setSelectedArtist(artist);
              }}
              className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 cursor-pointer text-center group transition-all shadow-md"
            >
              {/* Circular Portrait with Silver Glass Ring */}
              <div className="relative w-24 h-24 rounded-full p-1 mb-3">
                <div className="absolute inset-0 rounded-full border border-white/30 group-hover:border-white/60 shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all" />
                <img
                  src={artist.avatarUrl}
                  alt={artist.name}
                  className="w-full h-full rounded-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              <h3 className="text-xs font-bold text-white truncate w-full tracking-tight">
                {artist.name}
              </h3>
              <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                {artist.albumsCount} albums
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Artist Detail Drawer */}
      <AnimatePresence>
        {selectedArtist && (
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
                  setSelectedArtist(null);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-full bg-white/10 border border-white/15"
              >
                <ChevronLeft size={16} />
                <span>Artists</span>
              </button>
              <span className="text-xs font-mono text-slate-400">
                {selectedArtist.monthlyListeners} monthly
              </span>
            </div>

            {/* Artist Hero Banner */}
            <div className="p-6 flex flex-col items-center text-center border-b border-white/10 bg-white/[0.02]">
              <div className="w-24 h-24 rounded-full p-1 mb-3 border border-white/30 shadow-xl">
                <img
                  src={selectedArtist.avatarUrl}
                  alt={selectedArtist.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">{selectedArtist.name}</h2>
              <span className="text-xs text-slate-400 font-medium mt-0.5">
                Verified Global Artist • {selectedArtist.albumsCount} Studio Albums
              </span>
              <button
                onClick={() => {
                  if (artistSongs.length > 0) playSong(artistSongs[0], artistSongs);
                }}
                className="mt-4 px-5 py-2 rounded-full bg-white text-black font-bold text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
              >
                <Play size={14} className="fill-current" />
                <span>Play Popular</span>
              </button>
            </div>

            {/* Popular Tracks */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                Popular Songs
              </span>
              {artistSongs.map((track, i) => {
                const isCurrent = currentSong?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => playSong(track, artistSongs)}
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
                          {track.album}
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
