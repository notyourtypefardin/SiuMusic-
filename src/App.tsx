/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MusicProvider, useMusic } from './context/MusicContext';
import { IPhoneFrame } from './components/IPhoneFrame';
import { BottomNav } from './components/BottomNav';
import { MiniPlayer } from './components/MiniPlayer';
import { HomeScreen } from './screens/HomeScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { SearchScreen } from './screens/SearchScreen';
import { PlaylistsScreen } from './screens/PlaylistsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AlbumsScreen } from './screens/AlbumsScreen';
import { ArtistsScreen } from './screens/ArtistsScreen';
import { NowPlayingModal } from './screens/NowPlayingModal';
import { QueueModal } from './screens/QueueModal';
import { CreatePlaylistModal } from './screens/CreatePlaylistModal';
import { EqualizerModal } from './components/EqualizerModal';
import { NativeCodeModal } from './components/NativeCodeModal';
import { LiquidGlassCustomizer } from './components/LiquidGlassCustomizer';
import { LiquidRefractionCanvas } from './components/LiquidRefractionCanvas';
import { SplashModal } from './components/SplashModal';
import { PrimeModeModal } from './components/PrimeModeModal';
import { PrimeSongPickerModal } from './components/PrimeSongPickerModal';
import {
  BluetoothConnectedModal,
  SleepTimerModal,
  HapticFeedbackModal,
  NotificationPreviewSheet,
  LockScreenPreviewSheet,
} from './components/SupportingModals';
import { CODE4_SPRING } from './utils/audioMath';

const AppContent: React.FC = () => {
  const { activeTab, settings } = useMusic();
  const { tintHue, tintIntensity, blurRadius, appearance } = settings.liquidGlass;

  // Determine active theme mode ('dark' | 'dim' | 'light')
  const themeMode = useMemo(() => {
    if (appearance === 'frosted-white') return 'light';
    if (tintHue === 'obsidian' || tintHue === 'onyx') return 'dim';
    return 'dark';
  }, [appearance, tintHue]);

  // Compute dynamic CSS variables for the Liquid Glass material system (Major Black & Silver Theme)
  const dynamicCssVars = useMemo(() => {
    const intensityFactor = tintIntensity / 100;
    const isPrime = settings.primeModeActive;
    const baseAlpha = appearance === 'frosted-white' ? 0.16 : 0.38;
    const alpha = baseAlpha + intensityFactor * 0.18 + (isPrime ? 0.04 : 0);
    const specularAlpha = 0.42 + intensityFactor * 0.22 + (isPrime ? 0.18 : 0);

    return {
      '--glass-blur': `${blurRadius + (isPrime ? 4 : 0)}px`,
      '--glass-tint-r': 255,
      '--glass-tint-g': 255,
      '--glass-tint-b': 255,
      '--glass-tint-alpha': alpha,
      '--glass-specular-alpha': Math.min(0.92, specularAlpha),
      '--color-bg-base': isPrime ? '#030406' : '#020305',
    } as React.CSSProperties;
  }, [tintIntensity, blurRadius, appearance, settings.primeModeActive]);

  return (
    <div
      style={dynamicCssVars}
      data-theme={themeMode}
      className="theme-provider w-full min-h-screen bg-[#020305] text-white selection:bg-white/20"
    >
      <IPhoneFrame>
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#030406]">
          {/* Dynamic Optical Liquid Refraction Background Canvas */}
          <LiquidRefractionCanvas />

          {/* Cinematic Color Grading Vignette Overlay */}
          <div className="absolute inset-0 cinematic-grading-vignette pointer-events-none z-[1]" />

          {/* Dynamic Screen View with Ultra-Smooth Slide Motion Transitions */}
          <div className="flex-1 flex flex-col overflow-hidden relative z-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20, scale: 0.985 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.985 }}
                transition={CODE4_SPRING}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {activeTab === 'home' && <HomeScreen />}
                {activeTab === 'library' && <LibraryScreen />}
                {activeTab === 'search' && <SearchScreen />}
                {activeTab === 'playlists' && <PlaylistsScreen />}
                {activeTab === 'settings' && <SettingsScreen />}
                {activeTab === 'albums' && <AlbumsScreen />}
                {activeTab === 'artists' && <ArtistsScreen />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Floating MiniPlayer & Liquid Navigation Dock */}
          <div className="shrink-0 flex flex-col pointer-events-auto z-20">
            <MiniPlayer />
            <BottomNav />
          </div>

          {/* Full Screen Overlays, Screens & Modals */}
          <NowPlayingModal />
          <QueueModal />
          <CreatePlaylistModal />
          <EqualizerModal />
          <NativeCodeModal />
          <LiquidGlassCustomizer />
          <PrimeModeModal />
          <PrimeSongPickerModal />
          <SplashModal />
          <BluetoothConnectedModal />
          <SleepTimerModal />
          <HapticFeedbackModal />
          <NotificationPreviewSheet />
          <LockScreenPreviewSheet />
        </div>
      </IPhoneFrame>
    </div>
  );
};

export default function App() {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
}
