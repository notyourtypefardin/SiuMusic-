package com.sumusic.player.ui.components

import android.graphics.RenderEffect
import android.graphics.Shader
import android.os.Build
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asComposeRenderEffect
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Master Liquid Glass Component Engine
 * Multi-tier hardware-accelerated RenderEffect backdrop blur on Android 12+ (SDK 31+)
 * with multi-stop specular top rim reflections and smoked obsidian gradient.
 */
fun Modifier.liquidGlassSurface(
    cornerRadius: Dp = 24.dp,
    tintColor: Color = Color(0xBB161924),
    blurRadius: Float = 36f,
    elevationLevel: Int = 2
): Modifier {
    val shape = RoundedCornerShape(cornerRadius)
    val specularGradient = Brush.verticalGradient(
        0.0f to Color(0x4AFFFFFF),
        0.15f to Color(0x18FFFFFF),
        1.0f to Color(0x06FFFFFF)
    )

    return this
        .graphicsLayer {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && blurRadius > 0f) {
                renderEffect = RenderEffect
                    .createBlurEffect(blurRadius, blurRadius, Shader.TileMode.CLAMP)
                    .asComposeRenderEffect()
            }
            clip = true
            this.shape = shape
        }
        .clip(shape)
        .background(
            Brush.verticalGradient(
                0.0f to Color(0x18FFFFFF),
                0.2f to tintColor,
                1.0f to Color(0xE00C0E14)
            )
        )
        .border(width = 1.dp, brush = specularGradient, shape = shape)
}

@Composable
fun LiquidGlassCard(
    modifier: Modifier = Modifier,
    cornerRadius: Dp = 20.dp,
    onClick: (() -> Unit)? = null,
    content: @Composable BoxScope.() -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.985f else 1.0f,
        animationSpec = spring(stiffness = 500f, dampingRatio = 0.8f),
        label = "glass_card_press"
    )

    Box(
        modifier = modifier
            .scale(scale)
            .liquidGlassSurface(cornerRadius = cornerRadius, blurRadius = 24f)
            .then(
                if (onClick != null) {
                    Modifier.clickable(
                        interactionSource = interactionSource,
                        indication = null,
                        onClick = onClick
                    )
                } else Modifier
            ),
        content = content
    )
}
