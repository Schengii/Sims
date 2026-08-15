/**
 * School & Homework UI Modal
 * Displays Report card, grades, homework status, and school actions.
 */

import { SchoolSystem } from '../systems/SchoolSystem';
import type { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import type { ToastManager } from './ToastManager';

export class SchoolModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(schoolSystem: SchoolSystem, sim: Sim, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'school-modal';

    const card = schoolSystem.reportCard;

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 580px; width: 90%;">
        <div class="modal-header">
          <h2>🏫 Schule, Noten & Hausaufgaben</h2>
          <button class="close-btn" id="close-school-modal">&times;</button>
        </div>

        <div style="background: rgba(52, 152, 219, 0.15); border: 1px solid #3498db; padding: 14px; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: bold; color: #ffffff; font-size: 15px;">Zeugnisnote: <span style="color: #f1c40f;">${card.grade}</span></span>
            <span style="color: #2ecc71; font-weight: bold;">Leistung: ${card.performanceScore} %</span>
          </div>

          <div style="background: rgba(0,0,0,0.4); height: 10px; border-radius: 5px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 12px;">
            <div style="background: linear-gradient(90deg, #e74c3c, #f1c40f, #2ecc71); width: ${card.performanceScore}%; height: 100%;"></div>
          </div>

          <div style="font-size: 13px; color: ${card.homeworkCompleted ? '#2ecc71' : '#e74c3c'}; font-weight: bold;">
            ${card.homeworkCompleted ? '✅ Hausaufgaben für heute vollständig erledigt' : '❌ Hausaufgaben stehen noch aus!'}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <button class="hud-btn" id="btn-do-homework" ${card.homeworkCompleted ? 'disabled' : ''} style="padding: 12px; justify-content: center; background: ${card.homeworkCompleted ? '#7f8c8d' : '#2980b9'}; color: #fff; font-weight: bold;">
            📝 Hausaufgaben machen (-15 Energie)
          </button>

          <button class="hud-btn" id="btn-attend-school" style="padding: 12px; justify-content: center; background: #27ae60; color: #fff; font-weight: bold;">
            🚌 Zur Schule fahren (Schultag)
          </button>
        </div>

        <div style="margin-top: 18px; text-align: right;">
          <button class="hud-btn" id="close-school-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-school-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-school-bottom')?.addEventListener('click', () => this.close());

    modal.querySelector('#btn-do-homework')?.addEventListener('click', () => {
      const res = schoolSystem.doHomework(sim);
      if (res.success) {
        this.soundManager.playLevelUp();
        toastManager?.showToast('📝 Hausaufgaben', res.message, '📚', 'levelUp');
        this.open(schoolSystem, sim, toastManager);
      } else {
        toastManager?.showToast('Hausaufgaben', res.message, '⚠️', 'warning');
      }
    });

    modal.querySelector('#btn-attend-school')?.addEventListener('click', () => {
      const res = schoolSystem.attendSchool(sim);
      this.soundManager.playLevelUp();
      toastManager?.showToast('🏫 Schultag', res.message, '🚌', 'success');
      this.open(schoolSystem, sim, toastManager);
    });
  }

  public close(): void {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
  }
}
