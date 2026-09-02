import { describe, it, expect, beforeEach } from 'vitest';
import { PetNurserySystem } from './PetNurserySystem';
import { PetManager } from '../entity/PetManager';
import { Pet } from '../entity/Pet';
import { Sim } from '../entity/Sim';

describe('PetNurserySystem', () => {
  let nursery: PetNurserySystem;
  let petManager: PetManager;
  let sim: Sim;
  let dog1: Pet;
  let dog2: Pet;

  beforeEach(() => {
    nursery = new PetNurserySystem();
    petManager = new PetManager();
    petManager.pets = []; // Clear starter pets for test
    sim = new Sim();
    dog1 = new Pet('Bello', 'dog', '#e2e8f0');
    dog2 = new Pet('Luna', 'dog', '#d97706');
  });

  it('should start breeding when two compatible pets mate', () => {
    const res = nursery.startBreeding(dog1, dog2, sim);
    expect(res.success).toBe(true);
    expect(nursery.isExpecting).toBe(true);
    expect(nursery.expectedSpecies).toBe('dog');
  });

  it('should deliver cute puppy offspring and add it to PetManager', () => {
    nursery.startBreeding(dog1, dog2, sim);
    const baby = nursery.deliverOffspring(petManager, 'Milo', 5);

    expect(baby).not.toBeNull();
    expect(baby!.name).toBe('Milo');
    expect(baby!.stage).toBe('puppy');
    expect(nursery.isExpecting).toBe(false);
    expect(petManager.pets.length).toBe(1);
    expect(petManager.pets[0].name).toBe('Milo');
  });
});
