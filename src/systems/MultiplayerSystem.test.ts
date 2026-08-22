import { describe, it, expect, beforeEach } from 'vitest';
import { MultiplayerSystem } from './MultiplayerSystem';
import { NPCManager } from '../entity/NPCManager';
import { Sim } from '../entity/Sim';

describe('MultiplayerSystem', () => {
  let mp: MultiplayerSystem;
  let npcManager: NPCManager;
  let sim: Sim;

  beforeEach(() => {
    mp = new MultiplayerSystem();
    npcManager = new NPCManager();
    sim = new Sim({ name: 'Player Host' });
  });

  it('creates and joins multiplayer room sessions', () => {
    const session = mp.createSession('Player Host');
    expect(session.roomCode).toContain('SIM-');
    expect(session.isActive).toBe(true);

    const joinRes = mp.joinSession('SIM-TEST', 'Friend Player');
    expect(joinRes.success).toBe(true);
    expect(mp.currentSession?.guests.length).toBe(1);
  });

  it('invites a friend Sim and spawns visitor in world', () => {
    const initialNpcCount = npcManager.npcs.length;
    const guest = mp.inviteFriendSim(npcManager, 'Sarah Connor', '#ec4899');
    expect(guest).toBeDefined();
    expect(guest?.name).toBe('Sarah Connor');
    expect(npcManager.npcs.length).toBe(initialNpcCount + 1);
  });

  it('sends gifts to visiting friends correctly', () => {
    sim.simoleons = 500;
    const giftRes = mp.sendGift(sim, 'Sarah Connor', 100);
    expect(giftRes.success).toBe(true);
    expect(sim.simoleons).toBe(400);
  });
});
