import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, CheckCircle2, X, Sparkles, ShieldCheck, Zap, Disc3 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { haptics } from '../utils/haptics';
import { CODE4_SPRING } from '../utils/audioMath';

export const PrimeModeModal: React.FC = () => {
  const { isPrimeModalOpen, setIsPrimeModalOpen, settings, togglePrimeMode, updateSettings } = useMusic();

  if (!isPrimeModalOpen) return null;

  const isPrimeActive = settings.primeModeActive;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={CODE4_SPRING}
        className="absolute inset-0 z-50 bg-[#050505]/95 backdrop-blur-3xl flex flex-col overflow-hidden select-none"
      >
        {/* Specular ambient illumination */}
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-white/15 via-white/5 to-transparent pointer-events-none" />

        {/* Top close button */}
        <div className="flex items-center justify-between p-5 pt-12 z-10 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Crown size={20} className="text-white" />
            <span className="text-sm font-black tracking-tight text-white uppercase">
              Prime Mode
            </span>
          </div>

          <button
            onClick={() => {
              haptics.selection();
              setIsPrimeModalOpen(false);
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
          {/* Main Crown Presentation Card */}
          <div className="relative p-6 rounded-3xl bg-gradient-to-b from-white/15 via-white/[0.04] to-transparent border border-white/25 flex flex-col items-center text-center shadow-2xl overflow-hidden">
            {/* Specular Top Sheen */}
            <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />

            <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-white/25 via-white/10 to-black/60 border border-white/40 flex items-center justify-center text-white mb-4 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <Crown size={36} className="text-white drop-shadow-md" />
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight">
              {isPrimeActive ? 'Prime Mode Active' : 'Prime Mode'}
            </h2>
            <p className="text-xs text-slate-300 font-medium max-w-xs mt-1.5 leading-relaxed">
              {isPrimeActive
                ? "You're now in the ultimate music experience. Unlocked with lossless acoustic clarity and ultra-realistic liquid glass."
                : 'Unlock the ultimate music experience with lossless audio, zero ads, and ultra-realistic Liquid Glass.'}
            </p>

            {/* Status Pill */}
            <div className="mt-4 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-mono font-semibold text-white flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPrimeActive ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
              <span>Status: {isPrimeActive ? 'Prime VIP Active' : 'Standard'}</span>
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
              Prime Exclusive Benefits
            </span>

            {[
              { title: 'Ad-free experience', desc: 'Continuous uninterrupted audio playback without interruptions', icon: ShieldCheck },
              { title: 'High quality audio', desc: 'Studio Master 24-bit / 96kHz Lossless FLAC decoding engine', icon: Zap },
              { title: 'Exclusive themes', desc: 'Pure Black & Liquid Silver material reflection grading', icon: Sparkles },
              { title: 'Advanced features', desc: '5-Band hardware equalizer, gyro parallax 3D album tilt, and haptics', icon: Disc3 },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white tracking-tight">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Theme Switcher (Reference: Black vs Silver) */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
              Liquid Glass Theme
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  haptics.selection();
                  updateSettings({
                    themeAccent: 'obsidian',
                    liquidGlass: {
                      ...settings.liquidGlass,
                      tintHue: 'obsidian',
                      appearance: 'smoked-dark',
                    },
                  });
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                  settings.themeAccent === 'obsidian' || settings.liquidGlass.appearance === 'smoked-dark'
                    ? 'bg-white/15 border-white shadow-lg'
                    : 'bg-black/60 border-white/10 hover:border-white/25'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-black via-zinc-900 to-black border border-white/20 shadow-inner" />
                <div>
                  <h5 className="text-xs font-bold text-white">Obsidian Black</h5>
                  <span className="text-[10px] text-slate-400">Deep cinematic contrast</span>
                </div>
              </button>

              <button
                onClick={() => {
                  haptics.selection();
                  updateSettings({
                    themeAccent: 'silver',
                    liquidGlass: {
                      ...settings.liquidGlass,
                      tintHue: 'platinum',
                      appearance: 'frosted-white',
                    },
                  });
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                  settings.themeAccent === 'silver' || settings.liquidGlass.appearance === 'frosted-white'
                    ? 'bg-white/15 border-white shadow-lg'
                    : 'bg-black/60 border-white/10 hover:border-white/25'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white via-slate-200 to-slate-400 border border-white/40 shadow-md" />
                <div>
                  <h5 className="text-xs font-bold text-white">Liquid Silver</h5>
                  <span className="text-[10px] text-slate-400">Specular chrome reflections</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="p-5 border-t border-white/10 bg-[#050505]/90 backdrop-blur-xl">
          <button
            onClick={() => {
              togglePrimeMode();
            }}
            className="w-full py-4 rounded-full bg-gradient-to-r from-white via-slate-100 to-slate-200 text-black text-sm font-black tracking-tight shadow-2xl hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Crown size={18} className="fill-current text-black" />
            <span>{isPrimeActive ? 'Deactivate Prime Mode' : 'Activate Prime Mode'}</span>
          </button>
          <div className="text-center mt-2.5">
            <span className="text-[11px] text-slate-400 font-medium">
              SiuuMusic • More Music, More Life
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
