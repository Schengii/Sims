/**
 * Penthouse Living & Luxury Real Estate UI Modal
 * Buy high-rise penthouses and collect luxury dividends.
 */

import { PenthouseManager } from '../systems/PenthouseManager';
import type { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import type { ToastManager } from './ToastManager';

export class PenthouseModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(pentManager: PenthouseManager, sim: Sim, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'penthouse-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 650px; width: 90%;">
        <div class="modal-header">
          <h2>🏙️ Luxus-Penthouses & High-Rise Living</h2>
          <button class="close-btn" id="close-pent-modal">&times;</button>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <p style="color: #bdc3c7; font-size: 13px; margin: 0;">Ersteigere Luxus-Penthouses in den Wolkenkratzern und kassiere wöchentliche Mieten!</p>
          <button class="hud-btn" id="btn-collect-pent-rent" style="background: #27ae60; color: #fff; font-weight: bold; font-size: 11px;">
            💰 Miete auszahlen
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px; max-height: 320px; overflow-y: auto;">
          ${pentManager.properties.map(p => {
            const canAfford = sim.simoleons >= p.price;
            return `
              <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; border-left: 4px solid ${p.owned ? '#2ecc71' : '#f1c40f'};">
                <div>
                  <h4 style="margin: 0; color: #ffffff;">${p.name} ${p.owned ? '👑 (EIGENTUM)' : ''}</h4>
                  <div style="font-size: 11px; color: #38bdf8; font-weight: bold; margin-top: 2px;">Wöchentliche Dividende: +§ ${p.weeklyRent.toLocaleString()}</div>
                  <div style="font-size: 11px; color: #bdc3c7; margin-top: 2px;">${p.viewDesc}</div>
                </div>

                <div>
                  ${p.owned ? `
                    <span style="color: #2ecc71; font-weight: bold; font-size: 13px;">Eigentum</span>
                  ` : `
                    <button class="hud-btn btn-buy-pent" data-id="${p.id}" ${canAfford ? '' : 'disabled'} style="padding: 6px 12px; font-size: 11px; background: ${canAfford ? '#f39c12' : '#7f8c8d'}; color: #000; font-weight: bold;">
                      🏢 Kaufen (§ ${p.price.toLocaleString()})
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="margin-top: 18px; text-align: right;">
          <button class="hud-btn" id="close-pent-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-pent-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-pent-bottom')?.addEventListener('click', () => this.close());

    modal.querySelector('#btn-collect-pent-rent')?.addEventListener('click', () => {
      const res = pentManager.collectRent(sim);
      if (res.success) {
        this.soundManager.playLevelUp();
        toastManager?.showToast('🏙️ Penthouse-Dividende', res.message, '💰', 'levelUp');
      } else {
        toastManager?.showToast('Mieteinnahmen', res.message, '⚠️', 'warning');
      }
    });

    modal.querySelectorAll('.btn-buy-pent').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = pentManager.buyPenthouse(id, sim);
          if (res.success) {
            this.soundManager.playLevelUp();
            toastManager?.showToast('🏙️ Penthouse gekauft', res.message, '👑', 'levelUp');
            this.open(pentManager, sim, toastManager);
          } else {
            toastManager?.showToast('Penthouse', res.message, '⚠️', 'warning');
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
