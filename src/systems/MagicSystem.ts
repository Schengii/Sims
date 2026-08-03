/**
 * Supernatural Magic & Spellcasting System for Sims 5
 * Manages magic skills, Mana regeneration, spellbook unlocks, and magical effects.
 */

export interface SpellDef {
  id: string;
  name: string;
  icon: string;
  manaCost: number;
  minLevel: number;
  description: string;
}

export const SPELLS_CATALOG: Record<string, SpellDef> = {
  clean_spell: {
    id: 'clean_spell',
    name: 'Blitzsauber-Zauber',
    icon: '🧹',
    manaCost: 25,
    minLevel: 1,
    description: 'Füllt Hygiene & Blase deines Sims augenblicklich auf 100% auf.'
  },
  food_spell: {
    id: 'food_spell',
    name: 'Gourmet-Herbeirufen',
    icon: '🍕',
    manaCost: 30,
    minLevel: 1,
    description: 'Zaubert sofort ein Gourmet-Gericht in dein Sim-Inventar.'
  },
  wealth_spell: {
    id: 'wealth_spell',
    name: 'Midas-Glanz',
    icon: '🪙',
    manaCost: 50,
    minLevel: 2,
    description: 'Wandelt magische Energie in § 1.000 bare Simoleons um.'
  },
  sparkle_spell: {
    id: 'sparkle_spell',
    name: 'Glitzer-Segen',
    icon: '🔮',
    manaCost: 40,
    minLevel: 3,
    description: 'Verleiht allen Haushaltsmitgliedern 100% Spaß & Inspiration.'
  }
};

export class MagicManager {
  public magicLevel: number = 1;
  public magicXP: number = 0;
  public manaPoints: number = 100;
  public maxMana: number = 100;
  public unlockedSpells: string[] = ['clean_spell', 'food_spell'];

  public updateTime(deltaMinutes: number): void {
    // Regenerate Mana over time
    if (this.manaPoints < this.maxMana) {
      this.manaPoints = Math.min(this.maxMana, this.manaPoints + (deltaMinutes * 0.5));
    }
  }

  public castSpell(spellId: string, game: any): { success: boolean; message: string } {
    const spell = SPELLS_CATALOG[spellId];
    if (!spell) return { success: false, message: 'Unbekannter Zauberspruch!' };

    if (this.manaPoints < spell.manaCost) {
      return { success: false, message: `Nicht genügend Mana (${Math.round(this.manaPoints)} / ${spell.manaCost} benötigt)!` };
    }

    this.manaPoints -= spell.manaCost;
    this.addMagicXP(25);

    if (spellId === 'clean_spell') {
      game.sim.needs.modify('hygiene', 100);
      game.sim.needs.modify('bladder', 100);
      return { success: true, message: '🧹 Zauber "Blitzsauber" ausgeführt! Hygiene & Blase sind auf 100%!' };
    } else if (spellId === 'food_spell') {
      game.sim.inventory.addItem({
        name: 'Magisches Festmahl',
        type: 'crop',
        icon: '🍕',
        value: 200,
        description: 'Herbeigebaulter magischer Gourmet-Snack.'
      });
      return { success: true, message: '🍕 "Magisches Festmahl" wurde deinem Inventar hinzugefügt!' };
    } else if (spellId === 'wealth_spell') {
      game.sim.simoleons += 1000;
      return { success: true, message: '🪙 Midas-Glanz hat § 1.000 in deine Geldbörse gezaubert!' };
    } else if (spellId === 'sparkle_spell') {
      game.sim.needs.modify('fun', 100);
      game.sim.needs.modify('social', 100);
      return { success: true, message: '🔮 Glitzer-Segen erfüllt den gesamten Haushalt mit Magie!' };
    }

    return { success: false, message: 'Fehler beim Zaubern.' };
  }

  public addMagicXP(amount: number): boolean {
    this.magicXP += amount;
    if (this.magicXP >= this.magicLevel * 100 && this.magicLevel < 5) {
      this.magicLevel++;
      this.maxMana += 25;
      this.manaPoints = this.maxMana;

      // Unlock new spells based on level
      if (this.magicLevel === 2 && !this.unlockedSpells.includes('wealth_spell')) {
        this.unlockedSpells.push('wealth_spell');
      }
      if (this.magicLevel === 3 && !this.unlockedSpells.includes('sparkle_spell')) {
        this.unlockedSpells.push('sparkle_spell');
      }

      return true; // Leveled up!
    }
    return false;
  }
}
