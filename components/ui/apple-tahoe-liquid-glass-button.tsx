"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { haptics } from "../../src/utils/haptics";

export const CODE4_SPRING = { damping: 25, stiffness: 150, mass: 0.5 };

export interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  material?: "clear" | "frosted" | "smoked" | "obsidian";
  appearance?: "light" | "dark" | "auto";
  refraction?: number;
  bezel?: number;
  blur?: number;
  saturation?: number;
  brightness?: number;
  dispersion?: number;
  fallbackBlur?: number;
  mode?: "auto" | "webgl" | "backdrop";
  interactive?: boolean;
  motion?: "full" | "reduced" | "none";
  fluid?: boolean;
  glowColor?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

/**
 * LiquidGlass (Apple Tahoe & Aave Labs Glass Surface)
 * Multi-layer optical refraction surface with customizable bezel, refraction factor, and specular sheen.
 */
export const LiquidGlass: React.FC<LiquidGlassProps> = ({
  material = "clear",
  appearance = "dark",
  refraction = 32,
  bezel = 32,
  blur = 20,
  saturation = 1.4,
  brightness = 1.05,
  dispersion = 0,
  fallbackBlur = 10,
  mode = "auto",
  interactive = false,
  motion: motionMode = "full",
  fluid = false,
  glowColor,
  children,
  className = "",
  onClick,
  style,
  ...props
}) => {
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const [sheen, setSheen] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!surfaceRef.current || !interactive) return;
    const rect = surfaceRef.current.getBoundingClientRect();
    setSheen({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handlePointerLeave = () => {
    if (interactive) setSheen((prev) => ({ ...prev, active: false }));
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactive) haptics.selection();
    onClick?.(e);
  };

  const appearanceBg = {
    dark: "rgba(10, 12, 18, 0.45)",
    light: "rgba(255, 255, 255, 0.22)",
    auto: "rgba(15, 18, 25, 0.38)",
  }[appearance];

  return (
    <motion.div
      ref={surfaceRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      whileHover={interactive && motionMode === "full" ? { scale: 1.015 } : undefined}
      whileTap={interactive && motionMode === "full" ? { scale: 0.96 } : undefined}
      transition={CODE4_SPRING}
      className={`relative overflow-hidden rounded-[24px] border border-white/20 select-none ${
        interactive ? "cursor-pointer" : ""
      } ${className}`}
      style={{
        backgroundColor: appearanceBg,
        backdropFilter: `blur(${blur || fallbackBlur}px) saturate(${saturation * 100}%) brightness(${brightness * 100}%)`,
        WebkitBackdropFilter: `blur(${blur || fallbackBlur}px) saturate(${saturation * 100}%) brightness(${brightness * 100}%)`,
        boxShadow: glowColor
          ? `0 16px 40px -10px rgba(0,0,0,0.5), 0 0 ${refraction}px -4px ${glowColor}50, inset 0 1.5px 2px rgba(255,255,255,0.35)`
          : `0 16px 40px -10px rgba(0,0,0,0.5), inset 0 1.5px 2px rgba(255,255,255,0.35), inset 0 -1px 1px rgba(0,0,0,0.3)`,
        ...style,
      }}
      {...(props as any)}
    >
      {/* Tahoe Specular Bezel Border Rim */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[24px] z-20"
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.48)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.22)",
          borderRight: "1px solid rgba(255, 255, 255, 0.15)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      />

      {/* Dynamic Specular Sheen (when interactive) */}
      {interactive && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            opacity: sheen.active ? 0.35 : 0,
            background: `radial-gradient(circle 140px at ${sheen.x}px ${sheen.y}px, rgba(255, 255, 255, 0.5), transparent 70%)`,
          }}
        />
      )}

      {/* Surface Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-black/[0.2] pointer-events-none z-0" />

      {/* Children content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export interface LiquidGlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  interactive?: boolean;
  glowColor?: string;
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
}

/**
 * LiquidGlassButton (Code 4 Spec)
 * Floating interactive button with fluid spring physics and specular refraction
 */
export const LiquidGlassButton = React.forwardRef<
  HTMLButtonElement,
  LiquidGlassButtonProps
>(
  (
    {
      children,
      interactive = true,
      glowColor,
      className = "",
      size = "default",
      onClick,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const [sheen, setSheen] = useState<{ x: number; y: number; active: boolean }>({
      x: 0,
      y: 0,
      active: false,
    });

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!btnRef.current || !interactive) return;
      const rect = btnRef.current.getBoundingClientRect();
      setSheen({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      });
    };

    const handlePointerLeave = () => {
      if (interactive) setSheen((prev) => ({ ...prev, active: false }));
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        haptics.impact("medium");
        onClick?.(e);
      }
    };

    const sizeClasses = {
      sm: "h-9 px-4 text-xs rounded-full gap-2",
      default: "h-12 px-6 text-sm rounded-full gap-2.5",
      lg: "h-14 px-8 text-base rounded-full gap-3",
      icon: "w-12 h-12 p-0 rounded-full flex items-center justify-center shrink-0",
    }[size];

    return (
      <motion.button
        ref={(node) => {
          btnRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as any).current = node;
        }}
        disabled={disabled}
        onClick={handleClick}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        whileHover={interactive && !disabled ? { scale: 1.03 } : undefined}
        whileTap={interactive && !disabled ? { scale: 0.94 } : undefined}
        transition={CODE4_SPRING}
        className={`group relative overflow-hidden backdrop-blur-2xl font-semibold tracking-tight select-none cursor-pointer border border-white/30 bg-gradient-to-b from-white/25 via-white/10 to-white/[0.04] text-white shadow-[0_12px_36px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.6)] ${sizeClasses} ${className}`}
        style={{
          boxShadow: glowColor
            ? `0 12px 36px rgba(0,0,0,0.5), 0 0 32px -4px ${glowColor}60, inset 0 1.5px 2px rgba(255,255,255,0.6)`
            : undefined,
          ...style,
        }}
        {...(props as any)}
      >
        {/* Specular Edge Highlight Top Rim */}
        <span className="absolute inset-x-3 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none rounded-full z-10" />

        {/* Dynamic Specular Sheen Following Cursor */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            opacity: sheen.active ? 0.45 : 0,
            background: `radial-gradient(circle 90px at ${sheen.x}px ${sheen.y}px, rgba(255, 255, 255, 0.7), transparent 70%)`,
          }}
        />

        <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
          {children}
        </span>
      </motion.button>
    );
  }
);

LiquidGlassButton.displayName = "LiquidGlassButton";
