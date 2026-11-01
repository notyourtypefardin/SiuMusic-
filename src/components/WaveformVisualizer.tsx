import React, { useEffect, useRef } from 'react';
import { globalAudioEngine } from '../utils/audioEngine';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  color?: string;
  bars?: number;
  height?: number;
  className?: string;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isPlaying,
  color = '#FFFFFF',
  bars = 20,
  height = 36,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const smoothedValuesRef = useRef<Float32Array>(new Float32Array(bars));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(bars * 2);
    let smoothed = smoothedValuesRef.current;
    if (smoothed.length !== bars) {
      smoothed = new Float32Array(bars);
      smoothedValuesRef.current = smoothed;
    }

    let phase = 0;

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      const width = canvas.width;
      const canvasHeight = canvas.height;

      ctx.clearRect(0, 0, width, canvasHeight);

      if (isPlaying) {
        globalAudioEngine.getVisualizerData(dataArray);
      } else {
        phase += 0.04;
      }

      const barWidth = Math.max(2, (width / bars) * 0.62);
      const spacing = (width - barWidth * bars) / Math.max(1, bars - 1);

      for (let i = 0; i < bars; i++) {
        let targetValue = 0;
        if (isPlaying) {
          // Spread frequency bins nicely
          const raw = dataArray[i] || 0;
          targetValue = Math.max(8, raw);
        } else {
          // Subtle idle sine wave breathing
          targetValue = 16 + Math.sin(phase + i * 0.35) * 8;
        }

        // Smooth physics interpolation (fast attack, smooth release)
        if (targetValue > smoothed[i]) {
          smoothed[i] += (targetValue - smoothed[i]) * 0.45;
        } else {
          smoothed[i] += (targetValue - smoothed[i]) * 0.18;
        }

        const barHeight = Math.max(4, (smoothed[i] / 255) * (canvasHeight - 4));
        const x = i * (barWidth + spacing);
        const y = (canvasHeight - barHeight) / 2;

        // Glass gradient: glowing tip to subtle base
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.35, color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.15)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
        ctx.fill();

        // Specular dot highlight on top cap
        if (barHeight > 8) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, y + barWidth / 2, barWidth * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, color, bars]);

  return (
    <canvas
      ref={canvasRef}
      width={bars * 6.5}
      height={height}
      className={`block select-none ${className}`}
      aria-label="Audio Waveform Visualizer"
    />
  );
};
