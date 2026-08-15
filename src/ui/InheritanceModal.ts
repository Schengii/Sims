/**
 * Multi-Generation & Inheritance UI Modal
 * Setup wills, nominate primary heir, and claim ancestral wealth.
 */

import { InheritanceManager } from '../systems/InheritanceManager';
import type { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import type { ToastManager } from './ToastManager';

export class InheritanceModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(inherManager: InheritanceManager, sim: Sim, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'inheritance-modal';

    const will = inherManager.will;

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 600px; width: 90%;">
        <div class="modal-header">
          <h2>📜 Generationen-Erbe & Testament</h2>
          <button class="close-btn" id="close-inher-modal">&times;</button>
        </div>

        <div style="background: rgba(241, 196, 15, 0.15); border: 1px solid #f1c40f; padding: 14px; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: bold; color: #f1c40f; font-size: 15px;">👑 Prestige-Stufe: ${inherManager.generationalPrestigeLevel} / 5</span>
            <span style="color: #2ecc71; font-weight: bold;">Haupterbe: ${will.primaryHeir}</span>
          </div>

          <p style="font-size: 12px; color: #bdc3c7; margin: 0 0 10px 0;">
            Familien-Motto: <em>"${will.familyMotto}"</em>
          </p>

          <div style="display: flex; gap: 10px;">
            <button class="hud-btn" id="btn-seal-will" style="flex: 1; justify-content: center; background: #34495e; color: #fff; font-size: 11px; font-weight: bold;">
              🖋️ Testament notariell besiegeln
            </button>
            <button class="hud-btn" id="btn-claim-inheritance" style="flex: 1; justify-content: center; background: #27ae60; color: #fff; font-size: 11px; font-weight: bold;">
              💎 Erbschaft auszahlen
            </button>
          </div>
        </div>

        <div style="margin-top: 18px; text-align: right;">
          <button class="hud-btn" id="close-inher-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-inher-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-inher-bottom')?.addEventListener('click', () => this.close());

    modal.querySelector('#btn-seal-will')?.addEventListener('click', () => {
      const res = inherManager.sealWill('Erbe der nächsten Generation', 'Immer treu & erfolgreich', sim);
      this.soundManager.playLevelUp();
      toastManager?.showToast('📜 Testament', res.message, '🏛️', 'success');
      this.open(inherManager, sim, toastManager);
    });

    modal.querySelector('#btn-claim-inheritance')?.addEventListener('click', () => {
      const res = inherManager.executeInheritance(sim);
      this.soundManager.playLevelUp();
      toastManager?.showToast('💎 Erbschaft', res.message, '💰', 'levelUp');
      this.open(inherManager, sim, toastManager);
    });
  }

  public close(): void {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
  }
}
