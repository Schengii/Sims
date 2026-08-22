import { describe, it, expect, beforeEach } from 'vitest';
import { EconomyMarketSystem } from './EconomyMarketSystem';

describe('EconomyMarketSystem', () => {
  let market: EconomyMarketSystem;

  beforeEach(() => {
    market = new EconomyMarketSystem();
  });

  it('initializes commodities and stocks', () => {
    expect(market.commodities['tomatoes']).toBeDefined();
    expect(market.stocks['LLMA']).toBeDefined();
    expect(market.stocks['LLMA'].pricePerShare).toBeGreaterThan(0);
  });

  it('buys and sells stocks correctly updating balances', () => {
    const buyRes = market.buyStock('LLMA', 5, 2000);
    expect(buyRes.success).toBe(true);
    expect(market.stocks['LLMA'].ownedShares).toBe(5);

    const sellRes = market.sellStock('LLMA', 2);
    expect(sellRes.success).toBe(true);
    expect(market.stocks['LLMA'].ownedShares).toBe(3);
  });

  it('pays dividends on dividend cycle days', () => {
    market.buyStock('GOTH', 10, 5000);
    const day7Res = market.updateDailyMarket(7);
    expect(day7Res.dividendPaid).toBe(10 * market.stocks['GOTH'].weeklyDividend);
  });
});
