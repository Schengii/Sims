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
  gym: {
    id: 'gym',
    name: '🏋️ Fit & Flex Studio',
    category: 'Sport & Fitness',
    icon: '🏋️',
    description: 'Modernes Fitnessstudio mit Laufbändern, Hantelbänken & Wellness-Duschen.',
    bgColor: '#d35400'
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
    name: 'Plumbob Zentralpark & Teich',
    category: 'Erholung & Natur',
    icon: '🌳',
    description: 'Öffentlicher Stadtpark mit Angelteich, Picknick-Wiese, Staffeleien und Schachtisch.',
    bgColor: '#27ae60'
  },
  restaurant: {
    id: 'restaurant',
    name: 'La Bella Sim (Gourmet-Restaurant)',
    category: 'Gastronomie & Genuss',
    icon: '🍽️',
    description: 'Edles 5-Sterne-Restaurant mit Gourmet-Buffet, Kellnern und gemütlicher Dinner-Lounge.',
    bgColor: '#e74c3c'
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

    // 1. Save home layout if leaving home
    if (this.currentVenueId === 'home' && venueId !== 'home') {
      this.homeBackupHouseData = JSON.parse(JSON.stringify({
        placedFurniture: game.house.placedFurniture,
        tiles: game.house.tiles
      }));
    }

    this.currentVenueId = venueId;

    // 2. Setup venue-specific active layout
    if (venueId === 'home') {
      if (this.homeBackupHouseData) {
        game.house.placedFurniture = this.homeBackupHouseData.placedFurniture;
        game.house.tiles = this.homeBackupHouseData.tiles;
      }
    } else if (venueId === 'gym') {
      this.setupGymVenue(game.house, game.npcManager);
    } else if (venueId === 'lounge') {
      this.setupLoungeVenue(game.house, game.npcManager);
    } else if (venueId === 'park') {
      this.setupParkVenue(game.house, game.npcManager);
    } else if (venueId === 'restaurant') {
      this.setupRestaurantVenue(game.house, game.npcManager);
    } else if (venueId === 'cafe') {
      this.setupCafeVenue(game.house, game.npcManager);
    }

    // Move player Sim to entrance
    game.sim.gridPos = { x: 8, y: 13 };
    game.sim.renderPos = { x: 8, y: 13 };
    game.sim.currentPath = [];

    return true;
  }

  private setupGymVenue(house: House, npcManager: NPCManager): void {
    house.buildRoom(2, 2, 13, 12, 'tile', '#7f8c8d', '#2c3e50');
    house.placedFurniture = [];
    house.addFurniture('treadmill', 4, 4);
    house.addFurniture('treadmill', 6, 4);
    house.addFurniture('shower_glass', 10, 4);
    house.addFurniture('shower_glass', 12, 4);
    house.addFurniture('sofa_luxury', 8, 9);
    house.addFurniture('stereo_hifi', 4, 9);

    npcManager.spawnTownie();
    npcManager.spawnTownie();
    npcManager.spawnTownie();
  }

  private setupRestaurantVenue(house: House, npcManager: NPCManager): void {
    house.buildRoom(2, 2, 13, 12, 'marble', '#f5f6fa', '#c0392b');
    house.placedFurniture = [];
    house.addFurniture('party_buffet', 4, 4);
    house.addFurniture('bar_counter', 9, 4);
    house.addFurniture('sofa_luxury', 4, 8);
    house.addFurniture('sofa_luxury', 9, 8);
    house.addFurniture('coffee_bar', 12, 4);

    npcManager.spawnTownie();
    npcManager.spawnTownie();
    npcManager.spawnTownie();
  }

  private setupLoungeVenue(house: House, npcManager: NPCManager): void {
    house.buildRoom(2, 2, 13, 12, 'marble', '#111827', '#8e44ad');
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
    house.addFurniture('chess_table', 4, 4);
    house.addFurniture('easel_artist', 3, 9);
    house.addFurniture('sofa_luxury', 7, 7);

    npcManager.spawnTownie();
    npcManager.spawnTownie();
  }

  private setupCafeVenue(house: House, npcManager: NPCManager): void {
    house.buildRoom(3, 3, 12, 11, 'tile', '#d35400', '#795548');
    house.placedFurniture = [];
    house.addFurniture('coffee_bar', 7, 4);
    house.addFurniture('sofa_luxury', 4, 7);
    house.addFurniture('sofa_luxury', 10, 7);
    house.addFurniture('pc_station', 4, 10);

    npcManager.spawnTownie();
    npcManager.spawnTownie();
  }
}
