import { describe, it, expect, beforeEach } from 'vitest';
import { InheritanceManager } from './InheritanceManager';
import { Sim } from '../entity/Sim';

describe('InheritanceManager & Wills', () => {
  let inher: InheritanceManager;
  let sim: Sim;

  beforeEach(() => {
    inher = new InheritanceManager();
    sim = new Sim({ name: 'Heir Sim' });
  });

  it('should seal family will and boost generational prestige', () => {
    const res = inher.sealWill('Erbe Generation 2', 'Wohlstand & Fleiß', sim);

    expect(res.success).toBe(true);
    expect(inher.generationalPrestigeLevel).toBe(2);
    expect(inher.will.primaryHeir).toBe('Erbe Generation 2');
  });

  it('should execute inheritance payout', () => {
    sim.simoleons = 0;
    const res = inher.executeInheritance(sim);

    expect(res.success).toBe(true);
    expect(res.payout).toBeGreaterThanOrEqual(5000);
    expect(sim.simoleons).toBe(res.payout);
  });
});
