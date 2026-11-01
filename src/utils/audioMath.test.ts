import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatTime,
  calculateRemainingTime,
  getNextSongIndex,
  getPreviousSongIndex,
  filterSongs,
  EQUALIZER_PRESETS,
  clamp,
  BasicSong,
  getSpringTransition,
  calculateSheenPosition,
  calculateWaveformHeights,
} from './audioMath';

test('formatTime correctly formats seconds', () => {
  assert.equal(formatTime(0), '0:00');
  assert.equal(formatTime(9), '0:09');
  assert.equal(formatTime(65), '1:05');
  assert.equal(formatTime(222), '3:42');
  assert.equal(formatTime(3665), '1:01:05');
  assert.equal(formatTime(-10), '0:00');
});

test('calculateRemainingTime computes -MM:SS', () => {
  assert.equal(calculateRemainingTime(10, 100), '-1:30');
  assert.equal(calculateRemainingTime(100, 100), '-0:00');
  assert.equal(calculateRemainingTime(120, 100), '-0:00');
});

test('getNextSongIndex handles sequential, repeat, and shuffle', () => {
  // Sequential
  assert.equal(getNextSongIndex(0, 5, false, 'off'), 1);
  assert.equal(getNextSongIndex(4, 5, false, 'off'), null);
  assert.equal(getNextSongIndex(4, 5, false, 'all'), 0);

  // Repeat One
  assert.equal(getNextSongIndex(2, 5, false, 'one'), 2);

  // Shuffle
  const shuffled = [3, 0, 4, 1, 2];
  assert.equal(getNextSongIndex(0, 5, true, 'off', shuffled), 4);
  assert.equal(getNextSongIndex(2, 5, true, 'all', shuffled), 3);
});

test('getPreviousSongIndex handles rewind threshold vs previous track', () => {
  // If played > 3 seconds, rewinds current track
  assert.equal(getPreviousSongIndex(2, 5, 4.5), 2);
  // If played <= 3 seconds, goes to previous
  assert.equal(getPreviousSongIndex(2, 5, 1.2), 1);
  // Loops to end if at track 0
  assert.equal(getPreviousSongIndex(0, 5, 0.5), 4);
});

test('filterSongs correctly filters by search term, source and genre', () => {
  const sampleList: BasicSong[] = [
    {
      id: '1',
      title: 'Midnight Horizon',
      artist: 'Luna Sol',
      album: 'Synthwave Odyssey',
      duration: 222,
      genre: 'Synthwave',
      isFavorite: true,
      isSample: true,
    },
    {
      id: '2',
      title: 'Tokyo Raindrops',
      artist: 'Kenji Sato',
      album: 'Lo-Fi Memories',
      duration: 175,
      genre: 'Lo-Fi',
      isFavorite: false,
      isSample: true,
    },
    {
      id: '3',
      title: 'My Custom Song',
      artist: 'Local Band',
      album: 'Demo Tape',
      duration: 190,
      genre: 'Rock',
      isFavorite: false,
      isSample: false,
    },
  ];

  // Search by text
  const searched = filterSongs(sampleList, 'tokyo');
  assert.equal(searched.length, 1);
  assert.equal(searched[0].title, 'Tokyo Raindrops');

  // Filter by source
  const deviceOnly = filterSongs(sampleList, '', 'device');
  assert.equal(deviceOnly.length, 1);
  assert.equal(deviceOnly[0].id, '3');

  const sampleOnly = filterSongs(sampleList, '', 'sample');
  assert.equal(sampleOnly.length, 2);

  // Filter by genre
  const synthwaveOnly = filterSongs(sampleList, '', 'all', 'Synthwave');
  assert.equal(synthwaveOnly.length, 1);
  assert.equal(synthwaveOnly[0].title, 'Midnight Horizon');
});

test('clamp restricts number to bounds', () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-5, 0, 10), 0);
  assert.equal(clamp(15, 0, 10), 10);
});

test('EQUALIZER_PRESETS has valid presets', () => {
  assert.ok(EQUALIZER_PRESETS['Bass Boost']);
  assert.ok(EQUALIZER_PRESETS['Vocal Clarity']);
  assert.equal(EQUALIZER_PRESETS['Flat'].bass, 0);
});

test('getSpringTransition returns mode-specific animation parameters', () => {
  const snappy = getSpringTransition('snappy');
  assert.equal(snappy.type, 'spring');
  assert.equal(snappy.stiffness, 150);

  const fluid = getSpringTransition('fluid');
  assert.equal(fluid.type, 'spring');
  assert.equal(fluid.stiffness, 120);

  const reduced = getSpringTransition('reduced');
  assert.equal(reduced.duration, 0.12);
});

test('calculateSheenPosition bounds optical coordinates inside card rect', () => {
  const rect = { left: 100, top: 200, width: 300, height: 150 };
  
  // Center point
  const center = calculateSheenPosition(250, 275, rect);
  assert.equal(center.x, 150);
  assert.equal(center.y, 75);
  assert.equal(center.pctX, 50);
  assert.equal(center.pctY, 50);

  // Out of bounds clamped
  const out = calculateSheenPosition(50, 400, rect);
  assert.equal(out.x, 0);
  assert.equal(out.y, 150);
  assert.equal(out.pctX, 0);
  assert.equal(out.pctY, 100);
});

test('calculateWaveformHeights normalizes values correctly', () => {
  const idle = calculateWaveformHeights([100, 200], 40, false);
  assert.ok(idle[0] > 0);
  assert.ok(idle[1] > 0);

  const active = calculateWaveformHeights([0, 255], 50, true);
  assert.equal(active[1], 50);
  assert.ok(active[0] >= 5);
});

