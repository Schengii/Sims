import { describe, it, expect } from 'vitest';
import { GOAPAutonomy } from './GOAPAutonomy';
import { Sim } from './Sim';
import { House } from '../world/House';

describe('GOAPAutonomy', () => {
  it('does not trigger plan when needs are high', () => {
    const sim = new Sim({ name: 'Happy Sim' });
    const house = new House();
    const planned = GOAPAutonomy.planAndExecute(sim, house);
    expect(planned).toBe(false);
  });

  it('triggers action plan when hunger is critically low', () => {
    const sim = new Sim({ name: 'Hungry Sim' });
    sim.needs.modify('hunger', -80);
    const house = new House();
    house.addFurniture('fridge_modern', 6, 6);

    const planned = GOAPAutonomy.planAndExecute(sim, house);
    expect(planned).toBe(true);
    expect(sim.actionQueue.getQueueLength()).toBeGreaterThan(0);
  });

  it('returns valid routine for NPC depending on time of day', () => {
    const routineMorning = GOAPAutonomy.evaluateNPCRoutine({ name: 'Bella' } as any, 7);
    expect(routineMorning.routine).toContain('Morgen');
    expect(routineMorning.emote).toBe('🏃');

    const routineWork = GOAPAutonomy.evaluateNPCRoutine({ name: 'Bella' } as any, 13);
    expect(routineWork.routine).toContain('Arbeit');
    expect(routineWork.emote).toBe('💼');
  });
});
