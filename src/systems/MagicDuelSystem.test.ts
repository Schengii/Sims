import { describe, it, expect, beforeEach } from 'vitest';
import { MagicDuelSystem } from './MagicDuelSystem';
import { Sim } from '../entity/Sim';

describe('MagicDuelSystem', () => {
  let duels: MagicDuelSystem;
  let sim: Sim;

  beforeEach(() => {
    duels = new MagicDuelSystem();
    sim = new Sim();
  });

  it('should execute a combat round and reduce opponent HP', () => {
    const opp = { ...duels.opponents[2] }; // Faba with 75 HP
    const round = duels.executeRound('pyro', sim, opp, 'lightning');

    expect(round.playerDmg).toBe(50);
    expect(opp.hp).toBe(25);
  });

  it('should award win and promote wizard rank when opponent falls', () => {
    const opp = { ...duels.opponents[2], hp: 10 };
    const round = duels.executeRound('pyro', sim, opp, 'lightning');

    expect(round.battleOver).toBe(true);
    expect(round.playerWon).toBe(true);
    expect(duels.duelsWon).toBe(1);
    expect(duels.rank).toBe('Adept');
  });
});
