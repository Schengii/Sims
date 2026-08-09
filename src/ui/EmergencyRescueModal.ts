/**
 * Emergency Rescue & Firefighter / Cop Mini-Game Modal
 * Interactive mini-game during fires or burglar events to rescue the home and earn hero rewards.
 */

import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class EmergencyRescueModal {
  private container: HTMLDivElement | null = null;

  public open(eventType: 'fire' | 'burglar', sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.renderContent(eventType, sim, toastManager, soundManager);
      this.container.style.display = 'flex';
    }
  }

  public close(): void {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  private createDOM(): void {
    this.container = document.createElement('div');
    this.container.className = 'glass-modal-overlay';
    this.container.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
    `;

    const content = document.createElement('div');
    content.className = 'glass-panel';
    content.id = 'emergency-modal-content';
    content.style.cssText = `
      width: 440px;
      padding: 24px;
      border-radius: 16px;
      background: rgba(30, 41, 59, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    `;

    this.container.appendChild(content);
    document.body.appendChild(this.container);
  }

  private renderContent(eventType: 'fire' | 'burglar', sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const content = this.container?.querySelector('#emergency-modal-content');
    if (!content) return;

    const isFire = eventType === 'fire';
    const title = isFire ? '🔥 KÜCHENBRAND NOTFALL!' : '🥷 EINBRECHER NOTFALL!';
    const icon = isFire ? '🧯' : '👮';

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #ef4444;">${title}</h3>
        <button id="emerg-modal-close" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer;">✕</button>
      </div>

      <p style="margin: 0; font-size: 13px; color: #94a3b8;">
        ${isFire ? 'Schnell! Greife zum Feuerlöscher und bekämpfe die Flammen!' : 'Ein Einbrecher versucht Wertsachen zu stehlen! Rufe die Polizei oder stelle ihn selbst!'}
      </p>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button id="btn-hero-action" style="padding: 12px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">
          ${icon} ${isFire ? 'Feuerlöscher einsetzen!' : 'Einbrecher stellen & entwaffnen!'}
        </button>

        <button id="btn-call-help" style="padding: 12px; background: #0284c7; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">
          📞 Notruf wählen (Feuerwehr / Polizei)
        </button>
      </div>
    `;

    content.querySelector('#emerg-modal-close')?.addEventListener('click', () => this.close());

    content.querySelector('#btn-hero-action')?.addEventListener('click', () => {
      const reward = 800;
      sim.simoleons += reward;
      sim.moodletManager.addMoodlet({
        id: 'heroic_deed',
        name: 'Heldenhafter Einsatz',
        emotion: 'energized',
        weight: 3,
        durationSec: 240,
        icon: '🦸',
        description: 'Haus & Familie erfolgreich gerettet!'
      });

      soundManager.playLevelUp();
      toastManager.showToast('🦸 HELDENHAFT!', `Gefahr gebannt! + § ${reward} Belohnung & Helden-Moodlet!`, '🏆', 'levelUp');
      this.close();
    });

    content.querySelector('#btn-call-help')?.addEventListener('click', () => {
      soundManager.playUIClick();
      toastManager.showToast('📞 NOTRUF WÄHLEN', 'Einsatzkräfte sind eingetroffen & haben die Lage geklärt.', '🚓', 'success');
      this.close();
    });
  }
}
