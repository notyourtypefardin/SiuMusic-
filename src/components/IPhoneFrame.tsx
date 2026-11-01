import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Maximize2,
  Smartphone,
  Sliders,
  Code2,
  Sparkles,
  Play,
  Pause,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { haptics } from '../utils/haptics';
import { CODE4_SPRING } from '../utils/audioMath';

interface IPhoneFrameProps {
  children: React.ReactNode;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children }) => {
  const {
    settings,
    updateSettings,
    setIsCodeModalOpen,
    setIsEqualizerOpen,
    setIsTintCustomizerOpen,
    currentSong,
    isPlaying,
    togglePlayPause,
    setIsNowPlayingOpen,
  } = useMusic();

  const [currentTimeStr, setCurrentTimeStr] = useState('9:41');
  const [islandExpanded, setIslandExpanded] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTimeStr(`${hrs % 12 || 12}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const isPhoneFrame = settings.deviceFrameStyle === 'ios' || settings.showAndroidFrame;

  return (
    <div className="min-h-screen w-full bg-[#030305] flex flex-col items-center justify-start text-white overflow-x-hidden select-none">
      {/* Top Controller Bar */}
      <header className="w-full max-w-4xl px-4 py-2.5 flex items-center justify-between z-30 border-b border-white/10 bg-[#030305]/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl liquid-glass-card flex items-center justify-center text-white font-bold text-xs ring-1 ring-white/30 shadow-md">
            ♫
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-white font-display">SiuuMusic</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-200 font-medium border border-white/20">
                Liquid Glass
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium font-mono">
              Feel The Music · Black & Silver Edition
            </span>
          </div>
        </div>

        {/* View mode & inspector controls */}
        <div className="flex items-center gap-2">
          {/* Liquid Glass Customizer Trigger */}
          <button
            onClick={() => {
              haptics.selection();
              setIsTintCustomizerOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl liquid-glass-card text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 border border-white/20 transition-all active:scale-95 cursor-pointer shadow-sm"
            aria-label="Open Liquid Glass Customizer"
            title="Open Liquid Glass Customizer"
          >
            <Sparkles size={13} className="text-white animate-pulse" />
            <span>Glass Slider</span>
            <span className="text-[10px] bg-white/20 px-1.5 rounded text-white font-mono">
              {settings.liquidGlass.tintIntensity}%
            </span>
          </button>

          {/* Equalizer */}
          <button
            onClick={() => {
              haptics.selection();
              setIsEqualizerOpen(true);
            }}
            className="p-2 rounded-xl liquid-glass-card text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer border border-white/10"
            aria-label="Open 5-Band Equalizer"
            title="Open Equalizer"
          >
            <Sliders size={15} />
          </button>

          {/* Code Inspector */}
          <button
            onClick={() => {
              haptics.selection();
              setIsCodeModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl liquid-glass-card text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-white/20"
            aria-label="Inspect Native Code"
          >
            <Code2 size={14} className="text-slate-200" />
            <span className="hidden sm:inline">Inspect Code</span>
          </button>

          {/* Frame Toggle */}
          <button
            onClick={() => {
              haptics.selection();
              const nextStyle = isPhoneFrame ? 'expanded' : 'ios';
              updateSettings({
                deviceFrameStyle: nextStyle,
                showAndroidFrame: nextStyle === 'ios',
              });
            }}
            className="p-2 rounded-xl liquid-glass-card text-slate-300 hover:text-white flex items-center transition-all active:scale-95 cursor-pointer border border-white/10"
            aria-label="Toggle Phone Frame"
            title={isPhoneFrame ? 'Switch to Full Screen' : 'Switch to iPhone Frame'}
          >
            {isPhoneFrame ? <Maximize2 size={15} /> : <Smartphone size={15} />}
          </button>
        </div>
      </header>

      {/* Main Container: iOS Flagship Frame OR Expanded View */}
      <main className="w-full flex-1 flex items-center justify-center p-0 sm:p-4 my-auto">
        {isPhoneFrame ? (
          /* Liquid Glass Flagship Frame */
          <div
            className="relative w-full max-w-[420px] h-[890px] rounded-[52px] bg-[#07080B] border-[10px] border-[#181a24] shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_60px_-20px_rgba(255,255,255,0.12)] flex flex-col overflow-hidden ring-1 ring-white/15"
          >
            {/* Outer Specular Edge Highlight */}
            <div className="absolute inset-0 pointer-events-none rounded-[42px] border-t border-white/25 z-40" />

            {/* Status Bar & Dynamic Island */}
            <div className="w-full px-7 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-white/90 z-30 select-none bg-transparent relative">
              {/* Apple Clock */}
              <span className="text-[14px] font-semibold tracking-tight pl-1 text-white">
                {currentTimeStr}
              </span>

              {/* Dynamic Island Capsule */}
              <motion.div
                layout
                transition={CODE4_SPRING}
                onClick={() => {
                  haptics.selection();
                  setIslandExpanded(!islandExpanded);
                }}
                className={`bg-black rounded-full ring-1 ring-white/20 flex items-center justify-between px-2.5 py-1 cursor-pointer select-none shadow-xl z-40 overflow-hidden ${
                  islandExpanded
                    ? 'w-[230px] h-[38px] px-3'
                    : 'w-[124px] h-[30px]'
                }`}
              >
                {islandExpanded ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 min-w-0">
                      {currentSong && (
                        <img
                          src={currentSong.coverUrl}
                          alt={currentSong.title}
                          className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-white/30"
                        />
                      )}
                      <span className="text-[11px] font-medium text-white truncate max-w-[90px]">
                        {currentSong?.title || 'Paused'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          haptics.buttonPress();
                          togglePlayPause();
                        }}
                        className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white"
                      >
                        {isPlaying ? <Pause size={10} /> : <Play size={10} />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          haptics.selection();
                          setIsNowPlayingOpen(true);
                        }}
                        className="text-[10px] text-white font-semibold underline underline-offset-2"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    {/* Left: Mini Album thumbnail or camera dot */}
                    {currentSong && isPlaying ? (
                      <img
                        src={currentSong.coverUrl}
                        alt="mini"
                        className="w-4 h-4 rounded-full object-cover shrink-0 animate-spin"
                        style={{ animationDuration: '6s' }}
                      />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    )}

                    {/* Right: Live Dynamic Equalizer Bars (Liquid Silver) */}
                    {isPlaying ? (
                      <div className="flex items-end gap-[2px] h-3">
                        <span className="w-[2px] h-2 bg-white rounded-full animate-pulse shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                        <span
                          className="w-[2px] h-3 bg-white rounded-full animate-pulse shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                          style={{ animationDelay: '0.15s' }}
                        />
                        <span
                          className="w-[2px] h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                          style={{ animationDelay: '0.3s' }}
                        />
                      </div>
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    )}
                  </div>
                )}
              </motion.div>

              {/* Status Icons: 5G / Wi-Fi / Battery */}
              <div className="flex items-center gap-1.5 text-white/90 pr-1">
                <span className="text-[10px] font-semibold text-white/80 font-mono">5G</span>
                <Wifi size={13} />
                <div className="flex items-center gap-1 text-[11px] font-semibold font-mono">
                  <span>94%</span>
                  <Battery size={15} className="text-white" />
                </div>
              </div>
            </div>

            {/* Inner Content Area */}
            <div className="relative flex-1 flex flex-col overflow-hidden">
              {children}
            </div>

            {/* Home Indicator Bar */}
            <div className="w-full py-2 flex items-center justify-center bg-transparent z-40 pointer-events-auto">
              <div className="w-36 h-1 rounded-full bg-white/40 hover:bg-white/70 transition-colors cursor-pointer" />
            </div>
          </div>
        ) : (
          /* Expanded Full Canvas View */
          <div className="w-full max-w-4xl h-[92vh] rounded-[36px] bg-[#07080B] border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden relative">
            <div className="relative flex-1 flex flex-col overflow-hidden">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
