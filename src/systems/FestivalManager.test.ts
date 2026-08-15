import { describe, it, expect, beforeEach } from 'vitest';
import { FestivalManager } from './FestivalManager';
import { Sim } from '../entity/Sim';

describe('FestivalManager & Seasonal Activities', () => {
  let sim: Sim;

  beforeEach(() => {
    sim = new Sim({ name: 'Festival Sim' });
  });

  it('should map day 1 to spring, day 8 to summer, day 15 to autumn, day 22 to winter', () => {
    expect(FestivalManager.getSeasonFromDay(1)).toBe('spring');
    expect(FestivalManager.getSeasonFromDay(8)).toBe('summer');
    expect(FestivalManager.getSeasonFromDay(15)).toBe('autumn');
    expect(FestivalManager.getSeasonFromDay(22)).toBe('winter');
  });

  it('should execute spring blossom activity and reward item in inventory', () => {
    const res = FestivalManager.executeActivity('pick_flowers', sim, 'spring');
    expect(res.success).toBe(true);
    expect(sim.inventory.items.some(i => i.name.includes('Blumenstrauß'))).toBe(true);
    expect(sim.moodletManager.getActiveMoodlets().some(m => m.id === 'festival_pick_flowers')).toBe(true);
  });

  it('should execute autumn pumpkin carving activity', () => {
    const res = FestivalManager.executeActivity('carve_pumpkin', sim, 'autumn');
    expect(res.success).toBe(true);
    expect(sim.inventory.items.some(i => i.name.includes('Kürbis'))).toBe(true);
  });
});
