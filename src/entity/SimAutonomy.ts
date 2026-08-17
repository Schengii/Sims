/**
 * Sim Autonomy Engine
 * Automatically triggers actions for the Sim when idle if needs drop below critical thresholds.
 * v18: Social autonomy case added. Sims now seek social interaction autonomously.
 */

import type { Sim } from './Sim';
import type { House } from '../world/House';
import { Pathfinding } from '../world/Pathfinding';
import { FURNITURE_CATALOG } from '../world/Furniture';

export class SimAutonomy {
  private static cooldownSec: number = 0;

  public static update(sim: Sim, house: House, deltaSec: number): void {
    if (this.cooldownSec > 0) {
      this.cooldownSec -= deltaSec;
      return;
    }

    // Only run autonomy if Sim is completely idle (no active action queue & no current path)
    if (sim.actionQueue.getQueueLength() > 0 || sim.currentPath.length > 0 || sim.animState === 'acting') {
      return;
    }

    // Fainting sims can't perform autonomous actions
    if (sim.isFainting) return;

    const lowest = sim.needs.getLowestNeed();
    if (lowest.value >= 55) {
      // Needs are sufficiently high, no autonomous action required
      return;
    }

    // Map needed category to target furniture ID prefix or type
    let targetFurnitureIds: string[] = [];
    if (lowest.need === 'energy') {
      targetFurnitureIds = ['bed_basic', 'sofa_luxury'];
    } else if (lowest.need === 'hunger') {
      targetFurnitureIds = ['fridge_modern', 'party_buffet'];
    } else if (lowest.need === 'bladder') {
      targetFurnitureIds = ['toilet_deluxe'];
    } else if (lowest.need === 'hygiene') {
      targetFurnitureIds = ['shower_glass', 'pool_ladder'];
    } else if (lowest.need === 'fun') {
      targetFurnitureIds = ['tv_smart', 'pc_station', 'stereo_hifi', 'easel_artist'];
    } else if (lowest.need === 'social') {
      // Bug #4 fix: Social autonomy — sim moves toward stereo or phone to initiate contact
      // Try furniture that boosts social (stereo for dancing) first
      targetFurnitureIds = ['stereo_hifi', 'pc_station'];
      // Note: NPC interaction is triggered via NPCAutonomy; here we boost fun via social furniture
    }

    if (targetFurnitureIds.length === 0) return;

    // Find nearest placed furniture matching targets
    let nearestFurniture: { furnitureId: string; gridX: number; gridY: number } | null = null;
    let shortestDist = Infinity;

    for (const item of house.placedFurniture) {
      if (targetFurnitureIds.includes(item.furnitureId)) {
        const dist = Math.abs(item.gridX - sim.gridPos.x) + Math.abs(item.gridY - sim.gridPos.y);
        if (dist < shortestDist) {
          shortestDist = dist;
          nearestFurniture = item;
        }
      }
    }

    if (!nearestFurniture) return;

    const def = FURNITURE_CATALOG[nearestFurniture.furnitureId];
    if (!def || def.interactions.length === 0) return;

    // For social need, prefer interactions that boost social need
    let interaction = def.interactions[0]; // Primary interaction
    if (lowest.need === 'social') {
      const socialInteraction = def.interactions.find(i => i.needEffects?.social && i.needEffects.social > 0);
      if (socialInteraction) interaction = socialInteraction;
    }

    // Plan path to furniture
    const path = Pathfinding.findPath(
      sim.gridPos,
      { x: nearestFurniture.gridX, y: nearestFurniture.gridY },
      house.width,
      house.height,
      (x, y) => house.isWalkable(x, y)
    );

    if (path.length > 0) {
      sim.setPath(path);
      sim.actionQueue.enqueue({
        id: `auto_${Date.now()}`,
        name: `[Autonomie] ${interaction.label}`,
        icon: interaction.icon,
        durationSeconds: interaction.duration,
        elapsedSeconds: 0,
        onComplete: () => {
          Object.entries(interaction.needEffects).forEach(([needKey, val]) => {
            if (val) sim.needs.modify(needKey as any, val);
          });
          // Small social boost from autonomous social action
          if (lowest.need === 'social') {
            sim.needs.modify('social', 15);
          }
        }
      });
      // Set a short cooldown before next autonomy check
      this.cooldownSec = 8;
    }
  }
}
