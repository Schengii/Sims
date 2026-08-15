/**
 * Multi-Generation & Inheritance Testament System
 * Setup wills, bequeath family heirlooms, pass on generational wealth, and establish family legacy traits.
 */

import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export interface WillDocument {
  primaryHeir: string;
  bequestSimoleonsPercent: number; // e.g. 100%
  familyMotto: string;
  isSealed: boolean;
}

export class InheritanceManager {
  public will: WillDocument = {
    primaryHeir: 'Alexander Junior',
    bequestSimoleonsPercent: 100,
    familyMotto: 'Familie, Ehre & Simoleon-Wohlstand',
    isSealed: true
  };
  public generationalPrestigeLevel: number = 1; // 1 to 5

  public sealWill(primaryHeir: string, motto: string, sim: Sim): { success: boolean; message: string } {
    this.will.primaryHeir = primaryHeir || this.will.primaryHeir;
    this.will.familyMotto = motto || this.will.familyMotto;
    this.will.isSealed = true;
    this.generationalPrestigeLevel = Math.min(5, this.generationalPrestigeLevel + 1);

    sim.triggerEmote('📜', 3500);
    sim.moodletManager.addMoodlet({
      id: 'will_sealed',
      name: 'Familienerbe gesichert',
      emotion: 'happy',
      weight: 2,
      durationSec: 180,
      icon: '🏛️',
      description: `Testament für ${this.will.primaryHeir} notariell beglaubigt!`
    });

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '📜 Familienerbe & Testament',
      message: `Testament notariell besiegelt für Haupterbe: ${this.will.primaryHeir}!`,
      icon: '🏛️',
      type: 'success'
    });

    return { success: true, message: `Testament für ${this.will.primaryHeir} notariell beglaubigt!` };
  }

  public executeInheritance(sim: Sim): { success: boolean; payout: number; message: string } {
    const payout = 5000 * this.generationalPrestigeLevel;
    sim.simoleons += payout;

    sim.triggerEmote('💎', 4000);
    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '💎 GENERATIONEN-ERBSCHAFT',
      message: `Erbschaft der Ahnen ausgezahlt! Vermögens-Übertrag: +§ ${payout}`,
      icon: '👑',
      type: 'levelUp'
    });

    return { success: true, payout, message: `Erbschaft der Familie ausgezahlt (+§ ${payout})!` };
  }
}
