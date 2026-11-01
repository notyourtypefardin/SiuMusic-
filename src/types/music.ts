export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  genre: string;
  year: number;
  isFavorite: boolean;
  isSample: boolean;
  dominantColor: string; // Hex color for liquid aura background
  secondaryColor: string;
  lyrics: LyricLine[];
  filePath?: string; // Path or simulated Android Content URI
  audioFileBlob?: Blob; // For locally imported user songs
  bpm?: number;
  melodyKey?: string; // Used by synthesizer engine for realistic audio preview
}

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverGradient: [string, string];
  songIds: string[];
  createdAt: string;
  isSystem?: boolean;
}

export type ScreenTab = 'home' | 'library' | 'search' | 'playlists' | 'settings' | 'albums' | 'artists';
export type LibrarySubTab = 'tracks' | 'albums' | 'artists' | 'folders';
export type RepeatMode = 'off' | 'all' | 'one';
export type AudioOutput = 'speaker' | 'bluetooth' | 'usbdac';

export interface EqualizerSettings {
  enabled: boolean;
  preset: string;
  preamp: number;    // -12 to +12 dB (default 0)
  bass: number;      // 60Hz
  lowMid: number;    // 230Hz
  mid: number;       // 910Hz
  highMid: number;   // 3.6kHz
  treble: number;    // 14kHz
}

export type TintHue =
  | 'crystal'
  | 'platinum'
  | 'chrome'
  | 'titanium'
  | 'obsidian'
  | 'onyx'
  | 'azure'
  | 'amethyst'
  | 'sunset'
  | 'emerald'
  | 'ruby';
export type GlassAppearance = 'frosted-white' | 'smoked-dark';

export type AnimationMode = 'snappy' | 'fluid' | 'reduced';

export interface LiquidGlassConfig {
  tintIntensity: number; // 0 (pure crystal) to 100 (fully saturated tint)
  tintHue: TintHue;
  blurRadius: number; // 10 to 50px (default 30px)
  appearance: GlassAppearance; // 'frosted-white' (#FFFFFF 70%) or 'smoked-dark'
  specularSheen: number; // 0 to 100
  dropletRippleEnabled: boolean;
  animationMode: AnimationMode; // 'snappy' | 'fluid' | 'reduced'
  springPhysics: {
    response: number;
    damping: number;
  };
}

export interface AppSettings {
  themeAccent: 'silver' | 'platinum' | 'chrome' | 'obsidian' | 'cyan' | 'purple' | 'amber' | 'emerald' | 'rose';
  glassBlur: 'subtle' | 'standard' | 'ultra';
  specularHighlights: boolean;
  gaplessPlayback: boolean;
  crossfadeDuration: number; // 0 - 12s
  replayGain: boolean;
  audioQuality: 'lossless' | 'hires' | 'standard';
  haptics: boolean;
  sleepTimerMinutes: number | null; // null if inactive
  media3BackgroundService: boolean;
  showAndroidFrame: boolean;
  deviceFrameStyle: 'ios' | 'android' | 'expanded';
  primeModeActive: boolean; // SiuuMusic Prime Mode
  liquidGlass: LiquidGlassConfig;
}
