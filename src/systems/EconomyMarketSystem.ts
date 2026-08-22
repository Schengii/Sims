/**
 * EconomyMarketSystem - Dynamic Commodity & Stock Market Engine
 * Handles fluctuating prices for crops & crafts, demand indices,
 * and equity investments with weekly dividend returns.
 */

export interface MarketCommodity {
  id: string;
  name: string;
  icon: string;
  basePrice: number;
  currentPrice: number;
  demand: 'Niedrig' | 'Normal' | 'Hoch';
  trend: '📈 Steigend' | '📉 Fallend' | '➡️ Stabil';
}

export interface StockCompany {
  symbol: string;
  name: string;
  icon: string;
  pricePerShare: number;
  ownedShares: number;
  weeklyDividend: number;
  history: number[];
}

export class EconomyMarketSystem {
  public commodities: Record<string, MarketCommodity> = {
    tomatoes: { id: 'tomatoes', name: 'Bio-Tomaten', icon: '🍅', basePrice: 40, currentPrice: 42, demand: 'Normal', trend: '➡️ Stabil' },
    strawberries: { id: 'strawberries', name: 'Süße Erdbeeren', icon: '🍓', basePrice: 65, currentPrice: 70, demand: 'Hoch', trend: '📈 Steigend' },
    painting_master: { id: 'painting_master', name: 'Meisterwerk-Gemälde', icon: '🎨', basePrice: 350, currentPrice: 380, demand: 'Hoch', trend: '📈 Steigend' },
    honey: { id: 'honey', name: 'Bio-Waldhonig', icon: '🍯', basePrice: 85, currentPrice: 80, demand: 'Normal', trend: '➡️ Stabil' },
    potion: { id: 'potion', name: 'Magischer Glückstrank', icon: '🧪', basePrice: 200, currentPrice: 190, demand: 'Niedrig', trend: '📉 Fallend' }
  };

  public stocks: Record<string, StockCompany> = {
    LLMA: { symbol: 'LLMA', name: 'LlamaTech AI Systems', icon: '🦙', pricePerShare: 145, ownedShares: 0, weeklyDividend: 8, history: [130, 138, 145] },
    PGRN: { symbol: 'PGRN', name: 'Plumbob Green Energy', icon: '🟢', pricePerShare: 85, ownedShares: 0, weeklyDividend: 5, history: [80, 82, 85] },
    GOTH: { symbol: 'GOTH', name: 'Goth Real Estate Holding', icon: '🏰', pricePerShare: 220, ownedShares: 0, weeklyDividend: 16, history: [210, 215, 220] }
  };

  private lastSimDay: number = 0;

  /**
   * Updates market prices and demand daily (and pays dividends on Day 7, 14, 21, etc.).
   */
  public updateDailyMarket(currentDay: number): { dividendPaid: number; summary: string } {
    if (currentDay === this.lastSimDay) {
      return { dividendPaid: 0, summary: '' };
    }
    this.lastSimDay = currentDay;

    // 1. Fluctuate Commodity Prices
    Object.values(this.commodities).forEach(item => {
      const changePercent = (Math.random() * 0.4 - 0.2); // -20% to +20%
      item.currentPrice = Math.max(10, Math.round(item.basePrice * (1 + changePercent)));
      if (changePercent > 0.08) {
        item.demand = 'Hoch';
        item.trend = '📈 Steigend';
      } else if (changePercent < -0.08) {
        item.demand = 'Niedrig';
        item.trend = '📉 Fallend';
      } else {
        item.demand = 'Normal';
        item.trend = '➡️ Stabil';
      }
    });

    // 2. Fluctuate Stocks
    let totalDividends = 0;
    const isDividendDay = currentDay % 7 === 0;

    Object.values(this.stocks).forEach(stk => {
      const stockFluct = (Math.random() * 0.16 - 0.08); // -8% to +8%
      stk.pricePerShare = Math.max(20, Math.round(stk.pricePerShare * (1 + stockFluct)));
      stk.history.push(stk.pricePerShare);
      if (stk.history.length > 10) stk.history.shift();

      if (isDividendDay && stk.ownedShares > 0) {
        totalDividends += stk.ownedShares * stk.weeklyDividend;
      }
    });

    return {
      dividendPaid: totalDividends,
      summary: isDividendDay && totalDividends > 0
        ? `Wöchentliche Dividende ausgezahlt: § ${totalDividends}!`
        : 'Wirtschaftsmarkt-Kurse für den neuen Tag aktualisiert.'
    };
  }

  public buyStock(symbol: string, shares: number, currentSimoleons: number): { success: boolean; cost: number; message: string } {
    const stk = this.stocks[symbol];
    if (!stk || shares <= 0) return { success: false, cost: 0, message: 'Ungültige Aktien-Auswahl.' };

    const totalCost = stk.pricePerShare * shares;
    if (currentSimoleons < totalCost) {
      return { success: false, cost: 0, message: `Nicht genügend Simoleons (§ ${totalCost} benötigt)!` };
    }

    stk.ownedShares += shares;
    return {
      success: true,
      cost: totalCost,
      message: `${shares}x ${stk.name} Anteile für § ${totalCost} gekauft!`
    };
  }

  public sellStock(symbol: string, shares: number): { success: boolean; revenue: number; message: string } {
    const stk = this.stocks[symbol];
    if (!stk || shares <= 0 || stk.ownedShares < shares) {
      return { success: false, revenue: 0, message: 'Nicht genügend Anteile im Depot!' };
    }

    const revenue = stk.pricePerShare * shares;
    stk.ownedShares -= shares;
    return {
      success: true,
      revenue,
      message: `${shares}x ${stk.name} Anteile für § ${revenue} verkauft!`
    };
  }
}
