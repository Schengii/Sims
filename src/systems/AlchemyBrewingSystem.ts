/**
 * Alchemy & Magical Potion Brewing System
 * Allows Sims to brew potent potions in the Alchemy Cauldron using botanic hybrids, honey, and gems.
 */

import { Sim } from '../entity/Sim';

export interface AlchemyRecipe {
  id: string;
  name: string;
  icon: string;
  requiredIngredients: { name: string; icon: string }[];
  description: string;
  manaCost: number;
  effectType: 'youth' | 'mood_boost' | 'midas_wealth' | 'love_philter';
}

export const ALCHEMY_RECIPES: AlchemyRecipe[] = [
  {
    id: 'potion_youth',
    name: 'Elixier der ewigen Jugend',
    icon: '🧪',
    requiredIngredients: [
      { name: 'Drachenfrucht', icon: '🐉' },
      { name: 'Kristall-Pulver', icon: '💎' }
    ],
    description: 'Setzt das biologische Alter des Sims zurück und füllt Energie & Vitalität komplett auf.',
    manaCost: 35,
    effectType: 'youth'
  },
  {
    id: 'potion_mood_boost',
    name: 'Glückseligkeits-Nektar',
    icon: '✨',
    requiredIngredients: [
      { name: 'Edle Orchidee', icon: '🌺' },
      { name: 'Bio-Honig', icon: '🍯' }
    ],
    description: 'Füllt unverzüglich alle 6 Grundbedürfnisse auf das absolute Maximum (100%).',
    manaCost: 25,
    effectType: 'mood_boost'
  },
  {
    id: 'potion_midas_wealth',
    name: 'Midas-Goldelixier',
    icon: '🪙',
    requiredIngredients: [
      { name: 'Geldbaum-Frucht', icon: '💸' },
      { name: 'Goldbarren', icon: '🪙' }
    ],
    description: 'Erzeugt sofort § 2.500 bare Simoleons und verleiht die Aura des Wohlstands.',
    manaCost: 45,
    effectType: 'midas_wealth'
  },
  {
    id: 'potion_love_philter',
    name: 'Amor Liebes-Philter',
    icon: '💖',
    requiredIngredients: [
      { name: 'Duftende Blumen', icon: '💐' },
      { name: 'Süße Erdbeeren', icon: '🍓' }
    ],
    description: 'Verleiht intensive romantische Anziehungskraft und +50% Flirt-Erfolgschance.',
    manaCost: 20,
    effectType: 'love_philter'
  }
];

export class AlchemyBrewingSystem {
  public brewedPotions: { recipeId: string; name: string; icon: string; count: number }[] = [];

  public brewPotion(recipeId: string, sim: Sim): { success: boolean; message: string; recipe?: AlchemyRecipe } {
    const recipe = ALCHEMY_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return { success: false, message: 'Unbekanntes Rezept!' };

    let potionEntry = this.brewedPotions.find(p => p.recipeId === recipeId);
    if (!potionEntry) {
      potionEntry = { recipeId, name: recipe.name, icon: recipe.icon, count: 0 };
      this.brewedPotions.push(potionEntry);
    }
    potionEntry.count += 1;

    sim.addSkillXP('logic', 25);

    return {
      success: true,
      recipe,
      message: `${recipe.name} erfolgreich am Alchemie-Kessel gebraut!`
    };
  }

  public drinkPotion(recipeId: string, sim: Sim): { success: boolean; message: string } {
    const potionEntry = this.brewedPotions.find(p => p.recipeId === recipeId && p.count > 0);
    if (!potionEntry) return { success: false, message: 'Kein Trank dieser Art mehr vorrätig!' };

    potionEntry.count -= 1;
    const recipe = ALCHEMY_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return { success: false, message: 'Rezeptfehler' };

    switch (recipe.effectType) {
      case 'youth':
        sim.needs.fillAll();
        sim.triggerEmote('✨', 5000);
        return { success: true, message: 'Verjüngungstrank getrunken! Dein Sim strotzt vor jugendlicher Frische!' };

      case 'mood_boost':
        sim.needs.fillAll();
        sim.triggerEmote('😍', 4000);
        return { success: true, message: 'Glückseligkeits-Nektar getrunken! Alle Bedürfnisse sind auf 100%!' };

      case 'midas_wealth':
        sim.simoleons += 2500;
        sim.triggerEmote('💸', 4000);
        return { success: true, message: 'Midas-Goldelixier entfaltet seine Macht: +§ 2.500 erhalten!' };

      case 'love_philter':
        sim.needs.modify('social', 50);
        sim.triggerEmote('💖', 4000);
        return { success: true, message: 'Amor Liebes-Philter aktiviert: Romantische Ausstrahlung um 50% erhöht!' };
    }
  }

  public exportData(): Record<string, any> {
    return {
      brewedPotions: this.brewedPotions
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.brewedPotions) this.brewedPotions = data.brewedPotions;
  }
}
