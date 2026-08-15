import { describe, it, expect, beforeEach } from 'vitest';
import { PenthouseManager } from './PenthouseManager';
import { Sim } from '../entity/Sim';

describe('PenthouseManager & High-Rise Living', () => {
  let pent: PenthouseManager;
  let sim: Sim;

  beforeEach(() => {
    pent = new PenthouseManager();
    sim = new Sim({ name: 'Luxury Sim' });
  });

  it('should purchase luxury penthouse and collect weekly dividends', () => {
    sim.simoleons = 30000;
    const buyRes = pent.buyPenthouse('skyline_tower', sim);

    expect(buyRes.success).toBe(true);
    expect(pent.properties.find(p => p.id === 'skyline_tower')?.owned).toBe(true);

    sim.simoleons = 0;
    const rentRes = pent.collectRent(sim);
    expect(rentRes.success).toBe(true);
    expect(rentRes.payout).toBe(2200);
    expect(sim.simoleons).toBe(2200);
  });
});
