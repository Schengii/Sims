/**
 * Sim Wardrobe & Outfit System
 * Manages 5 outfit categories (Everyday, Formal, Sleepwear, Party, Swimwear) with instant Canvas visual color updates.
 */

export type OutfitCategory = 'everyday' | 'formal' | 'sleepwear' | 'party' | 'swimwear';

export interface Outfit {
  category: OutfitCategory;
  name: string;
  color: string;
  icon: string;
}

export class WardrobeManager {
  public activeCategory: OutfitCategory = 'everyday';
  public outfits: Record<OutfitCategory, Outfit> = {
    everyday: { category: 'everyday', name: 'Alltagskleidung', color: '#e74c3c', icon: '👕' },
    formal: { category: 'formal', name: 'Abendgarderobe', color: '#2c3e50', icon: '👔' },
    sleepwear: { category: 'sleepwear', name: 'Schlafanzug', color: '#9b59b6', icon: '🥼' },
    party: { category: 'party', name: 'Party-Dress', color: '#f1c40f', icon: '👗' },
    swimwear: { category: 'swimwear', name: 'Badekleidung', color: '#3498db', icon: '🩱' }
  };

  public setOutfitColor(category: OutfitCategory, color: string): void {
    if (this.outfits[category]) {
      this.outfits[category].color = color;
    }
  }

  public switchCategory(category: OutfitCategory): Outfit {
    this.activeCategory = category;
    return this.outfits[category];
  }
}
