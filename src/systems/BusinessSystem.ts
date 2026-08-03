/**
 * Retail Business & Store Management System for Sims 5
 * Manages store ownership, pricing margins, daily customer sales,
 * customer satisfaction, and business perks.
 */

export interface StoreType {
  id: string;
  name: string;
  icon: string;
  description: string;
  baseRevenuePerSale: number;
}

export const STORES_CATALOG: Record<string, StoreType> = {
  bakery: {
    id: 'bakery',
    name: 'Gourmet Bäckerei & Konditorei 🥐',
    icon: '🥐',
    description: 'Serviere frisches Gebäck, Torten & Espresso an kaufhungrige Gäste.',
    baseRevenuePerSale: 120
  },
  gallery: {
    id: 'gallery',
    name: 'Moderne Kunstgalerie 🎨',
    icon: '🎨',
    description: 'Stelle selbstgemalte Kunstwerke aus und verkaufe sie an Sammler.',
    baseRevenuePerSale: 350
  },
  pet_shop: {
    id: 'pet_shop',
    name: 'Haustier-Boutique 🐕',
    icon: '🐕',
    description: 'Verkaufe Hundespielzeug, Katzen-Kratzbäume & Gourmet-Futternäpfe.',
    baseRevenuePerSale: 220
  }
};

export class BusinessManager {
  public storeId: string = 'bakery';
  public isStoreOpen: boolean = false;
  public marginSetting: 'fair' | 'premium' | 'luxury' = 'fair';
  public dailyRevenue: number = 450;
  public customerSatisfaction: number = 85;
  public totalSalesCount: number = 12;

  public toggleStoreOpen(): boolean {
    this.isStoreOpen = !this.isStoreOpen;
    return this.isStoreOpen;
  }

  public setMargin(margin: 'fair' | 'premium' | 'luxury'): void {
    this.marginSetting = margin;
    if (margin === 'fair') this.customerSatisfaction = 95;
    if (margin === 'premium') this.customerSatisfaction = 80;
    if (margin === 'luxury') this.customerSatisfaction = 60;
  }

  public simulateCustomerTick(): number {
    if (!this.isStoreOpen) return 0;

    const store = STORES_CATALOG[this.storeId] || STORES_CATALOG.bakery;
    let multiplier = 1.0;
    if (this.marginSetting === 'premium') multiplier = 1.3;
    if (this.marginSetting === 'luxury') multiplier = 1.7;

    const saleAmount = Math.floor(store.baseRevenuePerSale * multiplier);
    this.dailyRevenue += saleAmount;
    this.totalSalesCount++;
    return saleAmount;
  }

  public collectRevenue(sim: import('../entity/Sim').Sim): number {
    const collected = this.dailyRevenue;
    sim.simoleons += collected;
    this.dailyRevenue = 0;
    return collected;
  }
}
