/**
 * World Travel UI Modal
 * Book holiday trips, choose destinations, and view vacation souvenirs.
 */

import { TravelManager, VACATIONS_CATALOG } from '../systems/TravelManager';
import type { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import type { ToastManager } from './ToastManager';

export class TravelModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(travelManager: TravelManager, sim: Sim, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'travel-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 650px; width: 90%;">
        <div class="modal-header">
          <h2>✈️ Internationaler Flughafen & Traumurlaube</h2>
          <button class="close-btn" id="close-travel-modal">&times;</button>
        </div>

        <p style="color: #bdc3c7; font-size: 13px; margin-top: -6px;">
          Entfliehe dem Alltag! Buche All-Inclusive Ferien, fülle alle Bedürfnisse zu 100% auf und sammle seltene Souvenirs.
        </p>

        <div style="display: flex; flex-direction: column; gap: 12px; max-height: 360px; overflow-y: auto;">
          ${VACATIONS_CATALOG.map(dest => {
            const canAfford = sim.simoleons >= dest.flightCost;
            return `
              <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.06); padding: 12px; border-radius: 10px; border-left: 4px solid #3498db;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 32px;">${dest.icon}</span>
                  <div>
                    <h4 style="margin: 0; color: #ffffff;">${dest.name}</h4>
                    <div style="font-size: 11px; color: #38bdf8; font-weight: bold; margin-top: 2px;">Klima: ${dest.climate}</div>
                    <div style="font-size: 11px; color: #bdc3c7; margin-top: 2px;">${dest.description}</div>
                  </div>
                </div>

                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
                  <span style="color: #2ecc71; font-weight: bold; font-size: 13px;">§ ${dest.flightCost}</span>
                  <button class="hud-btn btn-book-flight" data-id="${dest.id}" ${canAfford ? '' : 'disabled'} style="padding: 6px 12px; font-size: 11px; background: ${canAfford ? '#3498db' : '#7f8c8d'}; color: #fff; font-weight: bold;">
                    ✈️ Flug buchen
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="margin-top: 18px; text-align: right;">
          <button class="hud-btn" id="close-travel-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-travel-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-travel-bottom')?.addEventListener('click', () => this.close());

    modal.querySelectorAll('.btn-book-flight').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = travelManager.bookVacationFlight(id, sim);
          if (res.success) {
            this.soundManager.playLevelUp();
            toastManager?.showToast('✈️ Traumurlaub', res.message, '🏝️', 'levelUp');
            this.close();
          } else {
            toastManager?.showToast('Urlaubsbuchung', res.message, '⚠️', 'warning');
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
