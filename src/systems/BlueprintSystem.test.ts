import { describe, it, expect } from 'vitest';
import { BlueprintManager } from './BlueprintSystem';
import { House } from '../world/House';

describe('BlueprintSystem', () => {
  it('exports and imports house blueprints correctly', () => {
    const house = new House();
    house.setFloorStyle(4, 4, 'wood', '#8d5524');
    house.toggleWallNorth(4, 4, '#2c3e50');
    house.addFurniture('bed_basic', 4, 4);

    const json = BlueprintManager.exportBlueprint(house, 'Test Villa', 'Max');
    expect(json).toBeDefined();
    expect(json).toContain('Test Villa');

    const newHouse = new House();
    const importRes = BlueprintManager.importBlueprint(newHouse, json);
    expect(importRes.success).toBe(true);
    expect(newHouse.tiles[4][4].type).toBe('wood');
    expect(newHouse.tiles[4][4].hasWallNorth).toBe(true);
  });
});
