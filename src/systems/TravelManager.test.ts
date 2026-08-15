import { describe, it, expect, beforeEach } from 'vitest';
import { TravelManager } from './TravelManager';
import { Sim } from '../entity/Sim';

describe('TravelManager & Vacations', () => {
  let travel: TravelManager;
  let sim: Sim;

  beforeEach(() => {
    travel = new TravelManager();
    sim = new Sim({ name: 'Tourist Sim' });
  });

  it('should book flight to Sulani, fill needs to 100% and grant souvenir', () => {
    sim.simoleons = 2000;
    sim.needs.modify('hunger', -50);

    const res = travel.bookVacationFlight('sulani', sim);
    expect(res.success).toBe(true);
    expect(sim.needs.getValues().hunger).toBe(100);
    expect(sim.inventory.items.some(i => i.name.includes('Tiki'))).toBe(true);
    expect(travel.currentVacation?.id).toBe('sulani');
  });
});
