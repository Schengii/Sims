/**
 * GOAPAutonomy - Goal-Oriented Action Planner & Schedule Engine
 * Implements multi-step action chains (e.g. Cook & Eat -> Clean Up, Work -> Shower -> Relax)
 * and rich Townie NPC routines based on time of day.
 */

import type { Sim } from './Sim';
import type { NPCSim } from './NPCManager';
import type { House } from '../world/House';
import { Pathfinding } from '../world/Pathfinding';

export interface ActionPlanStep {
  targetFurnitureId: string[];
  actionName: string;
  actionIcon: string;
  durationSeconds: number;
  needEffects: Partial<Record<'hunger' | 'energy' | 'hygiene' | 'bladder' | 'fun' | 'social', number>>;
}

export class GOAPAutonomy {
  /**
   * Plans and executes multi-step chains for a Sim when idle.
   */
  public static planAndExecute(sim: Sim, house: House): boolean {
    if (sim.actionQueue.getQueueLength() > 0 || sim.currentPath.length > 0 || sim.isFainting) {
      return false;
    }

    const lowest = sim.needs.getLowestNeed();
    if (lowest.value >= 50) return false;

    const plan = this.getPlanForNeed(lowest.need);
    if (!plan || plan.length === 0) return false;

    // Try to enqueue steps in sequence
    let firstPathFound = false;

    for (let i = 0; i < plan.length; i++) {
      const step = plan[i];
      const targetFurniture = this.findNearestFurniture(house, sim.gridPos, step.targetFurnitureId);
      if (!targetFurniture) continue;

      if (i === 0) {
        const path = Pathfinding.findPath(
          sim.gridPos,
          { x: targetFurniture.gridX, y: targetFurniture.gridY },
          house.width,
          house.height,
          (x, y) => house.isWalkable(x, y)
        );

        if (path.length > 0) {
          sim.setPath(path);
          firstPathFound = true;
        }
      }

      sim.actionQueue.enqueue({
        id: `goap_${Date.now()}_${i}`,
        name: `[GOAP] ${step.actionName}`,
        icon: step.actionIcon,
        durationSeconds: step.durationSeconds,
        elapsedSeconds: 0,
        onComplete: () => {
          Object.entries(step.needEffects).forEach(([needKey, val]) => {
            if (val) sim.needs.modify(needKey as any, val);
          });
        }
      });
    }

    return firstPathFound;
  }

  /**
   * Evaluates routine schedules for Townie NPCs based on time of day (0-24h).
   */
  public static evaluateNPCRoutine(_npc: NPCSim, timeOfDay: number): { routine: string; emote: string } {
    if (timeOfDay >= 6 && timeOfDay < 9) {
      return { routine: 'Morgen-Jogging & Fitness', emote: '🏃' };
    } else if (timeOfDay >= 9 && timeOfDay < 17) {
      return { routine: 'Auf der Arbeit / Universität', emote: '💼' };
    } else if (timeOfDay >= 17 && timeOfDay < 21) {
      return { routine: 'Freizeit & Freunde treffen', emote: '🎉' };
    } else {
      return { routine: 'Schlafenszeit & Erholung', emote: '💤' };
    }
  }

  private static getPlanForNeed(need: string): ActionPlanStep[] {
    switch (need) {
      case 'hunger':
        return [
          {
            targetFurnitureId: ['fridge_modern', 'party_buffet'],
            actionName: 'Zutaten holen & Snack kochen',
            actionIcon: '🍳',
            durationSeconds: 4,
            needEffects: { hunger: 25, fun: 5 }
          },
          {
            targetFurnitureId: ['chair_dining', 'sofa_luxury'],
            actionName: 'Mahlzeit in Ruhe genießen',
            actionIcon: '🍽️',
            durationSeconds: 4,
            needEffects: { hunger: 35, fun: 5 }
          }
        ];
      case 'energy':
        return [
          {
            targetFurnitureId: ['bed_basic', 'sofa_luxury'],
            actionName: 'Tiefschlaf & Energietanken',
            actionIcon: '💤',
            durationSeconds: 8,
            needEffects: { energy: 70 }
          }
        ];
      case 'hygiene':
        return [
          {
            targetFurnitureId: ['shower_glass', 'pool_ladder'],
            actionName: 'Erfrischende Dusche nehmen',
            actionIcon: '🚿',
            durationSeconds: 5,
            needEffects: { hygiene: 60 }
          }
        ];
      case 'bladder':
        return [
          {
            targetFurnitureId: ['toilet_deluxe'],
            actionName: 'Toilette benutzen & Hände waschen',
            actionIcon: '🚽',
            durationSeconds: 3,
            needEffects: { bladder: 80, hygiene: 10 }
          }
        ];
      case 'fun':
        return [
          {
            targetFurnitureId: ['tv_smart', 'pc_station', 'stereo_hifi', 'easel_artist'],
            actionName: 'Lieblingsserie schauen & Zocken',
            actionIcon: '🎮',
            durationSeconds: 6,
            needEffects: { fun: 45 }
          }
        ];
      case 'social':
        return [
          {
            targetFurnitureId: ['stereo_hifi', 'party_buffet', 'pc_station'],
            actionName: 'Socializing & Musik hören',
            actionIcon: '💬',
            durationSeconds: 5,
            needEffects: { social: 40, fun: 15 }
          }
        ];
      default:
        return [];
    }
  }

  private static findNearestFurniture(
    house: House,
    pos: { x: number; y: number },
    targetIds: string[]
  ): { furnitureId: string; gridX: number; gridY: number } | null {
    let nearest: { furnitureId: string; gridX: number; gridY: number } | null = null;
    let minDist = Infinity;

    for (const item of house.placedFurniture) {
      if (targetIds.includes(item.furnitureId)) {
        const dist = Math.abs(item.gridX - pos.x) + Math.abs(item.gridY - pos.y);
        if (dist < minDist) {
          minDist = dist;
          nearest = item;
        }
      }
    }

    return nearest;
  }
}
