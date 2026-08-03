/**
 * Pet Autonomy Engine
 * Controls autonomous behavior for dogs and cats when idle.
 */

import type { Pet } from './Pet';
import type { House } from '../world/House';
import { Pathfinding } from '../world/Pathfinding';

export class PetAutonomy {
  public static update(pet: Pet, house: House, _deltaSec: number): void {
    if (pet.currentPath.length > 0 || pet.animState === 'acting') {
      return;
    }

    const lowest = pet.needs.getLowestNeed();
    if (lowest.value >= 50) {
      // Pet wanders randomly around the house occasionally
      if (Math.random() < 0.005) {
        const randX = Math.floor(Math.random() * 10) + 3;
        const randY = Math.floor(Math.random() * 10) + 3;

        const path = Pathfinding.findPath(
          pet.gridPos,
          { x: randX, y: randY },
          house.width,
          house.height,
          (x, y) => house.isWalkable(x, y)
        );
        pet.setPath(path);
      }
      return;
    }

    // Map need to target furniture item
    let targetFurnitureIds: string[] = [];
    if (lowest.need === 'hunger') {
      targetFurnitureIds = ['pet_bowl', 'fridge_modern'];
    } else if (lowest.need === 'energy') {
      targetFurnitureIds = ['pet_bed', 'sofa_luxury', 'bed_basic'];
    } else if (lowest.need === 'play') {
      targetFurnitureIds = ['cat_tree', 'pet_toy'];
    }

    if (targetFurnitureIds.length === 0) return;

    let nearest: { gridX: number; gridY: number } | null = null;
    let minDist = Infinity;

    for (const item of house.placedFurniture) {
      if (targetFurnitureIds.includes(item.furnitureId)) {
        const dist = Math.abs(item.gridX - pet.gridPos.x) + Math.abs(item.gridY - pet.gridPos.y);
        if (dist < minDist) {
          minDist = dist;
          nearest = item;
        }
      }
    }

    if (nearest) {
      const path = Pathfinding.findPath(
        pet.gridPos,
        { x: nearest.gridX, y: nearest.gridY },
        house.width,
        house.height,
        (x, y) => house.isWalkable(x, y)
      );

      if (path.length > 0) {
        pet.setPath(path);
        // Satisfy need slightly when reaching target
        pet.needs.modify(lowest.need, 40);
        pet.triggerEmote(pet.species === 'dog' ? '🐶' : '🐱', 3000);
      }
    }
  }
}
