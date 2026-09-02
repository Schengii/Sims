/**
 * Herbal Tea & Aromatherapy Spa System
 * Allows Sims to brew herbal teas, light aromatherapy essential oils, and receive hot stone massages for stress relief and buffs.
 */

import { Sim } from '../entity/Sim';

export interface SpaTreatment {
  id: string;
  name: string;
  type: 'tea' | 'aroma' | 'massage';
  icon: string;
  cost: number;
  energyGain: number;
  funGain: number;
  socialGain: number;
  buffDescription: string;
}

export const SPA_TREATMENTS: SpaTreatment[] = [
  {
    id: 'chamomile_tea',
    name: 'Kamillen-Entspannungstee',
    type: 'tea',
    icon: '🍵',
    cost: 15,
    energyGain: 25,
    funGain: 20,
    socialGain: 10,
    buffDescription: 'Befreit von Alltagsstress und beruhigt die Nerven.'
  },
  {
    id: 'matcha_focus',
    name: 'Matcha-Fokus-Elixier',
    type: 'tea',
    icon: '🍃',
    cost: 30,
    energyGain: 40,
    funGain: 25,
    socialGain: 0,
    buffDescription: 'Fokussiert den Geist und steigert die Lernleistung.'
  },
  {
    id: 'eucalyptus_oil',
    name: 'Eukalyptus-Aromatherapie',
    type: 'aroma',
    icon: '🌿',
    cost: 45,
    energyGain: 20,
    funGain: 30,
    socialGain: 15,
    buffDescription: 'Frischer Duft, der die Sinne belebt und die Hygiene regeneriert.'
  },
  {
    id: 'lavender_massage',
    name: 'Lavendel-Tiefenentspannungsmassage',
    type: 'massage',
    icon: '🌸',
    cost: 120,
    energyGain: 50,
    funGain: 45,
    socialGain: 30,
    buffDescription: 'Luxuriöse Ganzkörper-Massage für ultimatives Wohlbefinden.'
  }
];

export class HerbalSpaSystem {
  public spaSessionsCompleted: number = 0;

  public applyTreatment(treatmentId: string, sim: Sim): { success: boolean; treatment?: SpaTreatment; message: string } {
    const item = SPA_TREATMENTS.find(t => t.id === treatmentId);
    if (!item) return { success: false, message: 'Unbekannte Wellness-Behandlung!' };

    if (sim.simoleons < item.cost) {
      return { success: false, message: `Nicht genügend Simoleons (§ ${item.cost} benötigt)!` };
    }

    sim.simoleons -= item.cost;
    sim.needs.modify('energy', item.energyGain);
    sim.needs.modify('fun', item.funGain);
    sim.needs.modify('social', item.socialGain);
    sim.needs.modify('hygiene', 20);

    this.spaSessionsCompleted += 1;
    sim.triggerEmote(item.icon, 4000);

    return {
      success: true,
      treatment: item,
      message: `✨ "${item.name}" genossen! (${item.buffDescription})`
    };
  }

  public exportData(): Record<string, any> {
    return {
      spaSessionsCompleted: this.spaSessionsCompleted
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.spaSessionsCompleted !== undefined) this.spaSessionsCompleted = data.spaSessionsCompleted;
  }
}
