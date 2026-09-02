/**
 * Botany & Greenhouse Crossbreeding Engine
 * Manages plant grafting, rare hybrid botany, greenhouse winter protection, and bio-fertilizer boosts.
 */

import { type CropType } from '../world/GardenSystem';

export interface HybridRecipe {
  parentA: CropType;
  parentB: CropType;
  resultCrop: CropType;
  resultName: string;
  resultIcon: string;
  resultValue: number;
  description: string;
}

export const HYBRID_RECIPES: HybridRecipe[] = [
  {
    parentA: 'tomatoes',
    parentB: 'strawberries',
    resultCrop: 'dragonfruit',
    resultName: 'Drachenfrucht-Samen',
    resultIcon: '🐉',
    resultValue: 350,
    description: 'Exotische, schimmernde Drachenfrucht mit fantastischem Marktwert.'
  },
  {
    parentA: 'dragonfruit',
    parentB: 'flowers',
    resultCrop: 'money_tree',
    resultName: 'Geldbaum-Samen',
    resultIcon: '💸',
    resultValue: 500,
    description: 'Legendärer Baum, an dem echte Simoleons wachsen.'
  },
  {
    parentA: 'flowers',
    parentB: 'strawberries',
    resultCrop: 'orchid',
    resultName: 'Edle Orchidee',
    resultIcon: '🌺',
    resultValue: 280,
    description: 'Wunderschöne seltene Blüte mit starker aromatischer Duft-Aura.'
  }
];

export class BotanyGreenhouseSystem {
  public discoveredHybrids: string[] = [];
  public fertilizerInventory: Record<'compost' | 'fish_fertilizer' | 'crystal_powder', number> = {
    compost: 3,
    fish_fertilizer: 2,
    crystal_powder: 1
  };

  /**
   * Splicing & Grafting 2 parent crops together
   */
  public spliceCrops(cropA: CropType, cropB: CropType): HybridRecipe | null {
    const match = HYBRID_RECIPES.find(
      r => (r.parentA === cropA && r.parentB === cropB) || (r.parentA === cropB && r.parentB === cropA)
    );

    if (match) {
      if (!this.discoveredHybrids.includes(match.resultCrop)) {
        this.discoveredHybrids.push(match.resultCrop);
      }
      return match;
    }
    return null;
  }

  public applyFertilizer(fertilizerType: 'compost' | 'fish_fertilizer' | 'crystal_powder'): { speedBoost: number; valueMultiplier: number } | null {
    if ((this.fertilizerInventory[fertilizerType] || 0) <= 0) return null;

    this.fertilizerInventory[fertilizerType] -= 1;

    switch (fertilizerType) {
      case 'compost': return { speedBoost: 1.5, valueMultiplier: 1.2 };
      case 'fish_fertilizer': return { speedBoost: 1.8, valueMultiplier: 1.6 };
      case 'crystal_powder': return { speedBoost: 3.0, valueMultiplier: 2.0 };
    }
  }

  public exportData(): Record<string, any> {
    return {
      discoveredHybrids: this.discoveredHybrids,
      fertilizerInventory: this.fertilizerInventory
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.discoveredHybrids) this.discoveredHybrids = data.discoveredHybrids;
    if (data.fertilizerInventory) this.fertilizerInventory = data.fertilizerInventory;
  }
}
