/**
 * Scuba Diving & Sunken Treasure Hunting System
 * Dive into deep waters, discover sea shells, coral reefs, and salvage sunken pirate treasure chests.
 */

import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export interface UnderwaterTreasure {
  name: string;
  icon: string;
  value: number;
  description: string;
}

export const TREASURES_CATALOG: UnderwaterTreasure[] = [
  { name: 'Schillernde Riesenmuschel', icon: '🐚', value: 120, description: 'Mit einer echten schwarzen Perle im Inneren.' },
  { name: 'Leuchtender Korallen-Kristall', icon: '🪸', value: 280, description: 'Phosphoreszierende Tiefseekoralle.' },
  { name: 'Versunkene Piraten-Schatztruhe', icon: '🪙', value: 1500, description: 'Voller alter spanischer Golddublonen und Edelsteine.' }
];

export class ScubaDivingSystem {
  public divingSkill: number = 1;
  public salvagedTreasures: UnderwaterTreasure[] = [];

  public diveForTreasure(sim: Sim): { success: boolean; treasure?: UnderwaterTreasure; message: string } {
    if (sim.needs.getValues().energy < 20) {
      return { success: false, message: 'Zu erschöpft für einen anstrengenden Tauchgang!' };
    }

    sim.needs.modify('energy', -20);
    sim.needs.modify('hygiene', 100); // Wasser erfrischt
    sim.needs.modify('fun', 30);

    const roll = Math.random();
    let picked: UnderwaterTreasure;

    if (roll < 0.2 + (this.divingSkill * 0.05)) {
      picked = TREASURES_CATALOG[2]; // Piratentruhe
    } else if (roll < 0.6) {
      picked = TREASURES_CATALOG[1]; // Koralle
    } else {
      picked = TREASURES_CATALOG[0]; // Muschel
    }

    this.salvagedTreasures.push(picked);
    sim.inventory.addItem({
      name: picked.name,
      type: 'collectible',
      icon: picked.icon,
      value: picked.value,
      description: picked.description
    });

    this.divingSkill = Math.min(5, this.divingSkill + 0.3);
    sim.triggerEmote('🤿', 3500);

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '🤿 Schatz geborgen!',
      message: `${sim.customization.name} hat "${picked.name}" vom Meeresgrund geborgen! Wert: § ${picked.value}`,
      icon: picked.icon,
      type: 'success'
    });

    return {
      success: true,
      treasure: picked,
      message: `Erfolgreich "${picked.name}" geborgen! Wert: § ${picked.value}`
    };
  }
}
