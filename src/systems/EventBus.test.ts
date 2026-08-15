import { describe, it, expect, beforeEach } from 'vitest';
import { EventBus } from './EventBus';

describe('EventBus System', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = EventBus.getInstance();
    eventBus.clear();
  });

  it('should register and trigger listeners correctly', () => {
    let triggered = false;
    let receivedData: any = null;

    eventBus.on('SIM_SOCIAL_INTERACTION', (data) => {
      triggered = true;
      receivedData = data;
    });

    eventBus.emit('SIM_SOCIAL_INTERACTION', {
      simId: 'sim_1',
      targetNpcId: 'npc_1',
      interactionId: 'couple_dance',
      emote: '💃'
    });

    expect(triggered).toBe(true);
    expect(receivedData).toEqual({
      simId: 'sim_1',
      targetNpcId: 'npc_1',
      interactionId: 'couple_dance',
      emote: '💃'
    });
  });

  it('should unsubscribe listener via returned function', () => {
    let count = 0;
    const unsub = eventBus.on('TIME_HOUR_PASSED', () => {
      count++;
    });

    eventBus.emit('TIME_HOUR_PASSED', { hour: 10, day: 1 });
    expect(count).toBe(1);

    unsub();
    eventBus.emit('TIME_HOUR_PASSED', { hour: 11, day: 1 });
    expect(count).toBe(1);
  });
});
