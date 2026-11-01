import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  X,
  Droplets,
  Sparkles,
  Eye,
  Sun,
  Moon,
  RotateCcw,
  Zap,
  Waves,
  Activity,
  Shield,
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { TintHue } from '../types/music';
import { haptics } from '../utils/haptics';
import { CODE4_SPRING } from '../utils/audioMath';

export const LiquidGlassCustomizer: React.FC = () => {
  const { isTintCustomizerOpen, setIsTintCustomizerOpen, settings, updateLiquidGlass } = useMusic();
  const {
    tintIntensity,
    tintHue,
    blurRadius,
    appearance,
    dropletRippleEnabled,
    animationMode = 'snappy',
  } = settings.liquidGlass;

  if (!isTintCustomizerOpen) return null;

  const MOOD_PRESETS: { id: TintHue; name: string; color: string; desc: string }[] = [
    { id: 'crystal', name: 'Crystal Silver', color: '#FFFFFF', desc: 'Clear optical frosted liquid glass' },
    { id: 'platinum', name: 'Liquid Platinum', color: '#E2E8F0', desc: 'Ultra-bright platinum luster' },
    { id: 'chrome', name: 'Metallic Chrome', color: '#CBD5E1', desc: 'Mirror-polished chrome reflection' },
    { id: 'titanium', name: 'Brushed Titanium', color: '#94A3B8', desc: 'Aerospace-grade silver titanium' },
    { id: 'obsidian', name: 'Smoked Obsidian', color: '#475569', desc: 'Deep smoked black optical glass' },
    { id: 'onyx', name: 'Onyx Carbon', color: '#1E293B', desc: 'Dark obsidian mirror depths' },
  ];

  const handleReset = () => {
    haptics.stateChange();
    updateLiquidGlass({
      tintIntensity: 25,
      tintHue: 'crystal',
      blurRadius: 30,
      appearance: 'frosted-white',
      specularSheen: 80,
      dropletRippleEnabled: true,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md select-none">
        {/* Backdrop click to close */}
        <div
          className="absolute inset-0"
          onClick={() => {
            haptics.selection();
            setIsTintCustomizerOpen(false);
          }}
        />

        <motion.div
          initial={{ y: '100%', opacity: 0.9 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0.9 }}
          transition={CODE4_SPRING}
          className="relative w-full max-w-lg liquid-glass-sheet sm:rounded-[32px] rounded-t-[32px] p-6 pb-9 sm:pb-6 z-10 flex flex-col space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar border-t border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
        >
          {/* Specular top rim line */}
          <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none rounded-full" />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl liquid-glass-card flex items-center justify-center text-white border border-white/20 shadow-md">
                <Sliders size={18} />
              </div>
              <div>
                <h2 className="text-sf-title-22 text-white font-semibold tracking-tight">
                  Liquid Glass Engine
                </h2>
                <p className="text-sf-caption-13 text-slate-300 font-mono">
                  Black & Silver · Real-time Optical Caustics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 rounded-xl liquid-glass-button text-slate-300 hover:text-white cursor-pointer active:scale-95 transition-transform"
                title="Reset to defaults"
                aria-label="Reset defaults"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => {
                  haptics.selection();
                  setIsTintCustomizerOpen(false);
                }}
                className="p-2 rounded-xl liquid-glass-button text-slate-300 hover:text-white cursor-pointer active:scale-95 transition-transform"
                aria-label="Close customizer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Interactive Liquid Glass Customization Slider */}
          <div className="space-y-3 liquid-glass-card p-4 border border-white/15">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-white">
                <Sparkles size={14} className="text-white" />
                Silver Specular Refraction Depth
              </span>
              <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded-md border border-white/20">
                {tintIntensity}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={tintIntensity}
              onChange={(e) => {
                haptics.seek();
                const val = Number(e.target.value);
                updateLiquidGlass({ tintIntensity: val });
              }}
              className="w-full h-2 rounded-lg bg-white/20 accent-white cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-medium pt-0.5">
              <span>Pure Crystal Glass (0%)</span>
              <span>Liquid Silver (50%)</span>
              <span>Ultra Platinum (100%)</span>
            </div>
          </div>

          {/* Color Tint Presets - Strict Black & Silver */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Liquid Metallic Material (Black & Silver)
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {MOOD_PRESETS.map((mood) => {
                const isSelected = tintHue === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => {
                      haptics.selection();
                      updateLiquidGlass({ tintHue: mood.id });
                    }}
                    className={`relative p-3 rounded-2xl liquid-glass-card flex flex-col items-start gap-1.5 transition-all text-left cursor-pointer border ${
                      isSelected
                        ? 'ring-2 ring-white border-white bg-white/15 scale-[1.02] shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                        : 'border-white/10 hover:border-white/30 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span
                        className="w-3.5 h-3.5 rounded-full ring-1 ring-white/60 shadow-sm"
                        style={{ backgroundColor: mood.color }}
                      />
                      <span className="text-xs font-bold text-white truncate">
                        {mood.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 line-clamp-1">
                      {mood.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blur & Optical Depth Controls */}
          <div className="space-y-3 liquid-glass-card p-4 border border-white/15">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-white">
                <Eye size={14} className="text-slate-200" />
                Backdrop Blur Radius (Gaussian)
              </span>
              <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded-md border border-white/20">
                {blurRadius}px
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="50"
              step="2"
              value={blurRadius}
              onChange={(e) => {
                haptics.seek();
                const val = Number(e.target.value);
                updateLiquidGlass({ blurRadius: val });
              }}
              className="w-full h-2 rounded-lg bg-white/20 accent-white cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-medium pt-0.5">
              <span>Crisp Crystal (10px)</span>
              <span>Calibrated Optical (30px)</span>
              <span>Deep Smoked Velvet (50px)</span>
            </div>
          </div>

          {/* Appearance Mode: Frosted White vs Smoked Dark */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Glass Base Tone
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  haptics.selection();
                  updateLiquidGlass({ appearance: 'frosted-white' });
                }}
                className={`p-3 rounded-2xl liquid-glass-card flex items-center gap-3 transition-all cursor-pointer border ${
                  appearance === 'frosted-white'
                    ? 'ring-2 ring-white border-white bg-white/15 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    : 'border-white/10 hover:border-white/25'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Sun size={16} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Frosted Silver</div>
                  <div className="text-[10px] text-slate-300">#FFFFFF @ 70% Alpha</div>
                </div>
              </button>

              <button
                onClick={() => {
                  haptics.selection();
                  updateLiquidGlass({ appearance: 'smoked-dark' });
                }}
                className={`p-3 rounded-2xl liquid-glass-card flex items-center gap-3 transition-all cursor-pointer border ${
                  appearance === 'smoked-dark'
                    ? 'ring-2 ring-white border-white bg-white/15 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    : 'border-white/10 hover:border-white/25'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-black/60 flex items-center justify-center text-slate-200">
                  <Moon size={16} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Smoked Obsidian</div>
                  <div className="text-[10px] text-slate-300">Pure Black Optical</div>
                </div>
              </button>
            </div>
          </div>

          {/* Droplet Ripple Animation Toggle */}
          <div className="liquid-glass-card p-4 flex items-center justify-between border border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl liquid-glass-surface flex items-center justify-center text-white">
                <Droplets size={16} />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Water Droplet Wave Animation</div>
                <div className="text-[11px] text-slate-400">~0.45s fluid refraction ripple on taps</div>
              </div>
            </div>

            <button
              onClick={() => {
                haptics.selection();
                updateLiquidGlass({ dropletRippleEnabled: !dropletRippleEnabled });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                dropletRippleEnabled ? 'bg-white' : 'bg-white/20'
              }`}
              aria-label="Toggle water droplet ripple"
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-900 shadow-md transition-transform transform absolute top-0.5 left-0.5 ${
                  dropletRippleEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Animation Physics Dynamics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Animation Dynamics & Spring Feel
              </span>
              <span className="text-[11px] text-white font-mono capitalize bg-white/10 px-2 py-0.5 rounded">
                {animationMode}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  haptics.selection();
                  updateLiquidGlass({ animationMode: 'snappy' });
                }}
                className={`p-3 rounded-2xl liquid-glass-card flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
                  animationMode === 'snappy'
                    ? 'ring-2 ring-white border-white bg-white/20'
                    : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <Zap size={16} className="text-white" />
                <span className="text-xs font-bold text-white">Code 4 Snappy</span>
                <span className="text-[9px] text-slate-400 text-center">Fast spring (150k)</span>
              </button>

              <button
                onClick={() => {
                  haptics.selection();
                  updateLiquidGlass({ animationMode: 'fluid' });
                }}
                className={`p-3 rounded-2xl liquid-glass-card flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
                  animationMode === 'fluid'
                    ? 'ring-2 ring-white border-white bg-white/20'
                    : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <Waves size={16} className="text-slate-200" />
                <span className="text-xs font-bold text-white">Fluid Lush</span>
                <span className="text-[9px] text-slate-400 text-center">Smooth liquid flow</span>
              </button>

              <button
                onClick={() => {
                  haptics.selection();
                  updateLiquidGlass({ animationMode: 'reduced' });
                }}
                className={`p-3 rounded-2xl liquid-glass-card flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
                  animationMode === 'reduced'
                    ? 'ring-2 ring-white border-white bg-white/20'
                    : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
              >
                <Activity size={16} className="text-slate-300" />
                <span className="text-xs font-bold text-white">Reduced</span>
                <span className="text-[9px] text-slate-400 text-center">Accessible gentle fade</span>
              </button>
            </div>
          </div>

          {/* Active Specification Readout */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-[11px] text-slate-400 space-y-1 font-mono">
            <div className="text-white font-semibold flex items-center gap-1.5 text-xs">
              <Shield size={13} className="text-slate-300" />
              Active Liquid Glass Spec:
            </div>
            <div>backdrop-filter: blur({blurRadius}px) saturate(180%)</div>
            <div>theme: Black & Silver / Obsidian Platinum</div>
            <div>physics: Code 4 Spring (stiffness: 150, damping: 25, mass: 0.5)</div>
            <div>tactile: Haptic feedback enabled on all touch & drag interactions</div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
