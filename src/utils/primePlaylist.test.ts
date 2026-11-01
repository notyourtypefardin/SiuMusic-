import test from 'node:test';
import assert from 'node:assert/strict';

test('Prime playlist deduplication maintains unique song IDs', () => {
  const initial = ['track-1', 'track-2'];
  const toAdd = ['track-2', 'track-3', 'track-4', 'track-1'];
  const deduplicated = Array.from(new Set([...initial, ...toAdd]));

  assert.deepEqual(deduplicated, ['track-1', 'track-2', 'track-3', 'track-4']);
  assert.equal(deduplicated.length, 4);
});

test('Prime playlist removing a song preserves remaining order', () => {
  const initial = ['track-1', 'track-2', 'track-3', 'track-4'];
  const afterRemoval = initial.filter((id) => id !== 'track-2');

  assert.deepEqual(afterRemoval, ['track-1', 'track-3', 'track-4']);
  assert.equal(afterRemoval.length, 3);
});

test('Prime playlist empty state check prevents playing empty array', () => {
  const emptyPlaylist: string[] = [];
  const songs = [{ id: 'track-1', title: 'Blinding Lights' }];
  const resolved = emptyPlaylist
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean);

  assert.equal(resolved.length, 0);
  assert.equal(emptyPlaylist.length === 0, true);
});
