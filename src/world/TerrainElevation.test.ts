import { describe, it, expect } from 'vitest';
import { TerrainElevation } from './TerrainElevation';

describe('TerrainElevation', () => {
  it('manages grid heights and elevation sculpting', () => {
    const terrain = new TerrainElevation(16, 16);
    expect(terrain.getElevation(5, 5)).toBe(0);
    expect(terrain.getYOffset(5, 5)).toBe(0);

    terrain.raise(5, 5);
    expect(terrain.getElevation(5, 5)).toBe(1);
    expect(terrain.getYOffset(5, 5)).toBe(-12);

    terrain.lower(5, 5);
    expect(terrain.getElevation(5, 5)).toBe(0);

    terrain.lower(5, 5);
    expect(terrain.getElevation(5, 5)).toBe(-1);
    expect(terrain.getYOffset(5, 5)).toBe(12);

    terrain.flatten(5, 5, 0);
    expect(terrain.getElevation(5, 5)).toBe(0);
  });
});
