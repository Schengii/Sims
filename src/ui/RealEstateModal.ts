/**
 * Real Estate Empire Modal
 * UI dialog to purchase properties, collect rent, and upgrade property tier levels.
 */

import { RealEstateManager } from '../systems/RealEstateManager';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class RealEstateModal {
  private container: HTMLDivElement | null = null;

  public open(realEstateManager: RealEstateManager, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.renderContent(realEstateManager, sim, toastManager, soundManager);
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
    content.id = 'real-estate-modal-content';
    content.style.cssText = `
      width: 520px;
      max-height: 80vh;
      padding: 24px;
      border-radius: 20px;
      background: rgba(30, 41, 59, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    `;

    this.container.appendChild(content);
    document.body.appendChild(this.container);
  }

  private renderContent(manager: RealEstateManager, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const content = this.container?.querySelector('#real-estate-modal-content');
    if (!content) return;

    const totalRent = manager.collectWeeklyRent();

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: #4ade80;">🏢 Immobilien-Imperium & Rendite</h3>
        <button id="re-modal-close" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer;">✕</button>
      </div>

      <div style="background: rgba(74, 222, 128, 0.1); border: 1px solid #4ade80; padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 12px; color: #94a3b8;">Wöchentliche Mieteinnahmen:</div>
          <div style="font-weight: bold; font-size: 18px; color: #4ade80;">§ ${totalRent.toLocaleString()} / Woche</div>
        </div>
        <button id="btn-collect-rent" style="padding: 10px 16px; background: #22c55e; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
          💰 Miete Auszahlen
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${manager.properties.map(p => `
          <div style="background: rgba(255,255,255,0.05); padding: 14px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 32px;">${p.icon}</span>
              <div>
                <div style="font-weight: bold; font-size: 14px;">${p.name}</div>
                <div style="font-size: 11px; color: #94a3b8;">Mieter: ${p.tenantName || 'Leerstand'} • Stufe ${p.tierLevel}/3</div>
                <div style="font-size: 12px; color: #4ade80; font-weight: bold; margin-top: 2px;">§ ${(p.weeklyRent * p.tierLevel).toLocaleString()} Miete</div>
              </div>
            </div>

            <div>
              ${!p.isOwned ? `
                <button class="btn-buy-prop" data-id="${p.id}" style="padding: 8px 14px; background: #0284c7; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                  Kaufen (§ ${p.price.toLocaleString()})
                </button>
              ` : `
                <button class="btn-upgrade-prop" data-id="${p.id}" ${p.tierLevel >= 3 ? 'disabled' : ''} style="padding: 8px 14px; background: #eab308; color: black; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                  ${p.tierLevel >= 3 ? 'Max Stufe' : 'Upgrade (Stufe +1)'}
                </button>
              `}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    content.querySelector('#re-modal-close')?.addEventListener('click', () => this.close());

    content.querySelector('#btn-collect-rent')?.addEventListener('click', () => {
      if (totalRent > 0) {
        sim.simoleons += totalRent;
        soundManager.playLevelUp();
        toastManager.showToast('💰 MIETE EINGENOMMEN!', `+ § ${totalRent.toLocaleString()} Mieteinnahmen auf dein Konto überwiesen!`, '🪙', 'success');
      } else {
        toastManager.showToast('Immobilien', 'Du besitzt noch keine vermieteten Objekte.', '🏢', 'info');
      }
    });

    content.querySelectorAll('.btn-buy-prop').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = manager.buyProperty(id, sim.simoleons);
          if (res.success) {
            sim.simoleons -= res.cost;
            soundManager.playLevelUp();
            toastManager.showToast('🏰 IMMOBILIEN-KAUF!', res.message, '🔑', 'success');
            this.renderContent(manager, sim, toastManager, soundManager);
          } else {
            toastManager.showToast('⚠️ Kauf fehlgeschlagen', res.message, '❌', 'warning');
          }
        }
      });
    });

    content.querySelectorAll('.btn-upgrade-prop').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = manager.upgradeProperty(id, sim.simoleons);
          if (res.success) {
            sim.simoleons -= res.cost;
            soundManager.playLevelUp();
            toastManager.showToast('✨ UPGRADE ERFOLGREICH!', res.message, '⭐', 'success');
            this.renderContent(manager, sim, toastManager, soundManager);
          } else {
            toastManager.showToast('⚠️ Upgrade fehlgeschlagen', res.message, '❌', 'warning');
          }
        }
      });
    });
  }
}
