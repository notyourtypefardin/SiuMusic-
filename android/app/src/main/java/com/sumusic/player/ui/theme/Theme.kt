package com.sumusic.player.ui.theme

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
val TextPrimary = Color(0xFFF7F7FA)
val TextSecondary = Color(0xFFA4A7B3)
val TextTertiary = Color(0xFF727685)
val AccentSilver = Color(0xFFCBD5E1)
val SpecularHighlight = Color(0x38FFFFFF)

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
        content = content
    )
}
