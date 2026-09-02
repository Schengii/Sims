/**
 * Guest Invitation Modal UI
 * Allows players to select friends & neighbors, pick a themed activity, and invite them over to the household.
 */

import { GuestInvitationSystem } from '../systems/GuestInvitationSystem';
import { NPCManager } from '../entity/NPCManager';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class GuestInviteModal {
  private container: HTMLElement;
  private guestSystem: GuestInvitationSystem;
  private npcManager: NPCManager;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    guestSystem: GuestInvitationSystem,
    npcManager: NPCManager,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.guestSystem = guestSystem;
    this.npcManager = npcManager;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-guest-invite';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    const availableTownies = [
      { name: 'Mortimer Goth', icon: '🎩', mood: 'Intellektuell' },
      { name: 'Bella Goth', icon: '💃', mood: 'Elegant' },
      { name: 'Summer Holiday', icon: '☀️', mood: 'Fröhlich' },
      { name: 'Bob Pancakes', icon: '🥞', mood: 'Gourmet' },
      { name: 'Travis Scott', icon: '🎮', mood: 'Gamer' }
    ];

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 650px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(30, 41, 59, 0.96); border: 1px solid rgba(56, 189, 248, 0.3); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.7);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 30px;">💌</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #38bdf8;">Freunde & Nachbarn einladen</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #94a3b8;">Spontane Besuche, gemeinsame Dinner & Gaming-Sessions</p>
            </div>
          </div>
          <button id="close-guest-modal" style="background: transparent; border: none; font-size: 26px; color: #94a3b8; cursor: pointer;">&times;</button>
        </div>

        <!-- Activity Selection -->
        <div style="margin-bottom: 18px;">
          <label style="display: block; font-size: 13px; font-weight: 600; color: #f8fafc; margin-bottom: 8px;">1. Aktivitäts-Schwerpunkt wählen:</label>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
            <button class="activity-btn active" data-act="dinner" style="background: linear-gradient(135deg, #0284c7, #0369a1); border: 1px solid #38bdf8; color: white; border-radius: 8px; padding: 8px; cursor: pointer; text-align: center;">
              <span style="font-size: 20px; display: block;">🍳</span>
              <span style="font-size: 11px; font-weight: 600;">Dinner</span>
            </button>
            <button class="activity-btn" data-act="gaming" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px; padding: 8px; cursor: pointer; text-align: center;">
              <span style="font-size: 20px; display: block;">🎮</span>
              <span style="font-size: 11px; font-weight: 600;">Gaming</span>
            </button>
            <button class="activity-btn" data-act="pool" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px; padding: 8px; cursor: pointer; text-align: center;">
              <span style="font-size: 20px; display: block;">🏊</span>
              <span style="font-size: 11px; font-weight: 600;">Pool</span>
            </button>
            <button class="activity-btn" data-act="chat" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px; padding: 8px; cursor: pointer; text-align: center;">
              <span style="font-size: 20px; display: block;">☕</span>
              <span style="font-size: 11px; font-weight: 600;">Kaffee</span>
            </button>
          </div>
        </div>

        <!-- Townie List -->
        <label style="display: block; font-size: 13px; font-weight: 600; color: #f8fafc; margin-bottom: 8px;">2. Gast auswählen & einladen:</label>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${availableTownies.map(townie => `
            <div style="
              background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
              padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;
            ">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px;">${townie.icon}</span>
                <div>
                  <div style="font-weight: bold; font-size: 14px; color: #f8fafc;">${townie.name}</div>
                  <span style="font-size: 11px; color: #94a3b8;">Persönlichkeit: ${townie.mood}</span>
                </div>
              </div>

              <button class="invite-btn" data-name="${townie.name}" style="
                background: linear-gradient(135deg, #10b981, #059669); border: 1px solid #34d399;
                color: white; border-radius: 6px; padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer;
              ">📞 Einladen</button>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    let activeActivity: any = 'dinner';

    backdrop.querySelector('#close-guest-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelectorAll('.activity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        backdrop.querySelectorAll('.activity-btn').forEach(b => {
          (b as HTMLElement).style.background = 'rgba(15, 23, 42, 0.7)';
          (b as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
        });
        const clicked = e.currentTarget as HTMLElement;
        clicked.style.background = 'linear-gradient(135deg, #0284c7, #0369a1)';
        clicked.style.borderColor = '#38bdf8';
        activeActivity = clicked.getAttribute('data-act');
        this.soundManager.playUIClick();
      });
    });

    backdrop.querySelectorAll('.invite-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = (e.currentTarget as HTMLElement).getAttribute('data-name') || '';
        const res = this.guestSystem.inviteTownie(this.npcManager, name, activeActivity, this.sim);
        if (res.success) {
          this.soundManager.playPhoneRing();
          this.toastManager.showToast('💌 Gast eingeladen', res.message, '👋', 'success');
          this.close();
        } else {
          this.toastManager.showToast('⚠️ Hinweis', res.message, 'ℹ️', 'info');
        }
      });
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-guest-invite');
    if (existing) existing.remove();
  }
}
