import React, { useState, useEffect } from 'react';
import {
  Wifi,
  BatteryCharging,
  Smartphone,
  Maximize2,
  Code2,
  Sliders,
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { haptics } from '../utils/haptics';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const {
    settings,
    updateSettings,
    setIsCodeModalOpen,
    setIsEqualizerOpen,
  } = useMusic();

  const [currentTimeStr, setCurrentTimeStr] = useState('02:19');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTimeStr(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const isPhoneFrame = settings.showAndroidFrame;

  return (
    <div className="min-h-screen w-full bg-[#030305] flex flex-col items-center justify-start text-[#F7F7FA] overflow-x-hidden select-none">
      {/* Top Controller Bar */}
      <header className="w-full max-w-4xl px-4 py-3 flex items-center justify-between z-30 border-b border-white/5 bg-[#030305]/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl liquid-glass-surface flex items-center justify-center text-[#F7F7FA] font-black text-xs border border-white/20">
            S
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-[#F7F7FA] font-display">SiuuMusic</span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-[#727685]">
              Feel The Music · Black & Silver Edition
            </span>
          </div>
        </div>

        {/* View mode & inspector controls */}
        <div className="flex items-center gap-2">
          {/* Frame Toggle */}
          <button
            onClick={() => {
              haptics.selection();
              updateSettings({ showAndroidFrame: !isPhoneFrame });
            }}
            className="px-3 py-1.5 rounded-xl liquid-glass-card text-xs font-semibold text-[#A4A7B3] hover:text-[#F7F7FA] flex items-center gap-1.5 transition-all active:scale-95 border border-white/10"
            aria-label="Toggle Phone Frame"
            title={isPhoneFrame ? "Switch to Expanded View" : "Switch to Android Phone Frame"}
          >
            {isPhoneFrame ? <Maximize2 size={13} /> : <Smartphone size={13} />}
            <span className="hidden sm:inline">
              {isPhoneFrame ? 'Expand View' : 'Phone Frame'}
            </span>
          </button>

          {/* Equalizer */}
          <button
            onClick={() => {
              haptics.selection();
              setIsEqualizerOpen(true);
            }}
            className="p-2 rounded-xl liquid-glass-card text-[#A4A7B3] hover:text-white transition-all active:scale-95 border border-white/10"
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
            className="px-3 py-1.5 rounded-xl liquid-glass-card text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 border-t border-white/20 transition-all active:scale-95"
            aria-label="Inspect Jetpack Compose Kotlin Code"
          >
            <Code2 size={14} className="text-slate-200" />
            <span className="hidden sm:inline">Compose Code</span>
          </button>
        </div>
      </header>

      {/* Main Container: Android 15 Frame OR Expanded Full View */}
      <main className="w-full flex-1 flex items-center justify-center p-0 sm:p-4 my-auto">
        {isPhoneFrame ? (
          /* Android 15 Flagship Smoked Obsidian Frame */
          <div
            className="relative w-full max-w-[420px] h-[890px] rounded-[48px] bg-[#07080B] border-[9px] border-[#13151D] shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_60px_-20px_rgba(255,255,255,0.1)] flex flex-col overflow-hidden ring-1 ring-white/10"
          >
            {/* Outer Specular Edge Highlight */}
            <div className="absolute inset-0 pointer-events-none rounded-[39px] border-t border-white/15 z-40" />

            {/* Android 15 Status Bar */}
            <div className="w-full px-7 pt-3.5 pb-1 flex items-center justify-between text-xs font-semibold text-slate-300 z-30 select-none bg-transparent">
              {/* Clock */}
              <span className="text-[12px] font-medium tracking-tight font-mono pl-1 text-[#F7F7FA]">
                {currentTimeStr}
              </span>

              {/* Punch hole selfie camera */}
              <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-white/20 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#181818]" />
              </div>

              {/* Status Icons: 5G / Wi-Fi / Battery */}
              <div className="flex items-center gap-1.5 text-slate-300 pr-1">
                <span className="text-[10px] font-mono font-bold tracking-tighter text-[#A4A7B3]">5G</span>
                <Wifi size={13} />
                <div className="flex items-center gap-0.5 font-mono text-[11px]">
                  <span>94%</span>
                  <BatteryCharging size={14} className="text-white" />
                </div>
              </div>
            </div>

            {/* Inner screen content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {children}
            </div>

            {/* Android Gesture Navigation Bar Pill */}
            <div className="w-full py-2 flex items-center justify-center bg-transparent z-30 pointer-events-none">
              <div className="w-32 h-1 rounded-full bg-white/25" />
            </div>
          </div>
        ) : (
          /* Full Screen Responsive View */
          <div className="w-full max-w-3xl h-[88vh] rounded-3xl bg-[#07080B] border border-white/10 shadow-2xl flex flex-col overflow-hidden relative">
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
