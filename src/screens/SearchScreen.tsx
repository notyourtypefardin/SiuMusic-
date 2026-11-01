import React, { useState, useMemo, useRef } from 'react';
import { Search as SearchIcon, X, TrendingUp, Play, Pause, Music, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { Song } from '../types/music';
import {
  formatTime,
  filterSongs,
  CODE4_SPRING,
} from '../utils/audioMath';
import { haptics } from '../utils/haptics';

const FILTER_TABS = ['Top', 'Artists', 'Albums', 'Playlists'];

const TRENDING_SEARCHES = [
  { title: 'Blinding Lights', artist: 'The Weeknd' },
  { title: "Creepin'", artist: 'Metro Boomin, The Weeknd' },
  { title: 'SICKO MODE', artist: 'Travis Scott' },
  { title: 'Sweater Weather', artist: 'The Neighbourhood' },
];

export const SearchScreen: React.FC = () => {
  const {
    songs,
    currentSong,
    isPlaying,
    playSong,
    togglePlayPause,
    searchQuery,
    setSearchQuery,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    setActiveTab,
  } = useMusic();

  const [activeFilterTab, setActiveFilterTab] = useState<string>('Top');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(() => {
    return filterSongs(songs, searchQuery, 'all');
  }, [songs, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery.trim());
    }
  };

  const handleSelectTerm = (term: string) => {
    haptics.selection();
    setSearchQuery(term);
    addRecentSearch(term);
  };

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto smooth-scroll-container no-scrollbar pb-36 px-4 pt-3 space-y-4 select-none"
    >
      {/* Search Bar Input matching Reference Design */}
      <motion.form
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={CODE4_SPRING}
        onSubmit={handleSearchSubmit}
        className="pt-1"
      >
        <div
          className={`relative flex items-center rounded-2xl bg-white/[0.06] px-3.5 py-3 transition-all duration-200 border ${
            isFocused
              ? 'border-white/50 bg-white/[0.1] ring-1 ring-white/30'
              : 'border-white/15'
          }`}
        >
          <SearchIcon
            size={17}
            className={`mr-2.5 shrink-0 transition-colors ${
              isFocused ? 'text-white' : 'text-slate-400'
            }`}
          />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs, artists, albums..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-400 outline-none"
            aria-label="Search songs, artists, albums"
          />
          <AnimatePresence>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  haptics.selection();
                  setSearchQuery('');
                }}
                className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </AnimatePresence>
        </div>
      </motion.form>

      {/* Filter Tabs: Top | Artists | Albums | Playlists */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={CODE4_SPRING}
        className="flex gap-2 pb-1"
      >
        {FILTER_TABS.map((tab) => {
          const isSelected = activeFilterTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                haptics.selection();
                setActiveFilterTab(tab);
                if (tab === 'Albums') setActiveTab('albums');
                if (tab === 'Artists') setActiveTab('artists');
                if (tab === 'Playlists') setActiveTab('playlists');
              }}
              className={`text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer border ${
                isSelected
                  ? 'bg-white text-black border-white shadow-md'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border-white/10'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </motion.div>

      {/* When NO query typed: Show Recent Searches & Trending */}
      {!searchQuery && (
        <div className="space-y-6 pt-2">
          {/* Section: Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-white tracking-tight">
                  Recent Searches
                </span>
                <button
                  onClick={() => {
                    haptics.selection();
                    clearRecentSearches();
                  }}
                  className="text-[11px] text-slate-500 hover:text-white"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-1.5">
                {recentSearches.map((term) => (
                  <div
                    key={term}
                    onClick={() => handleSelectTerm(term)}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 border border-white/15">
                        <User size={15} />
                      </div>
                      <span className="text-xs font-semibold text-white">{term}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(term);
                      }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Trending */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 px-1">
              <TrendingUp size={15} className="text-white" />
              <span className="text-xs font-bold text-white tracking-tight">Trending</span>
            </div>

            <div className="space-y-1.5">
              {TRENDING_SEARCHES.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectTerm(item.title)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 cursor-pointer transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/15">
                    <Music size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <span className="text-[11px] text-slate-400">{item.artist}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* When SEARCH QUERY exists: Show Results */}
      {searchQuery && (
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-slate-400 px-1">
            Results ({results.length})
          </span>

          <div className="space-y-1.5">
            {results.map((song) => {
              const isCurrent = currentSong?.id === song.id;

              return (
                <div
                  key={song.id}
                  onClick={() => playSong(song)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-white/15 border border-white/30 text-white'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/15">
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{song.title}</h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {song.artist} • {song.album}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCurrent && isPlaying) {
                        togglePlayPause();
                      } else {
                        playSong(song);
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-md shrink-0"
                  >
                    {isCurrent && isPlaying ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} className="translate-x-0.5 fill-current" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
