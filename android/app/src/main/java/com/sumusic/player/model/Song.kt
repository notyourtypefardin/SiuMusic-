package com.sumusic.player.model

import android.net.Uri

data class Song(
    val id: String,
    val title: String,
    val artist: String,
    val album: String,
    val durationMs: Long,
    val contentUri: Uri,
    val albumArtUri: Uri? = null,
    val genre: String = "Unknown",
    val year: Int = 0,
    val isFavorite: Boolean = false
) {
    val durationFormatted: String
        get() {
            val totalSeconds = durationMs / 1000
            val minutes = totalSeconds / 60
            val seconds = totalSeconds % 60
            return "%d:%02d".format(minutes, seconds)
        }
}

data class Playlist(
    val id: String,
    val title: String,
    val description: String = "",
    val coverGradient: Pair<Long, Long> = Pair(0xFFCBD5E1, 0xFF0F172A),
    val songIds: List<String> = emptyList(),
    val isSystem: Boolean = false
)

enum class RepeatMode {
    OFF, ALL, ONE
}

data class PlayerUiState(
    val currentSong: Song? = null,
    val queue: List<Song> = emptyList(),
    val isPlaying: Boolean = false,
    val currentPositionMs: Long = 0L,
    val durationMs: Long = 0L,
    val repeatMode: RepeatMode = RepeatMode.ALL,
    val isShuffle: Boolean = false,
    val isNowPlayingOpen: Boolean = false,
    val isEqualizerOpen: Boolean = false,
    val isPrimeSongPickerOpen: Boolean = false,
    val currentRoute: String = "home",
    val allSongs: List<Song> = emptyList(),
    val playlists: List<Playlist> = emptyList(),
    val primePlaylistSongIds: List<String> = emptyList(),
    val isPrimePlaybackActive: Boolean = false,
    val isLoadingLibrary: Boolean = false,
    val hasStoragePermission: Boolean = false
) {
    val progressFraction: Float
        get() = if (durationMs > 0) (currentPositionMs.toFloat() / durationMs.toFloat()).coerceIn(0f, 1f) else 0f
}
