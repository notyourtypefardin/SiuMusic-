package com.sumusic.player.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sumusic.player.model.Playlist
import com.sumusic.player.model.Song
import com.sumusic.player.ui.components.LiquidGlassCard
import com.sumusic.player.ui.components.liquidGlassSurface
import com.sumusic.player.ui.theme.TextPrimary
import com.sumusic.player.ui.theme.TextSecondary
import com.sumusic.player.ui.theme.TextTertiary
import com.sumusic.player.viewmodel.MusicPlayerViewModel

@Composable
fun PlaylistsScreen(
    viewModel: MusicPlayerViewModel,
    playlists: List<Playlist>,
    primeSongIds: List<String>,
    isPrimeActive: Boolean,
    isPlaying: Boolean,
    allSongs: List<Song>,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 120.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Title Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Playlists",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black,
                        color = TextPrimary
                    )
                    Text(
                        text = "${playlists.size + 1} glass collections",
                        fontSize = 12.sp,
                        color = TextSecondary
                    )
                }

                Button(
                    onClick = { /* Create playlist */ },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color.White,
                        contentColor = Color.Black
                    ),
                    shape = CircleShape,
                    contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                ) {
                    Icon(Icons.Rounded.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Create", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        // Featured Prime Mode VIP Playlist Card
        item {
            LiquidGlassCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { viewModel.playPrimePlaylist() },
                cornerRadius = 24.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        modifier = Modifier.weight(1f),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Lightning Bolt Orb
                        Box(
                            modifier = Modifier
                                .size(54.dp)
                                .clip(CircleShape)
                                .background(
                                    Brush.verticalGradient(
                                        listOf(Color(0x55FFFFFF), Color(0x15FFFFFF), Color(0x05000000))
                                    )
                                )
                                .liquidGlassSurface(cornerRadius = 27.dp, blurRadius = 24f),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.Bolt,
                                contentDescription = "Prime Mode",
                                tint = Color.White,
                                modifier = Modifier.size(28.dp)
                            )
                        }

                        Spacer(modifier = Modifier.width(14.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .background(Color(0x33FFFFFF), CircleShape)
                                        .padding(horizontal = 8.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = "PRIME MODE",
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Black,
                                        color = Color.White
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Prime Mode Playlist",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Text(
                                text = "${primeSongIds.size} tracks · 1-Tap dock play",
                                fontSize = 11.sp,
                                color = TextSecondary
                            )
                        }
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        // Manage button
                        IconButton(onClick = { viewModel.openPrimeSongPicker() }) {
                            Icon(
                                imageVector = Icons.Rounded.Checklist,
                                contentDescription = "Manage Songs",
                                tint = TextPrimary,
                                modifier = Modifier.size(20.dp)
                            )
                        }

                        // Play/Pause Prime button
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(Color.White)
                                .clickable { viewModel.playPrimePlaylist() },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (isPrimeActive && isPlaying) Icons.Rounded.Pause else Icons.Rounded.PlayArrow,
                                contentDescription = "Play Prime",
                                tint = Color.Black,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }
            }
        }

        // Other Playlists
        items(playlists) { playlist ->
            val count = playlist.songIds.size
            LiquidGlassCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable {
                        val playlistSongs = playlist.songIds.mapNotNull { id -> allSongs.find { it.id == id } }
                        if (playlistSongs.isNotEmpty()) {
                            viewModel.playSong(playlistSongs.first(), playlistSongs)
                        }
                    },
                cornerRadius = 20.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        modifier = Modifier.weight(1f),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .liquidGlassSurface(cornerRadius = 16.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (playlist.id == "pl-favs") Icons.Rounded.Favorite else Icons.Rounded.QueueMusic,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(22.dp)
                            )
                        }

                        Spacer(modifier = Modifier.width(14.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = playlist.title,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Text(
                                text = "$count ${if (count == 1) "track" else "tracks"}",
                                fontSize = 11.sp,
                                color = TextSecondary
                            )
                        }
                    }

                    Box(
                        modifier = Modifier
                            .size(34.dp)
                            .liquidGlassSurface(cornerRadius = 17.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.PlayArrow,
                            contentDescription = "Play",
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }
        }
    }
}
