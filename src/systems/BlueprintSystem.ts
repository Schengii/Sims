/**
 * Blueprint & Lot Preset System
 * Allows 1-click placement of pre-built architect room templates in Build mode,
 * and full lot blueprint export / import as shareable JSON strings.
 */

import { House } from '../world/House';
import type { PlacedFurniture } from '../world/Furniture';
import { Sanitizer } from '../security/Sanitizer';

export interface PresetRoom {
  id: string;
  name: string;
  icon: string;
  category: 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'patio';
  cost: number;
  description: string;
  width: number;
  height: number;
  items: Array<{ furnitureId: string; offsetX: number; offsetY: number }>;
}

export interface HouseBlueprintData {
  version: string;
  title: string;
  author: string;
  width: number;
  height: number;
  floors: Record<number, {
    tiles: Array<{ x: number; y: number; type: string; color: string; hasWallNorth?: boolean; hasWallWest?: boolean; wallColor?: string }>;
    furniture: PlacedFurniture[];
  }>;
}

export const PRESET_ROOMS: PresetRoom[] = [
  {
    id: 'room_starter_bedroom',
    name: 'Starter-Schlafzimmer',
    icon: '🛏️',
    category: 'bedroom',
    cost: 850,
    description: 'Enthält ein gemütliches Bett, Nachttisch und Kleiderschrank.',
    width: 3,
    height: 3,
    items: [
      { furnitureId: 'bed_basic', offsetX: 0, offsetY: 0 },
      { furnitureId: 'easel_artist', offsetX: 2, offsetY: 0 }
    ]
  },
  {
    id: 'room_luxury_bathroom',
    name: 'Wellness-Badezimmer',
    icon: '🛁',
    category: 'bathroom',
    cost: 1400,
    description: 'Moderne Dusche, Designer-Toilette und Fliesen.',
    width: 3,
    height: 2,
    items: [
      { furnitureId: 'shower_glass', offsetX: 0, offsetY: 0 },
      { furnitureId: 'toilet_deluxe', offsetX: 2, offsetY: 0 }
    ]
  },
  {
    id: 'room_tech_office',
    name: 'High-Tech Arbeitszimmer',
    icon: '💻',
    category: 'living',
    cost: 1900,
    description: 'Profi-PC, Schreibtisch und bequemer Bürostuhl.',
    width: 3,
    height: 2,
    items: [
      { furnitureId: 'pc_station', offsetX: 0, offsetY: 0 }
    ]
  }
];

export class BlueprintManager {
  /**
   * Exports the current house layout as a serialized blueprint JSON string.
   */
  public static exportBlueprint(house: House, title: string = 'Mein Traumhaus', author: string = 'Architekt'): string {
    const tileList: Array<{ x: number; y: number; type: string; color: string; hasWallNorth?: boolean; hasWallWest?: boolean; wallColor?: string }> = [];

    for (let x = 0; x < house.width; x++) {
      for (let y = 0; y < house.height; y++) {
        const t = house.tiles[x][y];
        if (t.type !== 'grass' || t.hasWallNorth || t.hasWallWest) {
          tileList.push({
            x,
            y,
            type: t.type,
            color: t.color,
            hasWallNorth: t.hasWallNorth,
            hasWallWest: t.hasWallWest,
            wallColor: t.wallColor
          });
        }
      }
    }

    const blueprint: HouseBlueprintData = {
      version: '1.0',
      title: Sanitizer.sanitizeText(title, 64),
      author: Sanitizer.sanitizeText(author, 64),
      width: house.width,
      height: house.height,
      floors: {
        [house.activeFloor]: {
          tiles: tileList,
          furniture: [...house.placedFurniture]
        }
      }
    };

    return JSON.stringify(blueprint, null, 2);
  }

  /**
   * Imports a serialized blueprint and applies it to the active house floor.
   */
  public static importBlueprint(house: House, jsonString: string): { success: boolean; message: string } {
    try {
      const data = Sanitizer.safeJSONParse<HouseBlueprintData | null>(jsonString, null);
      if (!data || !data.floors || !data.floors[house.activeFloor]) {
        return { success: false, message: 'Keine passenden Grundriss-Daten für dieses Stockwerk gefunden.' };
      }

      const floorData = data.floors[house.activeFloor];

      // Apply tiles & walls
      if (Array.isArray(floorData.tiles)) {
        floorData.tiles.forEach(t => {
          if (t.x >= 0 && t.x < house.width && t.y >= 0 && t.y < house.height) {
            const tile = house.tiles[t.x][t.y];
            tile.type = t.type as any;
            tile.color = t.color;
            if (t.hasWallNorth !== undefined) tile.hasWallNorth = t.hasWallNorth;
            if (t.hasWallWest !== undefined) tile.hasWallWest = t.hasWallWest;
            if (t.wallColor) tile.wallColor = t.wallColor;
          }
        });
      }

      // Apply furniture
      if (Array.isArray(floorData.furniture)) {
        house.placedFurniture = floorData.furniture.filter(f =>
          f.gridX >= 0 && f.gridX < house.width && f.gridY >= 0 && f.gridY < house.height
        );
      }

      return {
        success: true,
        message: `Bauplan "${data.title || 'Importiert'}" erfolgreich geladen!`
      };
    } catch (e: any) {
      return { success: false, message: `Fehler beim Importieren: ${e.message}` };
    }
  }
}
