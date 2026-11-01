"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Sparkles } from "lucide-react";
import { haptics } from "../../src/utils/haptics";

export type Theme = "light" | "dark" | "dim";

export const CODE4_SPRING = { damping: 25, stiffness: 150, mass: 0.5 };

export interface ThemeSwitcherProps {
  value: Theme;
  onValueChange: (theme: Theme) => void;
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  value,
  onValueChange,
  className = "",
}) => {
  const options: { id: Theme; label: string; icon: React.ReactNode }[] = [
    {
      id: "light",
      label: "Light",
      icon: <Sun size={15} className="text-white" />,
    },
    {
      id: "dim",
      label: "Dim",
      icon: <Sparkles size={15} className="text-slate-300" />,
    },
    {
      id: "dark",
      label: "Dark",
      icon: <Moon size={15} className="text-slate-200" />,
    },
  ];

  return (
    <div
      className={`relative inline-flex items-center p-1 rounded-full backdrop-blur-2xl bg-black/40 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.3)] ${className}`}
    >
      {/* Specular top rim */}
      <span className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none rounded-full" />

      {options.map((opt) => {
        const isSelected = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => {
              haptics.selection();
              onValueChange(opt.id);
            }}
            className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold select-none transition-colors duration-200 cursor-pointer ${
              isSelected ? "text-white" : "text-white/60 hover:text-white/90"
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="theme-switcher-active-pill"
                transition={CODE4_SPRING}
                className="absolute inset-0 rounded-full bg-gradient-to-b from-white/35 via-white/20 to-white/10 border border-white/40 shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.7)] pointer-events-none"
              >
                {/* Specular highlight on active pill */}
                <span className="absolute inset-x-2 top-0 h-[1px] bg-white/70 pointer-events-none rounded-full" />
              </motion.div>
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {opt.icon}
              <span>{opt.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
