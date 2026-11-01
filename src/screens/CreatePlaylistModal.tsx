import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Camera, Check } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { haptics } from '../utils/haptics';
import { CODE4_SPRING } from '../utils/audioMath';

export const CreatePlaylistModal: React.FC = () => {
  const { isCreatePlaylistOpen, setIsCreatePlaylistOpen, createPlaylist } = useMusic();
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGradient, setSelectedGradient] = useState<[string, string]>(['#1E2028', '#0A0C10']);

  if (!isCreatePlaylistOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = playlistName.trim() || 'My Liquid Playlist';
    createPlaylist(finalTitle, description.trim(), selectedGradient);
    haptics.impact();
    setPlaylistName('');
    setDescription('');
    setIsCreatePlaylistOpen(false);
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
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-4 border-b border-white/10">
          <button
            onClick={() => {
              haptics.selection();
              setIsCreatePlaylistOpen(false);
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>

          <h2 className="text-base font-bold text-white tracking-tight">Create Playlist</h2>

          <div className="w-10" />
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col items-center">
          {/* Circular Cover Picker with Camera Icon */}
          <div className="relative w-36 h-36 rounded-full bg-gradient-to-b from-white/10 to-white/[0.03] border border-white/25 flex flex-col items-center justify-center text-slate-300 shadow-[0_0_25px_rgba(255,255,255,0.06)] mb-8 cursor-pointer group hover:border-white/50 transition-all">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mb-1 group-hover:scale-110 transition-transform">
              <Camera size={22} />
            </div>
            <span className="text-[10px] font-medium text-slate-400">Add Artwork</span>
          </div>

          <form onSubmit={handleCreate} className="w-full max-w-sm space-y-5">
            {/* Playlist Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 px-1">
                Playlist Name
              </label>
              <input
                type="text"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="Chill Vibes"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 focus:border-white/40 focus:bg-white/[0.08] text-white placeholder-slate-500 text-sm outline-none transition-all"
                autoFocus
              />
            </div>

            {/* Description Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 px-1">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Good music, better mood..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 focus:border-white/40 focus:bg-white/[0.08] text-white placeholder-slate-500 text-sm outline-none transition-all resize-none"
              />
            </div>

            {/* Silver Glass Color Palette selector */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-slate-300 px-1">
                Liquid Glass Hue
              </label>
              <div className="flex items-center gap-3 px-1">
                {[
                  ['#1E2028', '#0A0C10'],
                  ['#2B2D33', '#121316'],
                  ['#383B44', '#17191E'],
                  ['#4F5361', '#1D2027'],
                ].map((grad, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      haptics.selection();
                      setSelectedGradient(grad as [string, string]);
                    }}
                    className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer ${
                      selectedGradient[0] === grad[0]
                        ? 'border-white scale-110 shadow-lg'
                        : 'border-white/20'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Create Action Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-white via-slate-100 to-slate-200 text-black text-sm font-bold tracking-tight shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
