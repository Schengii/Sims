/**
 * Mega-Yacht & Island Cruise Fleet System
 * Buy luxury yachts, upgrade VIP decks, set charter routes,
 * and collect daily charter revenues.
 */

export interface YachtItem {
  id: string;
  name: string;
  type: 'Sunseeker 🚤' | 'Ocean Liner 🛳️' | 'Mega-Yacht ⛵';
  price: number;
  isOwned: boolean;
  charterRate: number; // § per charter guest
  dailyCharterGuests: number;
  upgrades: {
    helipad: boolean;
    vipCasino: boolean;
    jacuzziDeck: boolean;
  };
  dailyRevenue: number;
  totalEarnings: number;
}

export class YachtManager {
  private yachts: YachtItem[] = [];

  constructor() {
    this.initDefaultYachts();
  }

  private initDefaultYachts() {
    this.yachts = [
      {
        id: 'yacht_sunseeker',
        name: '🚤 Sunseeker Express Yacht',
        type: 'Sunseeker 🚤',
        price: 25000,
        isOwned: false,
        charterRate: 220,
        dailyCharterGuests: 15,
        upgrades: {
          helipad: false,
          vipCasino: false,
          jacuzziDeck: true
        },
        dailyRevenue: 3300,
        totalEarnings: 0
      },
      {
        id: 'yacht_royal_ocean',
        name: '🛳️ Royal Ocean Luxury Liner',
        type: 'Ocean Liner 🛳️',
        price: 55000,
        isOwned: false,
        charterRate: 450,
        dailyCharterGuests: 25,
        upgrades: {
          helipad: true,
          vipCasino: true,
          jacuzziDeck: true
        },
        dailyRevenue: 11250,
        totalEarnings: 0
      },
      {
        id: 'yacht_imperial_mega',
        name: '⛵ Imperial Sovereign Mega-Yacht',
        type: 'Mega-Yacht ⛵',
        price: 120000,
        isOwned: false,
        charterRate: 950,
        dailyCharterGuests: 40,
        upgrades: {
          helipad: true,
          vipCasino: true,
          jacuzziDeck: true
        },
        dailyRevenue: 38000,
        totalEarnings: 0
      }
    ];
  }

  public getYachts(): YachtItem[] {
    return this.yachts;
  }

  public getYacht(id: string): YachtItem | undefined {
    return this.yachts.find(y => y.id === id);
  }

  public buyYacht(id: string, currentSimoleons: number): { success: boolean; message: string; cost: number } {
    const yacht = this.getYacht(id);
    if (!yacht) return { success: false, message: 'Yacht nicht gefunden.', cost: 0 };
    if (yacht.isOwned) return { success: false, message: 'Diese Yacht gehört dir bereits!', cost: 0 };
    if (currentSimoleons < yacht.price) {
      return { success: false, message: `Nicht genug Simoleons! Du benötigst §${yacht.price.toLocaleString()}.`, cost: 0 };
    }

    yacht.isOwned = true;
    this.recalculateYachtMetrics(yacht);
    return {
      success: true,
      message: `🎉 Herzlichen Glückwunsch! Du hast die ${yacht.name} für §${yacht.price.toLocaleString()} gekauft!`,
      cost: yacht.price
    };
  }

  public toggleUpgrade(yachtId: string, upgradeKey: keyof YachtItem['upgrades'], cost: number, currentSimoleons: number): { success: boolean; message: string; cost: number } {
    const yacht = this.getYacht(yachtId);
    if (!yacht || !yacht.isOwned) return { success: false, message: 'Du besitzt diese Yacht nicht.', cost: 0 };

    const isActive = yacht.upgrades[upgradeKey];
    if (!isActive && currentSimoleons < cost) {
      return { success: false, message: `Nicht genug Simoleons! Upgrade kostet §${cost.toLocaleString()}.`, cost: 0 };
    }

    yacht.upgrades[upgradeKey] = !isActive;
    const actualCost = !isActive ? cost : 0;
    this.recalculateYachtMetrics(yacht);

    return {
      success: true,
      message: `✨ Upgrade ${!isActive ? 'installiert' : 'entfernt'} für ${yacht.name}!`,
      cost: actualCost
    };
  }

  public recalculateYachtMetrics(yacht: YachtItem): void {
    let bonusGuests = 0;
    if (yacht.upgrades.helipad) bonusGuests += 5;
    if (yacht.upgrades.vipCasino) bonusGuests += 8;
    if (yacht.upgrades.jacuzziDeck) bonusGuests += 4;

    const totalGuests = yacht.dailyCharterGuests + bonusGuests;
    yacht.dailyRevenue = totalGuests * yacht.charterRate;
  }

  public collectDailyCharter(): { totalRevenue: number; message: string } {
    let totalRevenue = 0;
    const ownedYachts = this.yachts.filter(y => y.isOwned);

    if (ownedYachts.length === 0) {
      return { totalRevenue: 0, message: 'Keine Yachten in deinem Besitz.' };
    }

    ownedYachts.forEach(y => {
      this.recalculateYachtMetrics(y);
      totalRevenue += y.dailyRevenue;
      y.totalEarnings += y.dailyRevenue;
    });

    return {
      totalRevenue,
      message: `⚓ Tägliche Charter-Einnahmen: §${totalRevenue.toLocaleString()} von ${ownedYachts.length} Yacht(en) kassiert!`
    };
  }

  public exportData(): any {
    return this.yachts;
  }

  public importData(data: any): void {
    if (Array.isArray(data)) {
      data.forEach(imported => {
        const y = this.getYacht(imported.id);
        if (y) Object.assign(y, imported);
      });
    }
  }
}
