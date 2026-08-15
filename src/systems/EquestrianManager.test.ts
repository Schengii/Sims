import { describe, it, expect, beforeEach } from 'vitest';
import { EquestrianManager } from './EquestrianManager';
import { Sim } from '../entity/Sim';

describe('EquestrianManager & Horse Tournaments', () => {
  let eq: EquestrianManager;
  let sim: Sim;

  beforeEach(() => {
    eq = new EquestrianManager();
    sim = new Sim({ name: 'Rider Sim' });
  });

  it('should train horse and compete in tournament for gold trophy', () => {
    eq.horse.speed = 5;
    eq.horse.jumping = 5;
    sim.simoleons = 0;

    const res = eq.competeInTournament(sim);
    expect(res.success).toBe(true);
    expect(eq.tournamentTrophies).toBe(1);
    expect(sim.simoleons).toBeGreaterThanOrEqual(2500);
    expect(sim.moodletManager.getActiveMoodlets().some(m => m.id === 'equestrian_champion')).toBe(true);
  });
});
