import { describe, it, expect, beforeEach } from 'vitest';
import { PetAgilitySystem } from './PetAgilitySystem';
import { Pet } from '../entity/Pet';
import { Sim } from '../entity/Sim';

describe('PetAgilitySystem', () => {
  let agility: PetAgilitySystem;
  let pet: Pet;
  let sim: Sim;

  beforeEach(() => {
    agility = new PetAgilitySystem();
    pet = new Pet('Bello', 'dog');
    sim = new Sim();
  });

  it('should train pet on obstacles and gain agility XP', () => {
    const res = agility.trainPet(pet, sim);

    expect(res).toBeDefined();
    expect(agility.agilityXP).toBe(35);
  });

  it('should participate and win bronze championship', () => {
    const res = agility.enterTournament('bronze', pet, sim);

    expect(res.success).toBe(true);
    expect(res.prize).toBe(500);
    expect(agility.trophiesWon.length).toBe(1);
  });
});
