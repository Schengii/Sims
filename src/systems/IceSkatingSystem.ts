/**
 * Winter Resort & Ice Skating System
 * Allows Sims to skate on the ice rink, perform figure skating pirouettes, play ice hockey, and drink spiced hot punch.
 */

import { Sim } from '../entity/Sim';

export interface FigureSkatingContest {
  score: number; // 1 to 10
  medal: 'Gold' | 'Silber' | 'Bronze';
  prize: number;
  message: string;
}

export class IceSkatingSystem {
  public skatingSkillLevel: number = 1;
  public skatingXP: number = 0;
  public totalPunchServed: number = 0;

  public practiceSkating(sim: Sim): { leveledUp: boolean; message: string } {
    this.skatingXP += 35;
    sim.addSkillXP('fitness', 30);
    sim.needs.modify('fun', 35);
    sim.needs.modify('energy', -15);
    sim.triggerEmote('⛸️', 3500);

    let leveledUp = false;
    if (this.skatingXP >= this.skatingSkillLevel * 100 && this.skatingSkillLevel < 5) {
      this.skatingXP -= this.skatingSkillLevel * 100;
      this.skatingSkillLevel += 1;
      leveledUp = true;
    }

    return {
      leveledUp,
      message: leveledUp
        ? `🎉 ${sim.customization.name} hat Eiskunstlauf-Stufe ${this.skatingSkillLevel} erreicht!`
        : `Auf dem Eis trainiert & Pirouetten geübt (+35 Eislauf-XP, +30 Fitness)!`
    };
  }

  public playIceHockey(sim: Sim): { message: string } {
    sim.addSkillXP('fitness', 40);
    sim.needs.modify('fun', 45);
    sim.needs.modify('social', 30);
    sim.triggerEmote('🏒', 4000);

    return {
      message: '🏒 Spannendes Eishockey-Match gespielt (+45 Spaß, +30 Sozial, Teamgeist-Moodlet)!'
    };
  }

  public drinkHotPunch(sim: Sim): { message: string } {
    this.totalPunchServed += 1;
    sim.needs.modify('hunger', 20);
    sim.needs.modify('energy', 30);
    sim.triggerEmote('☕', 3500);

    return {
      message: '☕ Dampfenden Gewürzpunsch an der Hütte genossen (Wohlige Winterwärme & Energie-Boost)!'
    };
  }

  public performFigureContest(sim: Sim): FigureSkatingContest {
    const baseScore = 5 + this.skatingSkillLevel;
    const score = Math.min(10, baseScore + Math.floor(Math.random() * 2));

    let medal: 'Gold' | 'Silber' | 'Bronze' = 'Bronze';
    let prize = 400;

    if (score >= 9) {
      medal = 'Gold';
      prize = 1800;
    } else if (score >= 7) {
      medal = 'Silber';
      prize = 900;
    }

    sim.simoleons += prize;
    sim.needs.modify('fun', 40);

    return {
      score,
      medal,
      prize,
      message: `🏆 Jury-Wertung: ${score}/10 Punkte! ${medal}-Medaille gewonnen (+§ ${prize.toLocaleString()})!`
    };
  }

  public exportData(): Record<string, any> {
    return {
      skatingSkillLevel: this.skatingSkillLevel,
      skatingXP: this.skatingXP,
      totalPunchServed: this.totalPunchServed
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.skatingSkillLevel !== undefined) this.skatingSkillLevel = data.skatingSkillLevel;
    if (data.skatingXP !== undefined) this.skatingXP = data.skatingXP;
    if (data.totalPunchServed !== undefined) this.totalPunchServed = data.totalPunchServed;
  }
}
