/**
 * Scuba Diving UI Modal
 * Dive deep into ocean waters, search for sunken treasures, and collect rare marine relics.
 */

import { ScubaDivingSystem } from '../systems/ScubaDivingSystem';
import type { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import type { ToastManager } from './ToastManager';

export class ScubaModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(scubaSystem: ScubaDivingSystem, sim: Sim, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'scuba-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 620px; width: 90%;">
        <div class="modal-header">
          <h2>🤿 Tiefsee-Tauchen & Versunkene Schätze</h2>
          <button class="close-btn" id="close-scuba-modal">&times;</button>
        </div>

        <div style="background: rgba(41, 128, 185, 0.2); border: 1px solid #2980b9; padding: 14px; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-weight: bold; color: #38bdf8;">🤿 Tauch-Fähigkeit: Stufe ${scubaSystem.divingSkill.toFixed(1)} / 5</span>
            <span style="color: #f1c40f; font-weight: bold;">⭐ Schätze geborgen: ${scubaSystem.salvagedTreasures.length}</span>
          </div>

          <button class="hud-btn" id="btn-dive-treasure" style="background: #2980b9; color: #fff; font-weight: bold; width: 100%; justify-content: center; margin-top: 8px;">
            🤿 Nach versunkenen Schätzen tauchen (-20 Energie)
          </button>
        </div>

        <h4 style="margin: 0 0 8px 0; color: #ffffff;">🏆 Deine geborgenen Meeres-Schätze:</h4>
        <div style="display: flex; flex-direction: column; gap: 8px; max-height: 220px; overflow-y: auto;">
          ${scubaSystem.salvagedTreasures.length === 0 ? `
            <div style="text-align: center; color: #bdc3c7; padding: 20px;">
              Noch keine Meeres-Schätze geborgen. Tauche hinab in die Tiefe!
            </div>
          ` : scubaSystem.salvagedTreasures.map(t => `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">${t.icon}</span>
                <div>
                  <div style="font-weight: bold; color: #ffffff; font-size: 13px;">${t.name}</div>
                  <div style="font-size: 11px; color: #bdc3c7;">${t.description}</div>
                </div>
              </div>
              <span style="color: #2ecc71; font-weight: bold; font-size: 12px;">§ ${t.value}</span>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 18px; text-align: right;">
          <button class="hud-btn" id="close-scuba-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-scuba-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-scuba-bottom')?.addEventListener('click', () => this.close());

    modal.querySelector('#btn-dive-treasure')?.addEventListener('click', () => {
      const res = scubaSystem.diveForTreasure(sim);
      if (res.success) {
        this.soundManager.playLevelUp();
        toastManager?.showToast('🤿 Schatz geborgen', res.message, res.treasure?.icon || '🐚', 'levelUp');
        this.open(scubaSystem, sim, toastManager);
      } else {
        toastManager?.showToast('Tiefsee-Tauchen', res.message, '⚠️', 'warning');
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
