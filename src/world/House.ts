/**
 * House & World Layout Engine
 * Handles floor tiles, wall segments, door/window cutouts, pool tiles,
 * multi-floor management (Basement, Ground, 1st, 2nd floor),
 * furniture placement, and collision validation.
 */

import { FURNITURE_CATALOG, type PlacedFurniture } from './Furniture';

export type FloorType = 'wood' | 'tile' | 'carpet' | 'grass' | 'marble' | 'pool';
export type RoofStyle = 'gabled' | 'flat' | 'hipped' | 'none';
export type WallPattern = 'plain' | 'brick' | 'wood_panel' | 'wallpaper_floral' | 'marble_tile';

export interface FloorTile {
  x: number;
  y: number;
  type: FloorType;
  color: string;
  hasWallNorth?: boolean;
  hasWallWest?: boolean;
  wallColor?: string;
  wallPattern?: WallPattern;
  openingNorth?: 'door' | 'window';
  openingWest?: 'door' | 'window';
}

export class House {
  public readonly width: number = 16;
  public readonly height: number = 16;

  public activeFloor: number = 0; // -1: Keller, 0: EG, 1: 1. OG, 2: 2. OG
  public roofStyle: RoofStyle = 'gabled';
  public roofColor: string = '#c0392b';
  public floorTilesMap: Record<number, FloorTile[][]> = {};
  public floorFurnitureMap: Record<number, PlacedFurniture[]> = {};
  public wallDisplayMode: 'full' | 'cutaway' | 'hidden' = 'cutaway';

  constructor() {
    this.initFloor(0);
    this.initDefaultHouse();
  }

  public get tiles(): FloorTile[][] {
    if (!this.floorTilesMap[this.activeFloor]) {
      this.initFloor(this.activeFloor);
    }
    return this.floorTilesMap[this.activeFloor];
  }

  public set tiles(val: FloorTile[][]) {
    this.floorTilesMap[this.activeFloor] = val;
  }

  public get placedFurniture(): PlacedFurniture[] {
    if (!this.floorFurnitureMap[this.activeFloor]) {
      this.floorFurnitureMap[this.activeFloor] = [];
    }
    return this.floorFurnitureMap[this.activeFloor];
  }

  public set placedFurniture(val: PlacedFurniture[]) {
    this.floorFurnitureMap[this.activeFloor] = val;
  }

  public setFloor(level: number): void {
    if (level >= -1 && level <= 2) {
      this.activeFloor = level;
      if (!this.floorTilesMap[level]) {
        this.initFloor(level);
      }
    }
  }

  private initFloor(level: number): void {
    const grid: FloorTile[][] = [];
    for (let x = 0; x < this.width; x++) {
      grid[x] = [];
      for (let y = 0; y < this.height; y++) {
        const isIndoor = x >= 3 && x <= 12 && y >= 3 && y <= 12;
        let defaultType: FloorType = level === 0 ? (isIndoor ? 'wood' : 'grass') : (isIndoor ? 'tile' : 'wood');
        let defaultColor = level === 0 ? (isIndoor ? '#8d5524' : '#27ae60') : (level === -1 ? '#34495e' : '#e67e22');

        grid[x][y] = {
          x,
          y,
          type: defaultType,
          color: defaultColor,
          wallColor: level === -1 ? '#111827' : '#2c3e50'
        };
      }
    }
    this.floorTilesMap[level] = grid;
    if (!this.floorFurnitureMap[level]) {
      this.floorFurnitureMap[level] = [];
    }
  }

  private initDefaultHouse(): void {
    const egTiles = this.floorTilesMap[0];

    // Surround indoor room with walls
    for (let x = 3; x <= 12; x++) {
      egTiles[x][3].hasWallNorth = true;
      egTiles[x][12].hasWallNorth = true;
    }
    for (let y = 3; y <= 12; y++) {
      egTiles[3][y].hasWallWest = true;
      egTiles[12][y].hasWallWest = true;
    }

    // Door cutout on south entrance
    egTiles[7][12].openingNorth = 'door';

    // Default starter furniture on Ground Floor (0)
    this.addFurniture('bed_basic', 4, 4);
    this.addFurniture('fridge_modern', 10, 4);
    this.addFurniture('shower_glass', 4, 10);
    this.addFurniture('toilet_deluxe', 6, 10);
    this.addFurniture('pc_station', 10, 8);
    this.addFurniture('sofa_luxury', 7, 7);
    this.addFurniture('stairs_wood', 11, 11);
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

  public setOpeningWest(x: number, y: number, type: 'door' | 'window' | undefined): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.tiles[x][y].hasWallWest = true;
      this.tiles[x][y].openingWest = type;
    }
  }

  /**
   * Builds an entire enclosed room rectangle with floors and enclosing boundary walls
   */
  public buildRoom(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    floorType: FloorType = 'wood',
    floorColor: string = '#8d5524',
    wallColor: string = '#2c3e50'
  ): void {
    const minX = Math.max(0, Math.min(startX, endX));
    const maxX = Math.min(this.width - 1, Math.max(startX, endX));
    const minY = Math.max(0, Math.min(startY, endY));
    const maxY = Math.min(this.height - 1, Math.max(startY, endY));

    // 1. Fill Floor tiles
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        this.setFloorStyle(x, y, floorType, floorColor);
      }
    }

    // 2. Build North & South walls
    for (let x = minX; x <= maxX; x++) {
      this.tiles[x][minY].hasWallNorth = true;
      this.tiles[x][minY].wallColor = wallColor;

      if (maxY + 1 < this.height) {
        this.tiles[x][maxY + 1].hasWallNorth = true;
        this.tiles[x][maxY + 1].wallColor = wallColor;
      } else {
        this.tiles[x][maxY].hasWallNorth = true;
        this.tiles[x][maxY].wallColor = wallColor;
      }
    }

    // 3. Build West & East walls
    for (let y = minY; y <= maxY; y++) {
      this.tiles[minX][y].hasWallWest = true;
      this.tiles[minX][y].wallColor = wallColor;

      if (maxX + 1 < this.width) {
        this.tiles[maxX + 1][y].hasWallWest = true;
        this.tiles[maxX + 1][y].wallColor = wallColor;
      } else {
        this.tiles[maxX][y].hasWallWest = true;
        this.tiles[maxX][y].wallColor = wallColor;
      }
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

  public addPlacedFurniture(item: PlacedFurniture): void {
    this.placedFurniture.push(item);
  }


  public rotateFurniture(instanceId: string): boolean {
    const item = this.placedFurniture.find(f => f.instanceId === instanceId);
    if (!item) return false;
    const rotations: Array<0 | 90 | 180 | 270> = [0, 90, 180, 270];
    const nextIdx = (rotations.indexOf(item.rotation) + 1) % rotations.length;
    item.rotation = rotations[nextIdx];
    return true;
  }

  public sellFurniture(instanceId: string): number {
    const item = this.placedFurniture.find(f => f.instanceId === instanceId);
    if (!item) return 0;

    const def = FURNITURE_CATALOG[item.furnitureId];
    const refund = def ? Math.floor(def.price * 0.8) : 50;

    this.removeFurniture(instanceId);
    return refund;
  }

  public moveFurniture(instanceId: string, newX: number, newY: number): boolean {
    const item = this.placedFurniture.find(f => f.instanceId === instanceId);
    if (!item) return false;

    const oldX = item.gridX;
    const oldY = item.gridY;
    item.gridX = -999;
    item.gridY = -999;

    if (this.canPlaceFurniture(item.furnitureId, newX, newY)) {
      item.gridX = newX;
      item.gridY = newY;
      return true;
    } else {
      item.gridX = oldX;
      item.gridY = oldY;
      return false;
    }
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
