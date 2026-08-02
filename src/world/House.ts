/**
 * House & World Layout Engine
 * Handles floor tiles, room walls, furniture placement, and collision validation.
 */

import { FURNITURE_CATALOG, type PlacedFurniture } from './Furniture';

export interface FloorTile {
  x: number;
  y: number;
  type: 'wood' | 'tile' | 'carpet' | 'grass';
  color: string;
}

export class House {
  public readonly width: number = 16;
  public readonly height: number = 16;
  public tiles: FloorTile[][] = [];
  public placedFurniture: PlacedFurniture[] = [];

  constructor() {
    this.initDefaultHouse();
  }

  private initDefaultHouse(): void {
    // Generate initial floor grid
    for (let x = 0; x < this.width; x++) {
      this.tiles[x] = [];
      for (let y = 0; y < this.height; y++) {
        // Center 10x10 is wooden house interior, outer is grass garden
        const isIndoor = x >= 3 && x <= 12 && y >= 3 && y <= 12;
        this.tiles[x][y] = {
          x,
          y,
          type: isIndoor ? 'wood' : 'grass',
          color: isIndoor ? '#8d5524' : '#27ae60'
        };
      }
    }

    // Default starter furniture set
    this.addFurniture('bed_basic', 4, 4);
    this.addFurniture('fridge_modern', 10, 4);
    this.addFurniture('shower_glass', 4, 10);
    this.addFurniture('toilet_deluxe', 6, 10);
    this.addFurniture('pc_station', 10, 8);
    this.addFurniture('sofa_luxury', 7, 7);
  }

  public addFurniture(furnitureId: string, gridX: number, gridY: number): PlacedFurniture | null {
    const def = FURNITURE_CATALOG[furnitureId];
    if (!def) return null;

    if (!this.canPlaceFurniture(furnitureId, gridX, gridY)) {
      return null;
    }

    const item: PlacedFurniture = {
      instanceId: `furn_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      furnitureId,
      gridX,
      gridY,
      rotation: 0
    };

    this.placedFurniture.push(item);
    return item;
  }

  public removeFurniture(instanceId: string): boolean {
    const idx = this.placedFurniture.findIndex(f => f.instanceId === instanceId);
    if (idx !== -1) {
      this.placedFurniture.splice(idx, 1);
      return true;
    }
    return false;
  }

  public canPlaceFurniture(furnitureId: string, gridX: number, gridY: number): boolean {
    const def = FURNITURE_CATALOG[furnitureId];
    if (!def) return false;

    // Boundary check
    if (gridX < 0 || gridY < 0 || gridX + def.width > this.width || gridY + def.height > this.height) {
      return false;
    }

    // Check overlap with existing furniture
    for (const item of this.placedFurniture) {
      const itemDef = FURNITURE_CATALOG[item.furnitureId];
      if (!itemDef) continue;

      const overlapX = gridX < item.gridX + itemDef.width && gridX + def.width > item.gridX;
      const overlapY = gridY < item.gridY + itemDef.height && gridY + def.height > item.gridY;

      if (overlapX && overlapY) {
        return false;
      }
    }

    return true;
  }

  public isWalkable(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return false;

    // Check if tile is occupied by furniture
    for (const item of this.placedFurniture) {
      const def = FURNITURE_CATALOG[item.furnitureId];
      if (!def) continue;

      if (x >= item.gridX && x < item.gridX + def.width && y >= item.gridY && y < item.gridY + def.height) {
        return false;
      }
    }

    return true;
  }

  public getFurnitureAt(x: number, y: number): PlacedFurniture | null {
    for (const item of this.placedFurniture) {
      const def = FURNITURE_CATALOG[item.furnitureId];
      if (!def) continue;

      if (x >= item.gridX && x < item.gridX + def.width && y >= item.gridY && y < item.gridY + def.height) {
        return item;
      }
    }
    return null;
  }
}
