package com.sumusic.player.ui.screens

import androidx.compose.animation.*
import androidx.compose.animation.core.spring
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.sumusic.player.model.PlayerUiState
import com.sumusic.player.model.RepeatMode
import com.sumusic.player.ui.components.liquidGlassSurface
import com.sumusic.player.ui.theme.TextPrimary
import com.sumusic.player.ui.theme.TextSecondary
import com.sumusic.player.ui.theme.TextTertiary
import com.sumusic.player.viewmodel.MusicPlayerViewModel

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
        val song = uiState.currentSong

        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFF030305))
        ) {
            // Ambient glow
            Box(
                modifier = Modifier
                    .size(340.dp)
                    .align(Alignment.TopCenter)
                    .offset(y = (-40).dp)
                    .liquidGlassSurface(blurRadius = 140f, tintColor = Color(0x356366F1))
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .statusBarsPadding()
                    .navigationBarsPadding()
                    .padding(horizontal = 24.dp, vertical = 16.dp),
                verticalArrangement = Arrangement.SpaceBetween,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Top Header Action Bar
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier
                            .size(40.dp)
                            .liquidGlassSurface(cornerRadius = 20.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.KeyboardArrowDown,
                            contentDescription = "Dismiss",
                            tint = TextPrimary
                        )
                    }

                    Text(
                        text = "Now Playing",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )

                    IconButton(
                        onClick = { viewModel.toggleEqualizer() },
                        modifier = Modifier
                            .size(40.dp)
                            .liquidGlassSurface(cornerRadius = 20.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.GraphicEq,
                            contentDescription = "Equalizer",
                            tint = TextPrimary
                        )
                    }
                }

                // Center Album Artwork Frame
                Box(
                    modifier = Modifier
                        .size(290.dp)
                        .liquidGlassSurface(cornerRadius = 32.dp, blurRadius = 32f)
                        .padding(12.dp)
                ) {
                    Image(
                        painter = rememberAsyncImagePainter(song?.albumArtUri),
                        contentDescription = song?.title,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .fillMaxSize()
                            .clip(RoundedCornerShape(24.dp))
                    )
                }

                // Track Information & Favorite
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = song?.title ?: "No Song Playing",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = song?.artist ?: "Unknown Artist",
                                fontSize = 14.sp,
                                color = TextSecondary,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }

                        IconButton(
                            onClick = { song?.id?.let { viewModel.toggleFavorite(it) } },
                            modifier = Modifier.size(40.dp)
                        ) {
                            Icon(
                                imageVector = if (song?.isFavorite == true) Icons.Rounded.Favorite else Icons.Rounded.FavoriteBorder,
                                contentDescription = "Favorite",
                                tint = if (song?.isFavorite == true) Color.White else TextSecondary
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Progress Scrubber Slider
                    var isUserSeeking by remember { mutableStateOf(false) }
                    var seekProgress by remember { mutableFloatStateOf(0f) }

                    val displayProgress = if (isUserSeeking) seekProgress else uiState.progressFraction

                    Slider(
                        value = displayProgress,
                        onValueChange = {
                            isUserSeeking = true
                            seekProgress = it
                        },
                        onValueChangeFinished = {
                            val targetMs = (seekProgress * uiState.durationMs).toLong()
                            viewModel.seekTo(targetMs)
                            isUserSeeking = false
                        },
                        colors = SliderDefaults.colors(
                            thumbColor = Color.White,
                            activeTrackColor = Color.White,
                            inactiveTrackColor = Color(0x33FFFFFF)
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        val currentMs = if (isUserSeeking) (seekProgress * uiState.durationMs).toLong() else uiState.currentPositionMs
                        Text(
                            text = formatMs(currentMs),
                            fontSize = 11.sp,
                            color = TextTertiary
                        )
                        Text(
                            text = formatMs(uiState.durationMs),
                            fontSize = 11.sp,
                            color = TextTertiary
                        )
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    // Media Playback Controls
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Shuffle
                        IconButton(onClick = { viewModel.toggleShuffle() }) {
                            Icon(
                                imageVector = Icons.Rounded.Shuffle,
                                contentDescription = "Shuffle",
                                tint = if (uiState.isShuffle) Color.White else TextTertiary,
                                modifier = Modifier.size(22.dp)
                            )
                        }

                        // Previous
                        IconButton(onClick = { viewModel.seekToPrevious() }) {
                            Icon(
                                imageVector = Icons.Rounded.SkipPrevious,
                                contentDescription = "Previous",
                                tint = TextPrimary,
                                modifier = Modifier.size(32.dp)
                            )
                        }

                        // Central Play/Pause Orb
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .clip(CircleShape)
                                .background(
                                    Brush.verticalGradient(
                                        listOf(Color.White, Color(0xFFCBD5E1))
                                    )
                                )
                                .clickable { viewModel.togglePlayPause() },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (uiState.isPlaying) Icons.Rounded.Pause else Icons.Rounded.PlayArrow,
                                contentDescription = "Play/Pause",
                                tint = Color.Black,
                                modifier = Modifier.size(32.dp)
                            )
                        }

                        // Next
                        IconButton(onClick = { viewModel.seekToNext() }) {
                            Icon(
                                imageVector = Icons.Rounded.SkipNext,
                                contentDescription = "Next",
                                tint = TextPrimary,
                                modifier = Modifier.size(32.dp)
                            )
                        }

                        // Repeat
                        IconButton(onClick = { viewModel.cycleRepeatMode() }) {
                            Icon(
                                imageVector = when (uiState.repeatMode) {
                                    RepeatMode.ONE -> Icons.Rounded.RepeatOne
                                    RepeatMode.ALL -> Icons.Rounded.Repeat
                                    RepeatMode.OFF -> Icons.Rounded.Repeat
                                },
                                contentDescription = "Repeat",
                                tint = if (uiState.repeatMode != RepeatMode.OFF) Color.White else TextTertiary,
                                modifier = Modifier.size(22.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

private fun formatMs(ms: Long): String {
    val totalSeconds = (ms / 1000).coerceAtLeast(0)
    val minutes = totalSeconds / 60
    val seconds = totalSeconds % 60
    return "%d:%02d".format(minutes, seconds)
}
