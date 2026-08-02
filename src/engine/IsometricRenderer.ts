/**
 * 2.5D Isometric Rendering Engine
 * Renders floor tiles, animated pool water, room walls, door/window cutouts,
 * furniture blocks, Sims sprites, and emote speech bubbles.
 */

import { House, type FloorTile } from '../world/House';
import { Sim } from '../entity/Sim';
import { Camera } from './Camera';
import { FURNITURE_CATALOG } from '../world/Furniture';
import { NPCManager, type NPCSim } from '../entity/NPCManager';
import { LifeStage } from '../entity/LifeStage';

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

  public gridToIso(gridX: number, gridY: number): { x: number; y: number } {
    const isoX = (gridX - gridY) * (this.tileWidth / 2);
    const isoY = (gridX + gridY) * (this.tileHeight / 2);
    return { x: isoX, y: isoY };
  }

  public screenToGrid(screenX: number, screenY: number, camera: Camera): { x: number; y: number } {
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

  public render(house: House, sim: Sim, npcManager: NPCManager, camera: Camera, timeOfDay: number = 12): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.translate(this.canvas.width / 2 + camera.x, (this.canvas.height / 2 - 100) + camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    // 1. Render Floor Grid Tiles & Pools
    for (let x = 0; x < house.width; x++) {
      for (let y = 0; y < house.height; y++) {
        const tile = house.tiles[x][y];
        const iso = this.gridToIso(x, y);

        this.drawTile(iso.x, iso.y, tile);

        if (this.hoverGrid && this.hoverGrid.x === x && this.hoverGrid.y === y) {
          this.drawTileOverlay(iso.x, iso.y, 'rgba(255, 255, 255, 0.4)');
        }
      }
    }

    // 2. Render Walls & Openings (North & West Grid Edges)
    for (let x = 0; x < house.width; x++) {
      for (let y = 0; y < house.height; y++) {
        const tile = house.tiles[x][y];
        const iso = this.gridToIso(x, y);

        if (tile.hasWallNorth) {
          this.drawWallSegment(iso.x, iso.y, 'north', tile.wallColor || '#2c3e50', tile.openingNorth);
        }
        if (tile.hasWallWest) {
          this.drawWallSegment(iso.x, iso.y, 'west', tile.wallColor || '#2c3e50', tile.openingWest);
        }
      }
    }

    // 3. Render Placed Furniture
    house.placedFurniture.forEach(item => {
      const def = FURNITURE_CATALOG[item.furnitureId];
      if (!def) return;
      const iso = this.gridToIso(item.gridX, item.gridY);
      this.drawFurnitureBlock(iso.x, iso.y, def);
    });

    // 4. Render NPC Townies
    npcManager.npcs.forEach(npc => {
      const npcIso = this.gridToIso(npc.renderPos.x, npc.renderPos.y);
      this.drawNPCSim(npcIso.x, npcIso.y, npc);
    });

    // 5. Render Active Player Sim
    const simIso = this.gridToIso(sim.renderPos.x, sim.renderPos.y);
    const isOnPool = house.tiles[Math.floor(sim.gridPos.x)]?.[Math.floor(sim.gridPos.y)]?.type === 'pool';
    this.drawSim(simIso.x, simIso.y, sim, isOnPool);

    ctx.restore();
    this.renderLightingOverlay(timeOfDay);
  }

  private drawTile(isoX: number, isoY: number, tile: FloorTile): void {
    const ctx = this.ctx;
    const hw = this.tileWidth / 2;
    const hh = this.tileHeight / 2;

    ctx.beginPath();
    ctx.moveTo(isoX, isoY);
    ctx.lineTo(isoX + hw, isoY + hh);
    ctx.lineTo(isoX, isoY + this.tileHeight);
    ctx.lineTo(isoX - hw, isoY + hh);
    ctx.closePath();

    if (tile.type === 'pool') {
      // Animated Swimming Pool Water
      const time = Date.now() / 400;
      const waterBlue = `rgba(0, 180, 255, ${0.75 + Math.sin(time + isoX) * 0.1})`;
      ctx.fillStyle = waterBlue;
      ctx.fill();
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else {
      ctx.fillStyle = tile.color;
      ctx.fill();
      ctx.strokeStyle = tile.type === 'grass' ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
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

  private drawWallSegment(
    isoX: number,
    isoY: number,
    direction: 'north' | 'west',
    wallColor: string,
    opening?: 'door' | 'window'
  ): void {
    const ctx = this.ctx;
    const hw = this.tileWidth / 2;
    const hh = this.tileHeight / 2;
    const wallH = 45; // Wall height

    ctx.save();

    if (direction === 'north') {
      // North Wall Segment
      ctx.fillStyle = wallColor;
      ctx.beginPath();
      ctx.moveTo(isoX - hw, isoY + hh);
      ctx.lineTo(isoX, isoY);
      ctx.lineTo(isoX, isoY - wallH);
      ctx.lineTo(isoX - hw, isoY + hh - wallH);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.stroke();

      // Render Door cutout
      if (opening === 'door') {
        ctx.fillStyle = '#8d5524';
        ctx.fillRect(isoX - hw + 8, isoY + hh - 30, 16, 25);
        ctx.strokeRect(isoX - hw + 8, isoY + hh - 30, 16, 25);
      } else if (opening === 'window') {
        ctx.fillStyle = 'rgba(0, 229, 255, 0.4)';
        ctx.fillRect(isoX - hw + 10, isoY + hh - 35, 14, 14);
        ctx.strokeRect(isoX - hw + 10, isoY + hh - 35, 14, 14);
      }
    } else {
      // West Wall Segment
      ctx.fillStyle = this.adjustColorBrightness(wallColor, -25);
      ctx.beginPath();
      ctx.moveTo(isoX, isoY);
      ctx.lineTo(isoX + hw, isoY + hh);
      ctx.lineTo(isoX + hw, isoY + hh - wallH);
      ctx.lineTo(isoX, isoY - wallH);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.stroke();

      if (opening === 'door') {
        ctx.fillStyle = '#8d5524';
        ctx.fillRect(isoX + 8, isoY + hh - 30, 16, 25);
        ctx.strokeRect(isoX + 8, isoY + hh - 30, 16, 25);
      } else if (opening === 'window') {
        ctx.fillStyle = 'rgba(0, 229, 255, 0.4)';
        ctx.fillRect(isoX + 10, isoY + hh - 35, 14, 14);
        ctx.strokeRect(isoX + 10, isoY + hh - 35, 14, 14);
      }
    }

    ctx.restore();
  }

  private drawFurnitureBlock(isoX: number, isoY: number, def: typeof FURNITURE_CATALOG[string]): void {
    const ctx = this.ctx;
    const w = def.width * (this.tileWidth / 2);
    const h = 30;

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

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(def.icon, isoX, isoY + (w/2) - h - 5);
  }

  private drawSim(isoX: number, isoY: number, sim: Sim, isSwimming: boolean = false): void {
    const ctx = this.ctx;
    const mood = sim.getCurrentMood();
    const stageInfo = LifeStage.getInfo(sim.lifeStage);
    const scale = stageInfo.renderScale;

    const currentAction = sim.actionQueue.getCurrentAction();
    const isDancing = currentAction && (currentAction.name.includes('tanzen') || currentAction.name.includes('Dance'));

    // Rhythmic dance bobbing animation
    const danceOffset = isDancing ? Math.sin(Date.now() / 150) * 4 : 0;
    const yOffset = isSwimming ? 10 : danceOffset;

    ctx.save();
    ctx.translate(isoX, isoY);
    ctx.scale(scale, scale);

    // Shadow (only when not swimming)
    if (!isSwimming) {
      ctx.beginPath();
      ctx.ellipse(0, 14, 14, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fill();
    }

    // Body
    ctx.fillStyle = sim.customization.outfitColor;
    ctx.fillRect(-8, -26 + yOffset, 16, 26 - yOffset);
    ctx.strokeStyle = '#111';
    ctx.strokeRect(-8, -26 + yOffset, 16, 26 - yOffset);

    // Head
    ctx.beginPath();
    ctx.arc(0, -36 + yOffset, 10, 0, Math.PI * 2);
    ctx.fillStyle = sim.customization.skinColor;
    ctx.fill();
    ctx.stroke();

    // Hair
    ctx.beginPath();
    ctx.arc(0, -40 + yOffset, 10, Math.PI, Math.PI * 2);
    ctx.fillStyle = sim.customization.hairColor;
    ctx.fill();

    // Floating Plumbob
    const plumbobY = -65 + yOffset + Math.sin(Date.now() / 250) * 4;
    this.drawPlumbob(0, plumbobY, mood.plumbobColor);

    // Action progress bar
    if (currentAction) {
      const progress = currentAction.elapsedSeconds / currentAction.durationSeconds;
      const barW = 40;
      const barH = 6;
      const bx = -barW / 2;
      const by = -80 + yOffset;

      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(bx - 2, by - 2, barW + 4, barH + 4);

      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(bx, by, barW * progress, barH);
    }

    ctx.restore();
  }

  private drawNPCSim(isoX: number, isoY: number, npc: NPCSim): void {
    const ctx = this.ctx;

    // Shadow
    ctx.beginPath();
    ctx.ellipse(isoX, isoY + 14, 12, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();

    // Body
    ctx.fillStyle = npc.outfitColor;
    ctx.fillRect(isoX - 7, isoY - 24, 14, 24);
    ctx.strokeStyle = '#222';
    ctx.strokeRect(isoX - 7, isoY - 24, 14, 24);

    // Head
    ctx.beginPath();
    ctx.arc(isoX, isoY - 33, 9, 0, Math.PI * 2);
    ctx.fillStyle = npc.skinColor;
    ctx.fill();
    ctx.stroke();

    // Hair
    ctx.beginPath();
    ctx.arc(isoX, isoY - 36, 9, Math.PI, Math.PI * 2);
    ctx.fillStyle = npc.hairColor;
    ctx.fill();

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(npc.name, isoX, isoY - 46);

    if (npc.activeEmote) {
      this.drawEmoteBubble(isoX, isoY - 60, npc.activeEmote.symbol);
    }
  }

  private drawEmoteBubble(x: number, y: number, symbol: string): void {
    const ctx = this.ctx;
    ctx.save();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, x, y + 1);

    ctx.restore();
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

    // Bottom pyramid
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
