/**
 * Archaeology & Relic Excavation System
 * Handles digging for ancient fossils, relics, and golden statues in the ground.
 */

import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export interface RelicItem {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'legendary';
  icon: string;
  value: number;
  description: string;
}

export const RELIC_CATALOG: RelicItem[] = [
  { id: 'fossil_dino', name: 'Versteinertes Dinosaurier-Ei', rarity: 'common', icon: '🦖', value: 150, description: 'Millionen Jahre alt aus der Urzeit.' },
  { id: 'ancient_pottery', name: 'Antike Sim-Amphore', rarity: 'common', icon: '🏺', value: 220, description: 'Historische handgefertigte Tonvase.' },
  { id: 'crystal_skull', name: 'Mystischer Kristallschädel', rarity: 'rare', icon: '💀', value: 650, description: 'Schimmert im Dunkeln und summt leise.' },
  { id: 'golden_lama', name: 'Kaiserliche Goldene Lama-Statue', rarity: 'legendary', icon: '🦙', value: 1800, description: 'Reines massives 24k-Gold der alten Inka-Dynastie.' }
];

export class ArchaeologySystem {
  public archaeologySkill: number = 1;
  public excavatedRelics: RelicItem[] = [];

  public digForRelics(sim: Sim): { success: boolean; relic?: RelicItem; message: string } {
    if (sim.needs.getValues().energy < 15) {
      return { success: false, message: 'Zu erschöpft zum Graben im Gartenboden!' };
    }

    sim.needs.modify('energy', -15);
    sim.needs.modify('hygiene', -20);
    sim.needs.modify('fun', 10);

    const roll = Math.random();
    let picked: RelicItem;

    if (roll < 0.15 + (this.archaeologySkill * 0.05)) {
      picked = RELIC_CATALOG[3]; // Golden Lama
    } else if (roll < 0.4) {
      picked = RELIC_CATALOG[2]; // Crystal Skull
    } else if (roll < 0.7) {
      picked = RELIC_CATALOG[1]; // Amphora
    } else {
      picked = RELIC_CATALOG[0]; // Dino Egg
    }

    this.excavatedRelics.push(picked);
    sim.inventory.addItem({
      name: picked.name,
      type: 'collectible',
      icon: picked.icon,
      value: picked.value,
      description: picked.description
    });

    this.archaeologySkill = Math.min(5, this.archaeologySkill + 0.25);
    sim.triggerEmote(picked.icon, 3500);

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '🏺 Fundstück ausgegraben!',
      message: `${sim.customization.name} hat ein "${picked.name}" entdeckt! Wert: § ${picked.value}`,
      icon: picked.icon,
      type: 'success'
    });

    return {
      success: true,
      relic: picked,
      message: `Erfolgreich "${picked.name}" ausgegraben! Wert: § ${picked.value}`
    };
  }
}
