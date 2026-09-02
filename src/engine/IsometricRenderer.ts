import { House, type FloorTile } from '../world/House';
import { Sim } from '../entity/Sim';
import { Camera } from './Camera';
import { FURNITURE_CATALOG } from '../world/Furniture';
import { NPCManager, type NPCSim } from '../entity/NPCManager';
import { LifeStage } from '../entity/LifeStage';
import type { WeatherSystem } from '../systems/WeatherSystem';
import type { GardenSystem } from '../world/GardenSystem';
import type { PetManager } from '../entity/PetManager';
import type { EventManager } from '../systems/EventSystem';

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

  public render(
    house: House,
    sim: Sim,
    npcManager: NPCManager,
    camera: Camera,
    timeOfDay: number = 12,
    weatherSystem?: WeatherSystem,
    gardenSystem?: GardenSystem,
    householdSims?: Sim[],
    petManager?: PetManager,
    eventManager?: EventManager,
    radioManager?: any
  ): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();

    // Apply vertical offset based on active floor height
    const floorYOffset = house.activeFloor * -40;

    ctx.translate(this.canvas.width / 2 + camera.x, (this.canvas.height / 2 - 100) + camera.y + floorYOffset);
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

    // 1b. Render Garden Plots (only on Ground Floor 0)
    if (gardenSystem && house.activeFloor === 0) {
      gardenSystem.plots.forEach(plot => {
        const iso = this.gridToIso(plot.gridX, plot.gridY);
        this.drawGardenPlot(iso.x, iso.y, plot);
      });
    }

    // 2. Render Walls & Openings (respecting house.wallDisplayMode with dynamic occlusion culling)
    const entityPositions = [
      { x: sim.gridPos.x, y: sim.gridPos.y },
      ...(householdSims || []).map(s => ({ x: s.gridPos.x, y: s.gridPos.y })),
      ...npcManager.npcs.map(n => ({ x: n.gridPos.x, y: n.gridPos.y }))
    ];
    if (this.hoverGrid) {
      entityPositions.push({ x: this.hoverGrid.x, y: this.hoverGrid.y });
    }

    if (house.wallDisplayMode !== 'hidden') {
      for (let x = 0; x < house.width; x++) {
        for (let y = 0; y < house.height; y++) {
          const tile = house.tiles[x][y];
          const iso = this.gridToIso(x, y);

          const isFrontWall = x >= 11 || y >= 11;
          const isCutaway = house.wallDisplayMode === 'cutaway' && isFrontWall;

          // Dynamic Occlusion Culling check: is any entity directly behind this wall?
          const isOccludingEntity = entityPositions.some(
            pos => Math.floor(pos.x) === x && Math.floor(pos.y) === y
          );

          if (tile.hasWallNorth) {
            this.drawWallSegment(iso.x, iso.y, 'north', tile.wallColor || '#2c3e50', tile.openingNorth, isCutaway, isOccludingEntity, tile.wallPattern);
          }
          if (tile.hasWallWest) {
            this.drawWallSegment(iso.x, iso.y, 'west', tile.wallColor || '#2c3e50', tile.openingWest, isCutaway, isOccludingEntity, tile.wallPattern);
          }
        }
      }

      // 2b. Render Wall Mounted Art Pieces (Framed Paintings & Photos)
      if (house.wallMountedArt && house.wallMountedArt.length > 0) {
        house.wallMountedArt.forEach(art => {
          const iso = this.gridToIso(art.gridX, art.gridY);
          const hw = this.tileWidth / 2;
          const hh = this.tileHeight / 2;

          this.ctx.save();
          if (art.wall === 'north') {
            const artX = iso.x - (hw / 2);
            const artY = iso.y + (hh / 2) - 26;
            // Frame Shadow & Border
            this.ctx.fillStyle = '#b45309'; // Gold/wood frame
            this.ctx.fillRect(artX - 8, artY - 8, 16, 16);
            this.ctx.fillStyle = '#1e293b';
            this.ctx.fillRect(artX - 6, artY - 6, 12, 12);
            this.ctx.font = '10px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(art.icon, artX, artY + 4);
          } else {
            const artX = iso.x + (hw / 2);
            const artY = iso.y + (hh / 2) - 26;
            this.ctx.fillStyle = '#b45309';
            this.ctx.fillRect(artX - 8, artY - 8, 16, 16);
            this.ctx.fillStyle = '#1e293b';
            this.ctx.fillRect(artX - 6, artY - 6, 12, 12);
            this.ctx.font = '10px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(art.icon, artX, artY + 4);
          }
          this.ctx.restore();
        });
      }
    }

    // 3. Render Placed Furniture
    house.placedFurniture.forEach(item => {
      const def = FURNITURE_CATALOG[item.furnitureId];
      if (!def) return;
      const iso = this.gridToIso(item.gridX, item.gridY);
      this.drawFurnitureBlock(iso.x, iso.y, def, item.rotation);
      this.drawFurnitureParticles(iso.x, iso.y, def);
    });

    // 4. Render Pets (Dogs & Cats)
    if (petManager) {
      petManager.pets.forEach(pet => {
        const petIso = this.gridToIso(pet.renderPos.x, pet.renderPos.y);
        this.drawPet(petIso.x, petIso.y, pet);
      });
    }

    // 5. Render NPC Townies
    npcManager.npcs.forEach(npc => {
      const npcIso = this.gridToIso(npc.renderPos.x, npc.renderPos.y);
      this.drawNPCSim(npcIso.x, npcIso.y, npc);
    });

    // 6. Render Household Sims (or single sim)
    const simsToRender = (householdSims && householdSims.length > 0) ? householdSims : [sim];
    simsToRender.forEach(hSim => {
      const simIso = this.gridToIso(hSim.renderPos.x, hSim.renderPos.y);
      const isOnPool = house.tiles[Math.floor(hSim.gridPos.x)]?.[Math.floor(hSim.gridPos.y)]?.type === 'pool';
      const isActive = hSim.id === sim.id;
      this.drawSim(simIso.x, simIso.y, hSim, isOnPool, isActive);
    });

    // 6b. Render Emergency Responders & Disasters (Fire, Burglars, Firefighter 🚒, Police 🚓)
    if (eventManager && eventManager.activeEvent && !eventManager.activeEvent.resolved) {
      this.renderEmergencyDisaster(eventManager.activeEvent);
    }

    ctx.restore();

    // 7. Lighting Overlay (with Dynamic Point-Lights), Weather Effects, Disco Lights & Sunbeams
    this.renderLightingOverlay(timeOfDay, house.activeFloor, house, camera);
    this.renderSunbeams(timeOfDay);

    if (radioManager && radioManager.getIsPlaying()) {
      this.renderDiscoLights();
    }

    if (weatherSystem) {
      this.renderWeatherParticles(weatherSystem);
    }

    // 7b. Render Roof Structure if on highest floor with full walls
    if (house.activeFloor >= 1 && house.wallDisplayMode === 'full' && house.roofStyle !== 'none') {
      this.renderRoofStructure(house);
    }

    // 8. Render Floor Level Badge (Top Left)
    this.renderFloorBadge(house.activeFloor);
  }

  private renderSunbeams(timeOfDay: number): void {
    if (timeOfDay < 7 || timeOfDay > 18) return; // Daylight only
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const gradient = ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, 'rgba(253, 224, 71, 0.08)');
    gradient.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();
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

  private drawGardenPlot(isoX: number, isoY: number, plot: any): void {
    const ctx = this.ctx;
    const hw = this.tileWidth / 2 - 4;
    const hh = this.tileHeight / 2 - 2;

    ctx.save();
    ctx.fillStyle = '#5d4037';
    ctx.beginPath();
    ctx.moveTo(isoX, isoY + 4);
    ctx.lineTo(isoX + hw, isoY + hh + 4);
    ctx.lineTo(isoX, isoY + this.tileHeight - 4);
    ctx.lineTo(isoX - hw, isoY + hh + 4);
    ctx.closePath();
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.font = '16px sans-serif';
    if (plot.isHarvestable) {
      const icon = plot.cropType === 'tomatoes' ? '🍅' : plot.cropType === 'strawberries' ? '🍓' : '💐';
      ctx.fillText(icon, isoX, isoY + hh);
    } else if (plot.cropType) {
      ctx.fillText('🌱', isoX, isoY + hh);
    } else {
      ctx.fillText('🟫', isoX, isoY + hh);
    }
    ctx.restore();
  }

  private drawWallSegment(
    isoX: number,
    isoY: number,
    direction: 'north' | 'west',
    wallColor: string,
    opening?: 'door' | 'window',
    isCutaway: boolean = false,
    isOccludingEntity: boolean = false,
    wallPattern?: string
  ): void {
    const ctx = this.ctx;
    const hw = this.tileWidth / 2;
    const hh = this.tileHeight / 2;
    const wallH = isCutaway ? 15 : 45;

    ctx.save();

    // Dynamic Occlusion Culling: if an entity or cursor is behind this wall, render translucent
    if (isOccludingEntity && !isCutaway) {
      ctx.globalAlpha = 0.32;
    }

    if (direction === 'north') {
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

      // Procedural Wall Patterns
      if (!isCutaway && wallPattern && wallPattern !== 'plain') {
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 1;
        if (wallPattern === 'brick') {
          for (let row = 1; row <= 4; row++) {
            const py = isoY - (row * 8);
            ctx.beginPath();
            ctx.moveTo(isoX - hw, py + hh);
            ctx.lineTo(isoX, py);
            ctx.stroke();
          }
        } else if (wallPattern === 'wood_panel') {
          for (let col = 1; col <= 3; col++) {
            const px = isoX - hw + (col * 8);
            const py = isoY + hh - (col * 4);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px, py - wallH);
            ctx.stroke();
          }
        } else if (wallPattern === 'wallpaper_floral') {
          ctx.font = '9px sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.fillText('🌸', isoX - (hw / 2), isoY - 15);
        }
      }

      if (!isCutaway) {
        if (opening === 'door') {
          ctx.fillStyle = '#8d5524';
          ctx.fillRect(isoX - hw + 8, isoY + hh - 30, 16, 25);
          ctx.strokeRect(isoX - hw + 8, isoY + hh - 30, 16, 25);
        } else if (opening === 'window') {
          ctx.fillStyle = 'rgba(0, 229, 255, 0.4)';
          ctx.fillRect(isoX - hw + 10, isoY + hh - 35, 14, 14);
          ctx.strokeRect(isoX - hw + 10, isoY + hh - 35, 14, 14);
        }
      }
    } else {
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

      // Procedural Wall Patterns (West Wall)
      if (!isCutaway && wallPattern && wallPattern !== 'plain') {
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 1;
        if (wallPattern === 'brick') {
          for (let row = 1; row <= 4; row++) {
            const py = isoY - (row * 8);
            ctx.beginPath();
            ctx.moveTo(isoX, py);
            ctx.lineTo(isoX + hw, py + hh);
            ctx.stroke();
          }
        } else if (wallPattern === 'wood_panel') {
          for (let col = 1; col <= 3; col++) {
            const px = isoX + (col * 8);
            const py = isoY + (col * 4);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px, py - wallH);
            ctx.stroke();
          }
        } else if (wallPattern === 'wallpaper_floral') {
          ctx.font = '9px sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.fillText('🌸', isoX + (hw / 2), isoY - 15);
        }
      }

      if (!isCutaway) {
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
    }

    ctx.restore();
  }

  private drawFurnitureParticles(isoX: number, isoY: number, def: typeof FURNITURE_CATALOG[string]): void {
    const ctx = this.ctx;
    const time = Date.now() / 180;

    // Fireplace Animated Fire
    if (def.id.includes('fireplace') || def.id.includes('kamin')) {
      ctx.save();
      for (let i = 0; i < 3; i++) {
        const fx = isoX + Math.sin(time + i * 2) * 5;
        const fy = isoY - 12 - Math.abs(Math.cos(time * 1.5 + i)) * 8;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(249, 115, 22, 0.85)' : 'rgba(234, 179, 8, 0.9)';
        ctx.beginPath();
        ctx.arc(fx, fy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Stove cooking steam
    if (def.id.includes('stove') || def.id.includes('herd') || def.id.includes('coffee')) {
      ctx.save();
      const sy = isoY - 25 - (Math.sin(time * 0.8) * 6);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('♨️', isoX, sy);
      ctx.restore();
    }

    // Stereo / Piano / Guitar musical notes
    if (def.id.includes('stereo') || def.id.includes('piano') || def.id.includes('guitar')) {
      ctx.save();
      const ny = isoY - 28 - (Math.sin(time) * 8);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
      ctx.textAlign = 'center';
      ctx.fillText(Math.sin(time) > 0 ? '🎵' : '🎶', isoX + Math.sin(time) * 6, ny);
      ctx.restore();
    }
  }

  private drawFurnitureBlock(isoX: number, isoY: number, def: typeof FURNITURE_CATALOG[string], rotation: number = 0): void {
    const ctx = this.ctx;
    const w = def.width * (this.tileWidth / 2);
    const h = 30;

    ctx.save();
    ctx.translate(isoX, isoY);

    if (rotation === 90) {
      ctx.scale(-1, 1);
    } else if (rotation === 180) {
      ctx.scale(1, -1);
      ctx.translate(0, -h);
    } else if (rotation === 270) {
      ctx.scale(-1, -1);
      ctx.translate(0, -h);
    }

    // Special 3D Staircase Step Rendering
    if (def.id.includes('stairs')) {
      const steps = 4;
      for (let s = 0; s < steps; s++) {
        const stepH = (h / steps) * (s + 1);
        const stepW = (w / steps) * (steps - s);
        const stepY = -stepH;

        ctx.fillStyle = s % 2 === 0 ? def.color : this.adjustColorBrightness(def.color, 15);
        ctx.beginPath();
        ctx.moveTo(0, stepY);
        ctx.lineTo(stepW, (stepW / 2) + stepY);
        ctx.lineTo(0, stepW + stepY);
        ctx.lineTo(-stepW, (stepW / 2) + stepY);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.stroke();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(def.icon, 0, -h - 6);
      ctx.restore();
      return;
    }

    ctx.fillStyle = def.color;
    ctx.beginPath();
    ctx.moveTo(0, -h);
    ctx.lineTo(w, (w/2) - h);
    ctx.lineTo(0, w - h);
    ctx.lineTo(-w, (w/2) - h);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.stroke();

    ctx.fillStyle = this.adjustColorBrightness(def.color, -20);
    ctx.beginPath();
    ctx.moveTo(-w, (w/2) - h);
    ctx.lineTo(0, w - h);
    ctx.lineTo(0, w);
    ctx.lineTo(-w, (w/2));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = this.adjustColorBrightness(def.color, -40);
    ctx.beginPath();
    ctx.moveTo(0, w - h);
    ctx.lineTo(w, (w/2) - h);
    ctx.lineTo(w, (w/2));
    ctx.lineTo(0, w);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(def.icon, 0, (w/2) - h - 5);

    ctx.restore();
  }

  private drawPet(isoX: number, isoY: number, pet: any): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(isoX, isoY);

    ctx.beginPath();
    ctx.ellipse(0, 8, 10, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();

    ctx.fillStyle = pet.color;
    ctx.beginPath();
    ctx.ellipse(0, -8, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(8, -14, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pet.species === 'dog' ? '🐕' : '🐈', 0, -20);

    ctx.fillStyle = '#ffffff';
    ctx.font = '9px sans-serif';
    ctx.fillText(pet.name, 0, -34);

    if (pet.activeEmote) {
      this.drawEmoteBubble(0, -48, pet.activeEmote.symbol);
    }

    ctx.restore();
  }

  private drawSim(isoX: number, isoY: number, sim: Sim, isSwimming: boolean = false, isActive: boolean = true): void {
    const ctx = this.ctx;
    const mood = sim.getCurrentMood();
    const stageInfo = LifeStage.getInfo(sim.lifeStage);
    const scale = stageInfo.renderScale;

    const currentAction = sim.actionQueue.getCurrentAction();
    const actName = currentAction ? currentAction.name.toLowerCase() : '';
    const isDancing = actName.includes('tanzen') || actName.includes('dance');
    const isSitting = actName.includes('sitz') || actName.includes('chair') || actName.includes('sofa') || actName.includes('pc') || actName.includes('essen');
    const isSleeping = actName.includes('schlaf') || actName.includes('sleep') || actName.includes('nap');
    const isWalking = sim.animState === 'walking';

    const danceOffset = isDancing ? Math.sin(Date.now() / 150) * 4 : 0;
    const yOffset = isSwimming ? 10 : (isSitting ? 6 : danceOffset);

    ctx.save();
    ctx.translate(isoX, isoY);
    ctx.scale(scale, scale);

    // 1. Water wake & Swimming Ripples
    if (isSwimming) {
      const rippleTime = Date.now() / 300;
      ctx.save();
      for (let r = 1; r <= 2; r++) {
        const radX = 16 + (Math.sin(rippleTime + r) * 6) + (r * 6);
        const radY = 8 + (Math.sin(rippleTime + r) * 3) + (r * 3);
        ctx.beginPath();
        ctx.ellipse(0, 8, radX, radY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 - (r * 0.15)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();
    } else {
      // Ground drop shadow
      ctx.beginPath();
      ctx.ellipse(0, 14, 14, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fill();
    }

    if (isSleeping) {
      // Horizontal Sleeping Pose
      ctx.save();
      ctx.rotate(Math.PI / 2);
      ctx.translate(0, -10);

      // Pillow / Head
      ctx.beginPath();
      ctx.arc(10, 0, 9, 0, Math.PI * 2);
      ctx.fillStyle = sim.customization.skinColor;
      ctx.fill();

      // Blanket overlay
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(-18, -10, 22, 20);
      ctx.strokeStyle = '#2563eb';
      ctx.strokeRect(-18, -10, 22, 20);

      // Zzz particle floating up
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#93c5fd';
      ctx.fillText('Zzz', 12, -15 - Math.sin(Date.now() / 200) * 4);

      ctx.restore();
    } else {
      // Legs (with walking stride cycle)
      const legStride = isWalking ? Math.sin(Date.now() / 80) * 7 : 0;
      if (!isSwimming && !isSitting) {
        // Left Leg
        ctx.fillStyle = this.adjustColorBrightness(sim.customization.outfitColor, -30);
        ctx.fillRect(-6, -8 + yOffset, 4, 12 + legStride);
        // Right Leg
        ctx.fillRect(2, -8 + yOffset, 4, 12 - legStride);
      }

      // Torso / Outfit
      const torsoH = isSitting ? 18 : 22;
      ctx.fillStyle = sim.customization.outfitColor;
      ctx.fillRect(-8, -26 + yOffset, 16, torsoH);
      ctx.strokeStyle = isActive ? '#00e5ff' : '#111';
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.strokeRect(-8, -26 + yOffset, 16, torsoH);

      // Arms (swinging when walking)
      const armSwing = isWalking ? Math.cos(Date.now() / 80) * 5 : 0;
      ctx.fillStyle = sim.customization.skinColor;
      // Left Arm
      ctx.fillRect(-11, -24 + yOffset - armSwing, 3, 14);
      // Right Arm
      ctx.fillRect(8, -24 + yOffset + armSwing, 3, 14);

      // Head
      ctx.beginPath();
      ctx.arc(0, -36 + yOffset, 10, 0, Math.PI * 2);
      ctx.fillStyle = sim.customization.skinColor;
      ctx.fill();
      ctx.stroke();

      // Facial Features / Hair based on Facing Direction
      ctx.beginPath();
      if (sim.facing === 'north') {
        // Back of head - full hair
        ctx.arc(0, -36 + yOffset, 10, 0, Math.PI * 2);
      } else {
        // Front / Side hair
        ctx.arc(0, -40 + yOffset, 10, Math.PI, Math.PI * 2);
      }
      ctx.fillStyle = sim.customization.hairColor;
      ctx.fill();

      // Eyes if facing south/east/west
      if (sim.facing !== 'north') {
        ctx.fillStyle = '#1e293b';
        const eyeOffsetX = sim.facing === 'east' ? 3 : (sim.facing === 'west' ? -3 : 0);
        ctx.beginPath();
        ctx.arc(-3 + eyeOffsetX, -36 + yOffset, 1.5, 0, Math.PI * 2);
        ctx.arc(3 + eyeOffsetX, -36 + yOffset, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Glasses rendering (CAS 2.0)
        if (sim.customization.glasses && sim.customization.glasses !== 'none') {
          ctx.strokeStyle = sim.customization.glasses === 'sunglasses_aviator' ? '#0f172a' : '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-6 + eyeOffsetX, -39 + yOffset, 5, 5);
          ctx.strokeRect(1 + eyeOffsetX, -39 + yOffset, 5, 5);
          ctx.beginPath();
          ctx.moveTo(-1 + eyeOffsetX, -36 + yOffset);
          ctx.lineTo(1 + eyeOffsetX, -36 + yOffset);
          ctx.stroke();
        }
      }

      // Hat / Cap rendering (CAS 2.0)
      if (sim.customization.hat && sim.customization.hat !== 'none') {
        const hatSymbol = sim.customization.hat === 'baseball_cap' ? '🧢' : sim.customization.hat === 'beanie' ? '🧶' : sim.customization.hat === 'fedora' ? '🎩' : '🎉';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(hatSymbol, 0, -42 + yOffset);
      }
    }

    const plumbobY = -65 + yOffset + Math.sin(Date.now() / 250) * 4;
    this.drawPlumbob(0, plumbobY, isActive ? mood.plumbobColor : 'rgba(200,200,200,0.5)');

    // Render Action Item Prop in hand
    if (currentAction && !isSleeping) {
      let propSymbol = '';
      if (actName.includes('malen') || actName.includes('paint') || actName.includes('staffelei')) propSymbol = '🎨';
      else if (actName.includes('gitarre') || actName.includes('guitar') || actName.includes('musik')) propSymbol = '🎸';
      else if (actName.includes('kochen') || actName.includes('essen') || actName.includes('cook')) propSymbol = '🍳';
      else if (actName.includes('buch') || actName.includes('lesen') || actName.includes('read')) propSymbol = '📖';
      else if (actName.includes('zauber') || actName.includes('magic') || actName.includes('wand')) propSymbol = '🪄';
      else if (actName.includes('kaffee') || actName.includes('tee') || actName.includes('drink')) propSymbol = '☕';

      if (propSymbol) {
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(propSymbol, 14, -20 + yOffset);
      }
    }

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

    // Active Emote / Conversation speech bubble vs. Needs/Thought bubble
    if (sim.activeEmote) {
      this.drawSpeechBubble(0, -92 + yOffset, sim.activeEmote.symbol);
    } else if (!currentAction) {
      const lowest = sim.needs.getLowestNeed();
      if (lowest.value < 40) {
        let alertIcon = '🍕';
        if (lowest.need === 'hunger') alertIcon = '🍕';
        if (lowest.need === 'energy') alertIcon = '💤';
        if (lowest.need === 'bladder') alertIcon = '🚽';
        if (lowest.need === 'hygiene') alertIcon = '🧼';
        if (lowest.need === 'fun') alertIcon = '🎮';
        if (lowest.need === 'social') alertIcon = '💬';
        this.drawEmoteBubble(0, -85 + yOffset, alertIcon);
      } else {
        this.drawEmoteBubble(0, -85 + yOffset, '✨');
      }
    }

    ctx.restore();
  }

  private drawNPCSim(isoX: number, isoY: number, npc: NPCSim): void {
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.ellipse(isoX, isoY + 14, 12, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();

    ctx.fillStyle = npc.outfitColor;
    ctx.fillRect(isoX - 7, isoY - 24, 14, 24);
    ctx.strokeStyle = '#222';
    ctx.strokeRect(isoX - 7, isoY - 24, 14, 24);

    ctx.beginPath();
    ctx.arc(isoX, isoY - 33, 9, 0, Math.PI * 2);
    ctx.fillStyle = npc.skinColor;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(isoX, isoY - 36, 9, Math.PI, Math.PI * 2);
    ctx.fillStyle = npc.hairColor;
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(npc.name, isoX, isoY - 46);

    if (npc.activeEmote) {
      this.drawSpeechBubble(isoX, isoY - 62, npc.activeEmote.symbol);
    }
  }

  private drawSpeechBubble(x: number, y: number, symbol: string): void {
    const ctx = this.ctx;
    ctx.save();

    // Bubble pop animation offset
    const bounce = Math.sin(Date.now() / 120) * 1.5;
    const by = y + bounce;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.roundRect(x - 17, by - 13, 34, 26, [8]);
    ctx.fill();

    // Main speech bubble body
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x - 18, by - 14, 36, 26, [8]);
    ctx.fill();
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Speech bubble tail pointing down
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x - 4, by + 12);
    ctx.lineTo(x, by + 18);
    ctx.lineTo(x + 4, by + 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Clean inner tail seam
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 3, by + 10, 6, 3);

    // Emoji icon / symbol
    ctx.font = '15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, x, by - 1);

    ctx.restore();
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

    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x, y + 2);
    ctx.lineTo(x - w, y);
    ctx.closePath();
    ctx.fill();

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

  private renderLightingOverlay(timeOfDay: number, activeFloor: number = 0, house?: House, camera?: Camera): void {
    let darkness = 0;
    if (activeFloor === -1) {
      darkness = 0.55; // Cellar ambient lighting
    } else {
      if (timeOfDay >= 22 || timeOfDay <= 5) {
        darkness = 0.5;
      } else if (timeOfDay > 5 && timeOfDay < 8) {
        darkness = 0.5 * (1 - (timeOfDay - 5) / 3);
      } else if (timeOfDay > 19 && timeOfDay < 22) {
        darkness = 0.5 * ((timeOfDay - 19) / 3);
      }
    }

    if (darkness <= 0) return;

    const ctx = this.ctx;
    ctx.save();

    // 1. Draw ambient darkness base
    ctx.fillStyle = activeFloor === -1 ? `rgba(10, 15, 30, ${darkness})` : `rgba(15, 25, 60, ${darkness})`;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 2. Dynamic Point-Lights (Lamps, Fireplace, TV, Computer, Candle)
    if (house && camera) {
      const floorYOffset = house.activeFloor * -40;
      const screenOriginX = this.canvas.width / 2 + camera.x;
      const screenOriginY = (this.canvas.height / 2 - 100) + camera.y + floorYOffset;

      const lightSources = house.placedFurniture.filter(item => {
        const id = item.furnitureId.toLowerCase();
        return id.includes('lamp') || id.includes('kamin') || id.includes('fireplace') ||
               id.includes('tv') || id.includes('computer') || id.includes('pc') ||
               id.includes('candle') || id.includes('stereo');
      });

      if (lightSources.length > 0) {
        ctx.globalCompositeOperation = 'screen';

        lightSources.forEach(item => {
          const iso = this.gridToIso(item.gridX, item.gridY);
          const screenX = screenOriginX + (iso.x * camera.zoom);
          const screenY = screenOriginY + (iso.y * camera.zoom);

          const isFire = item.furnitureId.includes('kamin') || item.furnitureId.includes('fireplace');
          const isTV = item.furnitureId.includes('tv') || item.furnitureId.includes('computer') || item.furnitureId.includes('pc');
          
          let radius = (isFire ? 130 : isTV ? 90 : 110) * camera.zoom;
          let glowColor = isFire ? 'rgba(251, 146, 60, 0.45)' : isTV ? 'rgba(56, 189, 248, 0.35)' : 'rgba(253, 224, 71, 0.4)';

          const grad = ctx.createRadialGradient(screenX, screenY, 4 * camera.zoom, screenX, screenY, radius);
          grad.addColorStop(0, glowColor);
          grad.addColorStop(0.5, glowColor.replace(/[\d\.]+\)$/, '0.15)'));
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    ctx.restore();
  }

  private renderWeatherParticles(weatherSystem: WeatherSystem): void {
    const info = weatherSystem.getWeatherInfo();
    const ctx = this.ctx;

    if (info.overlayColor) {
      ctx.fillStyle = info.overlayColor;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    const time = Date.now() / 10;

    if (weatherSystem.currentWeather === 'rain' || weatherSystem.currentWeather === 'thunderstorm') {
      ctx.strokeStyle = 'rgba(180, 220, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < 40; i++) {
        const rx = (i * 47 + time * 8) % this.canvas.width;
        const ry = (i * 31 + time * 18) % this.canvas.height;
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 5, ry + 15);
      }
      ctx.stroke();

      if (weatherSystem.currentWeather === 'thunderstorm' && Math.random() < 0.02) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
    } else if (weatherSystem.currentWeather === 'snow') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 35; i++) {
        const sx = (i * 53 + Math.sin(time / 20 + i) * 20) % this.canvas.width;
        const sy = (i * 41 + time * 3) % this.canvas.height;
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private renderFloorBadge(floor: number): void {
    const ctx = this.ctx;
    ctx.save();
    const labels: Record<number, string> = {
      '-1': '🏰 Keller (-1)',
      '0': '🏠 Erdgeschoss (EG)',
      '1': '🏢 1. Obergeschoss (1. OG)',
      '2': '🏰 2. Obergeschoss (2. OG)'
    };

    const text = labels[floor] || `Etage ${floor}`;
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(20, 20, 180, 28);
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, 180, 28);

    ctx.fillStyle = '#00e5ff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 110, 34);
    ctx.restore();
  }

  private renderEmergencyDisaster(event: any): void {
    const ctx = this.ctx;
    ctx.save();

    const time = Date.now() / 200;

    if (event.type === 'fire') {
      // Render animated flame particles at kitchen stove area (around grid 10, 4)
      const fireIso = this.gridToIso(10, 4);
      for (let i = 0; i < 5; i++) {
        const fx = fireIso.x + Math.sin(time + i) * 12;
        const fy = fireIso.y - 15 - (i * 8) - Math.abs(Math.cos(time * 2 + i) * 10);
        const radius = 6 + Math.sin(time + i) * 3;

        ctx.fillStyle = i % 2 === 0 ? 'rgba(239, 68, 68, 0.85)' : 'rgba(245, 158, 11, 0.9)';
        ctx.beginPath();
        ctx.arc(fx, fy, Math.max(2, radius), 0, Math.PI * 2);
        ctx.fill();
      }

      // Firefighter Responders at entrance
      const responderIso = this.gridToIso(7, 12);
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🚒', responderIso.x - 24, responderIso.y);
      ctx.fillText('🧯', responderIso.x + 8, responderIso.y - 10);
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('FEUERWEHR', responderIso.x - 8, responderIso.y - 28);
    } else if (event.type === 'burglar') {
      // Burglar with bag
      const thiefIso = this.gridToIso(6, 6);
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🥷', thiefIso.x, thiefIso.y - 12);
      ctx.fillText('💰', thiefIso.x + 12, thiefIso.y - 12);

      // Police Responders at entrance
      const copIso = this.gridToIso(7, 12);
      ctx.font = '22px sans-serif';
      ctx.fillText('🚓', copIso.x - 20, copIso.y);
      ctx.fillText('👮', copIso.x + 10, copIso.y - 10);
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('POLIZEI', copIso.x - 5, copIso.y - 28);
    } else if (event.type === 'ghost') {
      const ghostIso = this.gridToIso(8, 8);
      const gy = ghostIso.y - 20 + Math.sin(time) * 8;
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👻', ghostIso.x, gy);
    }

    ctx.restore();
  }

  private renderDiscoLights(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const time = Date.now() / 300;
    const colors = ['rgba(236, 72, 153, 0.15)', 'rgba(56, 189, 248, 0.15)', 'rgba(168, 85, 247, 0.15)', 'rgba(234, 179, 8, 0.15)'];

    for (let i = 0; i < 4; i++) {
      const angle = time + (i * Math.PI / 2);
      const cx = this.canvas.width / 2 + Math.cos(angle) * (this.canvas.width / 3);
      const cy = this.canvas.height / 2 + Math.sin(angle) * (this.canvas.height / 3);

      const radGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 220);
      radGrad.addColorStop(0, colors[i % colors.length]);
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    ctx.restore();
  }

  private renderRoofStructure(house: House): void {
    const ctx = this.ctx;
    ctx.save();

    // Render roof triangle peak above indoor perimeter (3 to 12)
    const isoNorth = this.gridToIso(3, 3);
    const isoEast = this.gridToIso(12, 3);
    const isoSouth = this.gridToIso(12, 12);
    const isoWest = this.gridToIso(3, 12);

    const roofPeakHeight = 60;
    const isGlass = house.roofStyle === 'skylight' || house.roofStyle === 'glass_roof';

    if (isGlass) {
      // Glass Roof Skylight Rendering
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath();
      ctx.moveTo(isoNorth.x, isoNorth.y - 45);
      ctx.lineTo((isoNorth.x + isoSouth.x) / 2, ((isoNorth.y + isoSouth.y) / 2) - 45 - roofPeakHeight);
      ctx.lineTo(isoWest.x, isoWest.y - 45);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Right slope
      ctx.fillStyle = 'rgba(14, 165, 233, 0.28)';
      ctx.beginPath();
      ctx.moveTo(isoEast.x, isoEast.y - 45);
      ctx.lineTo((isoNorth.x + isoSouth.x) / 2, ((isoNorth.y + isoSouth.y) / 2) - 45 - roofPeakHeight);
      ctx.lineTo(isoSouth.x, isoSouth.y - 45);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      // Mullion Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        const t = i / 4;
        ctx.beginPath();
        ctx.moveTo(isoNorth.x + (isoWest.x - isoNorth.x) * t, (isoNorth.y - 45) + (isoWest.y - isoNorth.y) * t);
        ctx.lineTo(((isoNorth.x + isoSouth.x) / 2) + (isoWest.x - isoNorth.x) * t * 0.5, (((isoNorth.y + isoSouth.y) / 2) - 45 - roofPeakHeight) + (isoWest.y - isoNorth.y) * t * 0.5);
        ctx.stroke();
      }
    } else {
      // Roof Left Slope (Solid)
      ctx.fillStyle = house.roofColor;
      ctx.beginPath();
      ctx.moveTo(isoNorth.x, isoNorth.y - 45);
      ctx.lineTo((isoNorth.x + isoSouth.x) / 2, ((isoNorth.y + isoSouth.y) / 2) - 45 - roofPeakHeight);
      ctx.lineTo(isoWest.x, isoWest.y - 45);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.stroke();

      // Roof Right Slope (Solid)
      ctx.fillStyle = this.adjustColorBrightness(house.roofColor, -25);
      ctx.beginPath();
      ctx.moveTo(isoEast.x, isoEast.y - 45);
      ctx.lineTo((isoNorth.x + isoSouth.x) / 2, ((isoNorth.y + isoSouth.y) / 2) - 45 - roofPeakHeight);
      ctx.lineTo(isoSouth.x, isoSouth.y - 45);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.stroke();
    }

    ctx.restore();
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
