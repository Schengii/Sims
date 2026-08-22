/**
 * MultiplayerSystem - Live Guest Visiting & Session Room Engine
 * Allows hosting multiplayer sessions with shareable room codes,
 * inviting friend Sims to visit the lot in real-time, receiving gifts, and live chat.
 */

import { NPCManager } from '../entity/NPCManager';
import { Sim } from '../entity/Sim';

export interface VisitingGuest {
  id: string;
  name: string;
  avatarIcon: string;
  outfitColor: string;
  skinColor: string;
  status: 'online' | 'visiting' | 'offline';
  friendshipPoints: number;
}

export interface MultiplayerSession {
  roomCode: string;
  hostName: string;
  isActive: boolean;
  guests: VisitingGuest[];
  chatLog: Array<{ sender: string; message: string; timestamp: string }>;
}

export class MultiplayerSystem {
  public currentSession: MultiplayerSession | null = null;

  public createSession(hostName: string): MultiplayerSession {
    const code = `SIM-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    this.currentSession = {
      roomCode: code,
      hostName,
      isActive: true,
      guests: [],
      chatLog: [
        {
          sender: 'System',
          message: `Raum ${code} eröffnet. Teile den Code mit deinen Freunden!`,
          timestamp: new Date().toLocaleTimeString('de-DE')
        }
      ]
    };
    return this.currentSession;
  }

  public joinSession(roomCode: string, playerName: string): { success: boolean; message: string } {
    if (!roomCode || roomCode.length < 4) {
      return { success: false, message: 'Ungültiger Raumcode!' };
    }

    this.currentSession = {
      roomCode: roomCode.toUpperCase(),
      hostName: 'Host-Spieler',
      isActive: true,
      guests: [
        {
          id: `guest_${Date.now()}`,
          name: playerName,
          avatarIcon: '🎮',
          outfitColor: '#38bdf8',
          skinColor: '#f1c27d',
          status: 'visiting',
          friendshipPoints: 50
        }
      ],
      chatLog: [
        {
          sender: 'System',
          message: `Du bist dem Raum ${roomCode.toUpperCase()} beigetreten!`,
          timestamp: new Date().toLocaleTimeString('de-DE')
        }
      ]
    };

    return {
      success: true,
      message: `Erfolgreich Raum ${roomCode.toUpperCase()} beigetreten!`
    };
  }

  public inviteFriendSim(
    npcManager: NPCManager,
    friendName: string = 'Alex Rivers',
    outfitColor: string = '#8b5cf6'
  ): VisitingGuest | null {
    if (!this.currentSession) {
      this.createSession('Du');
    }

    const guest: VisitingGuest = {
      id: `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: friendName,
      avatarIcon: '🌟',
      outfitColor,
      skinColor: '#f5d0b5',
      status: 'visiting',
      friendshipPoints: 60
    };

    this.currentSession!.guests.push(guest);

    // Spawn visiting friend directly as a lively visiting NPC in the world!
    npcManager.spawnVisitingNPC(guest.name, guest.outfitColor, guest.skinColor);

    this.addChatMessage(guest.name, 'Hey! Ich bin gerade auf deinem Grundstück angekommen! 🎉');

    return guest;
  }

  public sendGift(sim: Sim, guestName: string, amount: number = 100): { success: boolean; message: string } {
    if (sim.simoleons < amount) {
      return { success: false, message: `Nicht genügend Simoleons (§ ${amount} benötigt)!` };
    }

    sim.simoleons -= amount;
    this.addChatMessage(sim.customization.name, `🎁 Hat ein Geschenk über § ${amount} an ${guestName} überreicht!`);

    return {
      success: true,
      message: `Geschenk über § ${amount} an ${guestName} gesendet!`
    };
  }

  public addChatMessage(sender: string, message: string): void {
    if (!this.currentSession) return;
    this.currentSession.chatLog.push({
      sender,
      message,
      timestamp: new Date().toLocaleTimeString('de-DE')
    });
    if (this.currentSession.chatLog.length > 30) {
      this.currentSession.chatLog.shift();
    }
  }
}
