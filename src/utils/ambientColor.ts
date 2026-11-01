/**
 * SiuuMusic Music-Responsive Ambient Color Engine
 * Extracts, tones down, and caches artwork-driven ambient tints.
 * Ensures the app-wide Black & Silver theme is strictly preserved while
 * providing silky 450-900ms crossfaded ambient lighting behind artwork and players.
 */

interface AmbientColorPair {
  ambientPrimary: string;    // e.g. "rgba(180, 190, 205, 0.14)"
  ambientSecondary: string;  // e.g. "rgba(100, 110, 125, 0.08)"
  glowRgba: string;          // e.g. "rgba(220, 225, 235, 0.22)"
}

const colorCache = new Map<string, AmbientColorPair>();

// Standard neutral silver fallback
const FALLBACK_AMBIENT: AmbientColorPair = {
  ambientPrimary: 'rgba(217, 221, 227, 0.12)',
  ambientSecondary: 'rgba(128, 133, 142, 0.06)',
  glowRgba: 'rgba(255, 255, 255, 0.18)',
};

/**
 * Converts a hex string (#RGB, #RRGGBB) to RGB object
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }
  return null;
}

/**
 * Restrains a color towards neutral silver/platinum
 * Desaturates by 65% and scales luminance so it blends seamlessly with deep black #050505
 */
export function restrainColor(r: number, g: number, b: number): { r: number; g: number; b: number } {
  // Compute luminance
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  
  // Desaturate 65% towards luminance (pure grayscale)
  const desatFactor = 0.65;
  const dr = Math.round(r * (1 - desatFactor) + lum * desatFactor);
  const dg = Math.round(g * (1 - desatFactor) + lum * desatFactor);
  const db = Math.round(b * (1 - desatFactor) + lum * desatFactor);

  // Clamp brightness between 60 and 220
  const clampR = Math.max(60, Math.min(220, dr));
  const clampG = Math.max(60, Math.min(220, dg));
  const clampB = Math.max(60, Math.min(220, db));

  return { r: clampR, g: clampG, b: clampB };
}

/**
 * Resolves a restrained ambient color pair for a track
 */
export function getTrackAmbientColors(
  dominantHex?: string,
  secondaryHex?: string,
  cacheKey?: string
): AmbientColorPair {
  if (cacheKey && colorCache.has(cacheKey)) {
    return colorCache.get(cacheKey)!;
  }

  if (!dominantHex) {
    return FALLBACK_AMBIENT;
  }

  const rgb = hexToRgb(dominantHex);
  if (!rgb) {
    return FALLBACK_AMBIENT;
  }

  const { r, g, b } = restrainColor(rgb.r, rgb.g, rgb.b);

  const secRgb = secondaryHex ? hexToRgb(secondaryHex) : null;
  const secRestrained = secRgb ? restrainColor(secRgb.r, secRgb.g, secRgb.b) : { r: Math.round(r * 0.7), g: Math.round(g * 0.7), b: Math.round(b * 0.7) };

  const result: AmbientColorPair = {
    ambientPrimary: `rgba(${r}, ${g}, ${b}, 0.16)`,
    ambientSecondary: `rgba(${secRestrained.r}, ${secRestrained.g}, ${secRestrained.b}, 0.08)`,
    glowRgba: `rgba(${Math.min(255, r + 30)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)}, 0.22)`,
  };

  if (cacheKey) {
    // Keep cache bounded to 100 items
    if (colorCache.size > 100) {
      const firstKey = colorCache.keys().next().value;
      if (firstKey) colorCache.delete(firstKey);
    }
    colorCache.set(cacheKey, result);
  }

  return result;
}

/**
 * Optional async extractor for user-imported custom tracks with external images
 */
export function extractCoverDominantColor(imgSrc: string): Promise<string> {
  return new Promise((resolve) => {
    if (!imgSrc || typeof window === 'undefined') {
      resolve('#CBD5E1');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve('#CBD5E1');
          return;
        }
        ctx.drawImage(img, 0, 0, 16, 16);
        const imgData = ctx.getImageData(0, 0, 16, 16).data;

        let totalR = 0, totalG = 0, totalB = 0, count = 0;
        for (let i = 0; i < imgData.length; i += 16) {
          const alpha = imgData[i + 3];
          if (alpha > 128) {
            totalR += imgData[i];
            totalG += imgData[i + 1];
            totalB += imgData[i + 2];
            count++;
          }
        }

        if (count > 0) {
          const avgR = Math.round(totalR / count);
          const avgG = Math.round(totalG / count);
          const avgB = Math.round(totalB / count);
          const hex = `#${((1 << 24) + (avgR << 16) + (avgG << 8) + avgB).toString(16).slice(1)}`;
          resolve(hex);
        } else {
          resolve('#CBD5E1');
        }
      } catch {
        resolve('#CBD5E1');
      }
    };
    img.onerror = () => resolve('#CBD5E1');
    img.src = imgSrc;
  });
}
