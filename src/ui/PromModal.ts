/**
 * Prom Night Celebration Modal
 */

import { HighSchoolSystem } from '../systems/HighSchoolSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class PromModal {
  private container: HTMLDivElement | null = null;

  public open(hsSystem: HighSchoolSystem, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.renderContent(hsSystem, sim, toastManager, soundManager);
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
    content.id = 'prom-modal-content';
    content.style.cssText = `
      width: 440px;
      padding: 24px;
      border-radius: 20px;
      background: rgba(30, 41, 59, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    `;

    this.container.appendChild(content);
    document.body.appendChild(this.container);
  }

  private renderContent(hsSystem: HighSchoolSystem, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const content = this.container?.querySelector('#prom-modal-content');
    if (!content) return;

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: #ec4899;">👑 Highschool Abschlussball (Prom)</h3>
        <button id="prom-modal-close" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer;">✕</button>
      </div>

      <div style="background: rgba(236, 72, 153, 0.1); border: 1px solid #ec4899; padding: 12px; border-radius: 12px;">
        <div style="font-weight: bold; font-size: 15px;">Schulnote: ${hsSystem.gpa.toFixed(1)}</div>
        <div style="font-size: 12px; color: #94a3b8;">Prom-Krone: ${hsSystem.hasPromCrown ? 'Gewonnen 👑' : 'Offen'}</div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button id="btn-take-exam" style="padding: 12px; background: #0284c7; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">
          📚 Abschluss-Prüfung ablegen
        </button>

        <button id="btn-attend-prom" style="padding: 12px; background: linear-gradient(135deg, #ec4899, #be185d); color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">
          👑 Auf dem Abschlussball tanzen & Krönung!
        </button>
      </div>
    `;

    content.querySelector('#prom-modal-close')?.addEventListener('click', () => this.close());

    content.querySelector('#btn-take-exam')?.addEventListener('click', () => {
      hsSystem.takeExam(sim, toastManager, soundManager);
      this.renderContent(hsSystem, sim, toastManager, soundManager);
    });

    content.querySelector('#btn-attend-prom')?.addEventListener('click', () => {
      hsSystem.celebrateProm(sim, toastManager, soundManager);
      this.renderContent(hsSystem, sim, toastManager, soundManager);
    });
  }
}
