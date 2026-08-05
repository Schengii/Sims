/**
 * Random Events, Disasters & Ghosts System
 * Handles kitchen fires, burglars, ghost hauntings, and soul potion resurrection.
 */

import type { Sim } from '../entity/Sim';

export interface ActiveEvent {
  id: string;
  title: string;
  icon: string;
  description: string;
  type: 'fire' | 'burglar' | 'ghost';
  resolved: boolean;
}

export class EventManager {
  public activeEvent: ActiveEvent | null = null;
  public ghostsHaunting: number = 0;

  public triggerRandomDisaster(): ActiveEvent | null {
    const rand = Math.random();
    if (rand < 0.4) {
      this.activeEvent = {
        id: `event_${Date.now()}`,
        title: '🔥 KÜCHENBRAND!',
        icon: '🔥',
        description: 'Ein Herdbrand ist ausgebrochen! Verwende den Feuerlöscher!',
        type: 'fire',
        resolved: false
      };
    } else if (rand < 0.7) {
      this.activeEvent = {
        id: `event_${Date.now()}`,
        title: '🥷 EINBRECHER SCHLEICHT UMHER!',
        icon: '🥷',
        description: 'Ein Einbrecher versucht Wertsachen zu stehlen! Rufe die Polizei!',
        type: 'burglar',
        resolved: false
      };
    } else {
      this.activeEvent = {
        id: `event_${Date.now()}`,
        title: '👻 GEISTER-SPUK!',
        icon: '👻',
        description: 'Ein verstorbener Geist spukt nachts durch die Räume!',
        type: 'ghost',
        resolved: false
      };
      this.ghostsHaunting++;
    }
    return this.activeEvent;
  }

  public resolveEvent(sim: Sim): { success: boolean; message: string } {
    if (!this.activeEvent || this.activeEvent.resolved) {
      return { success: false, message: 'Kein aktives Notfall-Ereignis.' };
    }

    const type = this.activeEvent.type;
    this.activeEvent.resolved = true;
    this.activeEvent = null;

    if (type === 'fire') {
      sim.needs.modify('energy', -20);
      return { success: true, message: '🧯 Brand erfolgreich gelöscht! Schaden abgewendet.' };
    } else if (type === 'burglar') {
      sim.simoleons += 300; // Police reward
      return { success: true, message: '👮 Polizei hat den Einbrecher gefasst! Belohnung: +§ 300' };
    } else {
      sim.needs.modify('social', 30);
      return { success: true, message: '✨ Mit dem Geist angefreundet und Besänftigung erreicht!' };
    }
  }
}
