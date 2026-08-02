/**
 * Safe Persistence & LocalStorage Save Manager
 * Handles game state serialization, safe deserialization, and save file import/export.
 */

import { Sim } from '../entity/Sim';
import { House } from '../world/House';
import { CareerManager } from './CareerSystem';
import { Sanitizer } from '../security/Sanitizer';

export interface GameSaveData {
  version: string;
  timestamp: number;
  sim: {
    customization: Sim['customization'];
    gridPos: { x: number; y: number };
    needs: ReturnType<Sim['needs']['getValues']>;
    simoleons: number;
    skills: Sim['skills'];
    lifeStage?: import('../entity/LifeStage').LifeStageType;
    ageDays?: number;
    partnerName?: string;
    childrenNames?: string[];
  };
  house: {
    placedFurniture: House['placedFurniture'];
    tiles?: Array<Array<{
      type: import('../world/House').FloorType;
      color: string;
      hasWallNorth?: boolean;
      hasWallWest?: boolean;
      wallColor?: string;
      openingNorth?: 'door' | 'window';
      openingWest?: 'door' | 'window';
    }>>;
  };
  career: {
    careerId: string;
    rank: number;
  };
  relationships?: Array<{
    targetSimId: string;
    targetSimName: string;
    friendship: number;
    romance: number;
  }>;
  trophiesUnlocked?: string[];
}

export class SaveManager {
  private static readonly SAVE_KEY = 'sims_game_save_v1';

  public static saveGame(sim: Sim, house: House, career: CareerManager, npcManager?: import('../entity/NPCManager').NPCManager, partyManager?: import('../systems/PartyManager').PartyManager): boolean {
    try {
      const saveData: GameSaveData = {
        version: '1.0.0',
        timestamp: Date.now(),
        sim: {
          customization: sim.customization,
          gridPos: sim.gridPos,
          needs: sim.needs.getValues(),
          simoleons: sim.simoleons,
          skills: sim.skills,
          lifeStage: sim.lifeStage,
          ageDays: sim.ageDays,
          partnerName: sim.partnerName,
          childrenNames: sim.childrenNames
        },
        house: {
          placedFurniture: house.placedFurniture,
          tiles: house.tiles.map(row => row.map(tile => ({
            type: tile.type,
            color: tile.color,
            hasWallNorth: tile.hasWallNorth,
            hasWallWest: tile.hasWallWest,
            wallColor: tile.wallColor,
            openingNorth: tile.openingNorth,
            openingWest: tile.openingWest
          })))
        },
        career: {
          careerId: career.currentCareerId,
          rank: career.currentRank
        },
        relationships: npcManager?.npcs.map(n => ({
          targetSimId: n.id,
          targetSimName: n.name,
          friendship: n.relationship.friendship,
          romance: n.relationship.romance
        })),
        trophiesUnlocked: partyManager?.trophiesUnlocked
      };

      const jsonStr = JSON.stringify(saveData);
      localStorage.setItem(this.SAVE_KEY, jsonStr);
      return true;
    } catch (e) {
      console.error('[SaveManager] Error saving game:', e);
      return false;
    }
  }

  public static loadGame(sim: Sim, house: House, career: CareerManager, npcManager?: import('../entity/NPCManager').NPCManager, partyManager?: import('../systems/PartyManager').PartyManager): boolean {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (!raw) return false;

      const data = Sanitizer.safeJSONParse<GameSaveData | null>(raw, null);
      if (!data || !data.sim || !data.house) return false;

      // Restore Sim
      sim.customization = {
        name: Sanitizer.sanitizeText(data.sim.customization.name, 24),
        gender: data.sim.customization.gender,
        skinColor: data.sim.customization.skinColor,
        hairColor: data.sim.customization.hairColor,
        outfitColor: data.sim.customization.outfitColor,
        trait: Sanitizer.sanitizeText(data.sim.customization.trait, 30),
        aspiration: Sanitizer.sanitizeText(data.sim.customization.aspiration, 30)
      };

      sim.gridPos = data.sim.gridPos || { x: 5, y: 5 };
      sim.renderPos = { x: sim.gridPos.x, y: sim.gridPos.y };
      sim.simoleons = Sanitizer.clamp(data.sim.simoleons, 0, 999999);

      if (data.sim.needs) {
        Object.entries(data.sim.needs).forEach(([k, val]) => {
          sim.needs.modify(k as any, val - sim.needs.getValues()[k as keyof typeof data.sim.needs]);
        });
      }

      if (data.sim.skills) {
        sim.skills = data.sim.skills;
      }

      if (data.sim.lifeStage) {
        sim.lifeStage = data.sim.lifeStage;
      }
      if (typeof data.sim.ageDays === 'number') {
        sim.ageDays = data.sim.ageDays;
      }
      if (data.sim.partnerName) {
        sim.partnerName = Sanitizer.sanitizeText(data.sim.partnerName, 24);
      }
      if (Array.isArray(data.sim.childrenNames)) {
        sim.childrenNames = data.sim.childrenNames.map(c => Sanitizer.sanitizeText(c, 24));
      }

      // Restore House furniture & tiles
      if (Array.isArray(data.house.placedFurniture)) {
        house.placedFurniture = data.house.placedFurniture;
      }

      if (Array.isArray(data.house.tiles)) {
        data.house.tiles.forEach((row, x) => {
          if (Array.isArray(row)) {
            row.forEach((savedTile, y) => {
              if (house.tiles[x] && house.tiles[x][y]) {
                house.tiles[x][y].type = savedTile.type || 'grass';
                house.tiles[x][y].color = savedTile.color || '#27ae60';
                house.tiles[x][y].hasWallNorth = savedTile.hasWallNorth;
                house.tiles[x][y].hasWallWest = savedTile.hasWallWest;
                house.tiles[x][y].wallColor = savedTile.wallColor;
                house.tiles[x][y].openingNorth = savedTile.openingNorth;
                house.tiles[x][y].openingWest = savedTile.openingWest;
              }
            });
          }
        });
      }

      // Restore Career
      if (data.career) {
        career.currentCareerId = data.career.careerId || 'tech_guru';
        career.currentRank = data.career.rank || 1;
      }

      // Restore Relationships
      if (data.relationships && npcManager) {
        data.relationships.forEach(r => {
          const npc = npcManager.npcs.find(n => n.id === r.targetSimId);
          if (npc) {
            npc.relationship.friendship = Sanitizer.clamp(r.friendship, 0, 100);
            npc.relationship.romance = Sanitizer.clamp(r.romance, 0, 100);
          }
        });
      }

      // Restore Trophies
      if (Array.isArray(data.trophiesUnlocked) && partyManager) {
        partyManager.trophiesUnlocked = data.trophiesUnlocked;
      }

      return true;
    } catch (e) {
      console.error('[SaveManager] Error loading game:', e);
      return false;
    }
  }

  public static exportSaveFile(): string {
    const raw = localStorage.getItem(this.SAVE_KEY);
    return raw || '';
  }
}
