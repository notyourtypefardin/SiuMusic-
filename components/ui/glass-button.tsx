"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { haptics } from "../../src/utils/haptics";

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  size?: "sm" | "default" | "lg" | "icon";
  contentClassName?: string;
  glowColor?: string;
  variant?: "silver" | "obsidian" | "chromatic";
}

export const CODE4_SPRING = { damping: 25, stiffness: 150, mass: 0.5 };

export const DottedBackground = ({
  className = "",
  dotColor = "rgba(255, 255, 255, 0.16)",
}: {
  className?: string;
  dotColor?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="100%"
    width="100%"
    className={`pointer-events-none absolute inset-0 z-0 ${className}`}
  >
    <defs>
      <pattern
        patternUnits="userSpaceOnUse"
        height="28"
        width="28"
        id="dottedGrid"
      >
        <circle fill={dotColor} r="1.2" cy="2" cx="2" />
      </pattern>
      <radialGradient id="silverVignette" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
        <stop offset="60%" stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
      </radialGradient>
    </defs>
    <rect fill="url(#dottedGrid)" height="100%" width="100%" />
    <rect fill="url(#silverVignette)" height="100%" width="100%" />
  </svg>
);

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      children,
      className = "",
      size = "default",
      contentClassName = "",
      glowColor,
      variant = "silver",
      onClick,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Spring cursor tracking sheen
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, CODE4_SPRING);
    const smoothY = useSpring(mouseY, CODE4_SPRING);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        haptics.selection();
        onClick?.(e);
      }
    };

    // Size variants conforming to Code 1 & Apple HIG
    const sizeClasses = {
      sm: "h-8 px-3.5 text-xs rounded-full gap-1.5",
      default: "h-11 px-5 text-sm rounded-full gap-2.5",
      lg: "h-13 px-7 text-base rounded-full gap-3",
      icon: "w-11 h-11 p-0 rounded-full flex items-center justify-center shrink-0",
    }[size];

    // Metallic silver / obsidian tone
    const variantClasses = {
      silver:
        "border border-white/25 hover:border-white/50 active:border-white/70 bg-gradient-to-b from-white/20 via-white/10 to-white/[0.04] text-white shadow-[0_8px_24px_rgba(0,0,0,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.45)]",
      obsidian:
        "border border-white/15 hover:border-white/35 active:border-white/50 bg-gradient-to-b from-black/60 via-slate-950/70 to-black/80 text-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]",
      chromatic:
        "border border-white/30 hover:border-white/60 bg-gradient-to-tr from-white/15 via-sky-500/10 to-white/25 text-white shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.5)]",
    }[variant];

    return (
      <motion.button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as any).current = node;
        }}
        disabled={disabled}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.94 }}
        transition={CODE4_SPRING}
        className={`group relative overflow-hidden backdrop-blur-2xl font-medium tracking-tight select-none transition-colors duration-200 inline-flex items-center justify-center ${
          disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
        } ${sizeClasses} ${variantClasses} ${className}`}
        style={{
          boxShadow: glowColor
            ? `0 8px 24px rgba(0,0,0,0.35), 0 0 28px -4px ${glowColor}50, inset 0 1px 1.5px rgba(255,255,255,0.45)`
            : undefined,
          ...style,
        }}
        {...(props as any)}
      >
        {/* Specular Edge Highlight Top Rim */}
        <span className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none rounded-full z-10" />

        {/* Dynamic Specular Sheen Following Pointer (Code 4 Spring) */}
        <motion.span
          className="absolute pointer-events-none rounded-full blur-[10px] transition-opacity duration-300 z-0"
          style={{
            x: smoothX,
            y: smoothY,
            width: 90,
            height: 90,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)",
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Content Container */}
        <span
          className={`relative z-10 inline-flex items-center justify-center font-medium ${contentClassName}`}
        >
          {children}
        </span>
      </motion.button>
    );
  }
);

GlassButton.displayName = "GlassButton";
