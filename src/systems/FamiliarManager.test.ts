import { describe, it, expect, beforeEach } from 'vitest';
import { FamiliarManager } from './FamiliarManager';
import { Sim } from '../entity/Sim';

describe('FamiliarManager & Companions', () => {
  let familiarManager: FamiliarManager;
  let sim: Sim;

  beforeEach(() => {
    familiarManager = new FamiliarManager();
    sim = new Sim({ name: 'Wizard Sim' });
  });

  it('should summon phoenix familiar and add inspired moodlet', () => {
    const res = familiarManager.summonFamiliar('phoenix_familiar', sim);

    expect(res.success).toBe(true);
    expect(familiarManager.activeFamiliar?.id).toBe('phoenix_familiar');
    expect(sim.moodletManager.getActiveMoodlets().some(m => m.id === 'familiar_phoenix_familiar')).toBe(true);
  });
});
