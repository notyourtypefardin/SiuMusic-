package com.sumusic.player.data

import android.content.ContentUris
import android.content.Context
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import com.sumusic.player.model.Song
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class AudioScanner(private val context: Context) {

    suspend fun scanLocalAudio(): List<Song> = withContext(Dispatchers.IO) {
        val songsList = mutableListOf<Song>()
        val contentResolver = context.contentResolver
        val uri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI

        val projection = arrayOf(
            MediaStore.Audio.Media._ID,
            MediaStore.Audio.Media.TITLE,
            MediaStore.Audio.Media.ARTIST,
            MediaStore.Audio.Media.ALBUM,
            MediaStore.Audio.Media.DURATION,
            MediaStore.Audio.Media.ALBUM_ID,
            MediaStore.Audio.Media.YEAR
        )

        val selection = "${MediaStore.Audio.Media.IS_MUSIC} != 0"
        val sortOrder = "${MediaStore.Audio.Media.TITLE} ASC"

        try {
            contentResolver.query(uri, projection, selection, null, sortOrder)?.use { cursor ->
                val idColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media._ID)
                val titleColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE)
                val artistColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST)
                val albumColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM)
                val durationColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)
                val albumIdColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM_ID)
                val yearColumn = cursor.getColumnIndex(MediaStore.Audio.Media.YEAR)

                while (cursor.moveToNext()) {
                    val id = cursor.getLong(idColumn)
                    val title = cursor.getString(titleColumn) ?: "Unknown Track"
                    val artist = cursor.getString(artistColumn) ?: "Unknown Artist"
                    val album = cursor.getString(albumColumn) ?: "Unknown Album"
                    val durationMs = cursor.getLong(durationColumn)
                    val albumId = cursor.getLong(albumIdColumn)
                    val year = if (yearColumn != -1) cursor.getInt(yearColumn) else 0

                    if (durationMs > 10_000) { // filter out short sound effects
                        val trackContentUri = ContentUris.withAppendedId(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, id)
                        val albumArtUri = ContentUris.withAppendedId(
                            Uri.parse("content://media/external/audio/albumart"),
                            albumId
                        )

                        songsList.add(
                            Song(
                                id = id.toString(),
                                title = title,
                                artist = artist,
                                album = album,
                                durationMs = durationMs,
                                contentUri = trackContentUri,
                                albumArtUri = albumArtUri,
                                year = year
                            )
                        )
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // Return scanned tracks or curated initial sample tracks if storage is empty
        if (songsList.isNotEmpty()) {
            songsList
        } else {
            getInitialSampleSongs()
        }
    }

    private fun getInitialSampleSongs(): List<Song> {
        return listOf(
            Song(
                id = "track-1",
                title = "Blinding Lights",
                artist = "The Weeknd",
                album = "After Hours",
                durationMs = 200_000L,
                contentUri = Uri.parse("android.resource://${context.packageName}/raw/sample_blinding_lights"),
                albumArtUri = null,
                genre = "Synthpop",
                year = 2020,
                isFavorite = true
            ),
            Song(
                id = "track-2",
                title = "Save Your Tears",
                artist = "The Weeknd",
                album = "After Hours",
                durationMs = 215_000L,
                contentUri = Uri.parse("android.resource://${context.packageName}/raw/sample_save_your_tears"),
                albumArtUri = null,
                genre = "Synthpop",
                year = 2020,
                isFavorite = true
            ),
            Song(
                id = "track-3",
                title = "Starboy",
                artist = "The Weeknd",
                album = "Starboy",
                durationMs = 230_000L,
                contentUri = Uri.parse("android.resource://${context.packageName}/raw/sample_starboy"),
                albumArtUri = null,
                genre = "R&B / Electronic",
                year = 2016,
                isFavorite = true
            ),
            Song(
                id = "track-4",
                title = "SICKO MODE",
                artist = "Travis Scott",
                album = "ASTROWORLD",
                durationMs = 312_000L,
                contentUri = Uri.parse("android.resource://${context.packageName}/raw/sample_sicko_mode"),
                albumArtUri = null,
                genre = "Hip-Hop",
                year = 2018,
                isFavorite = false
            )
        )
    }
}
