/**
 * Neighborhood Story Progression & Autonomous NPC Events
 * Simulates background life for Townies (promotions, events) and triggers spontaneous SMS invitations.
 */

import { Sim } from '../entity/Sim';
import { ToastManager } from '../ui/ToastManager';
import { SoundManager } from '../audio/SoundManager';

export interface PhoneInvite {
  id: string;
  npcName: string;
  message: string;
  venueId: string;
  venueName: string;
  rewardSimoleons: number;
}

export class NeighborhoodProgression {
  private timerMinutes: number = 0;
  private readonly inviteIntervalMinutes: number = 240; // Every 4 in-game hours
  public activeInvite: PhoneInvite | null = null;

  public update(deltaMinutes: number, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    this.timerMinutes += deltaMinutes;

    if (this.timerMinutes >= this.inviteIntervalMinutes) {
      this.timerMinutes = 0;

      // 30% chance to receive a phone invite from a neighbour
      if (Math.random() < 0.4) {
        const npcs = ['Mortimer Goth', 'Penny Pizazz', 'Bob Pancakes', 'Summer Holiday'];
        const venues = [
          { id: 'lot_club', name: 'VIP Club Velvet' },
          { id: 'lot_gym', name: 'Fit & Flex Studio' },
          { id: 'lot_park', name: 'Plumbob Zentralpark' }
        ];

        const npc = npcs[Math.floor(Math.random() * npcs.length)];
        const venue = venues[Math.floor(Math.random() * venues.length)];

        this.activeInvite = {
          id: `invite_${Date.now()}`,
          npcName: npc,
          message: `${npc}: "Hey ${sim.customization.name}! Kommst du mit mir zum ${venue.name}?"`,
          venueId: venue.id,
          venueName: venue.name,
          rewardSimoleons: 150
        };

        soundManager.playLevelUp();
        toastManager.showToast('📱 SMS Einladung!', this.activeInvite.message, '💬', 'info');
      }
    }
  }

  public acceptInvite(sim: Sim, toastManager: ToastManager): void {
    if (!this.activeInvite) return;
    sim.simoleons += this.activeInvite.rewardSimoleons;
    sim.needs.modify('social', 35);
    sim.needs.modify('fun', 30);

    toastManager.showToast('🎉 EINLADUNG ANGENOMMEN!', `Ausflug mit ${this.activeInvite.npcName} unternommen! (+§ ${this.activeInvite.rewardSimoleons} & +Social)`, '🥳', 'success');
    this.activeInvite = null;
  }
}
