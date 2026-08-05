/**
 * Renters & Sub-Leasing System
 * Manages renting rooms or sub-floors to NPC tenants, collecting weekly rent, and tenant happiness.
 */

export interface Tenant {
  id: string;
  name: string;
  avatar: string;
  weeklyRent: number;
  satisfaction: number; // 0 to 100%
  assignedFloor: number;
  moveInDay: number;
}

export class RentersManager {
  public tenants: Tenant[] = [];

  public addTenant(name: string, avatar: string, assignedFloor: number, weeklyRent: number): Tenant {
    const newTenant: Tenant = {
      id: `tenant_${Date.now()}_${Math.floor(Math.random()*1000)}`,
      name,
      avatar,
      weeklyRent,
      satisfaction: 85,
      assignedFloor,
      moveInDay: 1
    };
    this.tenants.push(newTenant);
    return newTenant;
  }

  public collectRent(): { totalCollected: number; log: string } {
    if (this.tenants.length === 0) return { totalCollected: 0, log: 'Keine Mieter vorhanden.' };
    let total = 0;
    this.tenants.forEach(t => {
      total += t.weeklyRent;
    });
    return { totalCollected: total, log: `💰 Miete von ${this.tenants.length} Mietern kassiert: +§ ${total}` };
  }

  public evictTenant(id: string): boolean {
    const idx = this.tenants.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.tenants.splice(idx, 1);
      return true;
    }
    return false;
  }
}
