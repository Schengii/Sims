import { describe, it, expect, beforeEach } from 'vitest';
import { PoliticsManager } from './PoliticsManager';
import { Sim } from '../entity/Sim';

describe('PoliticsManager & City Ordinances', () => {
  let politics: PoliticsManager;
  let sim: Sim;

  beforeEach(() => {
    politics = new PoliticsManager();
    sim = new Sim({ name: 'Candidate Sim' });
  });

  it('should deliver campaign speech, boost voter support and promote to Mayor', () => {
    politics.voterSupport = 75;
    const res = politics.deliverCampaignSpeech(sim);

    expect(res.success).toBe(true);
    expect(politics.voterSupport).toBeGreaterThanOrEqual(80);
    expect(politics.politicalRank).toBe(5); // Oberbürgermeister
    expect(sim.simoleons).toBeGreaterThanOrEqual(2500);
  });

  it('should enact town ordinance when rank and funds are sufficient', () => {
    politics.politicalRank = 4;
    sim.simoleons = 2000;

    const res = politics.enactOrdinance('eco_grant', sim);
    expect(res.success).toBe(true);
    expect(politics.ordinances.find(o => o.id === 'eco_grant')?.active).toBe(true);
  });
});
