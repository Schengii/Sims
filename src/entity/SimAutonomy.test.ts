import { describe, it, expect } from 'vitest';
import { SimAutonomy } from './SimAutonomy';
import { Sim } from './Sim';
import { House } from '../world/House';

describe('SimAutonomy Engine', () => {
  it('respects per-sim autonomyCooldownSec timer', () => {
    const sim1 = new Sim();
    const sim2 = new Sim();
    const house = new House();

    sim1.autonomyCooldownSec = 5;
    sim2.autonomyCooldownSec = 0;

    SimAutonomy.update(sim1, house, 1.0);
    expect(sim1.autonomyCooldownSec).toBeCloseTo(4.0);
    expect(sim2.autonomyCooldownSec).toBe(0);
  });

  it('triggers autonomous action when needs drop below threshold', () => {
    const sim = new Sim();
    const house = new House();

    // Place a bed near sim
    house.placedFurniture.push({ instanceId: 'bed_1', furnitureId: 'bed_basic', gridX: 5, gridY: 5, rotation: 0 });

    sim.needs.modify('energy', -60); // Energy is now low (90 - 60 = 30)
    expect(sim.needs.getValues().energy).toBe(30);

    SimAutonomy.update(sim, house, 0.1);
    expect(sim.autonomyCooldownSec).toBeGreaterThan(0);
    expect(sim.actionQueue.getQueueLength()).toBeGreaterThanOrEqual(1);
  });
});
