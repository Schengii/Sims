/**
 * Banking, Vault & Savings Interest System
 * Allows Sims to store Simoleons in a High-Yield Savings Vault (5% weekly interest),
 * stash physical Gold Bars and Gemstones, and withdraw dividends.
 */

import { Sim } from '../entity/Sim';

export class BankingVaultSystem {
  public savingsBalance: number = 0;
  public goldBars: number = 0; // § 1.000 value per bar
  public diamonds: number = 0; // § 2.500 value per diamond
  public lastInterestDay: number = 0;

  public depositSavings(sim: Sim, amount: number): boolean {
    if (amount <= 0 || sim.simoleons < amount) return false;

    sim.simoleons -= amount;
    this.savingsBalance += amount;
    return true;
  }

  public withdrawSavings(sim: Sim, amount: number): boolean {
    if (amount <= 0 || this.savingsBalance < amount) return false;

    this.savingsBalance -= amount;
    sim.simoleons += amount;
    return true;
  }

  public buyGoldBar(sim: Sim): boolean {
    const cost = 1000;
    if (sim.simoleons < cost) return false;

    sim.simoleons -= cost;
    this.goldBars += 1;
    return true;
  }

  public sellGoldBar(sim: Sim): boolean {
    if (this.goldBars <= 0) return false;

    this.goldBars -= 1;
    sim.simoleons += 1050; // Slight profit
    return true;
  }

  public buyDiamond(sim: Sim): boolean {
    const cost = 2500;
    if (sim.simoleons < cost) return false;

    sim.simoleons -= cost;
    this.diamonds += 1;
    return true;
  }

  public sellDiamond(sim: Sim): boolean {
    if (this.diamonds <= 0) return false;

    this.diamonds -= 1;
    sim.simoleons += 2650;
    return true;
  }

  public applyWeeklyInterest(currentDay: number): number {
    if (currentDay - this.lastInterestDay >= 7 && this.savingsBalance > 0) {
      const interestEarned = Math.round(this.savingsBalance * 0.05); // 5%
      this.savingsBalance += interestEarned;
      this.lastInterestDay = currentDay;
      return interestEarned;
    }
    return 0;
  }

  public getTotalNetWorth(): number {
    return this.savingsBalance + (this.goldBars * 1050) + (this.diamonds * 2650);
  }

  public exportData(): Record<string, any> {
    return {
      savingsBalance: this.savingsBalance,
      goldBars: this.goldBars,
      diamonds: this.diamonds,
      lastInterestDay: this.lastInterestDay
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.savingsBalance !== undefined) this.savingsBalance = data.savingsBalance;
    if (data.goldBars !== undefined) this.goldBars = data.goldBars;
    if (data.diamonds !== undefined) this.diamonds = data.diamonds;
    if (data.lastInterestDay !== undefined) this.lastInterestDay = data.lastInterestDay;
  }
}
