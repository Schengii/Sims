/**
 * Detective & Crime Investigation UI Modal
 * Search for clues, inspect crime scenes, and arrest criminal suspects.
 */

import { DetectiveManager } from '../systems/DetectiveManager';
import type { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import type { ToastManager } from './ToastManager';

export class DetectiveModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(detManager: DetectiveManager, sim: Sim, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'detective-modal';

    const rankTitles = ['Streifenpolizist', 'Ermittler', 'Chefermittler', 'Meisterdetektiv 🕵️'];
    const currentTitle = rankTitles[detManager.detectiveRank - 1] || 'Detektiv';
    const c = detManager.activeCase;
    const canArrest = c.cluesCollected >= c.cluesRequired;

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 620px; width: 90%;">
        <div class="modal-header">
          <h2>🕵️ Polizeirevier & Kriminalfälle</h2>
          <button class="close-btn" id="close-det-modal">&times;</button>
        </div>

        <div style="background: rgba(44, 62, 80, 0.25); border: 1px solid #34495e; padding: 14px; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: bold; color: #38bdf8; font-size: 15px;">👮 Rang: ${currentTitle} (Stufe ${detManager.detectiveRank}/4)</span>
            <span style="color: #2ecc71; font-weight: bold;">⭐ Gelöste Fälle: ${detManager.casesSolved}</span>
          </div>

          <h4 style="margin: 6px 0; color: #ffffff; font-size: 15px;">${c.title}</h4>
          <div style="font-size: 12px; color: #bdc3c7; margin-bottom: 8px;">
            Hauptverdächtiger: <span style="color: #e74c3c; font-weight: bold;">${c.suspectName}</span> | Fangprämie: <span style="color: #f1c40f; font-weight: bold;">§ ${c.bountySimoleons}</span>
          </div>

          <div style="background: rgba(0,0,0,0.4); height: 10px; border-radius: 5px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 12px;">
            <div style="background: linear-gradient(90deg, #3498db, #2ecc71); width: ${(c.cluesCollected / c.cluesRequired) * 100}%; height: 100%;"></div>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="hud-btn" id="btn-search-clues" ${canArrest ? 'disabled' : ''} style="flex: 1; justify-content: center; background: ${canArrest ? '#7f8c8d' : '#2980b9'}; color: #fff; font-size: 11px; font-weight: bold;">
              🔍 Tatort untersuchen (-15 Energie)
            </button>
            <button class="hud-btn" id="btn-arrest-suspect" ${canArrest ? '' : 'disabled'} style="flex: 1; justify-content: center; background: ${canArrest ? '#e74c3c' : '#7f8c8d'}; color: #fff; font-size: 11px; font-weight: bold;">
              🚨 Verdächtigen verhaften
            </button>
          </div>
        </div>

        <div style="margin-top: 18px; text-align: right;">
          <button class="hud-btn" id="close-det-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-det-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-det-bottom')?.addEventListener('click', () => this.close());

    modal.querySelector('#btn-search-clues')?.addEventListener('click', () => {
      const res = detManager.searchForClues(sim);
      if (res.success) {
        this.soundManager.playLevelUp();
        toastManager?.showToast('🔍 Spurensicherung', res.message, '🔎', 'info');
        this.open(detManager, sim, toastManager);
      } else {
        toastManager?.showToast('Ermittlung', res.message, '⚠️', 'warning');
      }
    });

    modal.querySelector('#btn-arrest-suspect')?.addEventListener('click', () => {
      const res = detManager.arrestSuspect(sim);
      if (res.success) {
        this.soundManager.playLevelUp();
        toastManager?.showToast('🚨 Täter verhaftet', res.message, '⚖️', 'levelUp');
        this.open(detManager, sim, toastManager);
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
