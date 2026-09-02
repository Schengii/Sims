import { describe, it, expect, beforeEach } from 'vitest';
import { AlchemyBrewingSystem } from './AlchemyBrewingSystem';
import { Sim } from '../entity/Sim';

describe('AlchemyBrewingSystem', () => {
  let alchemy: AlchemyBrewingSystem;
  let sim: Sim;

  beforeEach(() => {
    alchemy = new AlchemyBrewingSystem();
    sim = new Sim();
  });

  it('should brew a potion and add it to potion inventory', () => {
    const res = alchemy.brewPotion('potion_youth', sim);
    expect(res.success).toBe(true);

    const potion = alchemy.brewedPotions.find(p => p.recipeId === 'potion_youth');
    expect(potion).toBeDefined();
    expect(potion!.count).toBe(1);
  });

  it('should drink a potion and apply its special effect', () => {
    alchemy.brewPotion('potion_midas_wealth', sim);
    const initialMoney = sim.simoleons;

    const drinkRes = alchemy.drinkPotion('potion_midas_wealth', sim);
    expect(drinkRes.success).toBe(true);
    expect(sim.simoleons).toBe(initialMoney + 2500);

    const potion = alchemy.brewedPotions.find(p => p.recipeId === 'potion_midas_wealth');
    expect(potion!.count).toBe(0);
  });
});
