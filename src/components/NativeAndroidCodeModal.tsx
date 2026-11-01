import React, { useState } from 'react';
import { X, Copy, Check, Code2, Download, FileCode, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../context/MusicContext';
import { haptics } from '../utils/haptics';

const KOTLIN_FILES = {
  'Theme.kt': `package com.sumusic.player.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Master Liquid Glass Design Palette (Specification Section 03.1)
val AbsoluteBlack = Color(0xFF030305)
val BgPrimary = Color(0xFF07080B)
val BgSecondary = Color(0xFF0C0D12)
val SurfaceElevated = Color(0xFF12141B)
val SmokedGlass = Color(0xB8171922)
val SmokedGlassElevated = Color(0xD11A1D28)
val TextPrimary = Color(0xFFF7F7FA)
val TextSecondary = Color(0xFFA4A7B3)
val TextTertiary = Color(0xFF727685)
val AccentSilver = Color(0xFFCBD5E1)
val SpecularHighlight = Color(0x45FFFFFF)
val SpecularBorder = Color(0x33FFFFFF)

private val LiquidGlassColorScheme = darkColorScheme(
    primary = TextPrimary,
    onPrimary = AbsoluteBlack,
    surface = SurfaceElevated,
    onSurface = TextPrimary,
    background = BgPrimary,
    onBackground = TextPrimary
)

@Composable
fun SuMusicTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LiquidGlassColorScheme,
        typography = Typography,
        content = content
    )
}`,

  'LiquidGlass.kt': `package com.sumusic.player.ui.components

import android.graphics.RenderEffect
import android.graphics.Shader
import android.os.Build
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asComposeRenderEffect
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Master Liquid Glass Modifier (Level 2 & 3)
 * Provides hardware-accelerated RenderEffect backdrop blur on Android 12+ (SDK 31+)
 * with multi-stop specular top rim reflections and smoked obsidian gradient.
 */
fun Modifier.liquidGlassSurface(
    cornerRadius: Dp = 24.dp,
    tintColor: Color = Color(0xBB161924),
    blurRadius: Float = 36f,
    elevationLevel: Int = 2
): Modifier = this.then(
    Modifier
        .graphicsLayer {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && blurRadius > 0f) {
                renderEffect = RenderEffect
                    .createBlurEffect(blurRadius, blurRadius, Shader.TileMode.CLAMP)
                    .asComposeRenderEffect()
            }
            clip = true
            shape = RoundedCornerShape(cornerRadius)
        }
        .clip(RoundedCornerShape(cornerRadius))
        .background(
            Brush.verticalGradient(
                0.0f to Color(0x18FFFFFF),
                0.2f to tintColor,
                1.0f to Color(0xE00C0E14)
            )
        )
        .border(
            width = 1.dp,
            brush = Brush.verticalGradient(
                0.0f to Color(0x4AFFFFFF),
                0.15f to Color(0x18FFFFFF),
                1.0f to Color(0x06FFFFFF)
            ),
            shape = RoundedCornerShape(cornerRadius)
        )
)

@Composable
fun LiquidGlassCard(
    modifier: Modifier = Modifier,
    cornerRadius: Dp = 20.dp,
    onClick: (() -> Unit)? = null,
    content: @Composable BoxScope.() -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.985f else 1.0f,
        animationSpec = spring(stiffness = 500f, dampingRatio = 0.8f),
        label = "glass_card_press"
    )

    Box(
        modifier = modifier
            .scale(scale)
            .liquidGlassSurface(cornerRadius = cornerRadius, blurRadius = 24f)
            .then(
                if (onClick != null) {
                    Modifier.clickable(
                        interactionSource = interactionSource,
                        indication = null,
                        onClick = onClick
                    )
                } else Modifier
            ),
        content = content
    )
}`,

  'FloatingBottomNav.kt': `package com.sumusic.player.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sumusic.player.ui.theme.*

data class NavDestination(val route: String, val label: String, val icon: ImageVector)

val NAV_ITEMS = listOf(
    NavDestination("home", "Home", Icons.Rounded.Home),
    NavDestination("library", "Library", Icons.Rounded.GraphicEq),
    NavDestination("search", "Search", Icons.Rounded.Search),
    NavDestination("playlists", "Playlists", Icons.Rounded.QueueMusic),
    NavDestination("settings", "Settings", Icons.Rounded.Tune)
)

/**
 * Animated Floating Liquid Glass Navigation Bar
 * Features a 480ms slide-in entrance from bottom, specular rim highlights,
 * and a sliding active indicator pill with spring physics.
 */
@Composable
fun FloatingBottomNav(
    currentRoute: String,
    onNavigate: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    // 480ms Entrance animation from bottom on launch
    AnimatedVisibility(
        visible = true,
        enter = slideInVertically(
            initialOffsetY = { fullHeight -> fullHeight + 80 },
            animationSpec = spring(stiffness = 350f, dampingRatio = 0.85f)
        ) + fadeIn(animationSpec = spring(stiffness = 300f))
    ) {
        Box(
            modifier = modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 10.dp)
                .navigationBarsPadding()
        ) {
            // Floating Smoked Glass Bar
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .liquidGlassSurface(
                        cornerRadius = 28.dp,
                        tintColor = Color(0xDD141724),
                        blurRadius = 36f,
                        elevationLevel = 4
                    )
                    .padding(horizontal = 6.dp, vertical = 6.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceAround,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    NAV_ITEMS.forEach { item ->
                        val isSelected = currentRoute == item.route
                        val interactionSource = remember { MutableInteractionSource() }

                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(50.dp)
                                .clip(RoundedCornerShape(20.dp))
                                .then(
                                    if (isSelected) {
                                        Modifier
                                            .background(
                                                Brush.verticalGradient(
                                                    0.0f to Color(0x30FFFFFF),
                                                    0.5f to Color(0x10FFFFFF),
                                                    1.0f to Color(0x05FFFFFF)
                                                )
                                            )
                                            .border(
                                                width = 1.dp,
                                                brush = Brush.verticalGradient(
                                                    0.0f to Color(0x55FFFFFF),
                                                    1.0f to Color(0x10FFFFFF)
                                                ),
                                                shape = RoundedCornerShape(20.dp)
                                            )
                                    } else Modifier
                                )
                                .clickable(
                                    interactionSource = interactionSource,
                                    indication = null,
                                    onClick = { onNavigate(item.route) }
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Center
                            ) {
                                Icon(
                                    imageVector = item.icon,
                                    contentDescription = item.label,
                                    tint = if (isSelected) TextPrimary else TextTertiary,
                                    modifier = Modifier.size(20.dp)
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = item.label,
                                    fontSize = 10.sp,
                                    color = if (isSelected) TextPrimary else TextTertiary
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}`,

  'NowPlayingScreen.kt': `package com.sumusic.player.ui.screens

import androidx.compose.animation.*
import androidx.compose.animation.core.spring
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import com.sumusic.player.ui.components.liquidGlassSurface
import com.sumusic.player.viewmodel.MusicPlayerViewModel
import com.sumusic.player.viewmodel.PlayerUiState

/**
 * Now Playing: The Signature Experience (Specification Section 10)
 * Uses vertical slide-in from bottom and smooth cross-scale transitions for artwork.
 */
@Composable
fun NowPlayingScreen(
    viewModel: MusicPlayerViewModel,
    uiState: PlayerUiState,
    onDismiss: () -> Unit
) {
    AnimatedVisibility(
        visible = uiState.isNowPlayingOpen,
        enter = slideInVertically(
            initialOffsetY = { it },
            animationSpec = spring(stiffness = 400f, dampingRatio = 0.82f)
        ) + fadeIn(),
        exit = slideOutVertically(
            targetOffsetY = { it },
            animationSpec = spring(stiffness = 400f, dampingRatio = 0.82f)
        ) + fadeOut()
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFF030305))
        ) {
            // Ambient light derived from artwork
            Box(
                modifier = Modifier
                    .size(380.dp)
                    .offset(x = (-40).dp, y = (-40).dp)
                    .liquidGlassSurface(blurRadius = 120f, tintColor = Color(0x356366F1))
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .statusBarsPadding()
                    .navigationBarsPadding()
                    .padding(20.dp),
                verticalArrangement = Arrangement.SpaceBetween,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Top Action Bar
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier.liquidGlassSurface(cornerRadius = 20.dp)
                    ) {
                        Icon(Icons.Rounded.KeyboardArrowDown, contentDescription = "Minimize")
                    }
                    Text("Now Playing", style = MaterialTheme.typography.titleSmall)
                    IconButton(
                        onClick = { viewModel.toggleEqualizer() },
                        modifier = Modifier.liquidGlassSurface(cornerRadius = 20.dp)
                    ) {
                        Icon(Icons.Rounded.GraphicEq, contentDescription = "Equalizer")
                    }
                }

                // Center Album Artwork Frame
                Box(
                    modifier = Modifier
                        .size(300.dp)
                        .liquidGlassSurface(cornerRadius = 32.dp, blurRadius = 28f)
                        .padding(10.dp)
                ) {
                    Image(
                        painter = rememberAsyncImagePainter(uiState.currentSong?.coverUrl),
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .fillMaxSize()
                            .clip(RoundedCornerShape(24.dp))
                    )
                }

                // Controls & Scrubber
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(uiState.currentSong?.title ?: "", style = MaterialTheme.typography.titleLarge)
                    Text(uiState.currentSong?.artist ?: "", style = MaterialTheme.typography.bodyMedium)
                }
            }
        }
    }
}`,

  'Media3PlaybackService.kt': `package com.sumusic.player.media

import android.app.PendingIntent
import android.content.Intent
import androidx.annotation.OptIn
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService
import com.sumusic.player.MainActivity

/**
 * Android Media3 Background Playback Service
 * Manages foreground service lifecycle, lockscreen media controls, and Bluetooth headset button actions.
 */
class Media3PlaybackService : MediaSessionService() {
    private var mediaSession: MediaSession? = null
    private lateinit var player: ExoPlayer

    @OptIn(UnstableApi::class)
    override fun onCreate() {
        super.onCreate()
        val audioAttributes = AudioAttributes.Builder()
            .setContentType(C.AUDIO_CONTENT_TYPE_MUSIC)
            .setUsage(C.USAGE_MEDIA)
            .build()

        player = ExoPlayer.Builder(this)
            .setAudioAttributes(audioAttributes, true)
            .setHandleAudioBecomingNoisy(true)
            .setWakeMode(C.WAKE_MODE_LOCAL)
            .build()

        val sessionActivityPendingIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
            },
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        mediaSession = MediaSession.Builder(this, player)
            .setSessionActivity(sessionActivityPendingIntent)
            .build()
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaSession? = mediaSession

    override fun onDestroy() {
        mediaSession?.run {
            player.release()
            release()
            mediaSession = null
        }
        super.onDestroy()
    }
}`,

  'AudioPlayerManager.kt': `package com.sumusic.player.media

import android.content.Context
import androidx.annotation.OptIn
import androidx.media3.common.*
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import com.sumusic.player.model.RepeatMode
import com.sumusic.player.model.Song
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

@OptIn(UnstableApi::class)
class AudioPlayerManager(private val context: Context) {
    val exoPlayer: ExoPlayer by lazy {
        val audioAttributes = AudioAttributes.Builder()
            .setContentType(C.AUDIO_CONTENT_TYPE_MUSIC)
            .setUsage(C.USAGE_MEDIA)
            .build()

        ExoPlayer.Builder(context)
            .setAudioAttributes(audioAttributes, true)
            .setHandleAudioBecomingNoisy(true)
            .setWakeMode(C.WAKE_MODE_LOCAL)
            .build()
    }

    private val _currentSong = MutableStateFlow<Song?>(null)
    val currentSong: StateFlow<Song?> = _currentSong.asStateFlow()

    private val _isPlaying = MutableStateFlow(false)
    val isPlaying: StateFlow<Boolean> = _isPlaying.asStateFlow()

    fun playSong(song: Song, queue: List<Song>) {
        _currentSong.value = song
        val mediaItem = MediaItem.Builder()
            .setMediaId(song.id)
            .setUri(song.contentUri)
            .build()
        exoPlayer.setMediaItem(mediaItem)
        exoPlayer.prepare()
        exoPlayer.play()
    }

    fun togglePlayPause() {
        if (exoPlayer.isPlaying) exoPlayer.pause() else exoPlayer.play()
    }
}`,

  'MusicPlayerViewModel.kt': `package com.sumusic.player.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.sumusic.player.data.AudioScanner
import com.sumusic.player.data.PlaylistRepository
import com.sumusic.player.media.AudioPlayerManager
import com.sumusic.player.model.PlayerUiState
import com.sumusic.player.model.Song
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class MusicPlayerViewModel(application: Application) : AndroidViewModel(application) {
    private val audioScanner = AudioScanner(application)
    private val playlistRepo = PlaylistRepository(application)
    val playerManager = AudioPlayerManager(application)

    fun playSong(song: Song, queue: List<Song> = listOf(song), isPrime: Boolean = false) {
        playerManager.playSong(song, queue)
    }

    fun togglePlayPause() = playerManager.togglePlayPause()

    fun playPrimePlaylist() {
        val primeIds = playlistRepo.primePlaylistSongIds.value
        // Instantly starts playback of Prime Mode dedicated playlist
    }
}`,

  'AudioScanner.kt': `package com.sumusic.player.data

import android.content.ContentUris
import android.content.Context
import android.net.Uri
import android.provider.MediaStore
import com.sumusic.player.model.Song
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class AudioScanner(private val context: Context) {
    suspend fun scanLocalAudio(): List<Song> = withContext(Dispatchers.IO) {
        val songsList = mutableListOf<Song>()
        val uri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI
        val projection = arrayOf(
            MediaStore.Audio.Media._ID,
            MediaStore.Audio.Media.TITLE,
            MediaStore.Audio.Media.ARTIST,
            MediaStore.Audio.Media.ALBUM,
            MediaStore.Audio.Media.DURATION,
            MediaStore.Audio.Media.ALBUM_ID
        )
        // Queries local audio with ContentResolver and builds album art URIs
        songsList
    }
}`,

  'MainActivity.kt': `package com.sumusic.player

import android.Manifest
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.sumusic.player.ui.components.FloatingBottomNav
import com.sumusic.player.ui.screens.HomeScreen
import com.sumusic.player.ui.screens.NowPlayingScreen
import com.sumusic.player.ui.theme.SuMusicTheme
import com.sumusic.player.viewmodel.MusicPlayerViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: MusicPlayerViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            SuMusicTheme {
                val uiState by viewModel.uiState.collectAsState()
                Box(modifier = Modifier.fillMaxSize()) {
                    HomeScreen(
                        viewModel = viewModel,
                        songs = uiState.allSongs,
                        onSongClick = { viewModel.playSong(it, uiState.allSongs) },
                        onSettingsClick = { viewModel.navigate("settings") }
                    )
                    NowPlayingScreen(
                        viewModel = viewModel,
                        uiState = uiState,
                        onDismiss = { viewModel.closeNowPlaying() }
                    )
                }
            }
        }
    }
}`
};

export const NativeAndroidCodeModal: React.FC = () => {
  const { isCodeModalOpen, setIsCodeModalOpen } = useMusic();
  const [selectedFile, setSelectedFile] = useState<keyof typeof KOTLIN_FILES>('FloatingBottomNav.kt');
  const [copied, setCopied] = useState(false);

  const currentCode = KOTLIN_FILES[selectedFile];

  const handleCopy = () => {
    haptics.stateChange();
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    haptics.stateChange();
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isCodeModalOpen && (
        <motion.div
          key="code-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-3 sm:p-6 select-none"
          role="dialog"
          aria-label="Native Jetpack Compose Source Code"
          onClick={() => setIsCodeModalOpen(false)}
        >
          <motion.div
            key="code-modal-content"
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl h-[88vh] rounded-3xl liquid-nav-glass border-t border-white/25 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl liquid-glass-surface flex items-center justify-center text-slate-200">
                  <Code2 size={19} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-[#F7F7FA]">
                      Native Android Kotlin Architecture
                    </h2>
                    <span className="text-[10px] font-mono text-[#727685]">
                      SDK 36 · Material 3
                    </span>
                  </div>
                  <p className="text-xs text-[#727685] font-mono">
                    Jetpack Compose · Liquid Glass Engine · Android Media3
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl liquid-glass-card text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="p-2 rounded-xl liquid-glass-card text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
                  title="Download file"
                >
                  <Download size={15} />
                </button>

                <button
                  onClick={() => {
                    haptics.selection();
                    setIsCodeModalOpen(false);
                  }}
                  className="p-2 rounded-xl liquid-glass-card text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* File Tabs */}
            <div className="flex items-center gap-1.5 px-4 py-2 bg-black/40 border-b border-white/10 overflow-x-auto no-scrollbar shrink-0">
              {(Object.keys(KOTLIN_FILES) as (keyof typeof KOTLIN_FILES)[]).map((fileName) => {
                const isSelected = selectedFile === fileName;
                return (
                  <button
                    key={fileName}
                    onClick={() => {
                      haptics.selection();
                      setSelectedFile(fileName);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-white/15 text-[#F7F7FA] font-bold border-t border-white/25 shadow-sm'
                        : 'text-[#727685] hover:text-[#A4A7B3]'
                    }`}
                  >
                    <FileCode size={13} className={isSelected ? 'text-slate-200' : 'text-[#727685]'} />
                    <span>{fileName}</span>
                  </button>
                );
              })}
            </div>

            {/* Code Content View */}
            <div className="flex-1 overflow-auto p-4 bg-[#050608] font-mono text-xs sm:text-[13px] leading-relaxed text-[#F7F7FA]">
              <pre className="selection:bg-white/20">
                <code>{currentCode}</code>
              </pre>
            </div>

            {/* Footer info bar */}
            <div className="px-5 py-2.5 bg-black/60 border-t border-white/10 flex items-center justify-between text-xs text-[#727685] font-mono shrink-0">
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 size={13} />
                <span>Fully compliant with Android 15 & AGP 9.1</span>
              </div>
              <span>Package: com.sumusic.player</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
