/**
 * Sim Inventory Panel UI
 * Displays held items (Paintings, Harvested Crops, Trophies) with options to sell for Simoleons (§).
 */

import type { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import type { ToastManager } from './ToastManager';

export class InventoryPanel {
  private container: HTMLElement;
  private soundManager: SoundManager;
  private modalEl: HTMLElement | null = null;
  public onSellItem?: (amount: number) => void;

  constructor(parentContainer: HTMLElement, soundManager: SoundManager) {
    this.container = parentContainer;
    this.soundManager = soundManager;
  }

  public open(sim: Sim, toastManager?: ToastManager): void {
    this.close();

    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal-backdrop';
    this.renderContent(sim, toastManager);

    this.container.appendChild(this.modalEl);
  }

  private renderContent(sim: Sim, toastManager?: ToastManager): void {
    if (!this.modalEl) return;

    const items = sim.inventory.items;

    this.modalEl.innerHTML = `
      <div class="modal-card glass-panel" style="max-width: 500px; animation: popIn 0.3s ease-out;">
        <div class="modal-header">
          <h2 style="margin: 0; font-size: 1.25rem;">🎒 Sim-Inventar (${items.length} Gegenstände)</h2>
          <button class="btn-icon" id="close-inventory-panel">✕</button>
        </div>

        ${items.length === 0 ? `
          <div style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.6);">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">📦</div>
            <p>Dein Inventar ist aktuell leer.<br>Male Gemälde an der Staffelei oder ernde Früchte im Garten!</p>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 0.75rem; max-height: 350px; overflow-y: auto; padding-right: 0.5rem;">
            ${items.map(item => `
              <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.08); padding: 0.85rem; border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 0.8rem;">
                  <span style="font-size: 1.8rem;">${item.icon}</span>
                  <div>
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7);">${item.description}</div>
                  </div>
                </div>
                <button class="btn-primary sell-item-btn" data-id="${item.id}" data-val="${item.value}" style="padding: 0.5rem 0.9rem; background: #27ae60;">
                  Verkaufen (§ ${item.value})
                </button>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    this.modalEl.querySelector('#close-inventory-panel')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      this.close();
    });

    const sellBtns = this.modalEl.querySelectorAll('.sell-item-btn');
    sellBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const id = target.getAttribute('data-id');
        const val = parseInt(target.getAttribute('data-val') || '0', 10);
        if (id) {
          const removed = sim.inventory.removeItem(id);
          if (removed) {
            sim.simoleons += val;
            this.soundManager.playBuySound();
            if (toastManager) {
              toastManager.showToast('Gegenstand verkauft', `Du hast "${removed.name}" für § ${val} verkauft!`, '💰', 'success');
            }
            this.renderContent(sim, toastManager);
          }
        }
      });
    });
  }

  public close(): void {
    if (this.modalEl && this.modalEl.parentNode === this.container) {
      this.container.removeChild(this.modalEl);
      this.modalEl = null;
    }
  }
}
