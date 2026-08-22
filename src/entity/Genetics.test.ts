import { describe, it, expect } from 'vitest';
import { GeneticsEngine } from './Genetics';

describe('GeneticsEngine', () => {
  it('blends parent skin colors and generates offspring DNA with generation tracking', () => {
    const parent1 = {
      name: 'Bob',
      gender: 'male' as const,
      skinColor: '#f1c27d',
      hairColor: '#1a1a1a',
      outfitColor: '#3b82f6',
      trait: 'Genial',
      aspiration: 'Wissen'
    };

    const parent2 = {
      name: 'Eliza',
      gender: 'female' as const,
      skinColor: '#c68642',
      hairColor: '#f1c40f',
      outfitColor: '#ec4899',
      trait: 'Kreativ',
      aspiration: 'Kreativität'
    };

    const dna = GeneticsEngine.createOffspringDNA(parent1, parent2, 1);
    expect(dna.generation).toBe(2);
    expect(dna.skinColor).toBeDefined();
    expect(dna.hairAllele).toBeDefined();
    expect(dna.eyeAllele).toBeDefined();
    expect(dna.ancestors).toEqual(['Bob', 'Eliza']);
  });
});
