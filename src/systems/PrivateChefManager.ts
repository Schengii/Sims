/**
 * Private Chef & Gourmet Catering Business System
 * Hire out as a private chef for luxury VIP dinners, cook 5-star menus, and build catering reputation.
 */

import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export interface CateringGig {
  id: string;
  clientName: string;
  occasion: string;
  guestsCount: number;
  rewardSimoleons: number;
  menuTitle: string;
}

export const CATERING_GIGS: CateringGig[] = [
  {
    id: 'vip_wedding_dinner',
    clientName: 'Graf & Gräfin von Landgraab',
    occasion: 'Romantisches Schloss-Hochzeitsdinner',
    guestsCount: 8,
    rewardSimoleons: 1400,
    menuTitle: 'Trüffel-Carpaccio & Hummer Thermidor'
  },
  {
    id: 'film_gala_buffet',
    clientName: 'Starlight Film Festival',
    occasion: 'VIP Aftershow Gala',
    guestsCount: 15,
    rewardSimoleons: 2600,
    menuTitle: 'Kaviar-Tartar & Champagner-Sorbet'
  }
];

export class PrivateChefManager {
  public chefSkill: number = 3;
  public completedGigs: number = 0;

  public executeCateringGig(gigId: string, sim: Sim): { success: boolean; reward: number; message: string } {
    const gig = CATERING_GIGS.find(g => g.id === gigId);
    if (!gig) return { success: false, reward: 0, message: 'Catering-Auftrag nicht gefunden.' };

    if (sim.needs.getValues().energy < 25) {
      return { success: false, reward: 0, message: 'Zu erschöpft für ein anspruchsvolles Gourmet-Event!' };
    }

    sim.needs.modify('energy', -25);
    sim.needs.modify('hunger', 100); // Chef probiert Speisen
    sim.simoleons += gig.rewardSimoleons;
    this.completedGigs++;
    this.chefSkill = Math.min(5, this.chefSkill + 0.5);

    sim.triggerEmote('👨‍🍳', 4000);
    sim.moodletManager.addMoodlet({
      id: `chef_${gig.id}`,
      name: '5-Sterne Starkoch',
      emotion: 'inspired',
      weight: 3,
      durationSec: 240,
      icon: '👨‍🍳',
      description: `Gourmet-Menü "${gig.menuTitle}" perfekt serviert!`
    });

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '👨‍🍳 CATERING-EVENT ERFOLGREICH!',
      message: `${gig.occasion} war ein voller Erfolg! Honorar: +§ ${gig.rewardSimoleons}`,
      icon: '🍽️',
      type: 'levelUp'
    });

    return { success: true, reward: gig.rewardSimoleons, message: `Menü serviert! Honorar erhalten: § ${gig.rewardSimoleons}` };
  }
}
