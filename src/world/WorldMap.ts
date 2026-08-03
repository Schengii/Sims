/**
 * Neighborhood World Map & Venues System for Sims 5
 * Manages travel locations, venue lot setups, and world transitions.
 */

import { House } from './House';
import type { NPCManager } from '../entity/NPCManager';

export interface VenueLocation {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  bgColor: string;
  isCurrent?: boolean;
}

export const VENUES_CATALOG: Record<string, VenueLocation> = {
  home: {
    id: 'home',
    name: 'Mein Anwesen (Zuhause)',
    category: 'Wohngrundstück',
    icon: '🏡',
    description: 'Dein eigenes gebautes Zuhause mit Garten, Möbeln und Haustieren.',
    bgColor: '#27ae60'
  },
  lounge: {
    id: 'lounge',
    name: 'Club Velvet (Lounge & Nightclub)',
    category: 'Ausgehen & VIP',
    icon: '🍸',
    description: 'Exklusiver Club mit DJ-Pult, Tanzfläche, Barmixer und VIP-Stimmung.',
    bgColor: '#8e44ad'
  },
  park: {
    id: 'park',
    name: 'Plumbob Park & Fitness',
    category: 'Erholung & Sport',
    icon: '🏋️',
    description: 'Öffentlicher Stadtpark mit Angelteich, Laufbändern, Schach-Tischen und Natur.',
    bgColor: '#d35400'
  },
  cafe: {
    id: 'cafe',
    name: 'Café Simlish (Bistro)',
    category: 'Gastronomie & Treffpunkt',
    icon: '☕',
    description: 'Gemütliches Kaffeekränzchen-Café zum Genießen und Kontakte knüpfen.',
    bgColor: '#2980b9'
  }
};

export class WorldMap {
  public currentVenueId: string = 'home';
  private homeBackupHouseData: any = null;

  public travelToVenue(venueId: string, game: any): boolean {
    if (!VENUES_CATALOG[venueId]) return false;

    // 1. Save home layout if leaving home for the first time
    if (this.currentVenueId === 'home' && venueId !== 'home') {
      this.homeBackupHouseData = JSON.parse(JSON.stringify({
        placedFurniture: game.house.placedFurniture,
        tiles: game.house.tiles
      }));
    }

    this.currentVenueId = venueId;

    // 2. Clear current lot furniture and setup venue-specific layout
    if (venueId === 'home') {
      if (this.homeBackupHouseData) {
        game.house.placedFurniture = this.homeBackupHouseData.placedFurniture;
        game.house.tiles = this.homeBackupHouseData.tiles;
      }
    } else if (venueId === 'lounge') {
      this.setupLoungeVenue(game.house, game.npcManager);
    } else if (venueId === 'park') {
      this.setupParkVenue(game.house, game.npcManager);
    } else if (venueId === 'cafe') {
      this.setupCafeVenue(game.house, game.npcManager);
    }

    // Move player Sim to entrance
    game.sim.gridPos = { x: 8, y: 13 };
    game.sim.renderPos = { x: 8, y: 13 };
    game.sim.currentPath = [];

    return true;
  }

  private setupLoungeVenue(house: House, npcManager: NPCManager): void {
    for (let x = 0; x < house.width; x++) {
      for (let y = 0; y < house.height; y++) {
        house.tiles[x][y].type = (x >= 2 && x <= 13 && y >= 2 && y <= 13) ? 'marble' : 'tile';
        house.tiles[x][y].color = (x >= 2 && x <= 13 && y >= 2 && y <= 13) ? '#111827' : '#374151';
      }
    }

    house.placedFurniture = [];
    house.addFurniture('dj_booth', 7, 3);
    house.addFurniture('bar_counter', 4, 8);
    house.addFurniture('sofa_luxury', 10, 8);
    house.addFurniture('stereo_hifi', 12, 3);

    npcManager.spawnTownie();
    npcManager.spawnTownie();
    npcManager.spawnTownie();
  }

  private setupParkVenue(house: House, npcManager: NPCManager): void {
    for (let x = 0; x < house.width; x++) {
      for (let y = 0; y < house.height; y++) {
        const isPond = x >= 10 && x <= 14 && y >= 4 && y <= 8;
        house.tiles[x][y].type = isPond ? 'pool' : 'grass';
        house.tiles[x][y].color = isPond ? '#00e5ff' : '#27ae60';
        house.tiles[x][y].hasWallNorth = false;
        house.tiles[x][y].hasWallWest = false;
      }
    }

    house.placedFurniture = [];
    house.addFurniture('treadmill', 3, 4);
    house.addFurniture('treadmill', 5, 4);
    house.addFurniture('easel_artist', 3, 9);
    house.addFurniture('sofa_luxury', 7, 7);

    npcManager.spawnTownie();
    npcManager.spawnTownie();
  }

  private setupCafeVenue(house: House, npcManager: NPCManager): void {
    for (let x = 0; x < house.width; x++) {
      for (let y = 0; y < house.height; y++) {
        const isIndoor = x >= 3 && x <= 12 && y >= 3 && y <= 11;
        house.tiles[x][y].type = isIndoor ? 'tile' : 'grass';
        house.tiles[x][y].color = isIndoor ? '#d35400' : '#27ae60';
      }
    }

    house.placedFurniture = [];
    house.addFurniture('coffee_bar', 7, 4);
    house.addFurniture('sofa_luxury', 4, 7);
    house.addFurniture('sofa_luxury', 10, 7);
    house.addFurniture('pc_station', 4, 10);

    npcManager.spawnTownie();
    npcManager.spawnTownie();
  }
}
