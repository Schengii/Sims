/**
 * Resort Empire & Island Getaway System
 * Allows Sims to buy, upgrade, and manage luxury island resorts & lodges,
 * adjust pricing tiers, hire staff, add amenities, and collect daily profits.
 */

export interface Resort {
  id: string;
  name: string;
  location: string;
  price: number;
  isOwned: boolean;
  starRating: number; // 1.0 to 5.0
  roomRate: number; // Daily room rate per guest (§)
  amenities: {
    poolBar: boolean;
    tikiBuffet: boolean;
    luxurySpa: boolean;
    fireShow: boolean;
    privateBeach: boolean;
  };
  dailyGuests: number;
  dailyRevenue: number;
  dailyExpenses: number;
  netProfit: number;
  totalEarnings: number;
}

export class ResortManager {
  private resorts: Resort[] = [];

  constructor() {
    this.initDefaultResorts();
  }

  private initDefaultResorts() {
    this.resorts = [
      {
        id: 'sunbreeze_resort',
        name: '🌴 Sunbreeze Island Resort',
        location: 'Sulani Palms',
        price: 15000,
        isOwned: false,
        starRating: 3.2,
        roomRate: 150,
        amenities: {
          poolBar: false,
          tikiBuffet: true,
          luxurySpa: false,
          fireShow: false,
          privateBeach: true
        },
        dailyGuests: 12,
        dailyRevenue: 1800,
        dailyExpenses: 600,
        netProfit: 1200,
        totalEarnings: 0
      },
      {
        id: 'coral_boutique_hotel',
        name: '🪸 Coral Reef Boutique Hotel',
        location: 'Emerald Lagoon',
        price: 28000,
        isOwned: false,
        starRating: 4.1,
        roomRate: 280,
        amenities: {
          poolBar: true,
          tikiBuffet: true,
          luxurySpa: true,
          fireShow: false,
          privateBeach: true
        },
        dailyGuests: 20,
        dailyRevenue: 5600,
        dailyExpenses: 1800,
        netProfit: 3800,
        totalEarnings: 0
      },
      {
        id: 'alpine_peak_spa',
        name: '🏔️ Alpine Peak Spa & Wellness Lodge',
        location: 'Mt. Komorebi Crest',
        price: 45000,
        isOwned: false,
        starRating: 4.8,
        roomRate: 450,
        amenities: {
          poolBar: true,
          tikiBuffet: true,
          luxurySpa: true,
          fireShow: true,
          privateBeach: false
        },
        dailyGuests: 30,
        dailyRevenue: 13500,
        dailyExpenses: 4000,
        netProfit: 9500,
        totalEarnings: 0
      }
    ];
  }

  public getResorts(): Resort[] {
    return this.resorts;
  }

  public getResort(id: string): Resort | undefined {
    return this.resorts.find(r => r.id === id);
  }

  public buyResort(id: string, currentSimoleons: number): { success: boolean; message: string; cost: number } {
    const resort = this.getResort(id);
    if (!resort) return { success: false, message: 'Resort nicht gefunden.', cost: 0 };
    if (resort.isOwned) return { success: false, message: 'Dieses Resort gehört dir bereits!', cost: 0 };
    if (currentSimoleons < resort.price) {
      return { success: false, message: `Nicht genug Simoleons! Du benötigst §${resort.price.toLocaleString()}.`, cost: 0 };
    }

    resort.isOwned = true;
    this.recalculateResortMetrics(resort);
    return { success: true, message: `🎉 Herzlichen Glückwunsch! Du hast das ${resort.name} für §${resort.price.toLocaleString()} gekauft!`, cost: resort.price };
  }

  public toggleAmenity(resortId: string, amenityKey: keyof Resort['amenities'], cost: number, currentSimoleons: number): { success: boolean; message: string; cost: number } {
    const resort = this.getResort(resortId);
    if (!resort || !resort.isOwned) return { success: false, message: 'Du besitzt dieses Resort nicht.', cost: 0 };

    const isCurrentlyActive = resort.amenities[amenityKey];
    if (!isCurrentlyActive && currentSimoleons < cost) {
      return { success: false, message: `Nicht genug Simoleons! Ausbau kostet §${cost.toLocaleString()}.`, cost: 0 };
    }

    resort.amenities[amenityKey] = !isCurrentlyActive;
    const actualCost = !isCurrentlyActive ? cost : 0;
    this.recalculateResortMetrics(resort);

    const statusStr = resort.amenities[amenityKey] ? 'freigeschaltet' : 'deaktiviert';
    return {
      success: true,
      message: `✨ Upgrade ${statusStr} für ${resort.name}! Sternewertung neu berechnet.`,
      cost: actualCost
    };
  }

  public setRoomRate(resortId: string, newRate: number): { success: boolean; message: string } {
    const resort = this.getResort(resortId);
    if (!resort || !resort.isOwned) return { success: false, message: 'Du besitzt dieses Resort nicht.' };
    
    resort.roomRate = Math.max(50, Math.min(1500, newRate));
    this.recalculateResortMetrics(resort);
    return { success: true, message: `Zimmerpreis auf §${resort.roomRate}/Nacht angepasst.` };
  }

  public recalculateResortMetrics(resort: Resort) {
    let baseRating = 2.5;
    let activeAmenitiesCount = 0;

    if (resort.amenities.poolBar) { baseRating += 0.5; activeAmenitiesCount++; }
    if (resort.amenities.tikiBuffet) { baseRating += 0.5; activeAmenitiesCount++; }
    if (resort.amenities.luxurySpa) { baseRating += 0.7; activeAmenitiesCount++; }
    if (resort.amenities.fireShow) { baseRating += 0.5; activeAmenitiesCount++; }
    if (resort.amenities.privateBeach) { baseRating += 0.3; activeAmenitiesCount++; }

    // Price elasticity penalty if rate is too high for rating
    const optimalRate = baseRating * 80;
    if (resort.roomRate > optimalRate * 1.5) {
      baseRating -= 0.6;
    }

    resort.starRating = Math.min(5.0, Math.max(1.0, Math.round(baseRating * 10) / 10));

    // Calculate daily guests based on rating & rate attractiveness
    const attractiveness = resort.starRating / (resort.roomRate / 100);
    resort.dailyGuests = Math.max(5, Math.round(attractiveness * 12));

    resort.dailyRevenue = resort.dailyGuests * resort.roomRate;
    resort.dailyExpenses = Math.round(resort.dailyRevenue * 0.35 + activeAmenitiesCount * 400);
    resort.netProfit = Math.max(0, resort.dailyRevenue - resort.dailyExpenses);
  }

  public collectDailyProfits(): { totalProfit: number; text: string } {
    let totalProfit = 0;
    const ownedResorts = this.resorts.filter(r => r.isOwned);

    if (ownedResorts.length === 0) {
      return { totalProfit: 0, text: 'Keine Resorts in deinem Besitz.' };
    }

    ownedResorts.forEach(r => {
      this.recalculateResortMetrics(r);
      totalProfit += r.netProfit;
      r.totalEarnings += r.netProfit;
    });

    return {
      totalProfit,
      text: `🏝️ Tägliche Resort-Einnahmen: §${totalProfit.toLocaleString()} aus ${ownedResorts.length} Resort(s) erhalten!`
    };
  }

  public exportData(): any {
    return this.resorts;
  }

  public importData(data: any) {
    if (Array.isArray(data)) {
      data.forEach(imported => {
        const existing = this.getResort(imported.id);
        if (existing) {
          Object.assign(existing, imported);
        }
      });
    }
  }
}
