import { describe, it, expect, beforeEach } from 'vitest';
import { BandManager } from './BandManager';
import { Sim } from '../entity/Sim';

describe('BandManager & Rockstar Gigs', () => {
  let band: BandManager;
  let sim: Sim;

  beforeEach(() => {
    band = new BandManager();
    sim = new Sim({ name: 'Rockstar Sim' });
  });

  it('should practice band rehearsal and grow fanbase', () => {
    const initialFans = band.fanBase;
    const res = band.practiceBandRehearsal(sim);

    expect(res.success).toBe(true);
    expect(band.fanBase).toBeGreaterThan(initialFans);
  });

  it('should play live gig and gain earnings', () => {
    sim.simoleons = 0;
    const res = band.playLiveGig(sim);

    expect(res.success).toBe(true);
    expect(res.earnings).toBeGreaterThan(0);
    expect(sim.simoleons).toBe(res.earnings);
    expect(sim.moodletManager.getActiveMoodlets().some(m => m.id === 'rockstar_gig')).toBe(true);
  });
});
