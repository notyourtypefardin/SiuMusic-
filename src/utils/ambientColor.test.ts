import test from 'node:test';
import assert from 'node:assert/strict';
import { restrainColor, getTrackAmbientColors } from './ambientColor';

test('restrainColor desaturates vibrant colors towards neutral silver', () => {
  // Pure bright red
  const restrained = restrainColor(255, 0, 0);
  // Red channel should be restrained, green and blue lifted by luminance
  assert.ok(restrained.r <= 220);
  assert.ok(restrained.g > 20);
  assert.ok(restrained.b > 20);
});

test('getTrackAmbientColors returns restrained RGBA strings with proper opacity', () => {
  const result = getTrackAmbientColors('#800020', '#101010', 'test-track-1');
  assert.match(result.ambientPrimary, /^rgba\(\d+,\s*\d+,\s*\d+,\s*0\.16\)$/);
  assert.match(result.ambientSecondary, /^rgba\(\d+,\s*\d+,\s*\d+,\s*0\.08\)$/);
  assert.match(result.glowRgba, /^rgba\(\d+,\s*\d+,\s*\d+,\s*0\.22\)$/);
});

test('getTrackAmbientColors returns fallback when dominant color is missing', () => {
  const result = getTrackAmbientColors(undefined, undefined);
  assert.equal(result.ambientPrimary, 'rgba(217, 221, 227, 0.12)');
});
