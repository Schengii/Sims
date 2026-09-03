/**
 * Fashion Runway Catwalk & Model Agency System
 * Allows Sims to present fashion collections on the LED runway, pose for photographers, and win model titles & sponsorships.
 */

import { Sim } from '../entity/Sim';

export interface RunwayShow {
  id: 'streetwear' | 'couture' | 'avantgarde';
  title: string;
  icon: string;
  minFame: number;
  reward: number;
  fameGain: number;
  description: string;
}

export const RUNWAY_SHOWS: RunwayShow[] = [
  {
    id: 'streetwear',
    title: 'Urban Streetwear Show',
    icon: '👟',
    minFame: 1,
    reward: 800,
    fameGain: 35,
    description: 'Lässige Streetwear-Präsentation für Nachwuchs-Models.'
  },
  {
    id: 'couture',
    title: 'Haute-Couture Galanacht',
    icon: '💃',
    minFame: 2,
    reward: 1800,
    fameGain: 60,
    description: 'Exklusive Designerkleider vor Blitzlichtgewitter und Star-Gästen.'
  },
  {
    id: 'avantgarde',
    title: 'Avantgarde Fashion Finale',
    icon: '🕶️',
    minFame: 4,
    reward: 3500,
    fameGain: 100,
    description: 'Spektakuläre Saison-Modenschau um den Titel "Top-Model des Jahres".'
  }
];

export class FashionRunwaySystem {
  public showsWalked: number = 0;
  public modelRating: number = 1; // 1 to 5

  public walkRunway(showId: 'streetwear' | 'couture' | 'avantgarde', sim: Sim): { success: boolean; show?: RunwayShow; message: string } {
    const show = RUNWAY_SHOWS.find(s => s.id === showId);
    if (!show) return { success: false, message: 'Unbekannte Modenschau!' };

    this.showsWalked += 1;
    sim.addSkillXP('charisma', 40);
    sim.needs.modify('fun', 40);
    sim.needs.modify('social', 30);
    sim.simoleons += show.reward;
    sim.triggerEmote('💃', 4000);

    if (this.showsWalked >= 5) this.modelRating = 5;
    else if (this.showsWalked >= 3) this.modelRating = 3;
    else if (this.showsWalked >= 1) this.modelRating = 2;

    return {
      success: true,
      show,
      message: `✨ Auf dem Catwalk brilliert! "${show.title}" erfolgreich absolviert (+§ ${show.reward.toLocaleString()}, Model-Rating: ${this.modelRating}/5)!`
    };
  }

  public exportData(): Record<string, any> {
    return {
      showsWalked: this.showsWalked,
      modelRating: this.modelRating
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.showsWalked !== undefined) this.showsWalked = data.showsWalked;
    if (data.modelRating !== undefined) this.modelRating = data.modelRating;
  }
}
