/**
 * Pet Agility Course & Championship System
 * Allows household pets (Dogs & Cats) to train on agility obstacles (Hurdles, Slalom, Tunnels) and enter tournaments for trophies and simoleons.
 */

import { Pet } from '../entity/Pet';
import { Sim } from '../entity/Sim';

export interface AgilityChampionship {
  id: 'bronze' | 'silver' | 'gold';
  title: string;
  trophy: string;
  minSkill: number;
  prizeMoney: number;
}

export const AGILITY_CHAMPIONSHIPS: AgilityChampionship[] = [
  { id: 'bronze', title: 'Bronze Pokal (Einsteiger)', trophy: '🥉', minSkill: 1, prizeMoney: 500 },
  { id: 'silver', title: 'Silber Medaille (Fortgeschritten)', trophy: '🥈', minSkill: 3, prizeMoney: 1200 },
  { id: 'gold', title: 'Goldener Champions-Cup (Meisterklasse)', trophy: '🏆', minSkill: 5, prizeMoney: 2500 }
];

export class PetAgilitySystem {
  public agilitySkillLevel: number = 1;
  public agilityXP: number = 0;
  public trophiesWon: string[] = [];

  public trainPet(pet: Pet, sim: Sim): { leveledUp: boolean; message: string } {
    this.agilityXP += 35;
    sim.needs.modify('fun', 25);
    sim.needs.modify('social', 20);
    pet.needs.modify('play', 35);
    pet.needs.modify('affection', 25);

    let leveledUp = false;
    if (this.agilityXP >= this.agilitySkillLevel * 100 && this.agilitySkillLevel < 5) {
      this.agilityXP -= this.agilitySkillLevel * 100;
      this.agilitySkillLevel += 1;
      leveledUp = true;
    }

    return {
      leveledUp,
      message: leveledUp
        ? `🎉 ${pet.name} hat Agility-Stufe ${this.agilitySkillLevel} erreicht!`
        : `${pet.name} hat den Parcours erfolgreich absolviert (+35 Agility-XP)!`
    };
  }

  public enterTournament(tier: 'bronze' | 'silver' | 'gold', pet: Pet, sim: Sim): { success: boolean; message: string; prize: number } {
    const champ = AGILITY_CHAMPIONSHIPS.find(c => c.id === tier);
    if (!champ) return { success: false, message: 'Unbekanntes Turnier!', prize: 0 };

    if (this.agilitySkillLevel < champ.minSkill) {
      return { success: false, message: `Mindestens Agility-Stufe ${champ.minSkill} erforderlich!`, prize: 0 };
    }

    sim.simoleons += champ.prizeMoney;
    this.trophiesWon.push(champ.trophy);
    pet.triggerEmote('🏆', 4000);

    return {
      success: true,
      message: `🏆 GLÜCKWUNSCH! ${pet.name} hat den "${champ.title}" gewonnen (+§ ${champ.prizeMoney.toLocaleString()})!`,
      prize: champ.prizeMoney
    };
  }

  public exportData(): Record<string, any> {
    return {
      agilitySkillLevel: this.agilitySkillLevel,
      agilityXP: this.agilityXP,
      trophiesWon: this.trophiesWon
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.agilitySkillLevel !== undefined) this.agilitySkillLevel = data.agilitySkillLevel;
    if (data.agilityXP !== undefined) this.agilityXP = data.agilityXP;
    if (data.trophiesWon) this.trophiesWon = data.trophiesWon;
  }
}
