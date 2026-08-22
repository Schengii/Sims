/**
 * EnvironmentScoring System
 * Evaluates the aesthetic and hygienic quality of the room/tile a Sim is in,
 * granting realistic environment moodlets ("Luxuriöse Umgebung", "Schön dekoriert", "Dreckiger Raum").
 */

import { House } from './House';
import { FURNITURE_CATALOG } from './Furniture';

export interface RoomScoreResult {
  score: number;
  tier: 'filthy' | 'poor' | 'neutral' | 'nice' | 'luxurious';
  moodletTitle?: string;
  moodletEffect?: { mood: string; value: number };
}

export class EnvironmentScoring {
  /**
   * Calculates the environment score of a 5x5 tile neighborhood around (gridX, gridY).
   */
  public static evaluateArea(house: House, gridX: number, gridY: number): RoomScoreResult {
    let score = 0;
    const radius = 2; // 5x5 area around the Sim

    const minX = Math.max(0, Math.floor(gridX) - radius);
    const maxX = Math.min(house.width - 1, Math.floor(gridX) + radius);
    const minY = Math.max(0, Math.floor(gridY) - radius);
    const maxY = Math.min(house.height - 1, Math.floor(gridY) + radius);

    // 1. Evaluate Floor Tiles
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const tile = house.tiles[x]?.[y];
        if (!tile) continue;

        if (tile.type === 'wood') score += 2;
        else if (tile.type === 'marble') score += 4;
        else if (tile.type === 'carpet') score += 2;
        else if (tile.type === 'pool') score += 3;
      }
    }

    // 2. Evaluate Furniture & Decor in Range
    house.placedFurniture.forEach(item => {
      if (item.gridX >= minX && item.gridX <= maxX && item.gridY >= minY && item.gridY <= maxY) {
        const def = FURNITURE_CATALOG[item.furnitureId];
        if (def) {
          // Luxury/High-end items
          if (def.price >= 800) score += 6;
          else if (def.price >= 300) score += 3;
          else score += 1;

          // Special aesthetic items
          const id = def.id.toLowerCase();
          if (id.includes('plant') || id.includes('pflanze') || id.includes('staffelei') || id.includes('art') || id.includes('photo')) {
            score += 5;
          }
          if (id.includes('kamin') || id.includes('fireplace') || id.includes('piano') || id.includes('whirlpool')) {
            score += 8;
          }
          if (id.includes('lamp') || id.includes('light')) {
            score += 3;
          }
        }
      }
    });

    // 3. Determine Tier & Moodlet
    if (score >= 35) {
      return {
        score,
        tier: 'luxurious',
        moodletTitle: '💎 Luxuriöse Umgebung',
        moodletEffect: { mood: 'happy', value: 2 }
      };
    } else if (score >= 18) {
      return {
        score,
        tier: 'nice',
        moodletTitle: '🌿 Schön dekoriert',
        moodletEffect: { mood: 'happy', value: 1 }
      };
    } else if (score <= -10) {
      return {
        score,
        tier: 'filthy',
        moodletTitle: '🤢 Unordentlicher Raum',
        moodletEffect: { mood: 'uncomfortable', value: -2 }
      };
    }

    return {
      score,
      tier: 'neutral'
    };
  }
}
