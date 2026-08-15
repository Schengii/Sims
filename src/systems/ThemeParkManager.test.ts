import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeParkManager } from './ThemeParkManager';
import { Sim } from '../entity/Sim';

describe('ThemeParkManager & Attractions', () => {
  let park: ThemeParkManager;
  let sim: Sim;

  beforeEach(() => {
    park = new ThemeParkManager();
    sim = new Sim({ name: 'ThemePark Sim' });
  });

  it('should ride roller coaster, boost fun and add energized moodlet', () => {
    sim.simoleons = 500;
    const res = park.rideAttraction('roller_coaster', sim);

    expect(res.success).toBe(true);
    expect(park.totalRidesTaken).toBe(1);
    expect(sim.moodletManager.getActiveMoodlets().some(m => m.id === 'ride_roller_coaster')).toBe(true);
  });
});
