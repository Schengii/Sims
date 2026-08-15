/**
 * Private Chef & Catering UI Modal
 * Accept luxury private catering gigs, cook gourmet menus, and earn master chef fees.
 */

import { PrivateChefManager, CATERING_GIGS } from '../systems/PrivateChefManager';
import type { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import type { ToastManager } from './ToastManager';

export class PrivateChefModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(chefManager: PrivateChefManager, sim: Sim, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'private-chef-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 640px; width: 90%;">
        <div class="modal-header">
          <h2>👨‍🍳 Privatkoch & VIP-Catering</h2>
          <button class="close-btn" id="close-chef-modal">&times;</button>
        </div>

        <div style="background: rgba(230, 126, 34, 0.2); border: 1px solid #e67e22; padding: 14px; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: bold; color: #f39c12;">⭐ Starkoch-Renommee: Stufe ${chefManager.chefSkill.toFixed(1)} / 5</span>
            <span style="color: #2ecc71; font-weight: bold;">🍽️ Servierte Galas: ${chefManager.completedGigs}</span>
          </div>
        </div>

        <h4 style="margin: 0 0 10px 0; color: #ffffff;">📜 VIP-Catering-Anfragen:</h4>
        <div style="display: flex; flex-direction: column; gap: 10px; max-height: 280px; overflow-y: auto;">
          ${CATERING_GIGS.map(gig => `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.06); padding: 12px; border-radius: 10px; border-left: 4px solid #e67e22;">
              <div>
                <h4 style="margin: 0; color: #ffffff;">${gig.occasion}</h4>
                <div style="font-size: 11px; color: #bdc3c7; margin-top: 2px;">Kunde: ${gig.clientName} (${gig.guestsCount} Gäste)</div>
                <div style="font-size: 11px; color: #f39c12; margin-top: 2px;">Menü: ${gig.menuTitle}</div>
              </div>

              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
                <span style="color: #2ecc71; font-weight: bold; font-size: 13px;">§ ${gig.rewardSimoleons}</span>
                <button class="hud-btn btn-cook-gig" data-id="${gig.id}" style="padding: 6px 12px; font-size: 11px; background: #e67e22; color: #fff; font-weight: bold;">
                  👨‍🍳 Kochen
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 18px; text-align: right;">
          <button class="hud-btn" id="close-chef-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-chef-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-chef-bottom')?.addEventListener('click', () => this.close());

    modal.querySelectorAll('.btn-cook-gig').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = chefManager.executeCateringGig(id, sim);
          if (res.success) {
            this.soundManager.playLevelUp();
            toastManager?.showToast('👨‍🍳 Gourmet-Catering', res.message, '🍽️', 'levelUp');
            this.open(chefManager, sim, toastManager);
          } else {
            toastManager?.showToast('Catering', res.message, '⚠️', 'warning');
          }
        }
      });
    });
  }

  public close(): void {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
  }
}
