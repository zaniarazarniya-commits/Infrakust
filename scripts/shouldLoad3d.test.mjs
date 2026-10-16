import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldLoad3d } from '../src/components/formad/shouldLoad3d.ts';

test('shouldLoad3d: spara data stänger av 3D', () => {
  assert.equal(shouldLoad3d({ connection: { saveData: true } }, false), false);
});

test('shouldLoad3d: under 3 GB minne stänger av 3D', () => {
  assert.equal(shouldLoad3d({ deviceMemory: 2 }, false), false);
});

test('shouldLoad3d: färre än fyra kärnor stänger av 3D', () => {
  assert.equal(shouldLoad3d({ hardwareConcurrency: 2 }, false), false);
});

test('shouldLoad3d: minskad rörelse stänger av 3D', () => {
  assert.equal(shouldLoad3d({ deviceMemory: 8, hardwareConcurrency: 8 }, true), false);
});

test('shouldLoad3d: en vanlig enhet laddar 3D', () => {
  assert.equal(shouldLoad3d({ deviceMemory: 8, hardwareConcurrency: 8 }, false), true);
});
