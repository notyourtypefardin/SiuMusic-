import React from 'react';
import { X, Sliders, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { CODE4_SPRING } from '../utils/audioMath';
import { haptics } from '../utils/haptics';

export const EqualizerModal: React.FC = () => {
  const {
    equalizer,
    setEqualizerPreset,
    updateEqualizerBand,
    updateEqualizerPreamp,
    setEqualizerEnabled,
    isEqualizerOpen,
    setIsEqualizerOpen,
  } = useMusic();

  if (!isEqualizerOpen) return null;

  const BANDS: {
    id: 'bass' | 'lowMid' | 'mid' | 'highMid' | 'treble';
    label: string;
    freq: string;
    value: number;
  }[] = [
    { id: 'bass', label: '60', freq: '60 Hz', value: equalizer.bass },
    { id: 'lowMid', label: '230', freq: '230 Hz', value: equalizer.lowMid },
    { id: 'mid', label: '910', freq: '910 Hz', value: equalizer.mid },
    { id: 'highMid', label: '3.6k', freq: '3.6 kHz', value: equalizer.highMid },
    { id: 'treble', label: '14k', freq: '14 kHz', value: equalizer.treble },
  ];

  const PRESETS = [
    'Normal',
    'Bass Boost',
    'Jazz',
    'Rock',
    'Pop',
    'Classical',
  ];

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-2xl flex flex-col justify-end sm:justify-center p-0 sm:p-4 select-none">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={CODE4_SPRING}
          className="w-full max-w-md mx-auto rounded-t-3xl sm:rounded-3xl bg-[#090A0C] border-t sm:border border-white/20 p-6 space-y-6 shadow-2xl relative overflow-hidden"
        >
          {/* Specular top sheen */}
          <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

          {/* Header matching reference: Title + Master Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-white" />
              <h2 className="text-lg font-black text-white tracking-tight">Equalizer</h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setEqualizerEnabled(!equalizer.enabled)}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  equalizer.enabled ? 'bg-white' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-black transition-transform ${
                    equalizer.enabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>

              <button
                onClick={() => {
                  haptics.selection();
                  setIsEqualizerOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-slate-300 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Preset Selector Dropdown Bar */}
          <div className="relative">
            <div className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 text-white text-xs font-bold">
              <span>{equalizer.preset}</span>
              <ChevronDown size={15} className="text-slate-400" />
            </div>
          </div>

          {/* 5 Vertical Faders (60, 230, 910, 3.6k, 14k) */}
          <div className="grid grid-cols-5 gap-3 py-2">
            {BANDS.map((band) => {
              const displayVal = band.value > 0 ? `+${band.value}` : `${band.value}`;
              return (
                <div key={band.id} className="flex flex-col items-center gap-3">
                  {/* Slider Value */}
                  <span className="text-xs font-mono font-bold text-white">
                    {displayVal}
                  </span>

                  {/* Vertical Range Slider */}
                  <div className="h-40 flex items-center justify-center relative">
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={band.value}
                      disabled={!equalizer.enabled}
                      onChange={(e) => {
                        updateEqualizerBand(band.id, Number(e.target.value));
                      }}
                      className="h-32 w-1.5 appearance-none bg-white/20 rounded-full outline-none cursor-pointer accent-white [writing-mode:vertical-lr] [direction:rtl]"
                    />
                  </div>

                  {/* Frequency Label */}
                  <span className="text-xs font-bold text-slate-300">
                    {band.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Preamp Horizontal Slider */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Preamp</span>
              <span className="font-mono text-white font-bold">
                {equalizer.preamp > 0 ? `+${equalizer.preamp}` : equalizer.preamp} dB
              </span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={equalizer.preamp}
              disabled={!equalizer.enabled}
              onChange={(e) => updateEqualizerPreamp(Number(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-full appearance-none accent-white cursor-pointer"
            />
          </div>

          {/* 6 Preset Buttons (2x3 Grid matching Reference Image) */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {PRESETS.map((preset) => {
              const isSelected = equalizer.preset.toLowerCase() === preset.toLowerCase();
              return (
                <button
                  key={preset}
                  onClick={() => setEqualizerPreset(preset)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black shadow-lg scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {preset}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
