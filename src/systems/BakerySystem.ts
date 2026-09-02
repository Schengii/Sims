/**
 * Gourmet Bakery & Pastry Confectionery System
 * Allows Sims to bake wedding cakes, cupcakes, croissants, and baguettes in the bakery oven,
 * stock the pastry display case, and sell baked goods to townies for profit.
 */

import { Sim } from '../entity/Sim';

export interface BakedPastry {
  id: string;
  name: string;
  icon: string;
  category: 'cake' | 'cupcake' | 'pastry' | 'bread';
  sellingPrice: number;
  ingredients: string;
  prepTimeSeconds: number;
}

export const BAKERY_RECIPES: BakedPastry[] = [
  {
    id: 'wedding_cake',
    name: 'Dreistöckige Hochzeitstorte',
    icon: '🎂',
    category: 'cake',
    sellingPrice: 450,
    ingredients: 'Erdbeeren + Honig',
    prepTimeSeconds: 6
  },
  {
    id: 'lemon_cupcakes',
    name: 'Gourmet-Cupcakes',
    icon: '🧁',
    category: 'cupcake',
    sellingPrice: 120,
    ingredients: 'Süße Früchte',
    prepTimeSeconds: 4
  },
  {
    id: 'butter_croissants',
    name: 'Französische Butter-Croissants',
    icon: '🥐',
    category: 'pastry',
    sellingPrice: 80,
    ingredients: 'Feinste Butter',
    prepTimeSeconds: 3
  },
  {
    id: 'sourdough_baguette',
    name: 'Rustikales Sauerteig-Baguette',
    icon: '🥖',
    category: 'bread',
    sellingPrice: 95,
    ingredients: 'Bio-Mehl & Hefe',
    prepTimeSeconds: 3
  }
];

export class BakerySystem {
  public displayCaseInventory: { recipeId: string; name: string; icon: string; price: number; quantity: number }[] = [];
  public totalRevenue: number = 0;

  public bakePastry(recipeId: string, sim: Sim): { success: boolean; message: string; pastry?: BakedPastry } {
    const recipe = BAKERY_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return { success: false, message: 'Unbekanntes Rezept!' };

    let stock = this.displayCaseInventory.find(i => i.recipeId === recipeId);
    if (!stock) {
      stock = { recipeId, name: recipe.name, icon: recipe.icon, price: recipe.sellingPrice, quantity: 0 };
      this.displayCaseInventory.push(stock);
    }
    stock.quantity += 1;

    sim.addSkillXP('cooking', 30);
    sim.needs.modify('hunger', 20);

    return {
      success: true,
      pastry: recipe,
      message: `"${recipe.name}" frisch gebacken und in die Verkaufsvitrine gelegt!`
    };
  }

  public simulateCustomerPurchase(): { soldItem?: string; revenue: number } {
    const available = this.displayCaseInventory.filter(i => i.quantity > 0);
    if (available.length === 0) return { revenue: 0 };

    const item = available[Math.floor(Math.random() * available.length)];
    item.quantity -= 1;
    this.totalRevenue += item.price;

    return {
      soldItem: item.name,
      revenue: item.price
    };
  }

  public exportData(): Record<string, any> {
    return {
      displayCaseInventory: this.displayCaseInventory,
      totalRevenue: this.totalRevenue
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.displayCaseInventory) this.displayCaseInventory = data.displayCaseInventory;
    if (data.totalRevenue !== undefined) this.totalRevenue = data.totalRevenue;
  }
}
