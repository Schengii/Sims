/**
 * MultiplayerModal UI
 * Multiplayer Room Host, Join via Code, Friend Sim Invites & Live Chat
 */

import { BaseModal } from './BaseModal';
import { MultiplayerSystem } from '../systems/MultiplayerSystem';
import { NPCManager } from '../entity/NPCManager';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class MultiplayerModal extends BaseModal {
  private mpSystem: MultiplayerSystem;
  private npcManager: NPCManager;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    mpSystem: MultiplayerSystem,
    npcManager: NPCManager,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    super(container, { className: 'multiplayer-modal-overlay', ariaLabel: 'Multiplayer & Besucher Hub' });
    this.mpSystem = mpSystem;
    this.npcManager = npcManager;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  protected renderHTML(): string {
    const session = this.mpSystem.currentSession || this.mpSystem.createSession(this.sim.customization.name);

    return `
      <div class="modal-header">
        <h2>🌐 Multiplayer & Freunde-Besuche</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(56, 189, 248, 0.15); padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.3); margin-bottom: 14px;">
          <div>
            <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Aktiver Raum-Code:</div>
            <div style="font-size: 22px; font-weight: bold; color: #38bdf8; letter-spacing: 2px;" id="mp-room-code">${session.roomCode}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline" id="btn-copy-code" style="font-size: 12px;">📋 Code kopieren</button>
            <button class="btn btn-secondary" id="btn-new-room" style="font-size: 12px;">🔄 Neuer Raum</button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
          <!-- Left: Invite Friends & Spawn Visitors -->
          <div class="glass-card" style="padding: 12px; border-radius: 8px;">
            <h4 style="margin: 0 0 8px 0; color: #f8fafc; font-size: 13px;">👥 Freunde auf dein Lot einladen</h4>
            <p style="font-size: 11px; color: #94a3b8; margin: 0 0 10px 0;">
              Lade Freunde ein, die als besuchende Sims auf deinem Grundstück herumlaufen!
            </p>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button class="btn btn-primary btn-invite-friend" data-name="Sarah Connor" data-color="#ec4899" style="font-size: 12px; padding: 6px;">
                🌟 Sarah Connor einladen
              </button>
              <button class="btn btn-primary btn-invite-friend" data-name="Neo Matrix" data-color="#10b981" style="font-size: 12px; padding: 6px;">
                🕶️ Neo Matrix einladen
              </button>
              <button class="btn btn-primary btn-invite-friend" data-name="Lara Croft" data-color="#f59e0b" style="font-size: 12px; padding: 6px;">
                🏹 Lara Croft einladen
              </button>
            </div>
          </div>

          <!-- Right: Active Guests & Gift Sending -->
          <div class="glass-card" style="padding: 12px; border-radius: 8px;">
            <h4 style="margin: 0 0 8px 0; color: #f8fafc; font-size: 13px;">🎁 Aktive Besucher (${session.guests.length})</h4>
            ${session.guests.length === 0 ? '<div style="font-size: 12px; color: #64748b;">Noch keine Besucher da.</div>' : ''}
            <div style="display: flex; flex-direction: column; gap: 6px; max-height: 120px; overflow-y: auto;">
              ${session.guests.map(g => `
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 6px 10px; border-radius: 6px;">
                  <span style="font-size: 12px; color: #e2e8f0;">${g.avatarIcon} <strong>${g.name}</strong></span>
                  <button class="btn btn-sm btn-outline btn-send-gift" data-name="${g.name}" style="padding: 2px 8px; font-size: 11px;">
                    🎁 § 100 schenken
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Chat Log -->
        <div class="glass-card" style="padding: 10px; border-radius: 8px;">
          <div style="font-size: 11px; font-weight: bold; color: #94a3b8; margin-bottom: 6px;">💬 Live Besucher-Chat:</div>
          <div id="mp-chat-box" style="height: 90px; overflow-y: auto; background: rgba(0,0,0,0.3); border-radius: 6px; padding: 6px; font-size: 11px; display: flex; flex-direction: column; gap: 4px;">
            ${session.chatLog.map(c => `
              <div><span style="color: #38bdf8; font-weight: bold;">[${c.sender}]:</span> <span style="color: #f1f5f9;">${c.message}</span></div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  protected onMount(): void {
    // Copy room code
    const copyBtn = this.$('#btn-copy-code');
    if (copyBtn && this.mpSystem.currentSession) {
      this.listen(copyBtn, 'click', () => {
        navigator.clipboard?.writeText(this.mpSystem.currentSession!.roomCode);
        this.toastManager.show('📋 Raum-Code in die Zwischenablage kopiert!', 'success');
      });
    }

    // New room
    const newRoomBtn = this.$('#btn-new-room');
    if (newRoomBtn) {
      this.listen(newRoomBtn, 'click', () => {
        this.mpSystem.createSession(this.sim.customization.name);
        this.toastManager.show('🔄 Neuer Multiplayer-Raum erstellt!', 'info');
        this.open();
      });
    }

    // Invite friends
    this.$$('.btn-invite-friend').forEach(btn => {
      this.listen(btn, 'click', (e: Event) => {
        const target = e.currentTarget as HTMLElement;
        const name = target.dataset.name || 'Besucher-Sim';
        const color = target.dataset.color || '#3b82f6';
        const guest = this.mpSystem.inviteFriendSim(this.npcManager, name, color);
        if (guest) {
          this.soundManager.playLevelUp();
          this.toastManager.show(`🎉 ${name} besucht jetzt dein Grundstück!`, 'success');
          this.open();
        }
      });
    });

    // Send gifts
    this.$$('.btn-send-gift').forEach(btn => {
      this.listen(btn, 'click', (e: Event) => {
        const name = (e.currentTarget as HTMLElement).dataset.name;
        if (name) {
          const res = this.mpSystem.sendGift(this.sim, name, 100);
          if (res.success) {
            this.soundManager.playBuySound();
            this.toastManager.show(res.message, 'success');
            this.open();
          } else {
            this.toastManager.show(res.message, 'warning');
          }
        }
      });
    });
  }
}
