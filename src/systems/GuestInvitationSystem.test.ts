import { describe, it, expect, beforeEach } from 'vitest';
import { GuestInvitationSystem } from './GuestInvitationSystem';
import { NPCManager } from '../entity/NPCManager';
import { Sim } from '../entity/Sim';

describe('GuestInvitationSystem', () => {
  let guestSys: GuestInvitationSystem;
  let npcManager: NPCManager;
  let sim: Sim;

  beforeEach(() => {
    guestSys = new GuestInvitationSystem();
    npcManager = new NPCManager();
    sim = new Sim();
  });

  it('should successfully invite a townie guest and boost social/friendship', () => {
    const res = guestSys.inviteTownie(npcManager, 'Mortimer Goth', 'dinner', sim);

    expect(res.success).toBe(true);
    expect(guestSys.activeGuests.length).toBe(1);
    expect(guestSys.activeGuests[0].name).toBe('Mortimer Goth');
  });

  it('should prevent duplicate active visits from the same townie', () => {
    guestSys.inviteTownie(npcManager, 'Bella Goth', 'gaming', sim);
    const res2 = guestSys.inviteTownie(npcManager, 'Bella Goth', 'pool', sim);

    expect(res2.success).toBe(false);
  });
});
