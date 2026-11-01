/**
 * Pure audio math, playlist queue logic, and search filtering
 * Decoupled from UI and framework state for deterministic testing.
 */

export interface BasicSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  genre: string;
  isFavorite: boolean;
  isSample: boolean;
}

export type RepeatMode = 'off' | 'all' | 'one';

/**
 * Formats seconds into MM:SS or H:MM:SS format
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const totalSecs = Math.floor(seconds);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const paddedSecs = secs < 10 ? `0${secs}` : `${secs}`;
  if (hrs > 0) {
    const paddedMins = mins < 10 ? `0${mins}` : `${mins}`;
    return `${hrs}:${paddedMins}:${paddedSecs}`;
  }
  return `${mins}:${paddedSecs}`;
}

/**
 * Calculates remaining time formatted as -MM:SS
 */
export function calculateRemainingTime(currentTime: number, duration: number): string {
  const remaining = Math.max(0, duration - currentTime);
  return `-${formatTime(remaining)}`;
}

/**
 * Resolves the next song in playback queue considering shuffle and repeat mode
 */
export function getNextSongIndex(
  currentIndex: number,
  totalSongs: number,
  isShuffle: boolean,
  repeatMode: RepeatMode,
  shuffledIndices?: number[]
): number | null {
  if (totalSongs === 0) return null;
  if (repeatMode === 'one') return currentIndex;

  if (isShuffle && shuffledIndices && shuffledIndices.length === totalSongs) {
    const currentShufflePos = shuffledIndices.indexOf(currentIndex);
    if (currentShufflePos !== -1 && currentShufflePos < totalSongs - 1) {
      return shuffledIndices[currentShufflePos + 1];
    }
    if (repeatMode === 'all') {
      return shuffledIndices[0];
    }
    return null;
  }

  if (currentIndex < totalSongs - 1) {
    return currentIndex + 1;
  }

  if (repeatMode === 'all') {
    return 0;
  }

  return null; // end of playlist reached
}

/**
 * Resolves previous song index in playback queue
 */
export function getPreviousSongIndex(
  currentIndex: number,
  totalSongs: number,
  currentTime: number = 0
): number {
  if (totalSongs === 0) return 0;
  // If playing more than 3 seconds, replay current song (standard Android/iOS music player behavior)
  if (currentTime > 3) {
    return currentIndex;
  }
  return currentIndex > 0 ? currentIndex - 1 : totalSongs - 1;
}

/**
 * Filter songs by search term and source (all, sample, device)
 */
export function filterSongs<T extends BasicSong>(
  songs: T[],
  query: string,
  sourceFilter: 'all' | 'device' | 'sample' = 'all',
  genreFilter?: string
): T[] {
  const cleanQuery = query.trim().toLowerCase();

  return songs.filter(song => {
    // Source check
    if (sourceFilter === 'device' && song.isSample) return false;
    if (sourceFilter === 'sample' && !song.isSample) return false;

    // Genre check
    if (genreFilter && genreFilter !== 'All' && song.genre.toLowerCase() !== genreFilter.toLowerCase()) {
      return false;
    }

    // Query text match
    if (!cleanQuery) return true;
    return (
      song.title.toLowerCase().includes(cleanQuery) ||
      song.artist.toLowerCase().includes(cleanQuery) ||
      song.album.toLowerCase().includes(cleanQuery) ||
      song.genre.toLowerCase().includes(cleanQuery)
    );
  });
}

/**
 * Standard 5-band equalizer presets in dB (-12 to +12)
 */
export interface EqualizerBands {
  bass: number;     // 60-150Hz
  lowMid: number;   // 400Hz
  mid: number;      // 1kHz
  highMid: number;  // 3kHz
  treble: number;   // 10kHz
}

export const EQUALIZER_PRESETS: Record<string, EqualizerBands> = {
  Flat: { bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0 },
  Normal: { bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0 },
  'Bass Boost': { bass: 5, lowMid: 3, mid: 0, highMid: 1, treble: 2 },
  Jazz: { bass: 3, lowMid: 2, mid: 0, highMid: 2, treble: 3 },
  Rock: { bass: 4, lowMid: 2, mid: -1, highMid: 3, treble: 4 },
  Pop: { bass: 2, lowMid: 1, mid: 2, highMid: 3, treble: 2 },
  Classical: { bass: 3, lowMid: 2, mid: 1, highMid: 2, treble: 3 },
  'Treble Boost': { bass: -2, lowMid: -1, mid: 0, highMid: 3, treble: 6 },
  'Vocal Clarity': { bass: -2, lowMid: 1, mid: 4, highMid: 3, treble: 1 },
  Electronic: { bass: 5, lowMid: 2, mid: -1, highMid: 2, treble: 4 },
  Acoustic: { bass: 2, lowMid: 1, mid: 1, highMid: 2, treble: 3 },
};

/**
 * Clamp a number to min and max boundaries
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export type AnimationMode = 'snappy' | 'fluid' | 'reduced';

export interface MotionTransitionConfig {
  type?: 'spring';
  stiffness?: number;
  damping?: number;
  mass?: number;
  duration?: number;
  ease?: 'linear' | 'easeOut' | 'easeInOut';
}

export const CODE4_SPRING: MotionTransitionConfig = {
  type: 'spring',
  stiffness: 150,
  damping: 25,
  mass: 0.5,
};

export const SCROLL_CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.02,
    },
  },
};

export const SCROLL_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: CODE4_SPRING,
  },
};

/**
 * Returns Apple iOS 27 & Code 4 spring transition parameters tuned for ultra-smooth fluid response
 */
export function getSpringTransition(mode: AnimationMode = 'snappy'): MotionTransitionConfig {
  if (mode === 'reduced') {
    return { duration: 0.12, ease: 'linear' };
  }
  if (mode === 'fluid') {
    return { type: 'spring', stiffness: 120, damping: 22, mass: 0.6 };
  }
  // Code 4 default spring physics: damping: 25, stiffness: 150, mass: 0.5
  return CODE4_SPRING;
}

/**
 * Computes bounded coordinates for optical glass specular sheen
 */
export function calculateSheenPosition(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number }
) {
  const x = clamp(clientX - rect.left, 0, rect.width);
  const y = clamp(clientY - rect.top, 0, rect.height);
  const pctX = rect.width > 0 ? (x / rect.width) * 100 : 50;
  const pctY = rect.height > 0 ? (y / rect.height) * 100 : 50;
  return { x, y, pctX, pctY };
}

/**
 * Normalizes visualizer frequency values into smooth bar heights
 */
export function calculateWaveformHeights(
  frequencies: Uint8Array | number[],
  maxHeight: number,
  isPlaying: boolean
): number[] {
  const count = frequencies.length;
  const result: number[] = new Array(count);
  for (let i = 0; i < count; i++) {
    if (!isPlaying) {
      result[i] = Math.max(3, maxHeight * 0.12);
    } else {
      const raw = frequencies[i] || 0;
      const normalized = Math.max(0.12, raw / 255);
      result[i] = Math.round(normalized * maxHeight);
    }
  }
  return result;
}

