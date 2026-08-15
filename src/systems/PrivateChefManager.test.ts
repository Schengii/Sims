import { describe, it, expect, beforeEach } from 'vitest';
import { PrivateChefManager, CATERING_GIGS } from './PrivateChefManager';
import { Sim } from '../entity/Sim';

describe('PrivateChefManager & VIP Catering', () => {
  let chef: PrivateChefManager;
  let sim: Sim;

  beforeEach(() => {
    chef = new PrivateChefManager();
    sim = new Sim({ name: 'Gourmet Chef Sim' });
  });

  it('should cook VIP wedding dinner and receive honorarium', () => {
    sim.simoleons = 0;
    const gig = CATERING_GIGS[0];

    const res = chef.executeCateringGig(gig.id, sim);
    expect(res.success).toBe(true);
    expect(res.reward).toBe(gig.rewardSimoleons);
    expect(sim.simoleons).toBe(gig.rewardSimoleons);
    expect(chef.completedGigs).toBe(1);
    expect(sim.moodletManager.getActiveMoodlets().some(m => m.id === `chef_${gig.id}`)).toBe(true);
  });
});
