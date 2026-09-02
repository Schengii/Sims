import { describe, it, expect, beforeEach } from 'vitest';
import { BankingVaultSystem } from './BankingVaultSystem';
import { Sim } from '../entity/Sim';

describe('BankingVaultSystem', () => {
  let vault: BankingVaultSystem;
  let sim: Sim;

  beforeEach(() => {
    vault = new BankingVaultSystem();
    sim = new Sim();
    sim.simoleons = 5000;
  });

  it('should deposit and withdraw savings correctly', () => {
    expect(vault.depositSavings(sim, 2000)).toBe(true);
    expect(sim.simoleons).toBe(3000);
    expect(vault.savingsBalance).toBe(2000);

    expect(vault.withdrawSavings(sim, 1000)).toBe(true);
    expect(sim.simoleons).toBe(4000);
    expect(vault.savingsBalance).toBe(1000);
  });

  it('should buy and sell gold bars', () => {
    expect(vault.buyGoldBar(sim)).toBe(true);
    expect(vault.goldBars).toBe(1);
    expect(sim.simoleons).toBe(4000);

    expect(vault.sellGoldBar(sim)).toBe(true);
    expect(vault.goldBars).toBe(0);
    expect(sim.simoleons).toBe(5050);
  });

  it('should calculate 5% weekly interest on savings', () => {
    vault.depositSavings(sim, 4000);
    const earned = vault.applyWeeklyInterest(7);

    expect(earned).toBe(200); // 5% of 4000
    expect(vault.savingsBalance).toBe(4200);
  });
});
