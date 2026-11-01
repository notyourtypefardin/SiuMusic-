import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { Song, Playlist, ScreenTab, LibrarySubTab, RepeatMode, EqualizerSettings, AppSettings } from '../types/music';
import { INITIAL_SAMPLE_SONGS, INITIAL_PLAYLISTS } from '../utils/sampleData';
import { globalAudioEngine } from '../utils/audioEngine';
import { getNextSongIndex, getPreviousSongIndex, EQUALIZER_PRESETS } from '../utils/audioMath';
import { haptics } from '../utils/haptics';

interface MusicContextType {
  // Songs & Playlists
  songs: Song[];
  playlists: Playlist[];
  currentSong: Song | null;
  playbackQueue: Song[];
  activePlaylistDetail: Playlist | null;

  // Playback State
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  equalizer: EqualizerSettings;

  // Navigation & Modals
  activeTab: ScreenTab;
  librarySubTab: LibrarySubTab;
  isNowPlayingOpen: boolean;
  isEqualizerOpen: boolean;
  isCodeModalOpen: boolean;
  isCreatePlaylistOpen: boolean;
  isQueueOpen: boolean;
  isPrimeModalOpen: boolean;
  isBluetoothModalOpen: boolean;
  isSleepTimerOpen: boolean;
  isHapticModalOpen: boolean;
  isNotificationPreviewOpen: boolean;
  isLockscreenPreviewOpen: boolean;
  isSplashActive: boolean;
  activeLyricsTab: boolean;
  audioOutput: 'speaker' | 'bluetooth' | 'usbdac';

  isTintCustomizerOpen: boolean;
  codeModalPlatform: 'swiftui' | 'uikit' | 'compose';

  // Search
  searchQuery: string;
  recentSearches: string[];

  // Settings
  settings: AppSettings;

  // Actions
  setActiveTab: (tab: ScreenTab) => void;
  setLibrarySubTab: (subTab: LibrarySubTab) => void;
  setIsNowPlayingOpen: (open: boolean) => void;
  setIsEqualizerOpen: (open: boolean) => void;
  setIsCodeModalOpen: (open: boolean) => void;
  setIsTintCustomizerOpen: (open: boolean) => void;
  setCodeModalPlatform: (platform: 'swiftui' | 'uikit' | 'compose') => void;
  setIsCreatePlaylistOpen: (open: boolean) => void;
  setIsQueueOpen: (open: boolean) => void;
  setIsPrimeModalOpen: (open: boolean) => void;
  setIsBluetoothModalOpen: (open: boolean) => void;
  setIsSleepTimerOpen: (open: boolean) => void;
  setIsHapticModalOpen: (open: boolean) => void;
  setIsNotificationPreviewOpen: (open: boolean) => void;
  setIsLockscreenPreviewOpen: (open: boolean) => void;
  setIsSplashActive: (active: boolean) => void;
  setActiveLyricsTab: (lyrics: boolean) => void;
  setAudioOutput: (output: 'speaker' | 'bluetooth' | 'usbdac') => void;
  setActivePlaylistDetail: (pl: Playlist | null) => void;
  setSearchQuery: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  removeRecentSearch: (query: string) => void;

  // Prime Mode 2.0
  primePlaylistSongIds: string[];
  isPrimePlaybackActive: boolean;
  isPrimeSongPickerOpen: boolean;
  setIsPrimeSongPickerOpen: (open: boolean) => void;
  playPrimePlaylist: () => void;
  toggleSongInPrimePlaylist: (songId: string) => void;
  setPrimePlaylistSongs: (songIds: string[]) => void;
  addSongsToPrimePlaylist: (songIds: string[]) => void;
  removeSongFromPrimePlaylist: (songId: string) => void;

  playSong: (song: Song, queueContext?: Song[], isPrimeContext?: boolean) => void;
  togglePlayPause: () => void;
  nextSong: () => void;
  previousSong: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  toggleFavorite: (songId: string) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setEqualizerPreset: (presetName: string) => void;
  updateEqualizerBand: (band: 'bass' | 'lowMid' | 'mid' | 'highMid' | 'treble', value: number) => void;
  updateEqualizerPreamp: (val: number) => void;
  setEqualizerEnabled: (enabled: boolean) => void;
  togglePrimeMode: () => void;
  reorderQueue: (newQueue: Song[]) => void;
  clearUpcomingQueue: () => void;
  updateLiquidGlass: (partial: Partial<AppSettings['liquidGlass']>) => void;
  createPlaylist: (title: string, description: string, gradient: [string, string]) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  importDeviceFiles: (files: FileList | File[]) => Promise<number>;
  updateSettings: (partial: Partial<AppSettings>) => void;
  setSleepTimer: (minutes: number | null) => void;
  clearCache: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

const DEFAULT_SETTINGS: AppSettings = {
  themeAccent: 'silver',
  glassBlur: 'standard',
  specularHighlights: true,
  gaplessPlayback: true,
  crossfadeDuration: 3,
  replayGain: true,
  audioQuality: 'lossless',
  haptics: true,
  sleepTimerMinutes: null,
  media3BackgroundService: true,
  showAndroidFrame: true,
  deviceFrameStyle: 'ios',
  primeModeActive: false,
  liquidGlass: {
    tintIntensity: 30,
    tintHue: 'platinum',
    blurRadius: 30,
    appearance: 'frosted-white',
    specularSheen: 85,
    dropletRippleEnabled: true,
    animationMode: 'snappy',
    springPhysics: {
      response: 0.5,
      damping: 0.7,
    },
  },
};

const DEFAULT_EQUALIZER: EqualizerSettings = {
  enabled: true,
  preset: 'Custom',
  preamp: 0,
  bass: 2,      // 60Hz: +2 dB (as shown in reference)
  lowMid: 1,    // 230Hz: +1 dB
  mid: 0,       // 910Hz: 0 dB
  highMid: 1,   // 3.6kHz: +1 dB
  treble: 2,    // 14kHz: +2 dB
};

const DEFAULT_RECENT_SEARCHES = [
  'The Weeknd',
  'Travis Scott',
  'Arctic Monkeys',
  'Imagine Dragons',
  'Billie Eilish',
];

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or use defaults (using v2 keys for fresh curated reference tracks)
  const [songs, setSongs] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem('siuumusic_songs_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_SAMPLE_SONGS;
  });

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem('siuumusic_playlists_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PLAYLISTS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('siuumusic_settings_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          liquidGlass: {
            ...DEFAULT_SETTINGS.liquidGlass,
            ...(parsed.liquidGlass || {}),
          },
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const [equalizer, setEqualizer] = useState<EqualizerSettings>(() => {
    try {
      const saved = localStorage.getItem('siuumusic_equalizer_v2');
      if (saved) return { ...DEFAULT_EQUALIZER, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_EQUALIZER;
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('siuumusic_recent_searches_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_RECENT_SEARCHES;
  });

  // Current playback state
  const [currentSong, setCurrentSong] = useState<Song | null>(() => INITIAL_SAMPLE_SONGS[0]);
  const [playbackQueue, setPlaybackQueue] = useState<Song[]>(() => INITIAL_SAMPLE_SONGS);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(INITIAL_SAMPLE_SONGS[0].duration);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [audioOutput, setAudioOutput] = useState<'speaker' | 'bluetooth' | 'usbdac'>('bluetooth');

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<ScreenTab>('home');
  const [librarySubTab, setLibrarySubTab] = useState<LibrarySubTab>('tracks');
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState<boolean>(false);
  const [isEqualizerOpen, setIsEqualizerOpen] = useState<boolean>(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [isTintCustomizerOpen, setIsTintCustomizerOpen] = useState<boolean>(false);
  const [codeModalPlatform, setCodeModalPlatform] = useState<'swiftui' | 'uikit' | 'compose'>('compose');
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isPrimeModalOpen, setIsPrimeModalOpen] = useState<boolean>(false);
  const [isBluetoothModalOpen, setIsBluetoothModalOpen] = useState<boolean>(false);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState<boolean>(false);
  const [isHapticModalOpen, setIsHapticModalOpen] = useState<boolean>(false);
  const [isNotificationPreviewOpen, setIsNotificationPreviewOpen] = useState<boolean>(false);
  const [isLockscreenPreviewOpen, setIsLockscreenPreviewOpen] = useState<boolean>(false);
  const [isSplashActive, setIsSplashActive] = useState<boolean>(true);
  const [activeLyricsTab, setActiveLyricsTab] = useState<boolean>(false);
  const [activePlaylistDetail, setActivePlaylistDetail] = useState<Playlist | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Prime Mode 2.0 Dedicated Playlist & Instant Playback
  const [primePlaylistSongIds, setPrimePlaylistSongIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('siuumusic_prime_playlist_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return ['track-1', 'track-2', 'track-3', 'track-4'];
  });
  const [isPrimePlaybackActive, setIsPrimePlaybackActive] = useState<boolean>(false);
  const [isPrimeSongPickerOpen, setIsPrimeSongPickerOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('siuumusic_prime_playlist_v2', JSON.stringify(primePlaylistSongIds));
    } catch {
      // ignore
    }
  }, [primePlaylistSongIds]);

  // Auto-hide splash screen after 1.8 seconds on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashActive(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Real Sleep Timer Countdown Handler
  useEffect(() => {
    if (!settings.sleepTimerMinutes || settings.sleepTimerMinutes <= 0) return;

    const timer = setTimeout(() => {
      globalAudioEngine.pause();
      setIsPlaying(false);
      setSettings((prev) => ({ ...prev, sleepTimerMinutes: null }));
      haptics.stateChange();
    }, settings.sleepTimerMinutes * 60 * 1000);

    return () => clearTimeout(timer);
  }, [settings.sleepTimerMinutes]);

  const updateLiquidGlass = (partial: Partial<AppSettings['liquidGlass']>) => {
    setSettings((prev) => ({
      ...prev,
      liquidGlass: {
        ...prev.liquidGlass,
        ...partial,
      },
    }));
  };

  // Shuffled indices cache
  const shuffledIndices = useMemo(() => {
    const indices = playbackQueue.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [playbackQueue.length, isShuffle]);

  // Audio Engine Hookup
  const nextSongRef = useRef<() => void>(() => {});

  useEffect(() => {
    globalAudioEngine.onTimeUpdate = (time) => {
      setCurrentTime(time);
    };

    globalAudioEngine.onTrackEnded = () => {
      nextSongRef.current();
    };

    return () => {
      globalAudioEngine.destroy();
    };
  }, []);

  // Sync Equalizer with Engine
  useEffect(() => {
    globalAudioEngine.applyEqualizer(equalizer);
    try {
      localStorage.setItem('siuumusic_equalizer_v2', JSON.stringify(equalizer));
    } catch {
      // ignore
    }
  }, [equalizer]);

  // Persist State
  useEffect(() => {
    try {
      localStorage.setItem('siuumusic_songs_v2', JSON.stringify(songs));
    } catch {
      // ignore
    }
  }, [songs]);

  useEffect(() => {
    try {
      localStorage.setItem('siuumusic_playlists_v2', JSON.stringify(playlists));
    } catch {
      // ignore
    }
  }, [playlists]);

  useEffect(() => {
    try {
      localStorage.setItem('siuumusic_settings_v2', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('siuumusic_recent_searches_v2', JSON.stringify(recentSearches));
    } catch {
      // ignore
    }
  }, [recentSearches]);

  // Playback Functions
  const playSong = async (song: Song, queueContext?: Song[], isPrimeContext: boolean = false) => {
    haptics.play();
    if (queueContext && queueContext.length > 0) {
      setPlaybackQueue(queueContext);
    }
    setCurrentSong(song);
    setDuration(song.duration);
    setCurrentTime(0);
    setIsPrimePlaybackActive(isPrimeContext);

    await globalAudioEngine.loadTrack(song);
    await globalAudioEngine.play();
    setIsPlaying(true);
  };

  const togglePlayPause = async () => {
    if (!currentSong) {
      if (songs.length > 0) {
        playSong(songs[0]);
      }
      return;
    }

    if (isPlaying) {
      haptics.pause();
      globalAudioEngine.pause();
      setIsPlaying(false);
    } else {
      haptics.play();
      await globalAudioEngine.play();
      setIsPlaying(true);
    }
  };

  const nextSong = async () => {
    if (!currentSong || playbackQueue.length === 0) return;
    haptics.trackChange();

    const currentIndex = playbackQueue.findIndex((s) => s.id === currentSong.id);
    const nextIdx = getNextSongIndex(currentIndex, playbackQueue.length, isShuffle, repeatMode, shuffledIndices);

    if (nextIdx !== null && playbackQueue[nextIdx]) {
      playSong(playbackQueue[nextIdx]);
    }
  };

  const previousSong = async () => {
    if (!currentSong || playbackQueue.length === 0) return;
    haptics.trackChange();

    // If more than 3 seconds in, restart track
    if (currentTime > 3) {
      seekTo(0);
      return;
    }

    const currentIndex = playbackQueue.findIndex((s) => s.id === currentSong.id);
    const prevIdx = getPreviousSongIndex(currentIndex, playbackQueue.length, currentTime);
    const targetSong = playbackQueue[prevIdx];

    if (targetSong) {
      playSong(targetSong);
    }
  };

  nextSongRef.current = nextSong;

  const seekTo = (seconds: number) => {
    haptics.seek();
    globalAudioEngine.seek(seconds);
    setCurrentTime(seconds);
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    globalAudioEngine.setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    haptics.selection();
    if (isMuted) {
      globalAudioEngine.setVolume(volume);
      setIsMuted(false);
    } else {
      globalAudioEngine.setVolume(0);
      setIsMuted(true);
    }
  };

  const toggleFavorite = (songId: string) => {
    haptics.impact();
    setSongs((prev) =>
      prev.map((s) => {
        if (s.id === songId) {
          const nextFav = !s.isFavorite;
          // Sync with Favorites playlist
          setPlaylists((pls) =>
            pls.map((pl) => {
              if (pl.id === 'favorites') {
                const nextIds = nextFav
                  ? Array.from(new Set([...pl.songIds, songId]))
                  : pl.songIds.filter((id) => id !== songId);
                return { ...pl, songIds: nextIds };
              }
              return pl;
            })
          );
          return { ...s, isFavorite: nextFav };
        }
        return s;
      })
    );

    if (currentSong && currentSong.id === songId) {
      setCurrentSong((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const toggleShuffle = () => {
    haptics.selection();
    setIsShuffle((prev) => !prev);
  };

  const cycleRepeat = () => {
    haptics.selection();
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const setEqualizerPreset = (presetName: string) => {
    haptics.selection();
    const presetValues = EQUALIZER_PRESETS[presetName];
    if (presetValues) {
      setEqualizer((prev) => ({
        ...prev,
        preset: presetName,
        bass: presetValues.bass,
        lowMid: presetValues.lowMid,
        mid: presetValues.mid,
        highMid: presetValues.highMid,
        treble: presetValues.treble,
      }));
    }
  };

  const updateEqualizerBand = (
    band: 'bass' | 'lowMid' | 'mid' | 'highMid' | 'treble',
    value: number
  ) => {
    haptics.seek();
    setEqualizer((prev) => ({
      ...prev,
      preset: 'Custom',
      [band]: value,
    }));
  };

  const updateEqualizerPreamp = (value: number) => {
    haptics.seek();
    setEqualizer((prev) => ({
      ...prev,
      preamp: value,
    }));
  };

  const setEqualizerEnabled = (enabled: boolean) => {
    haptics.selection();
    setEqualizer((prev) => ({
      ...prev,
      enabled,
    }));
  };

  const togglePrimeMode = () => {
    haptics.impact();
    setSettings((prev) => ({
      ...prev,
      primeModeActive: !prev.primeModeActive,
    }));
  };

  const playPrimePlaylist = async () => {
    haptics.impact();
    const primeSongs = primePlaylistSongIds
      .map((id) => songs.find((s) => s.id === id))
      .filter((s): s is Song => Boolean(s));

    if (primeSongs.length === 0) {
      haptics.error();
      setIsPrimeSongPickerOpen(true);
      return;
    }

    // If already playing inside Prime playlist, toggle play/pause smoothly
    if (isPrimePlaybackActive && currentSong && primePlaylistSongIds.includes(currentSong.id)) {
      if (!isPlaying) {
        haptics.play();
        await globalAudioEngine.play();
        setIsPlaying(true);
      } else {
        haptics.pause();
        globalAudioEngine.pause();
        setIsPlaying(false);
      }
      return;
    }

    // Start playing immediately from the first song in Prime playlist
    await playSong(primeSongs[0], primeSongs, true);
  };

  const toggleSongInPrimePlaylist = (songId: string) => {
    haptics.selection();
    setPrimePlaylistSongIds((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  const setPrimePlaylistSongs = (songIds: string[]) => {
    haptics.impact();
    setPrimePlaylistSongIds(songIds);
  };

  const addSongsToPrimePlaylist = (songIds: string[]) => {
    haptics.impact();
    setPrimePlaylistSongIds((prev) => {
      const set = new Set([...prev, ...songIds]);
      return Array.from(set);
    });
  };

  const removeSongFromPrimePlaylist = (songId: string) => {
    haptics.selection();
    setPrimePlaylistSongIds((prev) => prev.filter((id) => id !== songId));
  };

  const reorderQueue = (newQueue: Song[]) => {
    haptics.selection();
    setPlaybackQueue(newQueue);
  };

  const clearUpcomingQueue = () => {
    haptics.impact();
    if (!currentSong) {
      setPlaybackQueue([]);
    } else {
      setPlaybackQueue([currentSong]);
    }
  };

  const createPlaylist = (title: string, description: string, gradient: [string, string]) => {
    haptics.impact();
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      title: title || 'New Playlist',
      description: description || 'Curated liquid glass playlist',
      coverGradient: gradient,
      songIds: [],
      createdAt: new Date().toISOString(),
    };
    setPlaylists((prev) => [newPl, ...prev]);
  };

  const addSongToPlaylist = (playlistId: string, songId: string) => {
    haptics.selection();
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId && !pl.songIds.includes(songId)) {
          return { ...pl, songIds: [...pl.songIds, songId] };
        }
        return pl;
      })
    );
  };

  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    haptics.selection();
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          return { ...pl, songIds: pl.songIds.filter((id) => id !== songId) };
        }
        return pl;
      })
    );
  };

  const deletePlaylist = (playlistId: string) => {
    haptics.selection();
    setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
  };

  const importDeviceFiles = async (files: FileList | File[]): Promise<number> => {
    const fileArray = Array.from(files);
    let importedCount = 0;
    const newSongs: Song[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|ogg|m4a|flac|aac)$/i)) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        const parts = cleanName.split('-');
        const artist = parts.length > 1 ? parts[0].trim() : 'Local Audio';
        const title = parts.length > 1 ? parts.slice(1).join('-').trim() : cleanName;

        const newSong: Song = {
          id: `local-${Date.now()}-${i}`,
          title: title || 'Imported Track',
          artist: artist || 'Local Device',
          album: 'Device Files',
          duration: 180,
          coverUrl:
            'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80',
          genre: 'Local',
          year: new Date().getFullYear(),
          isFavorite: false,
          isSample: false,
          dominantColor: '#4A5568',
          secondaryColor: '#1A202C',
          audioFileBlob: file,
          filePath: `content://media/external/audio/media/${Date.now() + i}`,
          lyrics: [
            { time: 0, text: `♪ Now playing locally imported file ♪` },
            { time: 5, text: file.name },
          ],
        };

        newSongs.push(newSong);
        importedCount++;
      }
    }

    if (newSongs.length > 0) {
      setSongs((prev) => [...newSongs, ...prev]);
      setPlaybackQueue((prev) => [...newSongs, ...prev]);
    }

    return importedCount;
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    haptics.selection();
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const setSleepTimer = (minutes: number | null) => {
    haptics.selection();
    setSettings((prev) => ({ ...prev, sleepTimerMinutes: minutes }));
  };

  const clearCache = () => {
    haptics.impact();
    localStorage.removeItem('siuumusic_songs_v2');
    localStorage.removeItem('siuumusic_playlists_v2');
    localStorage.removeItem('siuumusic_settings_v2');
    localStorage.removeItem('siuumusic_equalizer_v2');
    localStorage.removeItem('siuumusic_recent_searches_v2');
    setSongs(INITIAL_SAMPLE_SONGS);
    setPlaylists(INITIAL_PLAYLISTS);
    setSettings(DEFAULT_SETTINGS);
    setEqualizer(DEFAULT_EQUALIZER);
    setRecentSearches(DEFAULT_RECENT_SEARCHES);
  };

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, 10);
    });
  };

  const clearRecentSearches = () => {
    haptics.selection();
    setRecentSearches([]);
  };

  const removeRecentSearch = (query: string) => {
    haptics.selection();
    setRecentSearches((prev) => prev.filter((item) => item !== query));
  };

  return (
    <MusicContext.Provider
      value={{
        songs,
        playlists,
        currentSong,
        playbackQueue,
        activePlaylistDetail,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        equalizer,
        activeTab,
        librarySubTab,
        isNowPlayingOpen,
        isEqualizerOpen,
        isCodeModalOpen,
        isCreatePlaylistOpen,
        isQueueOpen,
        isPrimeModalOpen,
        isBluetoothModalOpen,
        isSleepTimerOpen,
        isHapticModalOpen,
        isNotificationPreviewOpen,
        isLockscreenPreviewOpen,
        isSplashActive,
        activeLyricsTab,
        audioOutput,
        isTintCustomizerOpen,
        codeModalPlatform,
        searchQuery,
        recentSearches,
        settings,
        // Prime Mode 2.0
        primePlaylistSongIds,
        isPrimePlaybackActive,
        isPrimeSongPickerOpen,
        setIsPrimeSongPickerOpen,
        playPrimePlaylist,
        toggleSongInPrimePlaylist,
        setPrimePlaylistSongs,
        addSongsToPrimePlaylist,
        removeSongFromPrimePlaylist,

        setActiveTab,
        setLibrarySubTab,
        setIsNowPlayingOpen,
        setIsEqualizerOpen,
        setIsCodeModalOpen,
        setIsTintCustomizerOpen,
        setCodeModalPlatform,
        setIsCreatePlaylistOpen,
        setIsQueueOpen,
        setIsPrimeModalOpen,
        setIsBluetoothModalOpen,
        setIsSleepTimerOpen,
        setIsHapticModalOpen,
        setIsNotificationPreviewOpen,
        setIsLockscreenPreviewOpen,
        setIsSplashActive,
        setActiveLyricsTab,
        setAudioOutput,
        setActivePlaylistDetail,
        setSearchQuery,
        addRecentSearch,
        clearRecentSearches,
        removeRecentSearch,
        playSong,
        togglePlayPause,
        nextSong,
        previousSong,
        seekTo,
        setVolume,
        toggleMute,
        toggleFavorite,
        toggleShuffle,
        cycleRepeat,
        setEqualizerPreset,
        updateEqualizerBand,
        updateEqualizerPreamp,
        setEqualizerEnabled,
        togglePrimeMode,
        reorderQueue,
        clearUpcomingQueue,
        updateLiquidGlass,
        createPlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        deletePlaylist,
        importDeviceFiles,
        updateSettings,
        setSleepTimer,
        clearCache,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
