"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { haptics } from "../../src/utils/haptics";

export const CODE4_SPRING = { damping: 25, stiffness: 150, mass: 0.5 };

export interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  glowColor?: string;
  size?: "sm" | "default" | "lg" | "icon";
}

export const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  (
    {
      children,
      className = "",
      glowColor,
      size = "default",
      onClick,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Spring pointer tracking
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
          buttonRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as any).current = node;
        }}
        disabled={disabled}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: disabled ? 1 : 1.03 }}
        whileTap={{ scale: disabled ? 1 : 0.94 }}
        transition={CODE4_SPRING}
        className={`group relative overflow-hidden backdrop-blur-2xl font-semibold tracking-tight select-none cursor-pointer border border-white/30 hover:border-white/60 active:border-white/80 bg-gradient-to-b from-white/25 via-white/10 to-transparent text-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.6)] ${sizeClasses} ${className}`}
        style={{
          boxShadow: glowColor
            ? `0 10px 30px -5px rgba(0,0,0,0.5), 0 0 35px -6px ${glowColor}60, inset 0 1.5px 2px rgba(255,255,255,0.6)`
            : undefined,
          ...style,
        }}
        {...(props as any)}
      >
        {/* Specular Liquid Border Rim */}
        <span className="absolute inset-x-3 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none rounded-full z-10" />

        {/* Liquid Refraction Under-glaze */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] to-black/[0.25] pointer-events-none" />

        {/* Dynamic Liquid Spring Specular Glow */}
        <motion.span
          className="absolute pointer-events-none rounded-full blur-[14px] transition-opacity duration-300 z-0"
          style={{
            x: smoothX,
            y: smoothY,
            width: 110,
            height: 110,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.15) 50%, transparent 80%)",
            opacity: isHovered ? 0.9 : 0.15,
          }}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  }
);

LiquidButton.displayName = "LiquidButton";
