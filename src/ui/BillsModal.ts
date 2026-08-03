/**
 * Utility Bills & Eco Energy UI Modal for Sims 5
 * Displays property tax breakdown, solar/wind energy discounts, and bill payment.
 */

import { SoundManager } from '../audio/SoundManager';
import type { BillsManager } from '../systems/BillsSystem';
import type { House } from '../world/House';
import type { ToastManager } from './ToastManager';

export class BillsModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(billsManager: BillsManager, house: House, game: any, toastManager?: ToastManager): void {
    this.close();

    const breakdown = billsManager.calculateBreakdown(house);

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'bills-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 600px; width: 90%;">
        <div class="modal-header">
          <h2>📮 Rechnungen & Stromversorgungs-Konto</h2>
          <button class="close-btn" id="close-bills-modal">&times;</button>
        </div>

        ${billsManager.isPowerCutoff ? `
          <div style="background: rgba(231,76,60,0.2); border: 1px solid #e74c3c; padding: 12px; border-radius: 8px; margin-bottom: 16px; color: #e74c3c; font-weight: bold;">
            ⚠️ STROMSPERRE AKTIV! Bitte begleiche deine überfällige Rechnung, um das Licht im Haus wieder einzuschalten.
          </div>
        ` : ''}

        <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.1);">
          <h3 style="margin: 0 0 12px 0; color: #f1c40f;">📑 Wöchentliche Nebenkosten-Abrechnung:</h3>

          <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <span>Grundsteuer (Gemeinde):</span>
            <span style="font-weight: bold; color: #ffffff;">§ ${breakdown.propertyTax}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <span>Möbel- & Inventarsteuer (${house.placedFurniture.length} Objekte):</span>
            <span style="font-weight: bold; color: #ffffff;">§ ${breakdown.furnitureTax}</span>
          </div>

          <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #2ecc71;">
            <span>☀️ Solaranlagen (${breakdown.solarCount}x) & 🌀 Windräder (${breakdown.windCount}x) Rabatt:</span>
            <span style="font-weight: bold;">- § ${breakdown.ecoDiscount}</span>
          </div>

          <div style="display: flex; justify-content: space-between; padding: 12px 0 0 0; font-size: 18px; font-weight: 800;">
            <span style="color: #00e5ff;">Gesamtbetrag der Rechnung:</span>
            <span style="color: #00e5ff;">§ ${breakdown.totalAmount}</span>
          </div>
        </div>

        <div style="display: flex; gap: 12px; align-items: center; justify-content: space-between;">
          <div style="font-size: 13px; color: #bdc3c7;">
            Status: <span style="font-weight: bold; color: ${billsManager.isBillDue ? '#e74c3c' : '#2ecc71'};">${billsManager.isBillDue ? 'Zahlung fällig 📮' : 'Bezahlt ✅'}</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="hud-btn" id="btn-pay-bill" ${billsManager.isBillDue && game.sim.simoleons >= breakdown.totalAmount ? '' : 'disabled'} style="background: #27ae60; font-weight: bold;">
              Rechnung Bezahlen (§ ${breakdown.totalAmount})
            </button>
            <button class="hud-btn" id="close-bills-bottom">Schließen</button>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-bills-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-bills-bottom')?.addEventListener('click', () => this.close());

    modal.querySelector('#btn-pay-bill')?.addEventListener('click', () => {
      if (billsManager.payBill(game.sim)) {
        this.soundManager.playLevelUp();
        toastManager?.showToast('Rechnung bezahlt!', `§ ${breakdown.totalAmount} wurden überwiesen. Stromversorger ist zufrieden!`, '💳', 'success');
        this.close();
      }
    });
  }

  public close(): void {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
  }
}
