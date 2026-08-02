/**
 * NPC Townies & Visitor Manager
 * Handles spawning, movement, emotes, and relationship states for non-player Sims in the neighborhood.
 */

import type { Point } from '../world/Pathfinding';
import { Relationship } from './Relationship';
import { Sanitizer } from '../security/Sanitizer';

export interface NPCSim {
  id: string;
  name: string;
  skinColor: string;
  hairColor: string;
  outfitColor: string;
  trait: string;
  gridPos: Point;
  renderPos: { x: number; y: number };
  targetPath: Point[];
  activeEmote?: { symbol: string; expiresAt: number };
  relationship: Relationship;
}

export class NPCManager {
  public npcs: NPCSim[] = [];

  constructor() {
    this.spawnInitialTownies();
  }

  private spawnInitialTownies(): void {
    const presetTownies = [
      { id: 'npc_mortimer', name: 'Mortimer Goth', skinColor: '#f1c27d', hairColor: '#1a1a1a', outfitColor: '#8e44ad', trait: 'Aristokratisch', pos: { x: 2, y: 5 } },
      { id: 'npc_penny', name: 'Penny Pizazz', skinColor: '#e0ac69', hairColor: '#e67e22', outfitColor: '#e74c3c', trait: 'Party-Lover', pos: { x: 13, y: 5 } },
      { id: 'npc_bob', name: 'Bob Pancakes', skinColor: '#ffdbac', hairColor: '#7f8c8d', outfitColor: '#34495e', trait: 'Vielfraß', pos: { x: 2, y: 12 } },
      { id: 'npc_eliza', name: 'Eliza Pancakes', skinColor: '#f1c27d', hairColor: '#d35400', outfitColor: '#27ae60', trait: 'Perfektionistin', pos: { x: 13, y: 12 } }
    ];

    presetTownies.forEach(t => {
      this.npcs.push({
        id: t.id,
        name: Sanitizer.sanitizeText(t.name, 24),
        skinColor: t.skinColor,
        hairColor: t.hairColor,
        outfitColor: t.outfitColor,
        trait: t.trait,
        gridPos: t.pos,
        renderPos: { x: t.pos.x, y: t.pos.y },
        targetPath: [],
        relationship: new Relationship(t.id, t.name, 25, 0)
      });
    });
  }

  public update(deltaSec: number): void {
    const now = Date.now();

    this.npcs.forEach(npc => {
      // 1. Expire emotes
      if (npc.activeEmote && now > npc.activeEmote.expiresAt) {
        npc.activeEmote = undefined;
      }

      // 2. Walk along path
      if (npc.targetPath.length > 0) {
        const target = npc.targetPath[0];
        const speed = 2.5 * deltaSec;

        const dx = target.x - npc.renderPos.x;
        const dy = target.y - npc.renderPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= speed) {
          npc.renderPos.x = target.x;
          npc.renderPos.y = target.y;
          npc.gridPos = { x: target.x, y: target.y };
          npc.targetPath.shift();
        } else {
          npc.renderPos.x += (dx / dist) * speed;
          npc.renderPos.y += (dy / dist) * speed;
        }
      } else {
        // Occasionally wander around neighborhood outdoor grid
        if (Math.random() < 0.002) {
          const randomX = Math.floor(Math.random() * 14) + 1;
          const randomY = Math.floor(Math.random() * 14) + 1;
          npc.targetPath = [{ x: randomX, y: randomY }];
        }
      }
    });
  }

  public triggerEmote(npcId: string, emoteSymbol: string, durationMs: number = 3000): void {
    const npc = this.npcs.find(n => n.id === npcId);
    if (npc) {
      npc.activeEmote = {
        symbol: emoteSymbol,
        expiresAt: Date.now() + durationMs
      };
    }
  }

  public getNPCAt(gridX: number, gridY: number): NPCSim | null {
    for (const npc of this.npcs) {
      const dist = Math.sqrt(Math.pow(npc.gridPos.x - gridX, 2) + Math.pow(npc.gridPos.y - gridY, 2));
      if (dist < 1.2) {
        return npc;
      }
    }
    return null;
  }
}
