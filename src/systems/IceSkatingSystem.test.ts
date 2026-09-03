import { describe, it, expect, beforeEach } from 'vitest';
import { IceSkatingSystem } from './IceSkatingSystem';
import { Sim } from '../entity/Sim';

describe('IceSkatingSystem', () => {
  let skating: IceSkatingSystem;
  let sim: Sim;

  beforeEach(() => {
    skating = new IceSkatingSystem();
    sim = new Sim();
  });

  it('should practice skating and increase skating XP', () => {
    const res = skating.practiceSkating(sim);

    expect(res).toBeDefined();
    expect(skating.skatingXP).toBe(35);
  });

  it('should perform in figure skating contest and earn prize money', () => {
    const res = skating.performFigureContest(sim);

    expect(res.score).toBeGreaterThanOrEqual(5);
    expect(res.prize).toBeGreaterThan(0);
    expect(sim.simoleons).toBeGreaterThanOrEqual(400);
  });
});
