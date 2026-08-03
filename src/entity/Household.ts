/**
 * Household Engine
 * Manages multiple playable Sims in the family, active Sim switching, and family member management.
 */

import { Sim } from './Sim';

export class Household {
  public sims: Sim[] = [];
  public activeSimIndex: number = 0;

  constructor() {
    // Default starter Sim
    const primary = new Sim({ name: 'Bella Goth' });
    this.sims.push(primary);
  }

  public getActiveSim(): Sim {
    if (this.sims.length === 0) {
      const fallback = new Sim({ name: 'Bella Goth' });
      this.sims.push(fallback);
    }
    if (this.activeSimIndex < 0 || this.activeSimIndex >= this.sims.length) {
      this.activeSimIndex = 0;
    }
    return this.sims[this.activeSimIndex];
  }

  public setActiveSim(index: number): Sim {
    if (index >= 0 && index < this.sims.length) {
      this.activeSimIndex = index;
    }
    return this.getActiveSim();
  }

  public addSim(sim: Sim): void {
    this.sims.push(sim);
  }

  public removeSim(id: string): boolean {
    if (this.sims.length <= 1) {
      return false; // Cannot delete sole remaining Sim
    }
    const idx = this.sims.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.sims.splice(idx, 1);
      if (this.activeSimIndex >= this.sims.length) {
        this.activeSimIndex = this.sims.length - 1;
      }
      return true;
    }
    return false;
  }
}
