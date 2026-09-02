/**
 * Magic Duel Arena & Wizard Tournaments
 * Turn-based magical combat against rival spellcasters with spells, shields, counters, rank progression, and simoleon rewards.
 */

import { Sim } from '../entity/Sim';

export interface DuelOpponent {
  id: string;
  name: string;
  icon: string;
  rank: 'Novize' | 'Adept' | 'Meister' | 'Erzmagier';
  hp: number;
  maxHp: number;
}

export class MagicDuelSystem {
  public duelsWon: number = 0;
  public duelsLost: number = 0;
  public rank: 'Novize' | 'Adept' | 'Meister' | 'Erzmagier' = 'Novize';

  public readonly opponents: DuelOpponent[] = [
    { id: 'morgyn', name: 'Morgyn Ember', icon: '🧙‍♂️', rank: 'Erzmagier', hp: 120, maxHp: 120 },
    { id: 'darrel', name: 'Darrel Charm', icon: '🪄', rank: 'Meister', hp: 95, maxHp: 95 },
    { id: 'faba', name: 'L. Faba', icon: '🔮', rank: 'Adept', hp: 75, maxHp: 75 }
  ];

  public executeRound(
    playerSpell: 'lightning' | 'shield' | 'frost' | 'pyro',
    sim: Sim,
    opponent: DuelOpponent,
    forcedOppSpell?: 'lightning' | 'shield' | 'frost' | 'pyro'
  ): { playerDmg: number; oppDmg: number; log: string; battleOver: boolean; playerWon: boolean } {
    const oppSpells: Array<'lightning' | 'shield' | 'frost' | 'pyro'> = ['lightning', 'shield', 'frost', 'pyro'];
    const oppSpell = forcedOppSpell || oppSpells[Math.floor(Math.random() * oppSpells.length)];

    let playerDmg = 0;
    let oppDmg = 0;

    if (playerSpell === 'lightning') playerDmg = 35;
    else if (playerSpell === 'frost') playerDmg = 25;
    else if (playerSpell === 'pyro') playerDmg = 50;

    if (oppSpell === 'lightning') oppDmg = 25;
    else if (oppSpell === 'frost') oppDmg = 20;
    else if (oppSpell === 'pyro') oppDmg = 40;

    // Shield mitigates/reflects
    if (playerSpell === 'shield') {
      oppDmg = 0;
      playerDmg = 15; // Reflect partial
    }
    if (oppSpell === 'shield') {
      playerDmg = 0;
    }

    opponent.hp = Math.max(0, opponent.hp - playerDmg);

    let battleOver = false;
    let playerWon = false;

    if (opponent.hp <= 0) {
      battleOver = true;
      playerWon = true;
      this.duelsWon += 1;
      sim.simoleons += 1500;
      sim.addSkillXP('logic', 50);

      if (this.duelsWon >= 5) this.rank = 'Erzmagier';
      else if (this.duelsWon >= 3) this.rank = 'Meister';
      else if (this.duelsWon >= 1) this.rank = 'Adept';
    }

    const log = `Du wirkst ${playerSpell} (-${playerDmg} HP) gegen ${opponent.name}s ${oppSpell} (-${oppDmg} HP)!`;
    return { playerDmg, oppDmg, log, battleOver, playerWon };
  }

  public exportData(): Record<string, any> {
    return {
      duelsWon: this.duelsWon,
      duelsLost: this.duelsLost,
      rank: this.rank
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.duelsWon !== undefined) this.duelsWon = data.duelsWon;
    if (data.duelsLost !== undefined) this.duelsLost = data.duelsLost;
    if (data.rank) this.rank = data.rank;
  }
}
