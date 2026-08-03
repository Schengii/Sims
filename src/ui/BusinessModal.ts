/**
 * Retail Business Management UI Modal for Sims 5
 * Displays store ledger, customer satisfaction, price margins, and revenue collection.
 */

import { SoundManager } from '../audio/SoundManager';
import { STORES_CATALOG, type BusinessManager } from '../systems/BusinessSystem';
import type { ToastManager } from './ToastManager';

export class BusinessModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(businessManager: BusinessManager, game: any, toastManager?: ToastManager): void {
    this.close();

    const store = STORES_CATALOG[businessManager.storeId] || STORES_CATALOG.bakery;

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'business-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 650px; width: 90%;">
        <div class="modal-header">
          <h2>🏪 Gewerbe & Laden-Management</h2>
          <button class="close-btn" id="close-biz-modal">&times;</button>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(39,174,96,0.15); border: 1px solid #27ae60; padding: 14px; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 36px;">${store.icon}</span>
            <div>
              <h3 style="margin: 0; color: #ffffff;">${store.name}</h3>
              <div style="font-size: 13px; color: #bdc3c7;">Status: <span style="color: ${businessManager.isStoreOpen ? '#2ecc71' : '#e74c3c'}; font-weight: bold;">${businessManager.isStoreOpen ? 'Geöffnet 🟢' : 'Geschlossen 🔴'}</span></div>
            </div>
          </div>
          <button class="hud-btn" id="btn-toggle-store" style="background: ${businessManager.isStoreOpen ? '#e74c3c' : '#27ae60'}; font-weight: bold;">
            ${businessManager.isStoreOpen ? 'Laden Schließen' : 'Laden Öffnen'}
          </button>
        </div>

        <!-- Store Ledger Stats -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 16px;">
          <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 10px; text-align: center;">
            <div style="font-size: 11px; color: #bdc3c7; text-transform: uppercase;">Akkumulierter Gewinn</div>
            <div style="font-size: 20px; font-weight: bold; color: #f1c40f; margin-top: 4px;">§ ${businessManager.dailyRevenue.toLocaleString()}</div>
          </div>

          <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 10px; text-align: center;">
            <div style="font-size: 11px; color: #bdc3c7; text-transform: uppercase;">Kunden-Zufriedenheit</div>
            <div style="font-size: 20px; font-weight: bold; color: #00e5ff; margin-top: 4px;">${businessManager.customerSatisfaction}%</div>
          </div>

          <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 10px; text-align: center;">
            <div style="font-size: 11px; color: #bdc3c7; text-transform: uppercase;">Verkäufe Gesamt</div>
            <div style="font-size: 20px; font-weight: bold; color: #2ecc71; margin-top: 4px;">${businessManager.totalSalesCount} Stk</div>
          </div>
        </div>

        <!-- Margin Selector -->
        <div style="background: rgba(255,255,255,0.05); padding: 14px; border-radius: 10px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-weight: bold; color: #ffffff;">Preisaufschlag & Marge:</div>
            <div style="font-size: 12px; color: #bdc3c7;">Höhere Preise steigern Gewinn, senken jedoch Kundenbewertungen.</div>
          </div>

          <select id="select-margin" style="background: #2c3e50; color: #fff; border: 1px solid #00e5ff; padding: 6px 12px; border-radius: 8px;">
            <option value="fair" ${businessManager.marginSetting === 'fair' ? 'selected' : ''}>Fair (100% Preis)</option>
            <option value="premium" ${businessManager.marginSetting === 'premium' ? 'selected' : ''}>Premium (+30% Aufpreis)</option>
            <option value="luxury" ${businessManager.marginSetting === 'luxury' ? 'selected' : ''}>Luxus (+70% Aufpreis)</option>
          </select>
        </div>

        <div style="display: flex; gap: 12px; justify-content: space-between; align-items: center;">
          <button class="hud-btn" id="btn-collect-revenue" ${businessManager.dailyRevenue > 0 ? '' : 'disabled'} style="background: #2ecc71; font-weight: bold;">
            💰 Tagesgewinn auszahlen (§ ${businessManager.dailyRevenue.toLocaleString()})
          </button>
          <button class="hud-btn" id="close-biz-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-biz-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-biz-bottom')?.addEventListener('click', () => this.close());

    modal.querySelector('#btn-toggle-store')?.addEventListener('click', () => {
      const open = businessManager.toggleStoreOpen();
      this.soundManager.playUIClick();
      toastManager?.showToast('Laden-Status', `Geschäft ist jetzt ${open ? 'Geöffnet 🟢' : 'Geschlossen 🔴'}!`, open ? '🏪' : '🔴', 'info');
      this.open(businessManager, game, toastManager);
    });

    const selectMargin = modal.querySelector('#select-margin') as HTMLSelectElement;
    selectMargin?.addEventListener('change', (e) => {
      businessManager.setMargin((e.target as HTMLSelectElement).value as any);
      this.soundManager.playUIClick();
      toastManager?.showToast('Preisstrategie', `Marge geändert auf ${(e.target as HTMLSelectElement).value.toUpperCase()}`, '🏷️', 'info');
      this.open(businessManager, game, toastManager);
    });

    modal.querySelector('#btn-collect-revenue')?.addEventListener('click', () => {
      const collected = businessManager.collectRevenue(game.sim);
      if (collected > 0) {
        this.soundManager.playLevelUp();
        toastManager?.showToast('Gewinn ausgezahlt!', `§ ${collected.toLocaleString()} wurden deinem Simoleon-Konto gutgeschrieben!`, '💰', 'success');
        this.open(businessManager, game, toastManager);
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
