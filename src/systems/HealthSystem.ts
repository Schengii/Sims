/**
 * Sim Health, Illness & Wellness System
 * Simulates sicknesses (Cold, Flu, Stress Burnout, Allergy), symptoms,
 * and remedies (Herbal Tea, Bed Rest, Doctor Home Visit, Medicine).
 */

import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export type IllnessType = 'none' | 'cold' | 'flu' | 'burnout' | 'allergy';

export interface IllnessInfo {
  type: IllnessType;
  name: string;
  icon: string;
  description: string;
  durationMinutes: number;
  severity: 'mild' | 'moderate' | 'severe';
  remedyHint: string;
}

export const ILLNESS_CATALOG: Record<IllnessType, IllnessInfo> = {
  none: {
    type: 'none',
    name: 'Kerngesund',
    icon: '💚',
    description: 'Dein Sim strotzt vor Energie und Gesundheit.',
    durationMinutes: 0,
    severity: 'mild',
    remedyHint: 'Gesunde Ernährung & Sport halten fit!'
  },
  cold: {
    type: 'cold',
    name: 'Erkältung & Schnupfen',
    icon: '🤧',
    description: 'Niesen, Frösteln und leicht gesenkte Energie.',
    durationMinutes: 240,
    severity: 'mild',
    remedyHint: 'Heißer Kräutertee am Herd & warmes Bett'
  },
  flu: {
    type: 'flu',
    name: 'Simoleon-Grippe',
    icon: '🤒',
    description: 'Fieber, Schüttelfrost und schneller Hygiene- & Energieabfall.',
    durationMinutes: 360,
    severity: 'moderate',
    remedyHint: 'Medizin aus dem Medizinschrank oder Arzt rufen'
  },
  burnout: {
    type: 'burnout',
    name: 'Stress-Burnout',
    icon: '🤯',
    description: 'Überlastung durch zu viel Arbeit & Lernen. Spaßbedürfnis blockiert.',
    durationMinutes: 300,
    severity: 'moderate',
    remedyHint: 'Entspannung im Schaumbad oder Paartanz'
  },
  allergy: {
    type: 'allergy',
    name: 'Pollen-Allergie',
    icon: '🌸',
    description: 'Juckende Augen & Niesattacken durch Frühlingsblüten im Garten.',
    durationMinutes: 180,
    severity: 'mild',
    remedyHint: 'Antiallergikum oder Aufenthalt drinnen'
  }
};

export class HealthSystem {
  public currentIllness: IllnessType = 'none';
  public remainingMinutes: number = 0;
  public immunityLevel: number = 100; // 0 - 100

  public update(deltaMinutes: number, sim: Sim, weather?: string): void {
    // 1. Tick down illness if sick
    if (this.currentIllness !== 'none') {
      this.remainingMinutes -= deltaMinutes;
      
      // Needs penalty during sickness
      if (this.currentIllness === 'flu') {
        sim.needs.modify('energy', -0.05 * deltaMinutes);
        sim.needs.modify('hygiene', -0.04 * deltaMinutes);
      } else if (this.currentIllness === 'cold') {
        sim.needs.modify('energy', -0.03 * deltaMinutes);
      }

      // Random cough/sneeze emote
      if (Math.random() < 0.04) {
        const info = ILLNESS_CATALOG[this.currentIllness];
        sim.triggerEmote(info.icon, 2500);
      }

      if (this.remainingMinutes <= 0) {
        this.cure();
      }
    } else {
      // 2. Random chance to contract illness based on weather & hygiene
      this.checkRandomContraction(sim, weather);
    }
  }

  private checkRandomContraction(sim: Sim, weather?: string): void {
    const needs = sim.needs.getValues();
    // Rain or Snow increases cold chance if low energy
    if ((weather === 'rain' || weather === 'snow') && needs.energy < 30 && Math.random() < 0.005) {
      this.contractIllness('cold', sim);
      return;
    }

    // High stress / low fun
    if (needs.fun < 15 && Math.random() < 0.004) {
      this.contractIllness('burnout', sim);
      return;
    }
  }

  public contractIllness(type: IllnessType, sim: Sim): void {
    if (type === 'none') return;
    this.currentIllness = type;
    this.remainingMinutes = ILLNESS_CATALOG[type].durationMinutes;
    const info = ILLNESS_CATALOG[type];

    sim.triggerEmote(info.icon, 4000);
    sim.moodletManager.addMoodlet({
      id: `illness_${type}`,
      name: `Krank: ${info.name}`,
      emotion: 'tense',
      weight: 2,
      durationSec: 180,
      icon: info.icon,
      description: info.description
    });

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: `Krankheit: ${info.name}`,
      message: `${sim.customization.name} fühlt sich unwohl! ${info.remedyHint}`,
      icon: info.icon,
      type: 'warning'
    });
  }

  public cure(sim?: Sim, remedyName: string = 'Genesung'): void {
    if (this.currentIllness === 'none') return;
    this.currentIllness = 'none';
    this.remainingMinutes = 0;

    if (sim) {
      sim.triggerEmote('💚', 3000);
      sim.moodletManager.addMoodlet({
        id: 'cured_healthy',
        name: 'Vollständig genesen',
        emotion: 'happy',
        weight: 2,
        durationSec: 120,
        icon: '✨',
        description: 'Fühlt sich wieder fit und gesund!'
      });
    }

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: 'Gesund & Munter!',
      message: `${remedyName} war erfolgreich. Alle Symptome sind verschwunden!`,
      icon: '💚',
      type: 'success'
    });
  }

  public callDoctorHomeVisit(sim: Sim): { success: boolean; cost: number; message: string } {
    const cost = 250;
    if (sim.simoleons < cost) {
      return { success: false, cost, message: `Nicht genügend Simoleons (§ ${cost} erforderlich)!` };
    }

    sim.simoleons -= cost;
    this.cure(sim, 'Arzt-Hausbesuch & Vitaminspritze');
    return { success: true, cost, message: 'Der Arzt hat deinen Sim untersucht und sofort kuriert!' };
  }

  public drinkHerbalTea(sim: Sim): { success: boolean; message: string } {
    if (this.currentIllness === 'cold' || this.currentIllness === 'allergy') {
      this.cure(sim, 'Heißer Bio-Kräutertee');
      return { success: true, message: 'Der warme Kräutertee hat die Erkältungssymptome gelindert!' };
    } else if (this.currentIllness !== 'none') {
      this.remainingMinutes = Math.floor(this.remainingMinutes / 2);
      return { success: true, message: 'Der Kräutertee hat die Beschwerden merklich gelindert (-50% Dauer).' };
    }
    return { success: true, message: 'Frischer Kräutertee hat deinen Sim aufgewärmt (+Wohlbefinden).' };
  }

  public exportData(): any {
    return {
      currentIllness: this.currentIllness,
      remainingMinutes: this.remainingMinutes,
      immunityLevel: this.immunityLevel
    };
  }

  public importData(data: any): void {
    if (!data) return;
    if (data.currentIllness) this.currentIllness = data.currentIllness;
    if (typeof data.remainingMinutes === 'number') this.remainingMinutes = data.remainingMinutes;
    if (typeof data.immunityLevel === 'number') this.immunityLevel = data.immunityLevel;
  }
}

