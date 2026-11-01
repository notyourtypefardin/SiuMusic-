package com.sumusic.player.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.sumusic.player.data.AudioScanner
import com.sumusic.player.data.PlaylistRepository
import com.sumusic.player.media.AudioPlayerManager
import com.sumusic.player.model.PlayerUiState
import com.sumusic.player.model.Song
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class MusicPlayerViewModel(application: Application) : AndroidViewModel(application) {

    private val audioScanner = AudioScanner(application)
    private val playlistRepo = PlaylistRepository(application)
    val playerManager = AudioPlayerManager(application)

    private val _allSongs = MutableStateFlow<List<Song>>(emptyList())
    private val _isLoadingLibrary = MutableStateFlow(false)
    private val _hasStoragePermission = MutableStateFlow(false)
    private val _isNowPlayingOpen = MutableStateFlow(false)
    private val _isEqualizerOpen = MutableStateFlow(false)
    private val _isPrimeSongPickerOpen = MutableStateFlow(false)
    private val _currentRoute = MutableStateFlow("home")
    private val _isPrimePlaybackActive = MutableStateFlow(false)

    val uiState: StateFlow<PlayerUiState> = combine(
        playerManager.currentSong,
        playerManager.isPlaying,
        playerManager.currentPositionMs,
        playerManager.durationMs,
        playerManager.queue,
        playerManager.repeatMode,
        playerManager.isShuffle,
        _allSongs,
        playlistRepo.playlists,
        playlistRepo.primePlaylistSongIds,
        _isPrimePlaybackActive,
        _isNowPlayingOpen,
        _isEqualizerOpen,
        _isPrimeSongPickerOpen,
        _currentRoute,
        _isLoadingLibrary,
        _hasStoragePermission
    ) { params: Array<Any?> ->
        PlayerUiState(
            currentSong = params[0] as? Song,
            isPlaying = params[1] as Boolean,
            currentPositionMs = params[2] as Long,
            durationMs = params[3] as Long,
            queue = (params[4] as? List<Song>) ?: emptyList(),
            repeatMode = (params[5] as? com.sumusic.player.model.RepeatMode) ?: com.sumusic.player.model.RepeatMode.ALL,
            isShuffle = params[6] as Boolean,
            allSongs = (params[7] as? List<Song>) ?: emptyList(),
            playlists = (params[8] as? List<com.sumusic.player.model.Playlist>) ?: emptyList(),
            primePlaylistSongIds = (params[9] as? List<String>) ?: emptyList(),
            isPrimePlaybackActive = params[10] as Boolean,
            isNowPlayingOpen = params[11] as Boolean,
            isEqualizerOpen = params[12] as Boolean,
            isPrimeSongPickerOpen = params[13] as Boolean,
            currentRoute = params[14] as String,
            isLoadingLibrary = params[15] as Boolean,
            hasStoragePermission = params[16] as Boolean
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = PlayerUiState()
    )

    init {
        loadMusic()
    }

    fun setStoragePermissionGranted(granted: Boolean) {
        _hasStoragePermission.value = granted
        if (granted) {
            loadMusic()
        }
    }

    fun loadMusic() {
        viewModelScope.launch {
            _isLoadingLibrary.value = true
            val songs = audioScanner.scanLocalAudio()
            _allSongs.value = songs
            _isLoadingLibrary.value = false
        }
    }

    fun playSong(song: Song, queue: List<Song> = listOf(song), isPrime: Boolean = false) {
        _isPrimePlaybackActive.value = isPrime
        playerManager.playSong(song, queue)
    }

    fun togglePlayPause() {
        playerManager.togglePlayPause()
    }

    fun seekTo(positionMs: Long) {
        playerManager.seekTo(positionMs)
    }

    fun seekToNext() {
        playerManager.seekToNext()
    }

    fun seekToPrevious() {
        playerManager.seekToPrevious()
    }

    fun cycleRepeatMode() {
        playerManager.cycleRepeatMode()
    }

    fun toggleShuffle() {
        playerManager.toggleShuffle()
    }

    fun toggleFavorite(songId: String) {
        playlistRepo.toggleFavorite(songId)
    }

    fun playPrimePlaylist() {
        val primeIds = playlistRepo.primePlaylistSongIds.value
        val primeSongs = primeIds.mapNotNull { id -> _allSongs.value.find { it.id == id } }

        if (primeSongs.isEmpty()) {
            _isPrimeSongPickerOpen.value = true
            return
        }

        val current = playerManager.currentSong.value
        if (_isPrimePlaybackActive.value && current != null && primeIds.contains(current.id)) {
            togglePlayPause()
            return
        }

        playSong(primeSongs.first(), primeSongs, isPrime = true)
    }

    fun openNowPlaying() {
        _isNowPlayingOpen.value = true
    }

    fun closeNowPlaying() {
        _isNowPlayingOpen.value = false
    }

    fun toggleEqualizer() {
        _isEqualizerOpen.value = !_isEqualizerOpen.value
    }

    fun openPrimeSongPicker() {
        _isPrimeSongPickerOpen.value = true
    }

    fun closePrimeSongPicker() {
        _isPrimeSongPickerOpen.value = false
    }

    fun setPrimePlaylistSongs(songIds: List<String>) {
        playlistRepo.setPrimePlaylistSongs(songIds)
    }

    fun toggleSongInPrimePlaylist(songId: String) {
        playlistRepo.toggleSongInPrimePlaylist(songId)
    }

    fun removeSongFromPrimePlaylist(songId: String) {
        playlistRepo.removeSongFromPrimePlaylist(songId)
    }

    fun navigate(route: String) {
        _currentRoute.value = route
    }

    override fun onCleared() {
        super.onCleared()
        playerManager.release()
    }
}
