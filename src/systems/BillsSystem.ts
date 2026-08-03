/**
 * Bills & Eco Utility System for Sims 5
 * Calculates property taxes, utility bills, eco-energy discounts,
 * and handles power shutoff penalties when unpaid.
 */

import type { House } from '../world/House';

export interface BillBreakdown {
  propertyTax: number;
  furnitureTax: number;
  ecoDiscount: number;
  totalAmount: number;
  solarCount: number;
  windCount: number;
}

export class BillsManager {
  public dueDay: number = 7;
  public pendingBillAmount: number = 280;
  public isBillDue: boolean = false;
  public isPowerCutoff: boolean = false;

  public updateTime(day: number, house: House): void {
    if (day >= this.dueDay && !this.isBillDue) {
      const breakdown = this.calculateBreakdown(house);
      this.pendingBillAmount = breakdown.totalAmount;
      this.isBillDue = true;
    }

    // Shut off power if overdue by 3 days
    if (this.isBillDue && day > this.dueDay + 3) {
      this.isPowerCutoff = true;
    }
  }

  public calculateBreakdown(house: House): BillBreakdown {
    const furnitureCount = house.placedFurniture.length;
    const propertyTax = 150;
    const furnitureTax = furnitureCount * 15;

    let solarCount = 0;
    let windCount = 0;

    house.placedFurniture.forEach(f => {
      if (f.furnitureId === 'solar_panel') solarCount++;
      if (f.furnitureId === 'wind_turbine') windCount++;
    });

    const ecoDiscount = (solarCount * 50) + (windCount * 75);
    const totalAmount = Math.max(50, propertyTax + furnitureTax - ecoDiscount);

    return {
      propertyTax,
      furnitureTax,
      ecoDiscount,
      totalAmount,
      solarCount,
      windCount
    };
  }

  public payBill(sim: import('../entity/Sim').Sim): boolean {
    if (!this.isBillDue && this.pendingBillAmount <= 0) return false;

    if (sim.simoleons >= this.pendingBillAmount) {
      sim.simoleons -= this.pendingBillAmount;
      this.isBillDue = false;
      this.isPowerCutoff = false;
      this.dueDay += 7; // Next bill in 7 days
      return true;
    }
    return false;
  }
}
