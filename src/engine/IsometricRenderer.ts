/**
 * 2.5D Isometric Rendering Engine
 * Renders grid tiles, room walls, furniture objects, Sims characters,
 * action progress bars, and animated floating Plumbobs.
 */

import { House } from '../world/House';
import { Sim } from '../entity/Sim';
import { Camera } from './Camera';
import { FURNITURE_CATALOG } from '../world/Furniture';

export class IsometricRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tileWidth: number = 64;
  private tileHeight: number = 32;

  public hoverGrid: { x: number; y: number } | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  public setSize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Converts 2D Grid coordinates to Isometric Screen coordinates
   */
  public gridToIso(gridX: number, gridY: number): { x: number; y: number } {
    const isoX = (gridX - gridY) * (this.tileWidth / 2);
    const isoY = (gridX + gridY) * (this.tileHeight / 2);
    return { x: isoX, y: isoY };
  }

  /**
   * Converts Screen Point back to Grid coordinates
   */
  public screenToGrid(screenX: number, screenY: number, camera: Camera): { x: number; y: number } {
    // Offset screen coords by canvas center and camera
    const cx = screenX - this.canvas.width / 2 - camera.x;
    const cy = screenY - (this.canvas.height / 2 - 100) - camera.y;

    const unscaledX = cx / camera.zoom;
    const unscaledY = cy / camera.zoom;

    const gridX = (unscaledX / (this.tileWidth / 2) + unscaledY / (this.tileHeight / 2)) / 2;
    const gridY = (unscaledY / (this.tileHeight / 2) - unscaledX / (this.tileWidth / 2)) / 2;

    return {
      x: Math.floor(gridX),
      y: Math.floor(gridY)
    };
  }

  public render(house: House, sim: Sim, camera: Camera, timeOfDay: number = 12): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    // Center viewport and apply camera transformations
    ctx.translate(this.canvas.width / 2 + camera.x, (this.canvas.height / 2 - 100) + camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    // 1. Render Floor Grid Tiles
    for (let x = 0; x < house.width; x++) {
      for (let y = 0; y < house.height; y++) {
        const tile = house.tiles[x][y];
        const iso = this.gridToIso(x, y);

        this.drawTile(iso.x, iso.y, tile.color, tile.type);

        // Highlight hover tile
        if (this.hoverGrid && this.hoverGrid.x === x && this.hoverGrid.y === y) {
          this.drawTileOverlay(iso.x, iso.y, 'rgba(255, 255, 255, 0.4)');
        }
      }
    }

    // 2. Render Placed Furniture
    house.placedFurniture.forEach(item => {
      const def = FURNITURE_CATALOG[item.furnitureId];
      if (!def) return;
      const iso = this.gridToIso(item.gridX, item.gridY);
      this.drawFurnitureBlock(iso.x, iso.y, def);
    });

    // 3. Render Sim Character
    const simIso = this.gridToIso(sim.renderPos.x, sim.renderPos.y);
    this.drawSim(simIso.x, simIso.y, sim);

    // 4. Day/Night Ambient Overlay
    ctx.restore();
    this.renderLightingOverlay(timeOfDay);
  }

  private drawTile(isoX: number, isoY: number, color: string, type: string): void {
    const ctx = this.ctx;
    const hw = this.tileWidth / 2;
    const hh = this.tileHeight / 2;

    ctx.beginPath();
    ctx.moveTo(isoX, isoY);
    ctx.lineTo(isoX + hw, isoY + hh);
    ctx.lineTo(isoX, isoY + this.tileHeight);
    ctx.lineTo(isoX - hw, isoY + hh);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();

    ctx.strokeStyle = type === 'grass' ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  private drawTileOverlay(isoX: number, isoY: number, color: string): void {
    const ctx = this.ctx;
    const hw = this.tileWidth / 2;
    const hh = this.tileHeight / 2;

    ctx.beginPath();
    ctx.moveTo(isoX, isoY);
    ctx.lineTo(isoX + hw, isoY + hh);
    ctx.lineTo(isoX, isoY + this.tileHeight);
    ctx.lineTo(isoX - hw, isoY + hh);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();
  }

  private drawFurnitureBlock(isoX: number, isoY: number, def: typeof FURNITURE_CATALOG[string]): void {
    const ctx = this.ctx;
    const w = def.width * (this.tileWidth / 2);
    const h = 30; // Block height

    // Top face
    ctx.fillStyle = def.color;
    ctx.beginPath();
    ctx.moveTo(isoX, isoY - h);
    ctx.lineTo(isoX + w, isoY + (w/2) - h);
    ctx.lineTo(isoX, isoY + w - h);
    ctx.lineTo(isoX - w, isoY + (w/2) - h);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.stroke();

    // Front Left Face
    ctx.fillStyle = this.adjustColorBrightness(def.color, -20);
    ctx.beginPath();
    ctx.moveTo(isoX - w, isoY + (w/2) - h);
    ctx.lineTo(isoX, isoY + w - h);
    ctx.lineTo(isoX, isoY + w);
    ctx.lineTo(isoX - w, isoY + (w/2));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Front Right Face
    ctx.fillStyle = this.adjustColorBrightness(def.color, -40);
    ctx.beginPath();
    ctx.moveTo(isoX, isoY + w - h);
    ctx.lineTo(isoX + w, isoY + (w/2) - h);
    ctx.lineTo(isoX + w, isoY + (w/2));
    ctx.lineTo(isoX, isoY + w);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Furniture Icon & Name
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(def.icon, isoX, isoY + (w/2) - h - 5);
  }

  private drawSim(isoX: number, isoY: number, sim: Sim): void {
    const ctx = this.ctx;
    const mood = sim.getCurrentMood();

    // Shadow
    ctx.beginPath();
    ctx.ellipse(isoX, isoY + 14, 14, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fill();

    // Body (Outfit)
    ctx.fillStyle = sim.customization.outfitColor;
    ctx.fillRect(isoX - 8, isoY - 26, 16, 26);
    ctx.strokeStyle = '#111';
    ctx.strokeRect(isoX - 8, isoY - 26, 16, 26);

    // Head (Skin tone)
    ctx.beginPath();
    ctx.arc(isoX, isoY - 36, 10, 0, Math.PI * 2);
    ctx.fillStyle = sim.customization.skinColor;
    ctx.fill();
    ctx.stroke();

    // Hair
    ctx.beginPath();
    ctx.arc(isoX, isoY - 40, 10, Math.PI, Math.PI * 2);
    ctx.fillStyle = sim.customization.hairColor;
    ctx.fill();

    // Iconic Floating Plumbob (Sims Crystal)
    const plumbobY = isoY - 65 + Math.sin(Date.now() / 250) * 4;
    this.drawPlumbob(isoX, plumbobY, mood.plumbobColor);

    // Current Action Progress Bar
    const currentAction = sim.actionQueue.getCurrentAction();
    if (currentAction) {
      const progress = currentAction.elapsedSeconds / currentAction.durationSeconds;
      const barW = 40;
      const barH = 6;
      const bx = isoX - barW / 2;
      const by = isoY - 80;

      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(bx - 2, by - 2, barW + 4, barH + 4);

      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(bx, by, barW * progress, barH);
    }
  }

  private drawPlumbob(x: number, y: number, color: string): void {
    const ctx = this.ctx;
    const w = 8;
    const h = 16;

    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;

    // Top pyramid
    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x, y + 2);
    ctx.lineTo(x - w, y);
    ctx.closePath();
    ctx.fill();

    // Bottom inverted pyramid
    ctx.fillStyle = this.adjustColorBrightness(color, -20);
    ctx.beginPath();
    ctx.moveTo(x, y + 2);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x - w, y);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  private renderLightingOverlay(timeOfDay: number): void {
    // Time ranges: 0..24 hours
    // Night is 22..6
    let darkness = 0;
    if (timeOfDay >= 22 || timeOfDay <= 5) {
      darkness = 0.45;
    } else if (timeOfDay > 5 && timeOfDay < 8) {
      darkness = 0.45 * (1 - (timeOfDay - 5) / 3);
    } else if (timeOfDay > 19 && timeOfDay < 22) {
      darkness = 0.45 * ((timeOfDay - 19) / 3);
    }

    if (darkness > 0) {
      this.ctx.fillStyle = `rgba(15, 25, 60, ${darkness})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private adjustColorBrightness(hex: string, percent: number): string {
    let num = parseInt(hex.replace('#', ''), 16);
    if (isNaN(num)) return hex;
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00FF) + percent;
    let b = (num & 0x0000FF) + percent;

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}
