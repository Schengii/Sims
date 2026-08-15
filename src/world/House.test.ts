import { describe, it, expect, beforeEach } from 'vitest';
import { House } from './House';

describe('House Room Building & Furniture System', () => {
  let house: House;

  beforeEach(() => {
    house = new House();
  });

  it('should build an enclosed rectangular room with floors and walls', () => {
    house.buildRoom(4, 4, 7, 7, 'marble', '#ecf0f1', '#112233');

    // Verify Floor Tiles inside room
    for (let x = 4; x <= 7; x++) {
      for (let y = 4; y <= 7; y++) {
        expect(house.tiles[x][y].type).toBe('marble');
        expect(house.tiles[x][y].color).toBe('#ecf0f1');
      }
    }

    // Verify North and West walls around boundary
    for (let x = 4; x <= 7; x++) {
      expect(house.tiles[x][4].hasWallNorth).toBe(true);
      expect(house.tiles[x][4].wallColor).toBe('#112233');
    }
    for (let y = 4; y <= 7; y++) {
      expect(house.tiles[4][y].hasWallWest).toBe(true);
      expect(house.tiles[4][y].wallColor).toBe('#112233');
    }
  });

  it('should allow rotating furniture through 0, 90, 180, 270 degrees', () => {
    const item = house.addFurniture('stairs_wood', 5, 5);
    expect(item).not.toBeNull();
    if (!item) return;

    expect(item.rotation).toBe(0);
    house.rotateFurniture(item.instanceId);
    expect(item.rotation).toBe(90);
    house.rotateFurniture(item.instanceId);
    expect(item.rotation).toBe(180);
    house.rotateFurniture(item.instanceId);
    expect(item.rotation).toBe(270);
    house.rotateFurniture(item.instanceId);
    expect(item.rotation).toBe(0);
  });
});
