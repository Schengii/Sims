import { describe, it, expect, beforeEach } from 'vitest';
import { ScubaDivingSystem } from './ScubaDivingSystem';
import { Sim } from '../entity/Sim';

describe('ScubaDivingSystem & Deep Sea Treasures', () => {
  let scuba: ScubaDivingSystem;
  let sim: Sim;

  beforeEach(() => {
    scuba = new ScubaDivingSystem();
    sim = new Sim({ name: 'Diver Sim' });
  });

  it('should dive underwater and salvage sunken marine treasure', () => {
    const res = scuba.diveForTreasure(sim);

    expect(res.success).toBe(true);
    expect(res.treasure).toBeDefined();
    expect(scuba.salvagedTreasures.length).toBe(1);
    expect(sim.inventory.items.some(i => i.name === res.treasure?.name)).toBe(true);
  });
});
