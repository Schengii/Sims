/**
 * Guest Invitation & Townie Visit Engine
 * Allows players to invite friends & townies over for dinner, gaming, pool parties, or casual chats.
 */

import { NPCManager } from '../entity/NPCManager';
import { Sim } from '../entity/Sim';

export interface VisitingGuest {
  npcId: string;
  name: string;
  activityFocus: 'dinner' | 'gaming' | 'pool' | 'chat';
  arrivedAt: number;
  durationMinutes: number;
}

export class GuestInvitationSystem {
  public activeGuests: VisitingGuest[] = [];

  public inviteTownie(
    npcManager: NPCManager,
    name: string,
    activityFocus: 'dinner' | 'gaming' | 'pool' | 'chat',
    hostSim: Sim
  ): { success: boolean; guest?: VisitingGuest; message: string } {
    const existing = this.activeGuests.find(g => g.name === name);
    if (existing) {
      return { success: false, message: `${name} ist bereits zu Besuch bei dir!` };
    }

    // Spawn visiting NPC
    const npc = npcManager.spawnVisitingNPC(name);
    npc.activeEmote = { symbol: '👋', expiresAt: Date.now() + 6000 };
    npc.relationship.modifyFriendship(25);
    hostSim.needs.modify('social', 25);

    const guest: VisitingGuest = {
      npcId: npc.id,
      name: npc.name,
      activityFocus,
      arrivedAt: Date.now(),
      durationMinutes: 120
    };

    this.activeGuests.push(guest);
    return {
      success: true,
      guest,
      message: `${name} hat deine Einladung zum ${activityFocus === 'dinner' ? 'Dinner' : activityFocus === 'gaming' ? 'Gaming' : activityFocus === 'pool' ? 'Pool' : 'Kaffeeklatsch'} freudig angenommen!`
    };
  }

  public exportData(): Record<string, any> {
    return {
      activeGuests: this.activeGuests
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.activeGuests) this.activeGuests = data.activeGuests;
  }
}
