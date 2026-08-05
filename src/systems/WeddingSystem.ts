/**
 * Wedding & Family Expansion System
 * Manages proposals, wedding arch ceremonies, guest lists, and toddler/baby care mechanics.
 */

import type { Sim } from '../entity/Sim';

export interface WeddingParty {
  partnerName: string;
  isEngaged: boolean;
  isMarried: boolean;
  guests: string[];
  cakeCut: boolean;
}

export class WeddingManager {
  public weddingData: WeddingParty = {
    partnerName: '',
    isEngaged: false,
    isMarried: false,
    guests: [],
    cakeCut: false
  };

  public proposeToPartner(sim: Sim, partnerName: string): { success: boolean; message: string } {
    if (sim.simoleons < 500) {
      return { success: false, message: 'Ein Verlobungsring kostet § 500!' };
    }
    sim.simoleons -= 500;
    this.weddingData.partnerName = partnerName;
    this.weddingData.isEngaged = true;
    sim.partnerName = partnerName;
    return { success: true, message: `💍 GLÜCKWUNSCH! Du hast dich erfolgreich mit ${partnerName} verlobt!` };
  }

  public holdCeremony(sim: Sim): { success: boolean; message: string } {
    if (!this.weddingData.isEngaged) {
      return { success: false, message: 'Du musst erst verlobt sein, um zu heiraten!' };
    }
    this.weddingData.isMarried = true;
    this.weddingData.isEngaged = false;
    sim.needs.modify('social', 50);
    sim.needs.modify('fun', 50);
    return { success: true, message: `💒 WUNDERSCHÖN! Du hast ${this.weddingData.partnerName} am Hochzeitsbogen das Ja-Wort gegeben!` };
  }
}
