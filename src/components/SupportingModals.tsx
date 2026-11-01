import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Headphones,
  Moon,
  Vibrate,
  X,
  Check,
  Bell,
  Lock,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sliders,
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { haptics } from '../utils/haptics';
import { CODE4_SPRING, formatTime } from '../utils/audioMath';

// --- BLUETOOTH CONNECTED MODAL ---
export const BluetoothConnectedModal: React.FC = () => {
  const { isBluetoothModalOpen, setIsBluetoothModalOpen } = useMusic();

  if (!isBluetoothModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-6 select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={CODE4_SPRING}
          className="w-full max-w-sm rounded-3xl bg-[#090A0C] border border-white/20 p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
        >
          {/* Glowing Top Sheen */}
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          {/* Device Icon */}
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4 shadow-lg">
            <Headphones size={28} />
          </div>

          {/* Connection status */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AirPods Pro Connected • 85%</span>
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">Music Access</h3>
          <p className="text-xs text-slate-300 mt-1 mb-6 leading-relaxed">
            Allow SiuuMusic to access your music files, so you can play your songs with ultra-low latency.
          </p>

          <div className="w-full space-y-2.5">
            <button
              onClick={() => {
                haptics.impact();
                setIsBluetoothModalOpen(false);
              }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-white via-slate-100 to-slate-200 text-black text-xs font-bold tracking-wide uppercase shadow-lg active:scale-95 transition-transform"
            >
              Allow
            </button>
            <button
              onClick={() => {
                haptics.selection();
                setIsBluetoothModalOpen(false);
              }}
              className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 text-xs font-semibold active:scale-95 transition-transform"
            >
              Not Now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// --- SLEEP TIMER MODAL ---
export const SleepTimerModal: React.FC = () => {
  const { isSleepTimerOpen, setIsSleepTimerOpen, settings, setSleepTimer } = useMusic();
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(settings.sleepTimerMinutes || 30);

  if (!isSleepTimerOpen) return null;

  const TIMER_OPTIONS = [
    { label: '5 min', value: 5 },
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
    { label: 'Custom', value: 45 },
  ];

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-4 select-none">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={CODE4_SPRING}
          className="w-full max-w-sm rounded-3xl bg-[#0A0C10] border border-white/20 p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
        >
          {/* Moon Icon */}
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white mb-3 shadow-lg">
            <Moon size={28} />
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight">Sleep Timer</h3>
          <span className="text-xs text-slate-400 mb-5">Stop music after</span>

          {/* Options Grid */}
          <div className="grid grid-cols-3 gap-2.5 w-full mb-6">
            {TIMER_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => {
                  haptics.selection();
                  setSelectedMinutes(opt.value);
                }}
                className={`py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  selectedMinutes === opt.value
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full">
            <button
              onClick={() => {
                haptics.selection();
                setSleepTimer(null);
                setIsSleepTimerOpen(false);
              }}
              className="flex-1 py-3 rounded-full bg-white/10 text-slate-300 text-xs font-bold border border-white/15"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                haptics.impact();
                setSleepTimer(selectedMinutes);
                setIsSleepTimerOpen(false);
              }}
              className="flex-1 py-3 rounded-full bg-white text-black text-xs font-bold shadow-lg"
            >
              Start
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// --- HAPTIC FEEDBACK MODAL ---
export const HapticFeedbackModal: React.FC = () => {
  const { isHapticModalOpen, setIsHapticModalOpen, settings, updateSettings } = useMusic();

  if (!isHapticModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-6 select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={CODE4_SPRING}
          className="w-full max-w-sm rounded-3xl bg-[#090A0C] border border-white/20 p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
        >
          {/* Checkmark Icon */}
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4 shadow-lg">
            <Check size={30} />
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">
            Haptic Feedback ({settings.haptics ? 'On' : 'Off'})
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Feel the music in your hands with tactile sub-bass micro-impulses.
          </p>

          <div className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-6">
            <div className="flex items-center gap-2.5">
              <Vibrate size={18} className="text-slate-300" />
              <span className="text-xs font-semibold text-white">Tactile Engine</span>
            </div>
            <button
              onClick={() => {
                haptics.impact();
                updateSettings({ haptics: !settings.haptics });
              }}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                settings.haptics ? 'bg-white' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  settings.haptics ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button
            onClick={() => {
              haptics.selection();
              setIsHapticModalOpen(false);
            }}
            className="w-full py-3 rounded-full bg-white text-black text-xs font-bold shadow-lg"
          >
            Done
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// --- NOTIFICATION PANEL PREVIEW ---
export const NotificationPreviewSheet: React.FC = () => {
  const {
    isNotificationPreviewOpen,
    setIsNotificationPreviewOpen,
    currentSong,
    isPlaying,
    togglePlayPause,
    nextSong,
    previousSong,
  } = useMusic();

  if (!isNotificationPreviewOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col p-4 pt-10 select-none">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Bell size={16} />
            <span>Notification Shade Preview</span>
          </div>
          <button
            onClick={() => {
              haptics.selection();
              setIsNotificationPreviewOpen(false);
            }}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="pt-6">
          <div className="p-4 rounded-3xl bg-gradient-to-r from-white/15 via-white/10 to-white/[0.05] border border-white/25 shadow-2xl">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
              <span className="font-bold text-white tracking-wider uppercase font-mono">
                SiuuMusic
              </span>
              <span>Now Playing</span>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/20 shrink-0">
                <img
                  src={currentSong?.coverUrl}
                  alt={currentSong?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{currentSong?.title}</h4>
                <p className="text-xs text-slate-300 truncate mt-0.5">{currentSong?.artist}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 pt-1">
              <button onClick={previousSong} className="text-white hover:text-slate-300">
                <SkipBack size={20} />
              </button>
              <button
                onClick={togglePlayPause}
                className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-lg"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5 fill-current" />}
              </button>
              <button onClick={nextSong} className="text-white hover:text-slate-300">
                <SkipForward size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

// --- LOCK SCREEN PREVIEW ---
export const LockScreenPreviewSheet: React.FC = () => {
  const {
    isLockscreenPreviewOpen,
    setIsLockscreenPreviewOpen,
    currentSong,
    isPlaying,
    togglePlayPause,
    nextSong,
    previousSong,
    currentTime,
    duration,
  } = useMusic();

  if (!isLockscreenPreviewOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 bg-black flex flex-col justify-between p-6 pt-12 pb-10 select-none overflow-hidden">
        {/* Specular fluid background swirls */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="w-96 h-96 rounded-full bg-white/20 blur-3xl absolute -top-20 -left-20" />
        </div>

        {/* Top Header & Clock */}
        <div className="flex flex-col items-center text-center z-10">
          <div className="w-full flex justify-end">
            <button
              onClick={() => {
                haptics.selection();
                setIsLockscreenPreviewOpen(false);
              }}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
            >
              <X size={16} />
            </button>
          </div>
          <Lock size={18} className="text-slate-400 mb-1" />
          <h1 className="text-6xl font-light tracking-tight text-white font-mono">9:41</h1>
          <span className="text-xs text-slate-300 font-medium mt-1">Wednesday, October 23</span>
        </div>

        {/* Media Card on Lock Screen */}
        <div className="z-10 p-4 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/25 shrink-0">
              <img
                src={currentSong?.coverUrl}
                alt={currentSong?.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{currentSong?.title}</h4>
              <p className="text-xs text-slate-300 truncate mt-0.5">{currentSong?.artist}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-white"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-8">
            <button onClick={previousSong} className="text-white">
              <SkipBack size={22} />
            </button>
            <button
              onClick={togglePlayPause}
              className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-lg"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5 fill-current" />}
            </button>
            <button onClick={nextSong} className="text-white">
              <SkipForward size={22} />
            </button>
          </div>
        </div>

        {/* Bottom Swipe Bar */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-32 h-1 rounded-full bg-white/40" />
          <span className="text-[10px] text-slate-500">Swipe up to unlock</span>
        </div>
      </div>
    </AnimatePresence>
  );
};
