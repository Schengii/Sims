/**
 * Genetics & Inheritance System
 * Handles procedural blending of parent genetics (skin color, hair color, eye/outfit colors,
 * inherited skill potentials, and personality traits) for newborn/growing Sims.
 */

import type { SimCustomization } from './Sim';

export interface SimDNA {
  skinColor: string;
  hairColor: string;
  eyeColor: string;
  outfitColor: string;
  inheritedTraits: string[];
  skillPotentialBoosts: Record<string, number>;
}

export class GeneticsEngine {
  /**
   * Blends RGB/HSL colors of two parents with a slight random mutation chance.
   */
  public static blendColor(color1: string, color2: string, mutationRate: number = 0.15): string {
    const rgb1 = this.hexToRgb(color1) || { r: 200, g: 150, b: 120 };
    const rgb2 = this.hexToRgb(color2) || { r: 210, g: 160, b: 130 };

    // Blend ratio 40% - 60%
    const ratio = 0.4 + Math.random() * 0.2;
    let r = Math.round(rgb1.r * ratio + rgb2.r * (1 - ratio));
    let g = Math.round(rgb1.g * ratio + rgb2.g * (1 - ratio));
    let b = Math.round(rgb1.b * ratio + rgb2.b * (1 - ratio));

    // Mutation chance
    if (Math.random() < mutationRate) {
      const shift = (Math.random() - 0.5) * 30;
      r = Math.min(255, Math.max(0, Math.round(r + shift)));
      g = Math.min(255, Math.max(0, Math.round(g + shift)));
      b = Math.min(255, Math.max(0, Math.round(b + shift)));
    }

    return this.rgbToHex(r, g, b);
  }

  /**
   * Generates inherited DNA from two parent Sim customizations.
   */
  public static createOffspringDNA(parent1: SimCustomization, parent2: SimCustomization): SimDNA {
    const skinColor = this.blendColor(parent1.skinColor, parent2.skinColor, 0.1);
    const hairColor = Math.random() < 0.5 ? parent1.hairColor : parent2.hairColor;
    const outfitColor = Math.random() < 0.5 ? parent1.outfitColor : parent2.outfitColor;

    // Inherit trait or pick random
    const traitsPool = [parent1.trait, parent2.trait, 'Kreativ', 'Genial', 'Aktiv', 'Tierliebhaber'];
    const inheritedTrait = traitsPool[Math.floor(Math.random() * traitsPool.length)];

    return {
      skinColor,
      hairColor,
      eyeColor: '#2c3e50',
      outfitColor,
      inheritedTraits: [inheritedTrait],
      skillPotentialBoosts: {
        cooking: Math.random() < 0.3 ? 1.2 : 1.0,
        programming: Math.random() < 0.3 ? 1.2 : 1.0,
        painting: Math.random() < 0.3 ? 1.2 : 1.0,
        fitness: Math.random() < 0.3 ? 1.2 : 1.0,
        charisma: Math.random() < 0.3 ? 1.2 : 1.0,
      }
    };
  }

  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length === 6) {
      return {
        r: parseInt(cleanHex.substring(0, 2), 16),
        g: parseInt(cleanHex.substring(2, 4), 16),
        b: parseInt(cleanHex.substring(4, 6), 16),
      };
    }
    return null;
  }

  private static rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
}
