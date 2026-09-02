import { describe, it, expect, beforeEach } from 'vitest';
import { HerbalSpaSystem } from './HerbalSpaSystem';
import { Sim } from '../entity/Sim';

describe('HerbalSpaSystem', () => {
  let spa: HerbalSpaSystem;
  let sim: Sim;

  beforeEach(() => {
    spa = new HerbalSpaSystem();
    sim = new Sim();
    sim.simoleons = 500;
  });

  it('should brew chamomile tea and boost sim needs', () => {
    const res = spa.applyTreatment('chamomile_tea', sim);

    expect(res.success).toBe(true);
    expect(sim.simoleons).toBe(485);
    expect(spa.spaSessionsCompleted).toBe(1);
  });

  it('should reject treatment if sim lacks funds', () => {
    sim.simoleons = 0;
    const res = spa.applyTreatment('lavender_massage', sim);

    expect(res.success).toBe(false);
  });
});
