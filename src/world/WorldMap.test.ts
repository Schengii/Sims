import { describe, it, expect, beforeEach } from 'vitest';
import { WorldMap } from './WorldMap';
import { House } from './House';
import { Sim } from '../entity/Sim';
import { NPCManager } from '../entity/NPCManager';

describe('WorldMap & Live Community Lots', () => {
  let worldMap: WorldMap;
  let mockGame: any;

  beforeEach(() => {
    worldMap = new WorldMap();
    mockGame = {
      house: new House(),
      sim: new Sim({ name: 'Traveler Sim' }),
      npcManager: new NPCManager()
    };
  });

  it('should transition to gym venue and setup workout layout with NPCs', () => {
    const success = worldMap.travelToVenue('gym', mockGame);
    expect(success).toBe(true);
    expect(worldMap.currentVenueId).toBe('gym');

    // Treadmills placed
    const treadmills = mockGame.house.placedFurniture.filter((f: any) => f.furnitureId === 'treadmill');
    expect(treadmills.length).toBeGreaterThan(0);
    expect(mockGame.npcManager.npcs.length).toBeGreaterThan(0);
  });

  it('should travel to restaurant venue and back home with layout restored', () => {
    worldMap.travelToVenue('restaurant', mockGame);
    expect(worldMap.currentVenueId).toBe('restaurant');

    const backHome = worldMap.travelToVenue('home', mockGame);
    expect(backHome).toBe(true);
    expect(worldMap.currentVenueId).toBe('home');
  });
});
