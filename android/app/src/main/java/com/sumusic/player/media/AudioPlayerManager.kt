package com.sumusic.player.media

import android.content.Context
import androidx.annotation.OptIn
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import com.sumusic.player.model.RepeatMode
import com.sumusic.player.model.Song
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

@OptIn(UnstableApi::class)
class AudioPlayerManager(private val context: Context) {

    val exoPlayer: ExoPlayer by lazy {
        val audioAttributes = AudioAttributes.Builder()
            .setContentType(C.AUDIO_CONTENT_TYPE_MUSIC)
            .setUsage(C.USAGE_MEDIA)
            .build()

        ExoPlayer.Builder(context)
            .setAudioAttributes(audioAttributes, true)
            .setHandleAudioBecomingNoisy(true) // Automatically pause when Bluetooth/headphones disconnect
            .setWakeMode(C.WAKE_MODE_LOCAL)
            .build().apply {
                addListener(playerListener)
            }
    }

    private val scope = CoroutineScope(Dispatchers.Main + Job())
    private var progressJob: Job? = null

    private val _currentSong = MutableStateFlow<Song?>(null)
    val currentSong: StateFlow<Song?> = _currentSong.asStateFlow()

    private val _isPlaying = MutableStateFlow(false)
    val isPlaying: StateFlow<Boolean> = _isPlaying.asStateFlow()

    private val _currentPositionMs = MutableStateFlow(0L)
    val currentPositionMs: StateFlow<Long> = _currentPositionMs.asStateFlow()

    private val _durationMs = MutableStateFlow(0L)
    val durationMs: StateFlow<Long> = _durationMs.asStateFlow()

    private val _queue = MutableStateFlow<List<Song>>(emptyList())
    val queue: StateFlow<List<Song>> = _queue.asStateFlow()

    private val _repeatMode = MutableStateFlow(RepeatMode.ALL)
    val repeatMode: StateFlow<RepeatMode> = _repeatMode.asStateFlow()

    private val _isShuffle = MutableStateFlow(false)
    val isShuffle: StateFlow<Boolean> = _isShuffle.asStateFlow()

    private val playerListener = object : Player.Listener {
        override fun onIsPlayingChanged(isPlaying: Boolean) {
            _isPlaying.value = isPlaying
            if (isPlaying) {
                startProgressUpdates()
            } else {
                stopProgressUpdates()
            }
        }

        override fun onPlaybackStateChanged(playbackState: Int) {
            when (playbackState) {
                Player.STATE_READY -> {
                    _durationMs.value = exoPlayer.duration.coerceAtLeast(0L)
                }
                Player.STATE_ENDED -> {
                    onTrackEnded()
                }
                else -> {}
            }
        }

        override fun onMediaItemTransition(mediaItem: MediaItem?, reason: Int) {
            val mediaId = mediaItem?.mediaId
            if (mediaId != null) {
                val song = _queue.value.find { it.id == mediaId }
                if (song != null) {
                    _currentSong.value = song
                    _durationMs.value = song.durationMs
                }
            }
        }
    }

    private fun startProgressUpdates() {
        progressJob?.cancel()
        progressJob = scope.launch {
            while (isActive) {
                _currentPositionMs.value = exoPlayer.currentPosition.coerceAtLeast(0L)
                delay(200)
            }
        }
    }

    private fun stopProgressUpdates() {
        progressJob?.cancel()
    }

    private fun onTrackEnded() {
        when (_repeatMode.value) {
            RepeatMode.ONE -> {
                exoPlayer.seekTo(0)
                exoPlayer.play()
            }
            RepeatMode.ALL -> {
                seekToNext()
            }
            RepeatMode.OFF -> {
                val currentIndex = _queue.value.indexOfFirst { it.id == _currentSong.value?.id }
                if (currentIndex >= 0 && currentIndex < _queue.value.size - 1) {
                    seekToNext()
                } else {
                    exoPlayer.pause()
                    exoPlayer.seekTo(0)
                }
            }
        }
    }

    fun playSong(song: Song, newQueue: List<Song> = listOf(song)) {
        _queue.value = newQueue
        _currentSong.value = song
        _durationMs.value = song.durationMs
        _currentPositionMs.value = 0L

        val mediaMetadata = MediaMetadata.Builder()
            .setTitle(song.title)
            .setArtist(song.artist)
            .setAlbumTitle(song.album)
            .setArtworkUri(song.albumArtUri)
            .build()

        val mediaItem = MediaItem.Builder()
            .setMediaId(song.id)
            .setUri(song.contentUri)
            .setMediaMetadata(mediaMetadata)
            .build()

        exoPlayer.setMediaItem(mediaItem)
        exoPlayer.prepare()
        exoPlayer.play()
    }

    fun togglePlayPause() {
        if (exoPlayer.isPlaying) {
            exoPlayer.pause()
        } else {
            if (_currentSong.value != null) {
                exoPlayer.play()
            } else if (_queue.value.isNotEmpty()) {
                playSong(_queue.value.first(), _queue.value)
            }
        }
    }

    fun seekTo(positionMs: Long) {
        exoPlayer.seekTo(positionMs)
        _currentPositionMs.value = positionMs
    }

    fun seekToNext() {
        val current = _currentSong.value ?: return
        val currentIdx = _queue.value.indexOfFirst { it.id == current.id }
        if (currentIdx == -1 || _queue.value.isEmpty()) return

        val nextIdx = if (_isShuffle.value) {
            (0 until _queue.value.size).random()
        } else {
            (currentIdx + 1) % _queue.value.size
        }
        playSong(_queue.value[nextIdx], _queue.value)
    }

    fun seekToPrevious() {
        val current = _currentSong.value ?: return
        if (exoPlayer.currentPosition > 3000) {
            exoPlayer.seekTo(0)
            return
        }
        val currentIdx = _queue.value.indexOfFirst { it.id == current.id }
        if (currentIdx == -1 || _queue.value.isEmpty()) return

        val prevIdx = if (currentIdx > 0) currentIdx - 1 else _queue.value.size - 1
        playSong(_queue.value[prevIdx], _queue.value)
    }

    fun cycleRepeatMode() {
        _repeatMode.value = when (_repeatMode.value) {
            RepeatMode.ALL -> RepeatMode.ONE
            RepeatMode.ONE -> RepeatMode.OFF
            RepeatMode.OFF -> RepeatMode.ALL
        }
    }

    fun toggleShuffle() {
        _isShuffle.value = !_isShuffle.value
    }

    fun release() {
        stopProgressUpdates()
        exoPlayer.removeListener(playerListener)
        exoPlayer.release()
    }
}
