/**
 * Archaeology & Relic Excavation UI Modal
 * Displays Archaeology skill, excavated relics collection, and digging button.
 */

import { ArchaeologySystem } from '../systems/ArchaeologySystem';
import type { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import type { ToastManager } from './ToastManager';

export class ArchaeologyModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(archSystem: ArchaeologySystem, sim: Sim, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'archaeology-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 620px; width: 90%;">
        <div class="modal-header">
          <h2>🏺 Archäologie & Antike Relikte</h2>
          <button class="close-btn" id="close-arch-modal">&times;</button>
        </div>

        <div style="background: rgba(211, 84, 0, 0.15); border: 1px solid #d35400; padding: 14px; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-weight: bold; color: #e67e22;">🏺 Archäologie-Fähigkeit: Stufe ${archSystem.archaeologySkill.toFixed(1)} / 5</span>
            <span style="color: #f1c40f; font-weight: bold;">⭐ Funde: ${archSystem.excavatedRelics.length}</span>
          </div>
          <p style="font-size: 12px; color: #bdc3c7; margin: 0 0 10px 0;">Grabe im Boden nach seltenen Fossilien, antiken Vasen und kostbaren Goldstatuen!</p>
          
          <button class="hud-btn" id="btn-dig-relics" style="background: #d35400; color: #fff; font-weight: bold; width: 100%; justify-content: center;">
            ⛏️ Im Boden nach Relikten graben (-15 Energie)
          </button>
        </div>

        <h4 style="margin: 0 0 8px 0; color: #ffffff;">🏆 Deine archäologischen Fundstücke:</h4>
        <div style="display: flex; flex-direction: column; gap: 8px; max-height: 240px; overflow-y: auto;">
          ${archSystem.excavatedRelics.length === 0 ? `
            <div style="text-align: center; color: #bdc3c7; padding: 20px;">
              Noch keine Relikte ausgegraben. Schnapp dir die Schaufel und fang an zu graben!
            </div>
          ` : archSystem.excavatedRelics.map(r => `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">${r.icon}</span>
                <div>
                  <div style="font-weight: bold; color: #ffffff; font-size: 13px;">${r.name}</div>
                  <div style="font-size: 11px; color: #bdc3c7;">${r.description}</div>
                </div>
              </div>
              <span style="color: #2ecc71; font-weight: bold; font-size: 12px;">§ ${r.value}</span>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 16px; text-align: right;">
          <button class="hud-btn" id="close-arch-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-arch-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-arch-bottom')?.addEventListener('click', () => this.close());

    modal.querySelector('#btn-dig-relics')?.addEventListener('click', () => {
      const res = archSystem.digForRelics(sim);
      if (res.success) {
        this.soundManager.playLevelUp();
        toastManager?.showToast('🏺 Relikt ausgegraben', res.message, res.relic?.icon || '⛏️', 'levelUp');
        this.open(archSystem, sim, toastManager);
      } else {
        toastManager?.showToast('Archäologie', res.message, '⚠️', 'warning');
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
