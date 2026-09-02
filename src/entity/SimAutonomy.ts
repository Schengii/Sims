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
  public static update(sim: Sim, house: House, deltaSec: number): void {
    if (sim.autonomyCooldownSec > 0) {
      sim.autonomyCooldownSec -= deltaSec;
      return;
    }

    // Only run autonomy if Sim is completely idle (no active action queue & no current path)
    if (sim.actionQueue.getQueueLength() > 0 || sim.currentPath.length > 0 || sim.animState === 'acting') {
      return;
    }

    // Fainting sims can't perform autonomous actions
    if (sim.isFainting) return;

    const lowest = sim.needs.getLowestNeed();
    const traits = sim.getActiveTraitIds();

    // Trait-based threshold adjustments
    let threshold = 55;
    if (traits.includes('lazy') && lowest.need === 'energy') threshold = 68; // Lazy sims want to rest earlier
    if (traits.includes('glutton') && lowest.need === 'hunger') threshold = 70; // Glutton sims eat sooner
    if (traits.includes('creative') && lowest.need === 'fun') threshold = 65;

    if (lowest.value >= threshold) {
      // Needs are sufficiently high, no autonomous action required
      return;
    }

    // Map needed category to target furniture ID prefix or type
    let targetFurnitureIds: string[] = [];
    if (lowest.need === 'energy') {
      targetFurnitureIds = traits.includes('lazy') ? ['sofa_luxury', 'bed_basic'] : ['bed_basic', 'sofa_luxury'];
    } else if (lowest.need === 'hunger') {
      targetFurnitureIds = ['fridge_modern', 'party_buffet'];
    } else if (lowest.need === 'bladder') {
      targetFurnitureIds = ['toilet_deluxe'];
    } else if (lowest.need === 'hygiene') {
      targetFurnitureIds = ['shower_glass', 'pool_ladder'];
    } else if (lowest.need === 'fun') {
      if (traits.includes('genius') || traits.includes('geek')) {
        targetFurnitureIds = ['pc_station', 'tv_smart', 'easel_artist', 'stereo_hifi'];
      } else if (traits.includes('creative')) {
        targetFurnitureIds = ['easel_artist', 'stereo_hifi', 'tv_smart', 'pc_station'];
      } else if (traits.includes('athletic')) {
        targetFurnitureIds = ['pool_ladder', 'stereo_hifi', 'tv_smart'];
      } else {
        targetFurnitureIds = ['tv_smart', 'pc_station', 'stereo_hifi', 'easel_artist'];
      }
    } else if (lowest.need === 'social') {
      targetFurnitureIds = ['stereo_hifi', 'pc_station', 'party_buffet'];
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
          if (lowest.need === 'social') {
            sim.needs.modify('social', 15);
          }
        }
      });
      // Set a cooldown on this specific Sim
      sim.autonomyCooldownSec = 7;
    }
  }
}
