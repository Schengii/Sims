import { describe, it, expect, beforeEach } from 'vitest';
import { Sim } from './Sim';

describe('Sim Emote, Needs & Lifecycle System', () => {
  let sim: Sim;

  beforeEach(() => {
    sim = new Sim({ name: 'Bella Test' });
  });

  it('should trigger active emote with expiration timestamp', () => {
    expect(sim.activeEmote).toBeNull();

    sim.triggerEmote('💬', 2000);
    expect(sim.activeEmote).not.toBeNull();
    expect(sim.activeEmote?.symbol).toBe('💬');
    expect(sim.activeEmote?.expiresAt).toBeGreaterThan(Date.now());
  });

  it('should calculate mood correctly based on needs satisfaction', () => {
    sim.needs.modify('hunger', -80);
    const mood = sim.getCurrentMood();
    expect(mood.plumbobColor).toBeDefined();
    expect(sim.needs.getLowestNeed().need).toBe('hunger');
  });

  it('should age up properly across life stages', () => {
    expect(sim.lifeStage).toBe('adult');
    const next = sim.ageUp();
    expect(next).toBe('senior');
    expect(sim.lifeStage).toBe('senior');
    expect(sim.customization.hairColor).toBe('#bdc3c7'); // Grey hair for seniors
  });
});
