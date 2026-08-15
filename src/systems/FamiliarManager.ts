/**
 * Magical Familiars & Spellcaster Companions
 * Summon magic familiars (Snowy Owl 🦉, Phoenix 🐦‍🔥, Astral Cat 🐱, Glow Dragon 🐉)
 * that passively regenerate Mana, protect against curses, and boost magical prowess.
 */

import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export interface FamiliarDef {
  id: string;
  name: string;
  species: string;
  icon: string;
  manaBonusPerMinute: number;
  description: string;
}

export const FAMILIARS_CATALOG: FamiliarDef[] = [
  {
    id: 'owl_familiar',
    name: '🦉 Schnee-Eule "Hedwig"',
    species: 'Schnee-Eule',
    icon: '🦉',
    manaBonusPerMinute: 1.5,
    description: 'Weiser Bote aus den Bergen. Beschleunigt das Lernen von Zaubersprüchen.'
  },
  {
    id: 'phoenix_familiar',
    name: '🐦‍🔥 Glühender Phönix "Solarius"',
    species: 'Feuer-Phönix',
    icon: '🐦‍🔥',
    manaBonusPerMinute: 2.5,
    description: 'Mythischer Feuervogel. Verleiht unerschöpfliche magische Energie.'
  },
  {
    id: 'astral_cat',
    name: '🐱 Sternen-Katze "Luna"',
    species: 'Astral-Katze',
    icon: '🐱',
    manaBonusPerMinute: 1.8,
    description: 'Geheimnisvolle Samtpfote. Schützt den Haushalt vor bösen Geistern & Flüchen.'
  },
  {
    id: 'dragon_familiar',
    name: '🐉 Mini-Glutdrache "Ignis"',
    species: 'Glutdrache',
    icon: '🐉',
    manaBonusPerMinute: 3.0,
    description: 'Feuriger kleiner Begleiter mit mächtigem Mana-Aura-Schutz.'
  }
];

export class FamiliarManager {
  public activeFamiliar: FamiliarDef | null = FAMILIARS_CATALOG[0]; // Default Owl
  public familiarBondLevel: number = 1; // 1 to 5

  public summonFamiliar(familiarId: string, sim: Sim): { success: boolean; message: string } {
    const familiar = FAMILIARS_CATALOG.find(f => f.id === familiarId);
    if (!familiar) return { success: false, message: 'Vertrauter nicht gefunden.' };

    this.activeFamiliar = familiar;
    this.familiarBondLevel = Math.min(5, this.familiarBondLevel + 1);

    sim.triggerEmote(familiar.icon, 4000);
    sim.moodletManager.addMoodlet({
      id: `familiar_${familiar.id}`,
      name: `Zauber-Vertrauter: ${familiar.name}`,
      emotion: 'inspired',
      weight: 3,
      durationSec: 300,
      icon: familiar.icon,
      description: `Magische Verbindung mit ${familiar.name} aktiv (+Mana-Regeneration)!`
    });

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '🔮 MAGISCHER VERTRAUTER BESCHWOREN!',
      message: `${familiar.name} weicht nun nicht mehr von deiner Seite!`,
      icon: familiar.icon,
      type: 'levelUp'
    });

    return { success: true, message: `${familiar.name} als magischer Begleiter beschworen!` };
  }
}
