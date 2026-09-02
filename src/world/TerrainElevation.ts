/**
 * TerrainElevation - 2.5D Multi-Height & Landscaping Engine
 * Manages grid elevation levels (-1, 0, 1, 2) for garden hills,
 * sunken pool terraces, and cliff sculpting in Build Mode.
 */

export class TerrainElevation {
  public width: number;
  public height: number;
  public elevationGrid: number[][];

  constructor(width: number = 16, height: number = 16) {
    this.width = width;
    this.height = height;
    this.elevationGrid = [];

    for (let x = 0; x < width; x++) {
      this.elevationGrid[x] = [];
      for (let y = 0; y < height; y++) {
        this.elevationGrid[x][y] = 0; // Default flat ground level
      }
    }
  }

  public getElevation(x: number, y: number): number {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
    return this.elevationGrid[x][y] || 0;
  }

  public setElevation(x: number, y: number, level: number): boolean {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
    this.elevationGrid[x][y] = Math.max(-1, Math.min(2, level));
    return true;
  }

  public raise(x: number, y: number): boolean {
    const current = this.getElevation(x, y);
    if (current < 2) {
      return this.setElevation(x, y, current + 1);
    }
    return false;
  }

  public lower(x: number, y: number): boolean {
    const current = this.getElevation(x, y);
    if (current > -1) {
      return this.setElevation(x, y, current - 1);
    }
    return false;
  }

  public flatten(x: number, y: number, targetHeight: number = 0): boolean {
    return this.setElevation(x, y, targetHeight);
  }

  /**
   * Returns vertical pixel offset for isometric rendering (e.g. 1 elevation level = -12px higher).
   */
  public getYOffset(x: number, y: number): number {
    const offset = this.getElevation(x, y) * -12;
    return offset === 0 ? 0 : offset;
  }
}
