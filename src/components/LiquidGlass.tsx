import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { haptics } from '../utils/haptics';
import { calculateSheenPosition, getSpringTransition, clamp } from '../utils/audioMath';

interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  enableDropletRipple?: boolean;
}

/**
 * Reusable LiquidGlassSurface (Level 3 Glass)
 * Provides frosted/smoked glass with multi-stop specular top-edge highlight and 30px backdrop blur.
 */
export const LiquidGlassSurface: React.FC<LiquidGlassProps> = ({
  children,
  className = '',
  glowColor,
  style,
  ...props
}) => {
  const [sheen, setSheen] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const surfaceRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!surfaceRef.current) return;
    const rect = surfaceRef.current.getBoundingClientRect();
    const pos = calculateSheenPosition(e.clientX, e.clientY, rect);
    setSheen({ x: pos.x, y: pos.y, active: true });
  };

  const handlePointerLeave = () => {
    setSheen((prev) => ({ ...prev, active: false }));
  };

  return (
    <div
      ref={surfaceRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative rounded-[20px] liquid-glass-surface overflow-hidden ${className}`}
      style={{
        boxShadow: glowColor
          ? `0 4px 10px rgba(0, 0, 0, 0.2), 0 0 45px -12px ${glowColor}33`
          : undefined,
        ...style,
      }}
      {...props}
    >
      {/* Specular refractive rim */}
      <div className="absolute inset-0 pointer-events-none rounded-[20px] border-t border-white/30" />

      {/* Dynamic Specular Light Refraction following pointer */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: sheen.active ? 0.35 : 0,
          background: `radial-gradient(circle 160px at ${sheen.x}px ${sheen.y}px, rgba(255, 255, 255, 0.25), transparent 70%)`,
        }}
      />

      {children}
    </div>
  );
};

/**
 * Reusable LiquidGlassCard (Level 2 Glass)
 * 20px rounded card with water droplet ripple feedback on tap, pointer-reactive specular sheen,
 * and Apple iOS 27 spring touch response.
 */
export const LiquidGlassCard: React.FC<
  LiquidGlassProps & { onClick?: () => void; isInteractive?: boolean }
> = ({
  children,
  className = '',
  glowColor,
  onClick,
  isInteractive = true,
  enableDropletRipple = true,
  style,
  ...props
}) => {
  const { settings } = useMusic();
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [sheen, setSheen] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const cardRef = useRef<HTMLDivElement | null>(null);

  const animationMode = settings.liquidGlass.animationMode || 'snappy';
  const springConfig = getSpringTransition(animationMode);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isInteractive) return;
    const rect = cardRef.current.getBoundingClientRect();
    const pos = calculateSheenPosition(e.clientX, e.clientY, rect);
    setSheen({ x: pos.x, y: pos.y, active: true });
  };

  const handlePointerLeave = () => {
    setSheen((prev) => ({ ...prev, active: false }));
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isInteractive) {
      if (settings.liquidGlass.dropletRippleEnabled && enableDropletRipple && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newRipple = { id: Date.now(), x, y };
        setRipples((prev) => [...prev.slice(-3), newRipple]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 500);
      }
      haptics.selection();
    }
    onClick?.();
  };

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      whileTap={
        isInteractive && animationMode !== 'reduced'
          ? { scale: 0.965 }
          : undefined
      }
      transition={springConfig}
      className={`relative rounded-[20px] liquid-glass-card overflow-hidden ${
        isInteractive ? 'cursor-pointer select-none' : ''
      } ${className}`}
      style={{
        boxShadow: glowColor
          ? `0 4px 10px rgba(0,0,0,0.2), 0 0 35px -10px ${glowColor}30`
          : undefined,
        ...style,
      }}
      {...(props as any)}
    >
      {/* Specular upper rim */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none rounded-t-[20px] z-10" />

      {/* Dynamic Specular Sheen following cursor/finger */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{
          opacity: sheen.active ? 0.38 : 0,
          background: `radial-gradient(circle 140px at ${sheen.x}px ${sheen.y}px, rgba(255, 255, 255, 0.28), transparent 70%)`,
        }}
      />

      {/* Water Droplet Wave Ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/35 pointer-events-none animate-droplet-ripple z-20"
          style={{
            left: ripple.x - 45,
            top: ripple.y - 45,
            width: 90,
            height: 90,
          }}
        />
      ))}

      {children}
    </motion.div>
  );
};

/**
 * Reusable LiquidGlassPill (Level 3 High Elevation Glass)
 * Pill container with 28px border-radius and specular curvature.
 */
export const LiquidGlassPill: React.FC<LiquidGlassProps> = ({
  children,
  className = '',
  glowColor,
  style,
  ...props
}) => {
  return (
    <div
      className={`relative rounded-[28px] liquid-glass-pill overflow-hidden ${className}`}
      style={{
        boxShadow: glowColor
          ? `0 4px 10px rgba(0, 0, 0, 0.2), 0 10px 30px -4px ${glowColor}35`
          : undefined,
        ...style,
      }}
      {...props}
    >
      <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};

/**
 * Reusable LiquidGlassButton
 * Tactile interactive button with spring tap response.
 */
export const LiquidGlassButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost';
    glowColor?: string;
  }
> = ({
  children,
  className = '',
  variant = 'secondary',
  glowColor,
  disabled,
  style,
  onClick,
  ...props
}) => {
  const { settings } = useMusic();
  const animationMode = settings.liquidGlass.animationMode || 'snappy';
  const springConfig = getSpringTransition(animationMode);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      haptics.selection();
      onClick?.(e);
    }
  };

  return (
    <motion.button
      disabled={disabled}
      onClick={handleClick}
      whileTap={
        !disabled && animationMode !== 'reduced'
          ? { scale: 0.94 }
          : undefined
      }
      transition={springConfig}
      className={`relative px-4 py-2.5 rounded-[16px] text-xs font-semibold tracking-tight transition-colors duration-200 flex items-center justify-center gap-2 select-none ${
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'cursor-pointer'
      } ${
        variant === 'primary'
          ? 'bg-gradient-to-r from-white to-slate-100 text-slate-900 shadow-md font-bold'
          : 'liquid-glass-button text-white hover:text-white'
      } ${className}`}
      style={{
        boxShadow:
          variant === 'primary' && glowColor
            ? `0 4px 14px -2px ${glowColor}66`
            : undefined,
        ...style,
      }}
      {...(props as any)}
    >
      {/* Specular button top edge reflection */}
      <span className="absolute inset-x-2 top-0 h-[1px] bg-white/40 pointer-events-none rounded-full" />
      {children}
    </motion.button>
  );
};

/**
 * Reusable LiquidGlassArtworkFrame
 * Features ultra-realistic gyroscopic 3D parallax tilt reacting to device motion sensors (gamma/beta),
 * smooth pointer parallax fallback, shifting specular sheen, and Code 4 spring physics.
 */
export const LiquidGlassArtworkFrame: React.FC<{
  src: string;
  alt: string;
  className?: string;
  dominantColor?: string;
  isPlaying?: boolean;
}> = ({ src, alt, className = '', dominantColor, isPlaying = false }) => {
  const frameRef = useRef<HTMLDivElement | null>(null);

  // Motion values for tilt angles (degrees)
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  // Smooth springs with Code 4 physics { damping: 25, stiffness: 150, mass: 0.5 }
  const smoothTiltX = useSpring(tiltX, { damping: 25, stiffness: 150, mass: 0.5 });
  const smoothTiltY = useSpring(tiltY, { damping: 25, stiffness: 150, mass: 0.5 });

  // Dynamic specular sheen coordinates derived from tilt
  const sheenX = useTransform(smoothTiltY, [-12, 12], [20, 80]);
  const sheenY = useTransform(smoothTiltX, [-12, 12], [80, 20]);

  // Gyroscopic device orientation sensor listener
  useEffect(() => {
    let hasGyroscope = false;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      hasGyroscope = true;
      // gamma: tilt left-to-right [-90, 90]
      // beta: tilt front-to-back [-180, 180] (handheld baseline ~ 42°)
      const normY = clamp(-e.gamma * 0.38, -14, 14);
      const normX = clamp((e.beta - 42) * 0.35, -14, 14);

      tiltX.set(normX);
      tiltY.set(normY);
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [tiltX, tiltY]);

  // Pointer move fallback for desktop / touch drag parallax
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    tiltY.set(clamp(deltaX * 12, -14, 14));
    tiltX.set(clamp(-deltaY * 12, -14, 14));
  };

  const handlePointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="w-full h-full flex items-center justify-center select-none"
    >
      <motion.div
        ref={frameRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX: smoothTiltX,
          rotateY: smoothTiltY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.025 }}
        whileTap={{ scale: 0.96 }}
        transition={{ damping: 25, stiffness: 150, mass: 0.5 }}
        className={`relative rounded-[32px] p-2.5 liquid-glass-surface transition-shadow duration-500 overflow-hidden cursor-pointer ${className}`}
      >
        {/* Ambient liquid silver and deep obsidian rim shadow */}
        <div
          className="absolute inset-0 rounded-[32px] pointer-events-none transition-all duration-700"
          style={{
            boxShadow:
              '0 24px 60px -10px rgba(255, 255, 255, 0.22), 0 8px 24px rgba(0, 0, 0, 0.85), inset 0 1.5px 2px rgba(255, 255, 255, 0.45)',
          }}
        />

        {/* Specular Liquid Top Rim */}
        <div className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none rounded-full z-20" />

        {/* Dynamic Gyroscopic Refraction & Sheen Overlay */}
        <motion.div
          className="absolute inset-2 rounded-[24px] overflow-hidden pointer-events-none z-10"
          style={{
            background: useTransform(
              [sheenX, sheenY],
              ([x, y]) =>
                `radial-gradient(circle 240px at ${x}% ${y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 45%, transparent 70%)`
            ),
          }}
        />

        {/* High-res Cover Art with Depth */}
        <div className="relative w-full h-full rounded-[24px] overflow-hidden shadow-inner bg-black/40">
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              isPlaying ? 'scale-[1.03]' : 'scale-100'
            }`}
          />
          {/* Inner Vignette for Photorealism */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10 pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
};
