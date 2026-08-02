/**
 * House & World Layout Engine
 * Handles floor tiles, wall segments, door/window cutouts, pool tiles,
 * furniture placement, and collision validation.
 */

import { FURNITURE_CATALOG, type PlacedFurniture } from './Furniture';

export type FloorType = 'wood' | 'tile' | 'carpet' | 'grass' | 'marble' | 'pool';

export interface FloorTile {
  x: number;
  y: number;
  type: FloorType;
  color: string;
  hasWallNorth?: boolean;
  hasWallWest?: boolean;
  wallColor?: string;
  openingNorth?: 'door' | 'window';
  openingWest?: 'door' | 'window';
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
        const isIndoor = x >= 3 && x <= 12 && y >= 3 && y <= 12;
        this.tiles[x][y] = {
          x,
          y,
          type: isIndoor ? 'wood' : 'grass',
          color: isIndoor ? '#8d5524' : '#27ae60',
          wallColor: '#2c3e50'
        };
      }
    }

    // Surround indoor room with walls
    for (let x = 3; x <= 12; x++) {
      this.tiles[x][3].hasWallNorth = true;
      this.tiles[x][12].hasWallNorth = true;
    }
    for (let y = 3; y <= 12; y++) {
      this.tiles[3][y].hasWallWest = true;
      this.tiles[12][y].hasWallWest = true;
    }

    // Door cutout on south entrance
    this.tiles[7][12].openingNorth = 'door';

    // Default starter furniture
    this.addFurniture('bed_basic', 4, 4);
    this.addFurniture('fridge_modern', 10, 4);
    this.addFurniture('shower_glass', 4, 10);
    this.addFurniture('toilet_deluxe', 6, 10);
    this.addFurniture('pc_station', 10, 8);
    this.addFurniture('sofa_luxury', 7, 7);
  }

  public setFloorStyle(x: number, y: number, type: FloorType, color: string): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.tiles[x][y].type = type;
      this.tiles[x][y].color = color;
    }
  }

  public toggleWallNorth(x: number, y: number, wallColor: string = '#2c3e50'): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      const tile = this.tiles[x][y];
      tile.hasWallNorth = !tile.hasWallNorth;
      tile.wallColor = wallColor;
      if (!tile.hasWallNorth) tile.openingNorth = undefined;
    }
  }

  public toggleWallWest(x: number, y: number, wallColor: string = '#2c3e50'): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      const tile = this.tiles[x][y];
      tile.hasWallWest = !tile.hasWallWest;
      tile.wallColor = wallColor;
      if (!tile.hasWallWest) tile.openingWest = undefined;
    }
  }

  public setOpeningNorth(x: number, y: number, type: 'door' | 'window' | undefined): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.tiles[x][y].hasWallNorth = true;
      this.tiles[x][y].openingNorth = type;
    }
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

    if (gridX < 0 || gridY < 0 || gridX + def.width > this.width || gridY + def.height > this.height) {
      return false;
    }

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

    // Check furniture overlap
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
