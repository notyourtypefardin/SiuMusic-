/**
 * Su Music Motion System & Physics Presets
 * Standardized easing, spring physics, and duration tokens matching Android 15 & Apple-inspired Liquid Glass specs.
 */

// Duration tokens in seconds for Framer Motion / Motion
export const MOTION_DURATIONS = {
  touch: 0.08,        // 80ms touch feedback
  micro: 0.15,        // 150ms small icon transitions
  shortSlide: 0.22,   // 220ms short slide-and-fade
  content: 0.30,      // 300ms content entrance
  screen: 0.36,       // 360ms navigation transitions
  navEntrance: 0.48,  // 480ms floating bottom bar entrance
  panel: 0.42,        // 420ms larger panel / bottom sheet
} as const;

// Master luxury easing curves (Section 05 & User Spec)
export const MOTION_EASE = {
  premium: [0.16, 1, 0.3, 1] as const,       // Smooth deceleration with zero bounce
  outExpo: [0.19, 1, 0.22, 1] as const,      // High initial momentum, silky settle
  inOutSine: [0.37, 0, 0.63, 1] as const,    // Subtle natural breathing
} as const;

// Spring physics presets for interactive tactile elements
export const MOTION_SPRINGS = {
  snappy: { type: 'spring' as const, stiffness: 500, damping: 35, mass: 0.8 },
  smooth: { type: 'spring' as const, stiffness: 350, damping: 32, mass: 1 },
  pillIndicator: { type: 'spring' as const, stiffness: 450, damping: 35 },
  subtleBounce: { type: 'spring' as const, stiffness: 400, damping: 26 },
} as const;

// Screen slide-and-fade variants
export const screenVariants = {
  initial: (direction: number = 1) => ({
    opacity: 0,
    x: direction > 0 ? 18 : -18,
    scale: 0.995,
  }),
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: MOTION_DURATIONS.screen,
      ease: MOTION_EASE.premium,
    },
  },
  exit: (direction: number = 1) => ({
    opacity: 0,
    x: direction > 0 ? -16 : 16,
    scale: 0.995,
    transition: {
      duration: MOTION_DURATIONS.shortSlide,
      ease: MOTION_EASE.premium,
    },
  }),
};

// Staggered list container variants (30-50ms stagger)
export const staggerContainerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.02,
    },
  },
};

// Item slide-and-fade entrance variant
export const slideItemVariants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.content,
      ease: MOTION_EASE.premium,
    },
  },
};

// Bottom sheet / Now Playing modal vertical entrance
export const sheetVariants = {
  initial: { y: '100%', opacity: 0.9 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: MOTION_DURATIONS.panel,
      ease: MOTION_EASE.premium,
    },
  },
  exit: {
    y: '100%',
    opacity: 0.9,
    transition: {
      duration: 0.32,
      ease: [0.32, 0, 0.67, 0],
    },
  },
};

// Floating bottom nav entrance variant (slides in slightly from below with settle)
export const bottomNavEntranceVariants = {
  initial: { y: 38, opacity: 0, scale: 0.97 },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: MOTION_DURATIONS.navEntrance,
      ease: MOTION_EASE.premium,
    },
  },
};

// Mini player slide-up entrance
export const miniPlayerVariants = {
  initial: { y: 24, opacity: 0, scale: 0.98 },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: MOTION_DURATIONS.content,
      ease: MOTION_EASE.premium,
    },
  },
  exit: {
    y: 20,
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: MOTION_DURATIONS.shortSlide,
      ease: MOTION_EASE.premium,
    },
  },
};
