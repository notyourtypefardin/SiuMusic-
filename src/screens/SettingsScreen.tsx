import React, { useState } from 'react';
import {
  User,
  PlayCircle,
  Headphones,
  Sliders,
  Moon,
  Bell,
  Palette,
  Vibrate,
  Globe,
  Info,
  ChevronRight,
  ShieldCheck,
  Check,
  Trash2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { CODE4_SPRING } from '../utils/audioMath';
import { haptics } from '../utils/haptics';

export const SettingsScreen: React.FC = () => {
  const {
    settings,
    updateSettings,
    clearCache,
    setIsEqualizerOpen,
    setIsTintCustomizerOpen,
    setIsPrimeModalOpen,
    setIsSleepTimerOpen,
    setIsHapticModalOpen,
    setIsNotificationPreviewOpen,
    setIsSplashActive,
  } = useMusic();

  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    clearCache();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  const SETTINGS_ROWS = [
    {
      id: 'account',
      title: 'Account',
      badge: settings.primeModeActive ? 'VIP Prime' : 'Free Tier',
      icon: User,
      action: () => setIsPrimeModalOpen(true),
    },
    {
      id: 'playback',
      title: 'Playback',
      badge: 'Gapless & ReplayGain',
      icon: PlayCircle,
      action: () => {
        haptics.selection();
        updateSettings({ gaplessPlayback: !settings.gaplessPlayback });
      },
    },
    {
      id: 'audio-quality',
      title: 'Audio Quality',
      badge: 'Lossless >',
      icon: Headphones,
      action: () => {
        haptics.selection();
        const nextQuality =
          settings.audioQuality === 'lossless'
            ? 'hires'
            : settings.audioQuality === 'hires'
            ? 'standard'
            : 'lossless';
        updateSettings({ audioQuality: nextQuality });
      },
    },
    {
      id: 'equalizer',
      title: 'Equalizer',
      badge: '5-Band Hardware >',
      icon: Sliders,
      action: () => setIsEqualizerOpen(true),
    },
    {
      id: 'sleep-timer',
      title: 'Sleep Timer',
      badge: settings.sleepTimerMinutes ? `${settings.sleepTimerMinutes}m >` : 'Off >',
      icon: Moon,
      action: () => setIsSleepTimerOpen(true),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      badge: 'Active >',
      icon: Bell,
      action: () => setIsNotificationPreviewOpen(true),
    },
    {
      id: 'appearance',
      title: 'Appearance',
      badge: 'Black & Silver >',
      icon: Palette,
      action: () => setIsTintCustomizerOpen(true),
    },
    {
      id: 'haptics',
      title: 'Haptic Feedback',
      badge: settings.haptics ? 'On >' : 'Off >',
      icon: Vibrate,
      action: () => setIsHapticModalOpen(true),
    },
    {
      id: 'language',
      title: 'Language',
      badge: 'English >',
      icon: Globe,
      action: () => {
        haptics.selection();
      },
    },
    {
      id: 'about',
      title: 'About',
      badge: 'v2.4 Pro >',
      icon: Info,
      action: () => setIsSplashActive(true),
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-36 px-4 pt-3 space-y-4 select-none">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={CODE4_SPRING}
        className="pt-1"
      >
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Preferences
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>
      </motion.div>

      {/* User Profile Card matching Reference Image: "Fardin - Premium" */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={CODE4_SPRING}
        onClick={() => {
          haptics.selection();
          setIsPrimeModalOpen(true);
        }}
        className="relative p-4 rounded-3xl bg-gradient-to-r from-white/15 via-white/[0.08] to-white/[0.03] border border-white/20 flex items-center justify-between cursor-pointer group hover:border-white/40 shadow-xl transition-all"
      >
        <div className="flex items-center gap-3.5">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/40 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
              alt="Fardin"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-white tracking-tight">Fardin</h2>
              <ShieldCheck size={16} className="text-white" />
            </div>
            <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-semibold text-white">
              <span>{settings.primeModeActive ? 'Prime VIP' : 'Premium'}</span>
            </div>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
          <ChevronRight size={18} />
        </div>
      </motion.div>

      {/* 10 Settings Glass Rows matching Reference Design */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={CODE4_SPRING}
        className="space-y-1.5"
      >
        {SETTINGS_ROWS.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.id}
              onClick={() => {
                haptics.selection();
                row.action();
              }}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 cursor-pointer active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/15 shrink-0">
                  <Icon size={16} />
                </div>
                <span className="text-xs font-bold text-white tracking-tight">{row.title}</span>
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                <span className="text-xs font-medium">{row.badge}</span>
                <ChevronRight size={14} className="text-slate-500" />
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Cache / Reset Options */}
      <div className="pt-2">
        <button
          onClick={handleClearCache}
          className="w-full py-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {cacheCleared ? (
            <>
              <Check size={14} className="text-white" />
              <span className="text-white font-bold">Cache Cleared</span>
            </>
          ) : (
            <>
              <Trash2 size={14} />
              <span>Reset & Clear Local Cache</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
