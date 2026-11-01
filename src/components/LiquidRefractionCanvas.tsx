import React, { useEffect, useRef, useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { globalAudioEngine } from '../utils/audioEngine';

/**
 * LiquidRefractionCanvas - Ultra-Realistic Black & Liquid Silver Theme
 * Pure obsidian depths, animated mercury/liquid silver caustics,
 * audio-reactive platinum glow, and specular chrome optical refraction.
 * Strict Black & Silver palette — no distracting colors.
 */
export const LiquidRefractionCanvas: React.FC = () => {
  const { isPlaying, settings } = useMusic();
  const { animationMode } = settings.liquidGlass;
  const [audioEnergy, setAudioEnergy] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Real-time audio energy sampling
  useEffect(() => {
    if (!isPlaying || animationMode === 'reduced') {
      setAudioEnergy(0);
      return;
    }

    const freqData = new Uint8Array(16);
    let smoothedEnergy = 0;

    const sample = () => {
      globalAudioEngine.getVisualizerData(freqData);
      // Sample low frequency bass range (bins 1 to 4)
      const bassSum = freqData[1] + freqData[2] + freqData[3] + freqData[4];
      const targetEnergy = bassSum / (4 * 255); // 0.0 to 1.0

      // Smooth interpolation
      smoothedEnergy += (targetEnergy - smoothedEnergy) * 0.18;
      setAudioEnergy(smoothedEnergy);

      animFrameRef.current = requestAnimationFrame(sample);
    };

    animFrameRef.current = requestAnimationFrame(sample);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, animationMode]);

  const pulseScale = 1 + audioEnergy * 0.28;
  const isReduced = animationMode === 'reduced';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Base Obsidian Black & Platinum Depth Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e1017] via-[#06070a] to-[#010204]" />

      {/* Code 1 Dotted Metallic Silver Grid Matrix */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="100%"
        width="100%"
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
      >
        <defs>
          <pattern
            patternUnits="userSpaceOnUse"
            height="24"
            width="24"
            id="silverMatrixGrid"
          >
            <circle
              fill="rgba(255, 255, 255, 0.25)"
              r="1.0"
              cy="2"
              cx="2"
            />
          </pattern>
          <radialGradient id="silverAmbientWash" cx="50%" cy="25%" r="75%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.16)" />
            <stop offset="35%" stopColor="rgba(203, 213, 225, 0.08)" />
            <stop offset="70%" stopColor="rgba(100, 116, 139, 0.02)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect fill="url(#silverMatrixGrid)" height="100%" width="100%" />
        <rect fill="url(#silverAmbientWash)" height="100%" width="100%" />
      </svg>

      {/* Central Liquid Mercury Sphere (Ultra-Realistic Silver Core) */}
      <div
        className={`absolute top-12 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full blur-[90px] transition-all duration-300 ${
          isReduced ? '' : 'animate-fluid-wave'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(226,232,240,0.18) 35%, rgba(148,163,184,0.08) 65%, transparent 80%)',
          transform: `translateX(-50%) scale(${pulseScale})`,
          opacity: 0.85 + audioEnergy * 0.45,
          animationDuration: isPlaying ? '9s' : '16s',
        }}
      />

      {/* Top Left Liquid Silver Refraction Orb */}
      <div
        className={`absolute -top-24 -left-20 w-[440px] h-[440px] rounded-full blur-[100px] transition-all duration-300 ${
          isReduced ? '' : 'animate-fluid-wave'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.24) 0%, rgba(203,213,225,0.14) 40%, rgba(71,85,105,0.05) 70%, transparent 85%)',
          opacity: 0.65 + audioEnergy * 0.35,
          transform: `scale(${1 + audioEnergy * 0.22})`,
          animationDuration: isPlaying ? '11s' : '20s',
        }}
      />

      {/* Right Metallic Platinum Liquid Orb */}
      <div
        className={`absolute top-1/3 -right-24 w-[400px] h-[400px] rounded-full blur-[95px] transition-all duration-300 ${
          isReduced ? '' : 'animate-fluid-wave'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(248,250,252,0.22) 0%, rgba(203,213,225,0.12) 45%, rgba(51,65,85,0.05) 75%, transparent 90%)',
          opacity: 0.55 + audioEnergy * 0.3,
          transform: `scale(${1 + audioEnergy * 0.18})`,
          animationDuration: isPlaying ? '12s' : '22s',
          animationDelay: '-4s',
        }}
      />

      {/* Bottom Obsidian & Silver Pool */}
      <div
        className={`absolute -bottom-24 left-1/2 -translate-x-1/2 w-[500px] h-[360px] rounded-full blur-[100px] transition-all duration-300 ${
          isReduced ? '' : 'animate-fluid-wave'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(226,232,240,0.18) 0%, rgba(148,163,184,0.08) 50%, transparent 80%)',
          opacity: 0.5 + audioEnergy * 0.25,
          transform: `translateX(-50%) scale(${pulseScale * 0.95})`,
          animationDuration: isPlaying ? '13s' : '24s',
          animationDelay: '-8s',
        }}
      />

      {/* Shimmering Liquid Silver Horizon Streak */}
      <div
        className="absolute top-0 inset-x-0 h-44 pointer-events-none opacity-80"
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(203, 213, 225, 0.05) 45%, transparent 100%)',
          boxShadow: 'inset 0 1.5px 0 rgba(255, 255, 255, 0.45)',
        }}
      />

      {/* Dynamic Specular Liquid Chrome Edge Highlights */}
      <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/30 via-white/5 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-white/30 via-white/5 to-transparent pointer-events-none" />
    </div>
  );
};
