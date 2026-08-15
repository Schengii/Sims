/**
 * Equestrian UI Modal
 * Displays Horse stats, training buttons, and tournament competition.
 */

import { EquestrianManager } from '../systems/EquestrianManager';
import type { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import type { ToastManager } from './ToastManager';

export class EquestrianModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(eqManager: EquestrianManager, sim: Sim, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'equestrian-modal';

    const h = eqManager.horse;

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 620px; width: 90%;">
        <div class="modal-header">
          <h2>🐎 Reitsportzentrum & Turniere</h2>
          <button class="close-btn" id="close-eq-modal">&times;</button>
        </div>

        <div style="background: rgba(139, 69, 19, 0.2); border: 1px solid #8b4513; padding: 14px; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-weight: bold; color: #f39c12; font-size: 16px;">🐴 ${h.name} (${h.breed})</span>
            <span style="color: #f1c40f; font-weight: bold;">🏆 Trophäen: ${eqManager.tournamentTrophies}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; color: #ecf0f1; margin-bottom: 12px;">
            <div>Galopp-Tempo: <strong>${h.speed.toFixed(1)} / 10</strong></div>
            <div>Sprungkraft: <strong>${h.jumping.toFixed(1)} / 10</strong></div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
            <button class="hud-btn" id="btn-train-speed" style="background: #34495e; color: #fff; font-size: 11px; font-weight: bold; justify-content: center;">
              ⚡ Tempo trainieren
            </button>
            <button class="hud-btn" id="btn-train-jump" style="background: #34495e; color: #fff; font-size: 11px; font-weight: bold; justify-content: center;">
              🚧 Sprünge üben
            </button>
            <button class="hud-btn" id="btn-compete-tourney" style="background: #e67e22; color: #fff; font-size: 11px; font-weight: bold; justify-content: center;">
              🏆 Turnier reiten
            </button>
          </div>
        </div>

        <div style="margin-top: 18px; text-align: right;">
          <button class="hud-btn" id="close-eq-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-eq-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-eq-bottom')?.addEventListener('click', () => this.close());

    modal.querySelector('#btn-train-speed')?.addEventListener('click', () => {
      const res = eqManager.trainHorse('speed', sim);
      this.soundManager.playUIClick();
      toastManager?.showToast('🐎 Pferdetraining', res.message, '⚡', 'info');
      this.open(eqManager, sim, toastManager);
    });

    modal.querySelector('#btn-train-jump')?.addEventListener('click', () => {
      const res = eqManager.trainHorse('jumping', sim);
      this.soundManager.playUIClick();
      toastManager?.showToast('🐎 Hindernis-Parcours', res.message, '🚧', 'info');
      this.open(eqManager, sim, toastManager);
    });

    modal.querySelector('#btn-compete-tourney')?.addEventListener('click', () => {
      const res = eqManager.competeInTournament(sim);
      if (res.success) {
        this.soundManager.playLevelUp();
        toastManager?.showToast('🏆 Reitturnier', res.message, '🥇', 'levelUp');
        this.open(eqManager, sim, toastManager);
      } else {
        toastManager?.showToast('Reitturnier', res.message, '⚠️', 'warning');
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
