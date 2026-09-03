/**
 * Beekeeping Manufactory & Beeswax Candle System
 * Allows Sims to spin raw honeycomb in the centrifuge, craft fragrant beeswax candles, face masks, and royal jelly elixirs.
 */

import { Sim } from '../entity/Sim';

export interface HoneyProduct {
  id: string;
  name: string;
  icon: string;
  category: 'honey' | 'candle' | 'cosmetic' | 'elixir';
  value: number;
  ingredients: string;
}

export const HONEY_RECIPES: HoneyProduct[] = [
  {
    id: 'premium_honey_jar',
    name: 'Edler Bio-Blütenhonig',
    icon: '🍯',
    category: 'honey',
    value: 90,
    ingredients: '1x Rohwabe'
  },
  {
    id: 'fragrant_beeswax_candle',
    name: 'Duftende Bienenwachskerze',
    icon: '🕯️',
    category: 'candle',
    value: 65,
    ingredients: 'Bienenwachs + Docht'
  },
  {
    id: 'royal_jelly_mask',
    name: 'Gelee-Royale-Gesichtsmaske',
    icon: '🧴',
    category: 'cosmetic',
    value: 140,
    ingredients: 'Gelee Royale + Aloe'
  },
  {
    id: 'propolis_elixir',
    name: 'Propolis-Immunelixier',
    icon: '🐝',
    category: 'elixir',
    value: 180,
    ingredients: 'Propolis + Kräuter'
  }
];

export class BeekeepingManufactorySystem {
  public craftedProducts: HoneyProduct[] = [];
  public honeySpunCount: number = 0;

  public spinHoney(sim: Sim): { message: string } {
    this.honeySpunCount += 1;
    sim.addSkillXP('handiness', 30);
    sim.needs.modify('fun', 20);

    const product: HoneyProduct = HONEY_RECIPES[0];
    this.craftedProducts.push(product);
    sim.simoleons += product.value;

    return {
      message: `🍯 Honigschleuder betätigt! "${product.name}" abgefüllt (+§ ${product.value})!`
    };
  }

  public craftProduct(recipeId: string, sim: Sim): { success: boolean; product?: HoneyProduct; message: string } {
    const item = HONEY_RECIPES.find(r => r.id === recipeId);
    if (!item) return { success: false, message: 'Unbekanntes Rezept!' };

    this.craftedProducts.push(item);
    sim.addSkillXP('handiness', 35);
    sim.needs.modify('fun', 25);
    sim.simoleons += item.value;
    sim.triggerEmote(item.icon, 3500);

    return {
      success: true,
      product: item,
      message: `✨ "${item.name}" erfolgreich hergestellt & verkauft (+§ ${item.value})!`
    };
  }

  public exportData(): Record<string, any> {
    return {
      craftedProducts: this.craftedProducts,
      honeySpunCount: this.honeySpunCount
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.craftedProducts) this.craftedProducts = data.craftedProducts;
    if (data.honeySpunCount !== undefined) this.honeySpunCount = data.honeySpunCount;
  }
}
