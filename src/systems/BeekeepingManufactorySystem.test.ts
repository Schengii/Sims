import { describe, it, expect, beforeEach } from 'vitest';
import { BeekeepingManufactorySystem } from './BeekeepingManufactorySystem';
import { Sim } from '../entity/Sim';

describe('BeekeepingManufactorySystem', () => {
  let beekeeping: BeekeepingManufactorySystem;
  let sim: Sim;

  beforeEach(() => {
    beekeeping = new BeekeepingManufactorySystem();
    sim = new Sim();
    sim.simoleons = 0;
  });

  it('should spin raw honey and earn simoleons', () => {
    const res = beekeeping.spinHoney(sim);

    expect(res).toBeDefined();
    expect(beekeeping.honeySpunCount).toBe(1);
    expect(sim.simoleons).toBe(90);
  });

  it('should craft beeswax candles', () => {
    const res = beekeeping.craftProduct('fragrant_beeswax_candle', sim);

    expect(res.success).toBe(true);
    expect(beekeeping.craftedProducts.length).toBe(1);
    expect(sim.simoleons).toBe(65);
  });
});
