/**
 * Real Estate & Landlord Management Engine
 * Purchase investment properties, collect weekly tenant rent, upgrade lot tier, and handle maintenance.
 */

export interface PropertyLot {
  id: string;
  name: string;
  category: 'residential' | 'commercial' | 'vacation';
  price: number;
  weeklyRent: number;
  isOwned: boolean;
  tenantName?: string;
  tierLevel: number; // 1 to 3
  icon: string;
}

export const REAL_ESTATE_CATALOG: PropertyLot[] = [
  {
    id: 'prop_starter_apartment',
    name: 'Willow Creek Starter Appartment',
    category: 'residential',
    price: 8500,
    weeklyRent: 450,
    isOwned: false,
    tenantName: 'Summer Holiday',
    tierLevel: 1,
    icon: '🏢'
  },
  {
    id: 'prop_luxury_villa',
    name: 'Oasis Springs Luxus-Villa',
    category: 'residential',
    price: 25000,
    weeklyRent: 1400,
    isOwned: false,
    tenantName: 'Malcolm Landgraab',
    tierLevel: 2,
    icon: '🏰'
  },
  {
    id: 'prop_beach_resort',
    name: 'Sulani Strand-Bungalow',
    category: 'vacation',
    price: 45000,
    weeklyRent: 2800,
    isOwned: false,
    tenantName: 'Keanu Reeves',
    tierLevel: 3,
    icon: '🏝️'
  }
];

export class RealEstateManager {
  public properties: PropertyLot[] = [...REAL_ESTATE_CATALOG];

  public buyProperty(id: string, simoleons: number): { success: boolean; cost: number; message: string } {
    const prop = this.properties.find(p => p.id === id);
    if (!prop) return { success: false, cost: 0, message: 'Immobilie nicht gefunden.' };
    if (prop.isOwned) return { success: false, cost: 0, message: 'Immobilie gehört dir bereits.' };
    if (simoleons < prop.price) return { success: false, cost: 0, message: 'Nicht genügend Simoleons!' };

    prop.isOwned = true;
    return {
      success: true,
      cost: prop.price,
      message: `Herzlichen Glückwunsch! Du hast "${prop.name}" für § ${prop.price.toLocaleString()} erworben!`
    };
  }

  public collectWeeklyRent(): number {
    let totalRent = 0;
    this.properties.forEach(p => {
      if (p.isOwned) {
        totalRent += p.weeklyRent * p.tierLevel;
      }
    });
    return totalRent;
  }

  public upgradeProperty(id: string, simoleons: number): { success: boolean; cost: number; message: string } {
    const prop = this.properties.find(p => p.id === id);
    if (!prop || !prop.isOwned) return { success: false, cost: 0, message: 'Immobilie nicht in deinem Besitz.' };
    if (prop.tierLevel >= 3) return { success: false, cost: 0, message: 'Bereits auf Stufe 3 (Maximaler Luxus)!' };

    const upgradeCost = prop.price * 0.4;
    if (simoleons < upgradeCost) return { success: false, cost: 0, message: 'Nicht genügend Simoleons für Upgrade!' };

    prop.tierLevel += 1;
    return {
      success: true,
      cost: upgradeCost,
      message: `"${prop.name}" auf Stufe ${prop.tierLevel} aufgewertet! Mieteinnahmen um 40% gestiegen.`
    };
  }
}
