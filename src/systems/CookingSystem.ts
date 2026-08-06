/**
 * Cooking & Recipe System
 * Interactive recipe collection, ingredient discount calculations,
 * single vs. family meal preparation, and quality ratings.
 */

import { Sim } from '../entity/Sim';

export interface Recipe {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'gourmet' | 'dessert';
  requiredLevel: number;
  costSingle: number;
  costFamily: number;
  hungerBoost: number;
  icon: string;
  gardenIngredient?: string; // Optional garden item for 50% discount
}

export class CookingManager {
  public static RECIPES: Recipe[] = [
    { id: 'r1', name: 'Gartensalat', category: 'breakfast', requiredLevel: 1, costSingle: 5, costFamily: 18, hungerBoost: 35, icon: '🥗', gardenIngredient: 'Tomate' },
    { id: 'r2', name: 'Rührei mit Toast', category: 'breakfast', requiredLevel: 1, costSingle: 8, costFamily: 28, hungerBoost: 40, icon: '🍳' },
    { id: 'r3', name: 'Käsetoast', category: 'lunch', requiredLevel: 2, costSingle: 10, costFamily: 35, hungerBoost: 50, icon: '🥪' },
    { id: 'r4', name: 'Spaghetti Bolognese', category: 'lunch', requiredLevel: 3, costSingle: 15, costFamily: 50, hungerBoost: 65, icon: '🍝', gardenIngredient: 'Basilikum' },
    { id: 'r5', name: 'Gegrillter Lachs', category: 'gourmet', requiredLevel: 4, costSingle: 25, costFamily: 85, hungerBoost: 80, icon: '🐟' },
    { id: 'r6', name: 'Hummer Thermidor', category: 'gourmet', requiredLevel: 6, costSingle: 45, costFamily: 150, hungerBoost: 95, icon: '🦞' },
    { id: 'r7', name: 'Schokoladen-Traumtorte', category: 'dessert', requiredLevel: 5, costSingle: 30, costFamily: 100, hungerBoost: 75, icon: '🎂', gardenIngredient: 'Erdbeere' },
    { id: 'r8', name: 'Flambierter Crepe', category: 'dessert', requiredLevel: 7, costSingle: 40, costFamily: 130, hungerBoost: 85, icon: '🥞' },
  ];

  public static getAvailableRecipes(cookingLevel: number): Recipe[] {
    return this.RECIPES.filter(r => r.requiredLevel <= cookingLevel);
  }

  public static prepareMeal(sim: Sim, recipeId: string, isFamilyMeal: boolean): { success: boolean; cost: number; mealName: string; hungerBoost: number } {
    const recipe = this.RECIPES.find(r => r.id === recipeId);
    if (!recipe) return { success: false, cost: 0, mealName: '', hungerBoost: 0 };

    let cost = isFamilyMeal ? recipe.costFamily : recipe.costSingle;

    // Garden produce ingredient discount
    if (recipe.gardenIngredient && sim.inventory.hasItem(recipe.gardenIngredient)) {
      cost = Math.round(cost * 0.5);
      sim.inventory.removeItemByName(recipe.gardenIngredient);
    }

    if (sim.simoleons < cost) {
      return { success: false, cost, mealName: recipe.name, hungerBoost: 0 };
    }

    sim.simoleons -= cost;

    // Cooking skill XP gain
    sim.skills.cooking = Math.min(10, sim.skills.cooking + 0.2);

    return {
      success: true,
      cost,
      mealName: recipe.name,
      hungerBoost: recipe.hungerBoost
    };
  }
}
