package com.sumusic.player

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.core.content.ContextCompat
import com.sumusic.player.ui.components.FloatingBottomNav
import com.sumusic.player.ui.components.MiniPlayer
import com.sumusic.player.ui.screens.HomeScreen
import com.sumusic.player.ui.screens.NowPlayingScreen
import com.sumusic.player.ui.screens.PlaylistsScreen
import com.sumusic.player.ui.theme.AbsoluteBlack
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

                // Permission Launcher for Audio & Notifications
                val storagePermission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    Manifest.permission.READ_MEDIA_AUDIO
                } else {
                    Manifest.permission.READ_EXTERNAL_STORAGE
                }

                val permissionLauncher = rememberLauncherForActivityResult(
                    contract = ActivityResultContracts.RequestPermission()
                ) { isGranted ->
                    viewModel.setStoragePermissionGranted(isGranted)
                }

                LaunchedEffect(Unit) {
                    val hasPermission = ContextCompat.checkSelfPermission(
                        this@MainActivity,
                        storagePermission
                    ) == PackageManager.PERMISSION_GRANTED
                    if (!hasPermission) {
                        permissionLauncher.launch(storagePermission)
                    } else {
                        viewModel.setStoragePermissionGranted(true)
                    }
                }

                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = AbsoluteBlack
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .statusBarsPadding()
                    ) {
                        // Current Screen Body
                        when (uiState.currentRoute) {
                            "home" -> {
                                HomeScreen(
                                    viewModel = viewModel,
                                    songs = uiState.allSongs,
                                    onSongClick = { song -> viewModel.playSong(song, uiState.allSongs) },
                                    onSettingsClick = { viewModel.navigate("settings") }
                                )
                            }
                            "playlists" -> {
                                PlaylistsScreen(
                                    viewModel = viewModel,
                                    playlists = uiState.playlists,
                                    primeSongIds = uiState.primePlaylistSongIds,
                                    isPrimeActive = uiState.isPrimePlaybackActive,
                                    isPlaying = uiState.isPlaying,
                                    allSongs = uiState.allSongs
                                )
                            }
                            else -> {
                                HomeScreen(
                                    viewModel = viewModel,
                                    songs = uiState.allSongs,
                                    onSongClick = { song -> viewModel.playSong(song, uiState.allSongs) },
                                    onSettingsClick = { viewModel.navigate("settings") }
                                )
                            }
                        }

                        // Bottom Floating Dock Container (MiniPlayer + FloatingBottomNav)
                        Column(
                            modifier = Modifier
                                .align(Alignment.BottomCenter)
                                .fillMaxWidth()
                        ) {
                            MiniPlayer(
                                song = uiState.currentSong,
                                isPlaying = uiState.isPlaying,
                                progressFraction = uiState.progressFraction,
                                onPlayPause = { viewModel.togglePlayPause() },
                                onNext = { viewModel.seekToNext() },
                                onToggleFavorite = {
                                    uiState.currentSong?.id?.let { viewModel.toggleFavorite(it) }
                                },
                                onClick = { viewModel.openNowPlaying() }
                            )

                            FloatingBottomNav(
                                currentRoute = uiState.currentRoute,
                                isPlaying = uiState.isPlaying,
                                isPrimeActive = uiState.isPrimePlaybackActive,
                                onNavigate = { viewModel.navigate(it) },
                                onPlayPause = { viewModel.togglePlayPause() },
                                onPrimeClick = { viewModel.playPrimePlaylist() }
                            )
                        }

                        // Now Playing Signature Modal
                        NowPlayingScreen(
                            viewModel = viewModel,
                            uiState = uiState,
                            onDismiss = { viewModel.closeNowPlaying() }
                        )
                    }
                }
            }
        }
    }
}
