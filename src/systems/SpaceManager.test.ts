import { describe, it, expect, beforeEach } from 'vitest';
import { SpaceManager } from './SpaceManager';
import { Sim } from '../entity/Sim';

describe('SpaceManager & Rocket Missions', () => {
  let space: SpaceManager;
  let sim: Sim;

  beforeEach(() => {
    space = new SpaceManager();
    sim = new Sim({ name: 'Astronaut Sim' });
  });

  it('should build rocket stages to 100% and launch orbital mission', () => {
    sim.simoleons = 1000;
    for (let i = 0; i < 4; i++) {
      space.buildRocket(sim);
    }
    expect(space.rocketBuildProgress).toBe(100);

    const res = space.launchMission('orbit', sim);
    expect(res.success).toBe(true);
    expect(space.completedMissions).toBe(1);
    expect(sim.inventory.items.some(i => i.name.includes('Satelliten'))).toBe(true);
  });
});
