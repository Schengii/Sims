/**
 * Mini-Map UI Component
 * Canvas-based overview of the current house grid for orientation.
 * Shows: Sim positions, furniture placement, active floor level.
 * v18: New feature - helps with navigation in 16x16 multi-floor grid.
 */

import type { House } from '../world/House';
import type { Sim } from '../entity/Sim';
import type { NPCManager } from '../entity/NPCManager';
import type { PetManager } from '../entity/PetManager';

export class Minimap {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private readonly TILE_SIZE = 6; // px per tile
  private readonly GRID_SIZE = 16;
  private isVisible: boolean = true;
  private isDragging: boolean = false;

  constructor(parentContainer: HTMLElement) {
    // Create canvas
    this.canvas = document.createElement('canvas');
    const size = this.GRID_SIZE * this.TILE_SIZE + 4;
    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.id = 'minimap-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      bottom: 140px;
      right: 16px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 8px;
      border: 2px solid rgba(255,255,255,0.2);
      background: rgba(10,20,10,0.85);
      backdrop-filter: blur(6px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.6);
      cursor: move;
      z-index: 1200;
      image-rendering: pixelated;
    `;
    this.canvas.title = 'Mini-Karte (Zum Ausblenden klicken)';

    this.ctx = this.canvas.getContext('2d')!;
    parentContainer.appendChild(this.canvas);

    // Toggle visibility on click
    this.canvas.addEventListener('click', () => {
      if (!this.isDragging) {
        // Click toggle handled via toggle button only
      }
    });

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'minimap-toggle';
    toggleBtn.innerHTML = '🗺️';
    toggleBtn.title = 'Minimap ein/ausblenden';
    toggleBtn.setAttribute('aria-label', 'Minimap ein/ausblenden');
    toggleBtn.style.cssText = `
      position: fixed;
      bottom: ${140 + size + 4}px;
      right: 16px;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(10,20,10,0.85);
      color: white;
      font-size: 14px;
      cursor: pointer;
      z-index: 1201;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    `;
    toggleBtn.addEventListener('click', () => this.toggle());
    parentContainer.appendChild(toggleBtn);
  }

  public toggle(): void {
    this.isVisible = !this.isVisible;
    this.canvas.style.display = this.isVisible ? 'block' : 'none';
  }

  public render(house: House, sim: Sim, npcManager?: NPCManager, petManager?: PetManager): void {
    if (!this.isVisible) return;

    const ctx = this.ctx;
    const ts = this.TILE_SIZE;
    const gs = this.GRID_SIZE;

    // Clear
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid tiles
    for (let x = 0; x < gs; x++) {
      for (let y = 0; y < gs; y++) {
        const tile = house.tiles[x]?.[y];
        if (!tile) continue;

        let color = 'rgba(30,40,30,0.9)';
        if (tile.type === 'wood') color = '#5d4037';
        else if (tile.type === 'tile') color = '#455a64';
        else if (tile.type === 'carpet') color = '#6a1f85';
        else if (tile.type === 'marble') color = '#b0bec5';
        else if (tile.type === 'pool') color = '#0288d1';
        else if (tile.type === 'grass') color = '#1b5e20';

        ctx.fillStyle = color;
        ctx.fillRect(x * ts + 2, y * ts + 2, ts - 1, ts - 1);
      }
    }

    // Draw furniture (dark grey squares)
    ctx.fillStyle = 'rgba(100,100,100,0.8)';
    house.placedFurniture.forEach(f => {
      ctx.fillRect(f.gridX * ts + 2, f.gridY * ts + 2, ts - 1, ts - 1);
    });

    // Draw walls
    ctx.strokeStyle = 'rgba(200,200,200,0.5)';
    ctx.lineWidth = 1;
    for (let x = 0; x < gs; x++) {
      for (let y = 0; y < gs; y++) {
        const tile = house.tiles[x]?.[y];
        if (!tile) continue;
        if (tile.hasWallNorth) {
          ctx.beginPath();
          ctx.moveTo(x * ts + 2, y * ts + 2);
          ctx.lineTo((x + 1) * ts + 1, y * ts + 2);
          ctx.stroke();
        }
        if (tile.hasWallWest) {
          ctx.beginPath();
          ctx.moveTo(x * ts + 2, y * ts + 2);
          ctx.lineTo(x * ts + 2, (y + 1) * ts + 1);
          ctx.stroke();
        }
      }
    }

    // Draw NPCs (white dots)
    if (npcManager) {
      ctx.fillStyle = 'rgba(200,200,255,0.9)';
      npcManager.npcs.forEach(npc => {
        ctx.beginPath();
        ctx.arc(npc.gridPos.x * ts + 2 + ts / 2, npc.gridPos.y * ts + 2 + ts / 2, ts / 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw pets (orange dots)
    if (petManager) {
      ctx.fillStyle = 'rgba(255,150,50,0.9)';
      petManager.pets.forEach(pet => {
        ctx.beginPath();
        ctx.arc(pet.gridPos.x * ts + 2 + ts / 2, pet.gridPos.y * ts + 2 + ts / 2, ts / 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw active sim (green plumbob indicator)
    const sx = sim.renderPos.x * ts + 2 + ts / 2;
    const sy = sim.renderPos.y * ts + 2 + ts / 2;
    // Glow
    const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, ts);
    gradient.addColorStop(0, 'rgba(0,255,100,0.8)');
    gradient.addColorStop(1, 'rgba(0,255,100,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(sx, sy, ts, 0, Math.PI * 2);
    ctx.fill();
    // Solid dot
    ctx.fillStyle = '#00ff66';
    ctx.beginPath();
    ctx.arc(sx, sy, ts / 2 + 1, 0, Math.PI * 2);
    ctx.fill();

    // Floor indicator
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = `bold ${ts}px sans-serif`;
    ctx.fillText(`E${house.activeFloor}`, 4, 12);
  }
}
