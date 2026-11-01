package com.sumusic.player.data

import android.content.Context
import android.content.SharedPreferences
import com.sumusic.player.model.Playlist
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.json.JSONArray

class PlaylistRepository(context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences("siuumusic_playlists_prefs", Context.MODE_PRIVATE)

    private val _playlists = MutableStateFlow<List<Playlist>>(emptyList())
    val playlists: StateFlow<List<Playlist>> = _playlists.asStateFlow()

    private val _primePlaylistSongIds = MutableStateFlow<List<String>>(emptyList())
    val primePlaylistSongIds: StateFlow<List<String>> = _primePlaylistSongIds.asStateFlow()

    private val _favoriteSongIds = MutableStateFlow<Set<String>>(emptySet())
    val favoriteSongIds: StateFlow<Set<String>> = _favoriteSongIds.asStateFlow()

    init {
        loadData()
    }

    private fun loadData() {
        // Load Prime Playlist
        val primeJson = prefs.getString("prime_playlist_ids", null)
        val primeList = if (!primeJson.isNullOrEmpty()) {
            val arr = JSONArray(primeJson)
            List(arr.length()) { i -> arr.getString(i) }
        } else {
            listOf("track-1", "track-2", "track-3", "track-4")
        }
        _primePlaylistSongIds.value = primeList

        // Load Favorites
        val favsSet = prefs.getStringSet("favorite_ids", setOf("track-1", "track-2", "track-3")) ?: emptySet()
        _favoriteSongIds.value = favsSet

        // Load Playlists
        _playlists.value = listOf(
            Playlist(
                id = "pl-favs",
                title = "Favorites",
                description = "Your favorite tracks",
                coverGradient = Pair(0xFFCBD5E1, 0xFF0F172A),
                songIds = favsSet.toList(),
                isSystem = true
            ),
            Playlist(
                id = "pl-1",
                title = "My Playlist",
                description = "Curated obsidian glass tracks",
                coverGradient = Pair(0xFFE2E8F0, 0xFF1E293B),
                songIds = listOf("track-1", "track-2", "track-3"),
                isSystem = false
            ),
            Playlist(
                id = "pl-2",
                title = "Chill Vibes",
                description = "Late night ambient vibes",
                coverGradient = Pair(0xFF94A3B8, 0xFF020617),
                songIds = listOf("track-1", "track-2"),
                isSystem = false
            )
        )
    }

    fun setPrimePlaylistSongs(songIds: List<String>) {
        val unique = songIds.distinct()
        _primePlaylistSongIds.value = unique
        val arr = JSONArray()
        unique.forEach { arr.put(it) }
        prefs.edit().putString("prime_playlist_ids", arr.toString()).apply()
    }

    fun toggleSongInPrimePlaylist(songId: String) {
        val current = _primePlaylistSongIds.value.toMutableList()
        if (current.contains(songId)) {
            current.remove(songId)
        } else {
            current.add(songId)
        }
        setPrimePlaylistSongs(current)
    }

    fun removeSongFromPrimePlaylist(songId: String) {
        val updated = _primePlaylistSongIds.value.filter { it != songId }
        setPrimePlaylistSongs(updated)
    }

    fun toggleFavorite(songId: String) {
        val current = _favoriteSongIds.value.toMutableSet()
        if (current.contains(songId)) {
            current.remove(songId)
        } else {
            current.add(songId)
        }
        _favoriteSongIds.value = current
        prefs.edit().putStringSet("favorite_ids", current).apply()

        // Update Favorites system playlist
        _playlists.value = _playlists.value.map { pl ->
            if (pl.id == "pl-favs") {
                pl.copy(songIds = current.toList())
            } else pl
        }
    }

    fun createPlaylist(title: String, description: String, gradient: Pair<Long, Long>) {
        val newPl = Playlist(
            id = "pl-${System.currentTimeMillis()}",
            title = title,
            description = description,
            coverGradient = gradient,
            songIds = emptyList(),
            isSystem = false
        )
        _playlists.value = listOf(newPl) + _playlists.value
    }

    fun addSongToPlaylist(playlistId: String, songId: String) {
        _playlists.value = _playlists.value.map { pl ->
            if (pl.id == playlistId && !pl.songIds.contains(songId)) {
                pl.copy(songIds = pl.songIds + songId)
            } else pl
        }
    }

    fun removeSongFromPlaylist(playlistId: String, songId: String) {
        _playlists.value = _playlists.value.map { pl ->
            if (pl.id == playlistId) {
                pl.copy(songIds = pl.songIds.filter { it != songId })
            } else pl
        }
    }
}
