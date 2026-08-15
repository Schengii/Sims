import { describe, it, expect, beforeEach } from 'vitest';
import { VetClinicManager, PET_AILMENT_CATALOG } from './VetClinicManager';
import { Pet } from '../entity/Pet';
import { Sim } from '../entity/Sim';

describe('VetClinicManager & Pet Healthcare', () => {
  let vetManager: VetClinicManager;
  let pet: Pet;
  let sim: Sim;

  beforeEach(() => {
    vetManager = new VetClinicManager();
    pet = new Pet('Bello', 'dog', '#f39c12');
    sim = new Sim({ name: 'Tierfreund Sim' });
  });

  it('should diagnose pet ailment and treat at clinic', () => {
    sim.simoleons = 500;
    vetManager.setPetAilment(pet.id, 'fleas');
    expect(vetManager.getPetAilment(pet.id)).toBe('fleas');

    const res = vetManager.treatPet(pet, sim);
    expect(res.success).toBe(true);
    expect(vetManager.getPetAilment(pet.id)).toBe('none');
    expect(sim.simoleons).toBe(500 - PET_AILMENT_CATALOG.fleas.treatmentCost);
    expect(pet.needs.affection).toBe(100);
  });

  it('should successfully cure fleas with home bath', () => {
    vetManager.setPetAilment(pet.id, 'fleas');
    const bathRes = vetManager.giveFleaBath(pet, sim);

    expect(bathRes.success).toBe(true);
    expect(vetManager.getPetAilment(pet.id)).toBe('none');
  });
});
