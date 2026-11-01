package com.sumusic.player.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
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

/**
 * Animated Floating Liquid Glass Navigation Bar
 * Features a slide-in entrance, specular rim highlights,
 * central raised glossy silver play orb, and Prime Mode lightning bolt at the bottom-right corner.
 */
@Composable
fun FloatingBottomNav(
    currentRoute: String,
    isPlaying: Boolean,
    isPrimeActive: Boolean,
    onNavigate: (String) -> Unit,
    onPlayPause: () -> Unit,
    onPrimeClick: () -> Unit,
    modifier: Modifier = Modifier
) {
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
                .padding(horizontal = 16.dp, vertical = 8.dp)
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
                    .padding(horizontal = 4.dp, vertical = 6.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceAround,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Home
                    NavItem(
                        label = "Home",
                        icon = Icons.Rounded.Home,
                        isSelected = currentRoute == "home",
                        onClick = { onNavigate("home") },
                        modifier = Modifier.weight(1f)
                    )

                    // Library
                    NavItem(
                        label = "Library",
                        icon = Icons.Rounded.GraphicEq,
                        isSelected = currentRoute == "library",
                        onClick = { onNavigate("library") },
                        modifier = Modifier.weight(1f)
                    )

                    // Central Raised Glossy Silver Play Orb
                    Box(
                        modifier = Modifier
                            .offset(y = (-10).dp)
                            .size(52.dp)
                            .clip(CircleShape)
                            .background(
                                Brush.verticalGradient(
                                    listOf(
                                        Color(0xFFFFFFFF),
                                        Color(0xFFE2E8F0),
                                        Color(0xFFCBD5E1)
                                    )
                                )
                            )
                            .border(1.dp, Color(0xFFFFFFFF), CircleShape)
                            .clickable(onClick = onPlayPause),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = if (isPlaying) Icons.Rounded.Pause else Icons.Rounded.PlayArrow,
                            contentDescription = if (isPlaying) "Pause" else "Play",
                            tint = Color.Black,
                            modifier = Modifier.size(24.dp)
                        )
                    }

                    // Playlists
                    NavItem(
                        label = "Playlists",
                        icon = Icons.Rounded.QueueMusic,
                        isSelected = currentRoute == "playlists",
                        onClick = { onNavigate("playlists") },
                        modifier = Modifier.weight(1f)
                    )

                    // Prime Mode (Lightning bolt)
                    NavItem(
                        label = "Prime",
                        icon = Icons.Rounded.Bolt,
                        isSelected = isPrimeActive && isPlaying,
                        onClick = onPrimeClick,
                        isLightning = true,
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }
}

@Composable
private fun NavItem(
    label: String,
    icon: ImageVector,
    isSelected: Boolean,
    onClick: () -> Unit,
    isLightning: Boolean = false,
    modifier: Modifier = Modifier
) {
    val interactionSource = remember { MutableInteractionSource() }

    Box(
        modifier = modifier
            .height(50.dp)
            .clip(RoundedCornerShape(20.dp))
            .then(
                if (isSelected) {
                    Modifier
                        .background(
                            Brush.verticalGradient(
                                listOf(
                                    Color(0x30FFFFFF),
                                    Color(0x10FFFFFF),
                                    Color(0x05FFFFFF)
                                )
                            )
                        )
                        .border(
                            width = 1.dp,
                            brush = Brush.verticalGradient(
                                listOf(
                                    Color(0x55FFFFFF),
                                    Color(0x10FFFFFF)
                                )
                            ),
                            shape = RoundedCornerShape(20.dp)
                        )
                } else Modifier
            )
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = if (isSelected) TextPrimary else TextTertiary,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = label,
                fontSize = 10.sp,
                color = if (isSelected) TextPrimary else TextTertiary
            )
        }
    }
}
