/**
 * Multi-Generational Genetics & Phenotype Inheritance Engine
 * Implements Mendelian & polygenic trait inheritance (dominant/recessive alleles,
 * eye colors, hair colors, skin tone blending, and multi-generational pedigree tracking).
 */

import type { SimCustomization } from './Sim';

export type AlleleType = 'dominant' | 'recessive';

export interface GeneAllele {
  trait: string;
  type: AlleleType;
  colorCode: string;
}

export interface SimDNA {
  skinColor: string;
  hairColor: string;
  hairAllele: GeneAllele;
  eyeColor: string;
  eyeAllele: GeneAllele;
  outfitColor: string;
  generation: number;
  inheritedTraits: string[];
  ancestors: string[];
  skillPotentialBoosts: Record<string, number>;
}

export class GeneticsEngine {
  // Dominant & Recessive Gene Pool
  public static readonly EYE_ALLELES: GeneAllele[] = [
    { trait: 'Braun', type: 'dominant', colorCode: '#5c3a21' },
    { trait: 'Dunkelbraun', type: 'dominant', colorCode: '#2e1c0c' },
    { trait: 'Grün', type: 'recessive', colorCode: '#2e7d32' },
    { trait: 'Blau', type: 'recessive', colorCode: '#1976d2' },
    { trait: 'Grau', type: 'recessive', colorCode: '#78909c' }
  ];

  public static readonly HAIR_ALLELES: GeneAllele[] = [
    { trait: 'Schwarz', type: 'dominant', colorCode: '#1a1a1a' },
    { trait: 'Dunkelbraun', type: 'dominant', colorCode: '#4a2e18' },
    { trait: 'Blond', type: 'recessive', colorCode: '#f1c40f' },
    { trait: 'Rot', type: 'recessive', colorCode: '#c0392b' },
    { trait: 'Kastanienbraun', type: 'dominant', colorCode: '#795548' }
  ];

  /**
   * Blends RGB colors of two parents with a slight random mutation chance.
   */
  public static blendColor(color1: string, color2: string, mutationRate: number = 0.12): string {
    const rgb1 = this.hexToRgb(color1) || { r: 200, g: 150, b: 120 };
    const rgb2 = this.hexToRgb(color2) || { r: 210, g: 160, b: 130 };

    const ratio = 0.35 + Math.random() * 0.3;
    let r = Math.round(rgb1.r * ratio + rgb2.r * (1 - ratio));
    let g = Math.round(rgb1.g * ratio + rgb2.g * (1 - ratio));
    let b = Math.round(rgb1.b * ratio + rgb2.b * (1 - ratio));

    if (Math.random() < mutationRate) {
      const shift = (Math.random() - 0.5) * 25;
      r = Math.min(255, Math.max(0, Math.round(r + shift)));
      g = Math.min(255, Math.max(0, Math.round(g + shift)));
      b = Math.min(255, Math.max(0, Math.round(b + shift)));
    }

    return this.rgbToHex(r, g, b);
  }

  /**
   * Selects an expressed allele from two parent genes according to Mendelian dominance.
   */
  public static resolveAllele(allele1: GeneAllele, allele2: GeneAllele): GeneAllele {
    if (allele1.type === 'dominant' && allele2.type === 'recessive') {
      return Math.random() < 0.75 ? allele1 : allele2;
    }
    if (allele2.type === 'dominant' && allele1.type === 'recessive') {
      return Math.random() < 0.75 ? allele2 : allele1;
    }
    return Math.random() < 0.5 ? allele1 : allele2;
  }

  /**
   * Generates inherited DNA from two parent Sim customizations with generation incrementing.
   */
  public static createOffspringDNA(
    parent1: SimCustomization,
    parent2: SimCustomization,
    currentGen: number = 1
  ): SimDNA {
    const skinColor = this.blendColor(parent1.skinColor, parent2.skinColor, 0.1);

    // Pick parent hair/eye alleles or match defaults
    const p1Hair: GeneAllele = this.HAIR_ALLELES.find(h => h.colorCode.toLowerCase() === parent1.hairColor.toLowerCase()) || this.HAIR_ALLELES[0];
    const p2Hair: GeneAllele = this.HAIR_ALLELES.find(h => h.colorCode.toLowerCase() === parent2.hairColor.toLowerCase()) || this.HAIR_ALLELES[2];

    const hairAllele = this.resolveAllele(p1Hair, p2Hair);
    const eyeAllele = this.resolveAllele(this.EYE_ALLELES[0], this.EYE_ALLELES[3]);

    const outfitColor = Math.random() < 0.5 ? parent1.outfitColor : parent2.outfitColor;

    const traitsPool = [parent1.trait, parent2.trait, 'Kreativ', 'Genial', 'Aktiv', 'Tierliebhaber', 'Romantisch'];
    const inheritedTrait = traitsPool[Math.floor(Math.random() * traitsPool.length)];

    return {
      skinColor,
      hairColor: hairAllele.colorCode,
      hairAllele,
      eyeColor: eyeAllele.colorCode,
      eyeAllele,
      outfitColor,
      generation: currentGen + 1,
      inheritedTraits: [inheritedTrait],
      ancestors: [parent1.name, parent2.name],
      skillPotentialBoosts: {
        cooking: Math.random() < 0.35 ? 1.25 : 1.0,
        programming: Math.random() < 0.35 ? 1.25 : 1.0,
        painting: Math.random() < 0.35 ? 1.25 : 1.0,
        fitness: Math.random() < 0.35 ? 1.25 : 1.0,
        charisma: Math.random() < 0.35 ? 1.25 : 1.0,
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
