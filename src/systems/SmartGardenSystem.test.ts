import { describe, it, expect, beforeEach } from 'vitest';
import { SmartGardenSystem } from './SmartGardenSystem';
import { GardenSystem } from '../world/GardenSystem';
import { Sim } from '../entity/Sim';

describe('SmartGardenSystem & Sprinklers', () => {
  let smartGarden: SmartGardenSystem;
  let garden: GardenSystem;
  let sim: Sim;

  beforeEach(() => {
    smartGarden = new SmartGardenSystem();
    garden = new GardenSystem();
    sim = new Sim({ name: 'Gardener Sim' });
  });

  it('should install sprinklers and auto-water dry plots', () => {
    sim.simoleons = 1000;
    garden.addPlot(4, 4);
    const plot = garden.plots[0];
    plot.waterLevel = 10;

    const res = smartGarden.installSprinklers(sim, garden);
    expect(res.success).toBe(true);
    expect(smartGarden.sprinklersInstalled).toBe(true);
    expect(plot.waterLevel).toBe(100);

    // Test automatic update tick
    plot.waterLevel = 20;
    smartGarden.updateSprinklers(garden);
    expect(plot.waterLevel).toBe(100);
  });
});
