import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { haptics } from '../utils/haptics';

export const SplashModal: React.FC = () => {
  const { isSplashActive, setIsSplashActive } = useMusic();

  if (!isSplashActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.04 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => {
          haptics.selection();
          setIsSplashActive(false);
        }}
        className="absolute inset-0 z-50 bg-[#050505] flex flex-col items-center justify-between py-12 px-6 overflow-hidden cursor-pointer select-none"
      >
        {/* Swirling Liquid Chrome Wave Aesthetics in Background */}
        <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
          <svg className="w-full h-full object-cover" viewBox="0 0 400 800" fill="none">
            <defs>
              <linearGradient id="chromeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="40%" stopColor="#717684" stopOpacity="0.1" />
                <stop offset="70%" stopColor="#d1d5db" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="chromeGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#9ca3af" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#050505" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <path
              d="M-50 200 C 150 100, 250 400, 450 300 C 550 250, 350 700, 100 750 Z"
              fill="url(#chromeGrad1)"
              filter="blur(30px)"
            />
            <path
              d="M350 100 C 200 300, 50 400, 150 650 C 250 800, 400 700, 450 500 Z"
              fill="url(#chromeGrad2)"
              filter="blur(40px)"
            />
          </svg>
        </div>

        {/* Ambient radial center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-b from-white/10 via-slate-400/5 to-transparent blur-3xl pointer-events-none" />

        {/* Top spacer */}
        <div className="w-full flex justify-end pt-2">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
            v2.4 Pro
          </span>
        </div>

        {/* Center Emblem & Branding */}
        <div className="flex flex-col items-center text-center z-10 my-auto">
          {/* 3D Liquid Chrome Emblem Frame */}
          <motion.div
            initial={{ scale: 0.82, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-28 h-28 rounded-full mb-8 flex items-center justify-center p-1"
          >
            {/* Outer Specular Ring */}
            <div className="absolute inset-0 rounded-full border border-white/30 shadow-[0_0_35px_rgba(255,255,255,0.18)]" />
            <div className="absolute inset-1.5 rounded-full bg-gradient-to-b from-white/20 via-black/40 to-black/80 backdrop-blur-xl border border-white/10" />

            {/* Glowing Specular Sheen Arc */}
            <div className="absolute -top-1 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent" />

            {/* Chrome 'S' Emblem Icon */}
            <div className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-white via-slate-200 to-slate-400 text-black shadow-2xl">
              <svg
                viewBox="0 0 24 24"
                className="w-11 h-11 text-black fill-current drop-shadow-md"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c0 .83-.67 1.5-1.5 1.5S10 17.33 10 16.5 10.67 15 11.5 15s1.5.67 1.5 1.5zm3.5-5.5c-.83 0-1.5-.67-1.5-1.5S15.67 8 16.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-7-2c-.83 0-1.5-.67-1.5-1.5S8.67 6 9.5 6s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 4c1.1 0 2 .9 2 2v2.5c0 .83-.67 1.5-1.5 1.5S11 9.33 11 8.5V6c0-1.1.9-2 2-2z" />
              </svg>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-4xl font-extrabold tracking-tight text-white mb-2 font-display"
          >
            SiuuMusic
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-sm font-medium text-slate-400 tracking-wider"
          >
            Feel The Music
          </motion.p>
        </div>

        {/* Bottom Loading Indicator */}
        <div className="w-full max-w-xs flex flex-col items-center gap-3 z-10 pb-6">
          <span className="text-xs text-slate-400 font-medium tracking-wide">
            Loading...
          </span>
          <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden relative">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                repeat: Infinity,
                duration: 1.4,
                ease: 'easeInOut',
              }}
              className="w-24 h-full bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
          </div>
          <span className="text-[10px] text-slate-600 mt-1">Tap anywhere to enter</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
